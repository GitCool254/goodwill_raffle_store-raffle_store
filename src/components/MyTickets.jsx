import React, { useState } from "react";
import LabelWithBullet from "./LabelWithBullet";

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

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setTickets(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const payload = {
        email: email.trim().toLowerCase(),
      };

      const nonce = crypto.randomUUID();
      const payloadWithNonce = { ...payload, nonce };
      const timestamp = Math.floor(Date.now() / 1000); // seconds

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/my_tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Nonce": nonce,
           "X-Timestamp": timestamp.toString(),
        },
        body: JSON.stringify(payloadWithNonce),
      });

      if (!res.ok) {
        throw new Error("Fetch failed");
      }

      const data = await res.json();
      setTickets(data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Could not retrieve tickets. Try again.");
    }
  }

  async function handleOrderRedownload(e) {
    e.preventDefault();
    setOrderError("");

    if (!orderId.trim()) {
      setOrderError("Please enter a valid Order ID.");
      return;
    }

    try {
      const payload = {
        order_id: orderId.trim(),
      };

      const nonce = crypto.randomUUID();
      const payloadWithNonce = { ...payload, nonce };
      const timestamp = Math.floor(Date.now() / 1000); // seconds

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/redownload_ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Nonce": nonce,
             "X-Timestamp": timestamp.toString(),
          },
          body: JSON.stringify(payloadWithNonce),
        }
      );

      if (!res.ok) {
        let errorMsg = "Re-download failed. Please contact support.";

        try {
          const errJson = await res.json();

          if (res.status === 410 && errJson.error === "TICKET_EXPIRED") {
            errorMsg =
              "This ticket has expired and is no longer available for download.";
          } else if (
            res.status === 403 &&
            errJson.error === "MAX_REDOWNLOADS_REACHED"
          ) {
            errorMsg =
              "You’ve reached the maximum number of re-downloads for this order.";
          } else if (
            res.status === 403 &&
            errJson.error === "Replay detected"
          ) {
            errorMsg =
              "Security validation failed. Please refresh and try again.";
          } else {
            errorMsg = errJson.error || errorMsg;
          }
        } catch {
          errorMsg = "Unexpected error occurred during re-download.";
        }

        setOrderError(errorMsg);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="(.+)"/);
      a.download = match ? match[1] : "raffle_tickets";
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
    <div 
      className="max-w-3xl mx-auto p-6 text-left"
      style={{ backgroundColor: "#f8fafc" }}
    >
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
          <p
            className="mt-2"
            style={{
              fontSize: "0.75rem",
              color: "#64748b", // slate-500
            }}
          >
            Maximum of 3 re-downloads per order.
          </p>
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
                  {/* ORDER ID */}
                  <LabelWithBullet label="Order ID:" className="text-sm text-slate-800">
                    {t.order_id}
                  </LabelWithBullet>

                  {/* PRODUCT */}
                  {(t.product_name || t.product_id || t.product) && (
                    <LabelWithBullet label="Product:" className="text-sm text-slate-700 mt-2">
                      {t.product_name || t.product_id || t.product}
                    </LabelWithBullet>
                  )}

                  {/* QUANTITY */}
                  {typeof t.quantity === "number" && (
                    <LabelWithBullet label="Quantity:" className="text-sm text-slate-700 mt-2">
                      {t.quantity}
                    </LabelWithBullet>
                  )}

                  {/* TICKET NUMBERS */}
                  {Array.isArray(t.tickets) && t.tickets.length > 0 && (
                    <LabelWithBullet label="Ticket No:" className="text-sm text-slate-700 mt-2">
                      <div className="mt-1 flex flex-col gap-1">
                        {t.tickets.map((no, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-mono text-slate-800"
                          >
                            {no}
                          </span>
                        ))}
                      </div>
                    </LabelWithBullet>
                  )}

                  {/* DATE / TIME */}
                  {t.date && (
                    <LabelWithBullet label="Generated on:" className="text-xs text-slate-500 mt-3">
                      {new Date(t.date).toLocaleString()}
                    </LabelWithBullet>
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
