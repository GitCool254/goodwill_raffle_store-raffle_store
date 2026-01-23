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

  // 🔒 Live refs (prevents stale data)
  const validateRef = useRef(validateForm);
  const nameRef = useRef(name);
  const emailRef = useRef(email);
  const quantityRef = useRef(quantity);
  const productRef = useRef(product);
  const amountRef = useRef(amount);

  // 🔄 Keep refs up to date
  useEffect(() => {
    validateRef.current = validateForm;
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
          style: { layout: "vertical", shape: "pill", color: "gold" },

          onClick: (data, actions) => {
            const ok = validateRef.current();
            return ok ? actions.resolve() : actions.reject();
          },

          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: amountRef.current.toFixed(2) },
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

            // Log to Sheets (non-blocking)
            fetch(appsScriptUrl, {
              method: "POST",
              body: JSON.stringify({ secret, ...orderObj })
            }).catch(() => {});

            onPaymentSuccess({
              ...orderObj,
              orderId: order.id
            });
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
  }, []); // MUST remain empty

  return <div id="paypal-root"></div>;
}
