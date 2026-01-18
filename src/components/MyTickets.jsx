import React, { useState } from "react";

const FOCUS_BLUE = "#38bdf8"; // sky-400
const ERROR_RED = "#ef4444";  // red-500

const shakeStyle = {
  animation: "shake 0.35s ease-in-out",
};

export default function MyTickets() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState(null);

  const [orderId, setOrderId] = useState("");
  const [orderError, setOrderError] = useState("");

  const [focusedField, setFocusedField] = useState(null);
  
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSearch(e) {
    e.preventDefault();
    setError("");
    setTickets(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders_by_email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    );

    const orders = await res.json();
    setTickets(orders);
    if (!stored) {
      setTickets([]);
      return;
    }

    const entries = JSON.parse(stored);
    const emailKey = email.trim().toLowerCase();
    setTickets(entries[emailKey] || []);
  }

  async function handleOrderRedownload(e) {
    e.preventDefault();
    setOrderError("");

    if (!orderId.trim()) {
      setOrderError("Please enter a valid Order ID.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/redownload_ticket`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId.trim() }),
        }
      );

      if (!res.ok) throw new Error("Re-download failed");

      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "tickets.zip";

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setOrderError("Re-download failed. Please contact support.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-left">
      <h1
        className="font-bold mb-4"
        style={{ fontSize: "24px" }}
      >
        🎟️ My Tickets
      </h1>

      <div className="text-slate-600 mb-6">
        {/* ORDER ID RE-DOWNLOAD */}
        <form onSubmit={handleOrderRedownload} className="mb-8">
          <input
            type="text"
            value={orderId}
            placeholder="Enter PayPal Order ID"
            onChange={(e) => setOrderId(e.target.value)}
            onFocus={() => setFocusedField("orderId")}
            onBlur={() => setFocusedField(null)}
            style={{
              border: orderError
                ? `1px solid ${ERROR_RED}`
                : focusedField === "orderId"
                ? `1px solid ${FOCUS_BLUE}`
                : "1px solid #d1d5db",
              boxShadow: orderError
                ? "0 0 0 2px rgba(239,68,68,0.3)"
                : focusedField === "orderId"
                ? "0 0 0 2px rgba(56,189,248,0.4)"
                : "none",
              outline: "none",
              transition: "all 0.15s ease",
              ...(orderError ? shakeStyle : {}),
            }}
            className="w-full rounded-lg px-4 py-3 mb-2"
          />

          {orderError && (
            <div className="text-red-600 text-sm mb-2">
              {orderError}
            </div>
          )}

          <button
            type="submit"
            className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            Re-download by Order ID
          </button>
        </form>

        <hr className="my-6" />
        Enter the email address you used during ticket purchase to view all your
        generated tickets.
        
      </div>

      {/* EMAIL FORM */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="email"
          value={email}
          placeholder="your@email.com"
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          style={{
            border: error
              ? `1px solid ${ERROR_RED}`
              : focusedField === "email"
              ? `1px solid ${FOCUS_BLUE}`
              : "1px solid #d1d5db",
            boxShadow: error
              ? "0 0 0 2px rgba(239,68,68,0.3)"
              : focusedField === "email"
              ? "0 0 0 2px rgba(56,189,248,0.4)"
              : "none",
            outline: "none",
            transition: "all 0.15s ease",
            ...(error ? shakeStyle : {}),
          }}
          className="w-full rounded-lg px-4 py-3 mb-2"
        />

        {error && (
          <div className="text-red-600 text-sm mb-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-700 transition"
        >
          View My Tickets
        </button>
      </form>

      {/* RESULTS */}
      {tickets && (
        <>
          {tickets.length === 0 ? (
            <div className="text-slate-600">
              No tickets found for this email address.
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 bg-white shadow-sm"
                >
                  <div className="font-semibold text-slate-800">
                    {t.productTitle}
                  </div>

                  <div className="text-sm text-slate-600 mt-1">
                    Ticket No: <strong>{t.ticketNo}</strong>
                  </div>

                  {t.orderId && (
                    <div className="text-xs text-slate-500 mt-1">
                      Order ID: {t.orderId}
                    </div>
                  )}

                  {t.date && (
                    <div className="text-xs text-slate-500 mt-1">
                      Generated on: {new Date(t.date).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
