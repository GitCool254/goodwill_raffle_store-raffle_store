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

  const paypalRef = useRef(null);
  const buttonsRendered = useRef(false);

  useEffect(() => {
    if (buttonsRendered.current) return;

    const loadScript = () =>
      new Promise((resolve) => {
        if (window.paypal) return resolve();

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    loadScript().then(() => {
      if (!paypalRef.current) return;

      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            shape: "pill",
            color: "gold"
          },

          onClick: (data, actions) => {
            if (!validateForm()) {
              return actions.reject();
            }
            return actions.resolve();
          },

          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: Number(amount).toFixed(2)
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
              fullname: name,
              email,
              quantity,
              product,
              ticketNumber: `PP-${Math.random()
                .toString(36)
                .slice(2, 9)
                .toUpperCase()}`
            };

            fetch(appsScriptUrl, {
              method: "POST",
              body: JSON.stringify({ secret, ...orderObj })
            }).catch(() => {});

            onPaymentSuccess({
              ...orderObj,
              orderId: order.id
            });
          },

          onCancel: () => {
            console.log("PayPal payment cancelled");
          },

          onError: (err) => {
            console.error("PayPal error", err);
            alert("Payment failed. Please try again.");
          }
        })
        .render(paypalRef.current);

      buttonsRendered.current = true;
    });
  }, []);

  return <div ref={paypalRef}></div>;
}
