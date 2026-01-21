import { useState, useEffect } from "react";
import PayPalButton from "./PayPalButton";
                                                                       const shakeStyle = {
  animation: "shake 0.35s ease-in-out",
};

export default function Detail({ product, openImage }) {                 const ticket = product?._ticket || null;                               const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [errors, setErrors] = useState({});
  const [downloadReady, setDownloadReady] = useState(false);             const [lastOrder, setLastOrder] = useState(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);             const [isGenerating, setIsGenerating] = useState(false);
  const [isTicketGenerating, setIsTicketGenerating] = useState(false);

  // Description toggle (same idea as Catalog)
  const DESCRIPTION_LIMIT = 70;
  const [expandedDesc, setExpandedDesc] = useState(false);

  const [focusedField, setFocusedField] = useState(null);
  function toggleDescription(e) {
    e.stopPropagation();
    setExpandedDesc((prev) => !prev);
  }

  useEffect(() => {                                                        setHasDownloaded(false);                                             }, [lastOrder]);

  const price =
    parseFloat(String(product.ticketPrice).replace(/[^0-9.]/g, "")) || 0;                                                                       const safeQty = Number(quantity) || 0;
  const amount = Number((price * safeQty).toFixed(2));
                                                                         const appsScriptUrl =
    "https://script.google.com/macros/s/AKfycbx1JEi4-2VTFaB-QMLCYkCKi2eIo_uYTLfu5-fLUc7zV6QjxelNyfrJgUBJCydhhwqM/exec";                         const secret = "goodwill_5490_secret";
                                                                         function validateForm() {                                                const newErrors = {};                                                  if (!name.trim()) newErrors.name = "Please enter your full name.";     if (!email.trim()) newErrors.email = "Enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Enter a valid email.";
    const qtyNum = Number(quantity);

    if (
      !quantity ||
      !Number.isInteger(qtyNum) ||
      qtyNum < 1
    ) {
      newErrors.quantity = "Quantity must be at least 1 and and a whole number.";
    }
    setErrors(newErrors);                                                  return Object.keys(newErrors).length === 0;
  }

  async function handleTicketDownload() {                                  if (!lastOrder) {
      alert("No completed payment found.");
      return;
    }
                                                                           if (hasDownloaded || isGenerating) return;
    setIsGenerating(true);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/download_ticket`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: lastOrder.orderId,
          }),
        }
      );  
                                                                             if (!res.ok) {
        const errText = await res.text();
        console.error("Backend error:", errText);
        alert(errText);
        setIsGenerating(false);
        return;
      }
                                                                             const blob = await res.blob();
      
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="?(.+)"?/);
      a.download = match ? match[1] : "raffle_ticket";

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
                                                                             setHasDownloaded(true); // 🔒 lock permanently
    } catch (err) {
      console.error("Download error:", err);
      alert("Could not download ticket. Try again.");
    } finally {                                                              setIsGenerating(false);
    }                                                                    }
                                                                         return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

      {ticket && (
        <div className="inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-700">                                        🎟️ Viewing your ticket                                                </div>
      )}

      <img
        src={product.image}
        className="mx-auto w-full max-w-xs h-auto max-h-64 rounded-xl object-contain mb-4 cursor-zoom-in"
        onClick={() =>
          openImage(
            product.images && product.images.length
              ? product.images                                                       : [product.image],
            0,
            "detail"
          )
        }
      />
                                                                             <p className="text-lg mb-2">Price per ticket: {product.ticketPrice}</p>

      {ticket && (                                                             <p className="text-sm text-slate-700 mb-4">                              Ticket No: <strong>{ticket.ticketNo}</strong>
        </p>                                                                 )}
                                                                             {/* DESCRIPTION SECTION */}                                            <div className="mb-10">
        <div className="text-sm text-slate-600 leading-relaxed mb-1 whitespace-pre-line text-left max-w-md mx-auto">
          {product.description.length > DESCRIPTION_LIMIT && !expandedDesc
            ? product.description.slice(0, DESCRIPTION_LIMIT) + "…"
            : product.description}
        </div>

        {product.description.length > DESCRIPTION_LIMIT && (
          <button
            className="text-sm text-sky-600 hover:underline"                       onClick={toggleDescription}                                          >                                                                        {expandedDesc ? "See less" : "See more"}                             </button>
        )}
      </div>

      <br />


      {!ticket && (
        <>
          {/* NAME */}
          <div className="mb-3 max-w-md mx-auto text-left">                        <label>Full Name</label>
            <input
              value={name}
              placeholder="Enter your full name"
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}                                   style={{
                border: errors.name
                  ? "1px solid #ef4444"
                  : focusedField === "name"
                  ? "1px solid #38bdf8"                                                  : "1px solid #d1d5db",
                boxShadow: errors.name
                  ? "0 0 0 2px rgba(239,68,68,0.3)"
                  : focusedField === "name"
                  ? "0 0 0 2px rgba(56,189,248,0.4)"
                  : "none",
                outline: "none",
                transition: "all 0.15s ease",
                ...(errors.name ? shakeStyle : {}),
              }}
              className="p-2 w-full rounded"                                       />                                                                     {errors.name && <p className="text-red-500">{errors.name}</p>}       </div>                                                                                                                                        {/* EMAIL */}
          <div className="mb-3 max-w-md mx-auto text-left">
            <label>Email</label>
            <input
              value={email}
              type="email"
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={{
                border: errors.email
                  ? "1px solid #ef4444"
                  : focusedField === "email"
                  ? "1px solid #38bdf8"
                  : "1px solid #d1d5db",
                boxShadow: errors.email
                  ? "0 0 0 2px rgba(239,68,68,0.3)"
                  : focusedField === "email"
                  ? "0 0 0 2px rgba(56,189,248,0.4)"
                  : "none",
                outline: "none",
                transition: "all 0.15s ease",
                ...(errors.email ? shakeStyle : {}),
              }}
              className="p-2 w-full rounded"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
                                                                                 {/* QUANTITY */}
          <div className="mb-5 max-w-md mx-auto text-left">                        <label className="block mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              min="1"
              max="50"
              onChange={(e) => setQuantity(e.target.value)}
              onFocus={() => setFocusedField("quantity")}
              onBlur={() => setFocusedField(null)}                                   style={{
                border: errors.quantity
                  ? "1px solid #ef4444"
                  : focusedField === "quantity"                                          ? "1px solid #38bdf8"
                  : "1px solid #d1d5db",                                               boxShadow: errors.quantity
                  ? "0 0 0 2px rgba(239,68,68,0.3)"
                  : focusedField === "quantity"
                  ? "0 0 0 2px rgba(56,189,248,0.4)"
                  : "none",
                outline: "none",
                transition: "all 0.15s ease",
                ...(errors.quantity ? shakeStyle : {}),                              }}
              className="p-2 w-28 rounded mb-4"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>                                                                              )}
          </div>

          <br />

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 shadow-sm mt-4 mb-4">                                                      <div className="text-xl font-semibold text-blue-700">
              💵 Total: <b>${amount}</b> USD
            </div>
            <p className="text-sm text-gray-600 italic mt-1">
              (This will be charged securely via PayPal)
            </p>
          </div>

          <hr className="my-4" />

          {/* PAYPAL */}                                                         <PayPalButton
            amount={amount}                                                        description={`${product.title} — ${quantity} ticket(s)`}
            appsScriptUrl={appsScriptUrl}
            secret={secret}                                                        validateForm={validateForm}
            product={product.title}                                                quantity={quantity}
            name={name}                                                            email={email}
            onPaymentSuccess={async (orderObj) => {
              setLastOrder(orderObj);
              setIsTicketGenerating(true);

              // 🔹 Generate tickets silently
              const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/generate_ticket`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name,
                    email: email.trim().toLowerCase(),
                    quantity,
                    ticket_price: product.ticketPrice,
                    order_id: orderObj.orderId,
                    product_title: product.title,
                  }),
                }
              );

              if (!res.ok) {
                alert("Ticket generation failed. Please contact support.");
                return;
              }

              const data = await res.json();
              if (data.status !== "tickets_generated") {
                alert("Ticket generation incomplete.");
                return;
              }

              setIsTicketGenerating(false);
              setDownloadReady(true);
              
            }}                                                                   />

          <br />

          {/* DOWNLOAD PLACEHOLDER (before payment ONLY) */}
          {!ticket && !isTicketGenerating && !downloadReady && (
            <div className="mt-4 flex flex-col items-center text-slate-500 text-sm italic">
              <div className="flex items-center gap-3 mb-1">
                <span className="subtle-spinner" style={{ marginRight: "10px" }} />
                <span>Waiting for payment confirmation</span>
              </div>
              <div className="text-xs text-slate-400">
                Your ticket download will appear here after successful payment
              </div>
            </div>
          )}

          {/* TICKET GENERATION STATUS (after payment, before download) */}
          {ticket && isTicketGenerating && !downloadReady && (
            <div className="mt-4 flex flex-col items-center text-slate-600 text-sm italic">
              <div className="flex items-center gap-2 mb-1">
                <span className="subtle-spinner" />
                <span className="font-medium">
                  Generating your ticket…
                </span>
              </div>
              <div className="text-xs text-slate-400">
                This will only take a moment
              </div>
            </div>
          )}

          {downloadReady && (
            <button
              onClick={handleTicketDownload}
              disabled={hasDownloaded || isGenerating}                               className={`mt-4 px-4 py-2 rounded text-white ${                         hasDownloaded
                  ? "bg-gray-400"
                  : isGenerating                                                         ? "bg-yellow-500"
                  : "bg-green-600"
              }`}
            >
              {hasDownloaded
                ? "Ticket Already Downloaded"
                : isGenerating
                ? "Generating Ticket..."
                : "Download Ticket"}                                               </button>                                                            )}                                                                   </>
      )}
      {ticket && (
        <button                                                                  onClick={() => window.dispatchEvent(new CustomEvent("goMyTickets"))}                                                                          className="mt-6 text-sky-600 font-semibold"
        >
          ← Back to My Tickets
        </button>
      )}
    </div>                                                               );
}
