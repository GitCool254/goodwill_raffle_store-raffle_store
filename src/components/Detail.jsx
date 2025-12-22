import { useState, useEffect } from "react";
import PayPalButton from "./PayPalButton";

export default function Detail({ product, openImage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  const [downloadReady, setDownloadReady] = useState(false);             const [lastOrder, setLastOrder] = useState(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
 
  useEffect(() => {
    setHasDownloaded(false);
  }, [lastOrder]);

  const price =
    parseFloat(String(product.ticketPrice).replace(/[^0-9.]/g, "")) || 0;                                                                       const amount = Number((price * quantity).toFixed(2));                
  const appsScriptUrl =
    "https://script.google.com/macros/s/AKfycbx1JEi4-2VTFaB-QMLCYkCKi2eIo_uYTLfu5-fLUc7zV6QjxelNyfrJgUBJCydhhwqM/exec";                         const secret = "goodwill_5490_secret";
                                                                         function validateForm() {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Please enter your full name.";     if (!email.trim()) newErrors.email = "Enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Enter a valid email.";
    if (!quantity || quantity < 1)
      newErrors.quantity = "Quantity must be at least 1.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleInstantDownload() {
    if (!lastOrder) {
      alert("No completed payment found.");
      return;
    }

    if (hasDownloaded || isGenerating) return;

    setIsGenerating(true);

    try {
      const payload = { name, quantity };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/generate_ticket`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        alert("Ticket generation failed.");
        setIsGenerating(false);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        quantity > 1 ? "raffle_tickets.zip" : "raffle_ticket.pdf";
      a.click();

      window.URL.revokeObjectURL(url);

      setHasDownloaded(true); // 🔒 lock permanently
    } catch (err) {
      console.error("Download error:", err);
      alert("Could not download ticket. Try again.");
    } finally {
      setIsGenerating(false);
    }
  }
                                                                         return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

      <img
        src={product.image}
        className="mx-auto w-64 h-64 rounded-xl object-cover mb-4 cursor-zoom-in"
        onClick={() =>
          openImage(
            product.images && product.images.length
              ? product.images
              : [product.image],
            0
          )
        }
      />

      <p className="text-lg mb-2">Price per ticket: {product.ticketPrice}</p>

      {/* NAME */}
      <div className="mb-3 max-w-md mx-auto text-left">                        <label>Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`p-2 w-full border rounded ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}       </div>                                                                                                                                        {/* EMAIL */}
      <div className="mb-3 max-w-md mx-auto text-left">
        <label>Email</label>
        <input                                                                   value={email}
          type="email"                                                           onChange={(e) => setEmail(e.target.value)}
          className={`p-2 w-full border rounded ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
                                                                             {/* QUANTITY */}
      <div className="mb-5 max-w-md mx-auto text-left">
        <label className="block mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          min="1"
          max="50"
          onChange={(e) =>
            setQuantity(Math.max(1, Number(e.target.value) || 1))                }
          className={`p-2 w-28 border rounded mb-4 ${
            errors.quantity ? "border-red-500" : "border-gray-300"               }`}                                                                  />
        {errors.quantity && (
          <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>                                                                              )}
      </div>

      <br />

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 shadow-sm mt-4 mb-4">
        <div className="text-xl font-semibold text-blue-700">
          💵 Total: <b>${amount}</b> USD
        </div>
        <p className="text-sm text-gray-600 italic mt-1">
          (This will be charged securely via PayPal)
        </p>
      </div>

      <hr className="my-4" />

      {/* PAYPAL */}
      <PayPalButton
        amount={amount}                                                        description={`${product.title} — ${quantity} ticket(s)`}
        appsScriptUrl={appsScriptUrl}
        secret={secret}
        validateForm={validateForm}
        product={product.title}
        quantity={quantity}
        name={name}                                                            email={email}
        onPaymentSuccess={async (orderObj) => {
          setLastOrder(orderObj);
          setDownloadReady(true);
        }}
      />

      {downloadReady && (
        <button
          onClick={handleInstantDownload}
          disabled={hasDownloaded || isGenerating}
          className={`mt-4 px-4 py-2 rounded text-white ${
            hasDownloaded
              ? "bg-gray-400"
              : isGenerating
              ? "bg-yellow-500"
              : "bg-green-600"
          }`}
        >
          {hasDownloaded
            ? "Ticket Already Downloaded"
            : isGenerating
            ? "Generating Ticket..."
            : "Download Ticket"}
        </button>
      )}
    </div>
  );
}
