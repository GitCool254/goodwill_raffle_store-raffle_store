import React, { useState, useEffect } from "react";
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

  // New state for ticket number lookup
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketNumberError, setTicketNumberError] = useState("");
  const [ticketNumberFocused, setTicketNumberFocused] = useState(false);
  const [recentWinners, setRecentWinners] = useState([]);
  const [matchedWinner, setMatchedWinner] = useState(null);
  const [ticketCheckPerformed, setTicketCheckPerformed] = useState(false);

  // State for raffle status (to enable/disable ticket lookup)
  const [remainingTickets, setRemainingTickets] = useState(null);
  const [ticketStateLoaded, setTicketStateLoaded] = useState(false);

  const [focusedField, setFocusedField] = useState(null);

  // Fetch ticket state to determine if draw has been done
  useEffect(() => {
    const fetchTicketState = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ticket_state`);
        const data = await res.json();
        setRemainingTickets(data.remaining);
        setTicketStateLoaded(true);
      } catch (err) {
        console.error("Failed to fetch ticket state:", err);
        setTicketStateLoaded(true);
      }
    };
    fetchTicketState();
  }, []);

  // Fetch recent winners on component mount
  useEffect(() => {
    const fetchRecentWinners = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recent_winners`);
        const data = await res.json();
        if (data.show && data.winners) {
          setRecentWinners(data.winners);
        }
      } catch (err) {
        console.error("Failed to fetch recent winners:", err);
      }
    };
    fetchRecentWinners();
  }, []);

  // Determine if the draw is done (no tickets remaining)
  const isDrawDone = ticketStateLoaded && remainingTickets !== null && remainingTickets === 0;

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
      const timestamp = Math.floor(Date.now() / 1000);

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
      const timestamp = Math.floor(Date.now() / 1000);

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

  // Ticket number lookup handler
  const handleTicketNumberLookup = (e) => {
    e.preventDefault();
    setTicketNumberError("");
    setMatchedWinner(null);
    setTicketCheckPerformed(true);

    if (!ticketNumber.trim()) {
      setTicketNumberError("Please enter a ticket number.");
      return;
    }

    const foundWinner = recentWinners.find(
      (winner) => winner.ticket_no === ticketNumber.trim().toUpperCase()
    );

    if (foundWinner) {
      setMatchedWinner(foundWinner);
    } else {
      setMatchedWinner(null);
    }
  };

  // Cash-out option handler (placeholder)
  async function handleCashOut(orderId, productMarketPrice) {
    alert(`You have chosen to cash out $${productMarketPrice} for order ${orderId}. This feature will be implemented with backend integration.`);
  }

  async function handleClaimItem(orderId) {
    alert(`You have chosen to receive the prize item for order ${orderId}. Our team will contact you shortly.`);
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
              color: "#64748b",
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

      <br />

      {/* TICKET NUMBER LOOKUP SECTION - Visible but disabled when draw not done */}
      <div className="mb-8" style={{ marginTop: "30px" }}>
        <h2 className="text-lg font-semibold mb-3" style={{ fontSize: "1.2rem" }}>
          Check Your Ticket Status
        </h2>

        {!isDrawDone && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              ℹ️ The raffle draw has not yet taken place. Ticket status checking will be available after the draw is completed.
            </p>
          </div>
        )}

        <form onSubmit={handleTicketNumberLookup} className="mb-4">
          <input
            type="text"
            value={ticketNumber}
            placeholder="Enter Ticket Number (e.g., RF-48219)"
            onChange={(e) => setTicketNumber(e.target.value)}
            onFocus={() => setTicketNumberFocused(true)}
            onBlur={() => setTicketNumberFocused(false)}
            disabled={!isDrawDone}
            style={{
              border: ticketNumberError
                ? `1px solid ${ERROR_RED}`
                : ticketNumberFocused && isDrawDone
                ? `1px solid ${FOCUS_BLUE}`
                : "1px solid #d1d5db",
              boxShadow: ticketNumberError
                ? "0 0 0 2px rgba(239,68,68,0.3)"
                : ticketNumberFocused && isDrawDone
                ? "0 0 0 2px rgba(56,189,248,0.4)"
                : "none",
              outline: "none",
              transition: "all 0.15s ease",
              ...(ticketNumberError ? shakeStyle : {}),
              opacity: !isDrawDone ? 0.6 : 1,
              cursor: !isDrawDone ? "not-allowed" : "text",
              backgroundColor: !isDrawDone ? "#f3f4f6" : "white",
            }}
            className="w-full rounded-lg px-4 py-3 mb-2"
          />

          {ticketNumberError && (
            <div className="text-red-600 text-sm mb-2">
              {ticketNumberError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isDrawDone}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              isDrawDone
                ? "bg-sky-600 text-white hover:bg-sky-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Check Ticket Number
          </button>
        </form>

        {/* Instruction text with added space below */}
        <p className="mt-2 text-xs text-slate-500 mb-6">
          Enter your ticket number to check if it matches any recent winners. If your ticket is a winner, you can choose to claim the prize item or cash out.
        </p>

        {/* Plain rows for claims */}
        <div className="space-y-3">
          {/* Claims label row */}
          <div className="flex items-center">
            <span
              className="w-24 text-sm font-medium text-slate-700"
              style={{ fontWeight: "480" }}
            >
              Claims:
            </span>
          </div>

          {/* Prize Item button row */}
          <div
            className="flex items-center"
            style={{ marginBottom: "5px" }}
          >
            <span
              className="w-24 text-sm text-slate-600"
              style={{ marginRight: "10px" }}
            >
              Prize Item:
            </span>
            <button
              onClick={() => matchedWinner && handleClaimItem(matchedWinner.ticket_no)}
              disabled={!matchedWinner || !isDrawDone}
              className={`px-4 py-2 rounded-lg transition ${
                matchedWinner && isDrawDone
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Claim Item
            </button>
          </div>

          {/* Cash Out Money button row */}
          <div className="flex items-center">
            <span
              className="w-24 text-sm text-slate-600"
              style={{ marginRight: "10px" }}
            >
              Cash Out Money:
            </span>
            <button
              onClick={() => matchedWinner && handleCashOut(matchedWinner.ticket_no, matchedWinner.prize)}
              disabled={!matchedWinner || !isDrawDone}
              className={`px-4 py-2 rounded-lg transition ${
                matchedWinner && isDrawDone
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Cash Out {matchedWinner && matchedWinner.cash_out ? `(${matchedWinner.prize})` : ""}
            </button>
          </div>

          {/* Congratulatory message (only appears when a winning ticket is found) */}
          {matchedWinner && isDrawDone && (
            <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg">
              <p className="text-sm font-semibold text-green-800">
                🎉 Congratulations! Your ticket number matches a recent winner! 🎉
              </p>
              <p className="text-sm text-green-700 mt-1">
                You have won: {matchedWinner.cash_out ? `$${matchedWinner.prize} cash` : matchedWinner.prize}
              </p>
            </div>
          )}

          {/* Apology note when ticket not found (only after check) */}
          {ticketCheckPerformed && !matchedWinner && isDrawDone && (
            <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-800">
                ❌ Ticket Number Not Found
              </p>
              <p className="text-sm text-red-700 mt-1">
                The ticket number you entered does not match any recent winners. Please double-check your ticket number or contact support if you believe this is an error.
              </p>
            </div>
          )}
        </div>
      </div>

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

                  {/* MARKET PRICE (if winner) */}
                  {t.winner && t.product_market_price && (
                    <LabelWithBullet label="Market value:" className="text-sm text-emerald-600 font-semibold mt-2">
                      ${t.product_market_price}
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

                  {/* WINNER OPTIONS */}
                  {t.winner && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-800 mb-2">
                        🎉 Congratulations! You are a winner! 🎉
                      </p>
                      <p className="text-sm text-yellow-700 mb-3">
                        You can either receive the prize item or cash out the market value.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleClaimItem(t.order_id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Claim Item
                        </button>
                        <button
                          onClick={() => handleCashOut(t.order_id, t.product_market_price)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                          Cash Out (${t.product_market_price})
                        </button>
                      </div>
                    </div>
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
