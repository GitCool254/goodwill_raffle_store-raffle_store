import { useEffect, useRef, useId, useState } from "react";

export default function PayPalButton({
  amount,
  description,
  validateForm,
  onPaymentSuccess,
  product,
  quantity,
  name,
  email
}) {
  const [configLoaded, setConfigLoaded] = useState(false);
  const [clientId, setClientId] = useState(null);
  const containerId = useId();

  // Refs to prevent stale data
  const validateRef = useRef(validateForm);
  const successRef = useRef(onPaymentSuccess);
  const nameRef = useRef(name);
  const emailRef = useRef(email);
  const quantityRef = useRef(quantity);
  const productRef = useRef(product);
  const amountRef = useRef(amount);
  const buttonsRef = useRef(null);

  // Keep refs fresh
  useEffect(() => {
    validateRef.current = validateForm;
    successRef.current = onPaymentSuccess;
    nameRef.current = name;
    emailRef.current = email;
    quantityRef.current = quantity;
    productRef.current = product;
    amountRef.current = amount;
  });

  // Fetch PayPal client ID from backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/paypal_config`);
        if (res.ok) {
          const data = await res.json();
          setClientId(data.client_id);
        } else {
          // Fallback to old environment variable
          setClientId(import.meta.env.VITE_PAYPAL_CLIENT_ID);
        }
      } catch (err) {
        console.error("Failed to fetch PayPal config, using fallback:", err);
        setClientId(import.meta.env.VITE_PAYPAL_CLIENT_ID);
      } finally {
        setConfigLoaded(true);
      }
    };
    fetchConfig();
  }, []);

  // Load PayPal SDK when clientId is known
  useEffect(() => {
    if (!configLoaded || !clientId) return;

    const scriptUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;

    function renderButton() {
      const container = document.getElementById(containerId);
      if (!container || !window.paypal) return;

      container.innerHTML = "";

      const buttons = window.paypal.Buttons({
        style: {
          layout: "vertical",
          shape: "pill",
          color: "gold"
        },

        onClick: (data, actions) => {
          const ok = validateRef.current();
          return ok ? actions.resolve() : actions.reject();
        },

        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amountRef.current.toFixed(2)
                },
                description
              }
            ]
          });
        },

        onApprove: async (data, actions) => {
          const order = await actions.order.capture();

          const orderObj = {
            id: order.id,
            fullname: nameRef.current,
            email: emailRef.current,
            quantity: quantityRef.current,
            product: productRef.current,
            ticketNumber: `PP-${Math.random()
              .toString(36)
              .slice(2, 9)
              .toUpperCase()}`
          };

          successRef.current({
            ...orderObj,
            orderId: order.id
          });

          try {
            const stateRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ticket_state`);
            const stateData = await stateRes.json();
            window.dispatchEvent(
              new CustomEvent("ticketsPurchased", {
                detail: {
                  quantity: quantityRef.current,
                  total_sold: stateData.total_sold,
                  remaining: stateData.remaining
                }
              })
            );
          } catch (err) {
            console.error("Failed to sync ticket state:", err);
          }
        }
      });

      buttonsRef.current = buttons;
      buttons.render(`#${containerId}`);
    }

    if (!window.paypal && !document.getElementById("paypal-sdk")) {
      const s = document.createElement("script");
      s.id = "paypal-sdk";
      s.src = scriptUrl;
      s.async = true;
      s.onload = renderButton;
      document.body.appendChild(s);
    } else if (window.paypal) {
      renderButton();
    }

    return () => {
      if (buttonsRef.current) {
        buttonsRef.current.close();
      }
    };
  }, [configLoaded, clientId, containerId, description]);

  return <div id={containerId}></div>;
}
