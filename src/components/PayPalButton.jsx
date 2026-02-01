import { useEffect, useRef } from "react";

export default function PayPalButton({
  amount,
  description,
  appsScriptUrl,
  secret,
  validateForm,
  onPaymentSuccess,
  product,
  quantity,
  name,
  email
}) {
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const scriptUrl = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
  const containerId = "paypal-root";

  // 🔒 Refs to prevent stale data
  const validateRef = useRef(validateForm);
  const successRef = useRef(onPaymentSuccess);
  const nameRef = useRef(name);
  const emailRef = useRef(email);
  const quantityRef = useRef(quantity);
  const productRef = useRef(product);
  const amountRef = useRef(amount);

  // 🔄 Keep refs always fresh
  useEffect(() => {
    validateRef.current = validateForm;
    successRef.current = onPaymentSuccess;
    nameRef.current = name;
    emailRef.current = email;
    quantityRef.current = quantity;
    productRef.current = product;
    amountRef.current = amount;
  });

  useEffect(() => {
    function renderButton() {
      const container = document.getElementById(containerId);
      if (!container || !window.paypal) return;

      container.innerHTML = "";

      window.paypal
        .Buttons({
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

            // 🔹 Non-blocking Sheets logging
            fetch(appsScriptUrl, {
              method: "POST",
              body: JSON.stringify({ secret, ...orderObj })
            }).catch(() => {});

            // 🔹 Guaranteed ticket generation
            successRef.current({
              ...orderObj,
              orderId: order.id
            });

            try {
              // Fetch backend-authoritative state
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
        })
        .render(`#${containerId}`);
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
  }, []); // ✅ MUST stay empty

  return <div id="paypal-root"></div>;
}
