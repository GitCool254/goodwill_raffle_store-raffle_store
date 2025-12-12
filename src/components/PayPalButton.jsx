import { useEffect } from "react";

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
  const PAYPAL_CLIENT_ID =
    "AYBAbWKQtvibNiDi7AiMc6LTQRgoQvCd25g8yapQ-3U9EEanpwNFM4i-LbGnXk5MYBRXViDoysR_snJw";

  const scriptUrl = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;

  const containerId = "paypal-root";

  useEffect(() => {
    function renderButton() {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = "";

      window.paypal
        .Buttons({
          style: { layout: "vertical", shape: "pill", color: "gold" },

          onClick: (data, actions) => {
            const ok = validateForm();
            if (!ok) return actions.reject();
            return actions.resolve();
          },

          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: amount.toFixed(2) },
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

            // log to sheets
            fetch(appsScriptUrl, {
              method: "POST",
              body: JSON.stringify({ secret, ...orderObj })
            }).catch(() => {});

            onPaymentSuccess(orderObj);
          }
        })
        .render(`#${containerId}`);
    }

    if (!window.paypal) {
      const s = document.createElement("script");
      s.src = scriptUrl;
      s.async = true;
      s.onload = renderButton;
      document.body.appendChild(s);
    } else {
      renderButton();
    }
  }, [amount, name, email, quantity]);

  return <div id="paypal-root"></div>;
}
