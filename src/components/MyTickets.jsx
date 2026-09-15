import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import CanonicalTag from "./CanonicalTag";
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

  // Ticket number lookup state
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketNumberError, setTicketNumberError] = useState("");
  const [ticketNumberFocused, setTicketNumberFocused] = useState(false);
  const [claimedTicket, setClaimedTicket] = useState(null);
  const [ticketCheckPerformed, setTicketCheckPerformed] = useState(false);
  const [isCheckingTicket, setIsCheckingTicket] = useState(false);

  // Raffle status (to enable/disable ticket lookup)
  const [remainingTickets, setRemainingTickets] = useState(null);
  const [ticketStateLoaded, setTicketStateLoaded] = useState(false);

  const [focusedField, setFocusedField] = useState(null);

  // Referral states
  const [referralCode, setReferralCode] = useState("");
  const [referralCredits, setReferralCredits] = useState(0);
  const [copied, setCopied] = useState(false);

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

  // Determine if the draw is done (no tickets remaining)
  const isDrawDone =
    ticketStateLoaded && remainingTickets !== null && remainingTickets === 0;

  // Validate ticket number format: GWS-XXXXXXXX (case-insensitive, 8 alphanumeric)
  const isValidTicketFormat = (ticket) => {
    const regex = /^[Gg][Ww][Ss]-[A-Za-z0-9]{8}$/;
    return regex.test(ticket);
  };

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
      const payload = { email: email.trim().toLowerCase() };

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

      if (!res.ok) throw new Error("Fetch failed");

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
      const payload = { order_id: orderId.trim() };

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

  // ----- Ticket number lookup (backend is the source of truth) -----
  const handleTicketNumberLookup = async (e) => {
    e.preventDefault();
    setTicketNumberError("");
    setClaimedTicket(null);
    setTicketCheckPerformed(false);

    if (!ticketNumber.trim()) {
      setTicketNumberError("Please enter a ticket number.");
      return;
    }

    if (!isValidTicketFormat(ticketNumber)) {
      setTicketNumberError(
        "Invalid ticket format. Please use format: GWS-XXXXXXXX (e.g., GWS-WA0P1KQ, case insensitive, 8 alphanumeric characters after the dash)."
      );
      return;
    }

    setIsCheckingTicket(true);

    try {
      const normalizedTicket = ticketNumber.trim().toUpperCase();

      const nonce = crypto.randomUUID();
      const payloadWithNonce = { ticket_no: normalizedTicket, nonce };
      const timestamp = Math.floor(Date.now() / 1000);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/check_ticket_status`,
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
        throw new Error("Ticket status check failed");
      }

      const data = await res.json();

      if (data.status === "CLAIMED" && data.winner) {
        setClaimedTicket(data.winner);
      } else {
        setClaimedTicket(null);
      }
      setTicketCheckPerformed(true);
    } catch (err) {
      console.error("Ticket status check failed:", err);
      setTicketNumberError(
        "Could not verify this ticket right now. Please try again."
      );
    } finally {
      setIsCheckingTicket(false);
    }
  };

  // Referral handlers
  const fetchReferralCode = async () => {
    if (!email || !isValidEmail(email)) {
      alert("Please enter a valid email address first.");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/referral/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        }
      );
      const data = await res.json();
      if (data.code) {
        setReferralCode(data.code);
        setReferralCredits(data.credits || 0);
      } else {
        alert("Could not generate referral code.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch referral code.");
    }
  };

  const fetchReferralRewards = async () => {
    if (!email || !isValidEmail(email)) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/referral/rewards`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        }
      );
      const data = await res.json();
      setReferralCredits(data.credits || 0);
    } catch (err) {
      console.error("Failed to fetch referral rewards:", err);
    }
  };

  useEffect(() => {
    if (email && isValidEmail(email)) {
      fetchReferralRewards();
    } else {
      setReferralCredits(0);
      setReferralCode("");
    }
  }, [email]);

  // Shared card style for the two ticket-status result sections
  const resultCardStyle = {
    backgroundColor: "#ffffff",
    maxWidth: "480px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20px",
    marginBottom: "20px",
    padding: "24px",
    borderRadius: "16px",
    boxShadow:
      "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)",
  };

  return (
    <>
      <Helmet>
        <title>My Tickets – Goodwillstores</title>
        <meta
          name="description"
          content="View your raffle tickets, re‑download your tickets, and check your ticket status. Stay updated on your entries and potential wins."
        />
      </Helmet>

      <CanonicalTag path="/tickets" />

      <div
        className="max-w-3xl mx-auto p-6 text-left"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <h1 className="font-bold mb-4" style={{ fontSize: "1.2rem" }}>
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
              <div className="text-red-600 text-sm mb-2">{orderError}</div>
            )}

            <button
              type="submit"
              className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Re-download by Order ID
            </button>
            <p className="mt-2" style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Maximum of 3 re-downloads per order.
            </p>
          </form>

          <hr className="my-6" />
          <p className="text-sm text-slate-600">
            Enter the email address you used during ticket purchase to view all your generated tickets.
          </p>
          <p
            className="mt-1"
            style={{ fontSize: "0.875rem", color: "#64748b" }}
          >
            ℹ️ Simply enter your email, then click "Get My Referral Code" below to receive your unique referral link.
          </p>
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
            <div className="text-red-600 text-sm mb-2">{error}</div>
          )}

          <button
            type="submit"
            className="bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-700 transition"
          >
            View My Tickets
          </button>
        </form>

        <br />

        {/* RESULTS */}
        {tickets && (
          <>
            {tickets.length === 0 ? (
              <div className="text-slate-600 mb-6">
                No tickets found for this email address.
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {tickets.map((t, i) => (
                  <div
                    key={i}
                    className="border rounded-xl p-4 bg-white shadow-sm"
                    style={{ paddingLeft: "10px", marginTop: "20px" }}
                  >
                    <LabelWithBullet
                      label="Order ID:"
                      className="text-sm text-slate-800"
                    >
                      {t.order_id}
                    </LabelWithBullet>

                    {(t.product_name || t.product_id || t.product) && (
                      <LabelWithBullet
                        label="Product:"
                        className="text-sm text-slate-700 mt-2"
                      >
                        {t.product_name || t.product_id || t.product}
                      </LabelWithBullet>
                    )}

                    {t.winner && t.product_market_price && (
                      <LabelWithBullet
                        label="Market value:"
                        className="text-sm text-emerald-600 font-semibold mt-2"
                      >
                        ${t.product_market_price}
                      </LabelWithBullet>
                    )}

                    {typeof t.quantity === "number" && (
                      <LabelWithBullet
                        label="Quantity:"
                        className="text-sm text-slate-700 mt-2"
                      >
                        {t.quantity}
                      </LabelWithBullet>
                    )}

                    {Array.isArray(t.tickets) && t.tickets.length > 0 && (
                      <LabelWithBullet
                        label="Ticket No:"
                        className="text-sm text-slate-700 mt-2"
                      >
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
                            disabled
                            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                          >
                            Claim Item
                          </button>
                          <button
                            disabled
                            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                          >
                            Cash Out (${t.product_market_price})
                          </button>
                        </div>
                      </div>
                    )}

                    {t.date && (
                      <LabelWithBullet
                        label="Generated on:"
                        className="text-xs text-slate-500 mt-3"
                      >
                        {new Date(t.date).toLocaleString()}
                      </LabelWithBullet>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <h2
          className="text-lg font-semibold mb-2"
          style={{ fontSize: "1.2rem" }}
        >
          Refer a Friend, Earn Free Tickets
        </h2>

        {/* REFERRAL SECTION */}
        <div
          className="mb-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
          style={{ paddingLeft: "5px", marginBottom: "10px" }}
        >
          <p className="text-sm text-slate-600 mb-3">
            Invite someone to join Goodwillstores. When they purchase{" "}
            <strong>3 or more tickets</strong>, you receive{" "}
            <strong>1 free ticket credit</strong>.
          </p>
          {email ? (
            <>
              <div className="flex flex-col gap-2 mb-3">
                <button
                  onClick={fetchReferralCode}
                  className="bg-sky-600 text-white px-3 py-1 rounded text-sm self-start"
                  style={{ marginBottom: "10px" }}
                >
                  Get My Referral Code
                </button>
                {referralCode && (
                  <>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-medium text-slate-700"
                        style={{ marginRight: "5px" }}
                      >
                        Referral code:
                      </span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {referralCode}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}?ref=${referralCode}`
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-sky-600 text-sm underline self-start"
                      style={{ marginBottom: "5px" }}
                    >
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                    <p
                      className="mt-1"
                      style={{ fontSize: "0.875rem", color: "#64748b" }}
                    >
                      Share this link with friends to earn free ticket credit!
                    </p>
                  </>
                )}
              </div>
              {referralCredits > 0 && (
                <div className="text-sm text-emerald-700 font-medium">
                  🎉 You have {referralCredits} free ticket credit(s)! Use them
                  on your next purchase.
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">
              Enter your email above to get your referral code.
            </p>
          )}
        </div>

        {/* TICKET NUMBER LOOKUP SECTION */}
        <div className="mb-8" style={{ marginTop: "30px" }}>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ fontSize: "1.2rem" }}
          >
            Check Your Ticket Status
          </h2>

          {!isDrawDone && (
            <div
              className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4"
              style={{ marginTop: "15px", marginBottom: "15px" }}
            >
              <p className="text-sm text-yellow-800">
                ℹ️ The raffle draw has not yet taken place. Ticket status
                checking will be available after the draw is completed.
              </p>
            </div>
          )}

          <form onSubmit={handleTicketNumberLookup} className="mb-4">
            <input
              type="text"
              value={ticketNumber}
              placeholder="Enter Ticket Number (e.g., GWS-WA0P1KQ)"
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
              <div
                className="text-red-600 text-sm mb-2"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                {ticketNumberError}
              </div>
            )}

            <button
              type="submit"
              disabled={!isDrawDone || isCheckingTicket}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                isDrawDone && !isCheckingTicket
                  ? "bg-sky-600 text-white hover:bg-sky-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isCheckingTicket ? "Checking…" : "Check Ticket Number"}
            </button>
          </form>

          <p
            className="mt-2 text-xs text-slate-600 mb-6 leading-relaxed"
            style={{ fontSize: "0.875rem", color: "#64748b" }}
          >
            Please enter your ticket number to check if it has been selected. If
            selected, you may claim the prize item or its cash value. We're
            grateful to have you with us. Best of luck!
          </p>

          {/* Plain rows for claims */}
          <div className="space-y-3">
            <div className="flex items-center">
              <span
                className="w-24 text-sm font-medium text-slate-700"
                style={{ fontWeight: "480" }}
              >
                Claims:
              </span>
            </div>

            <div className="flex items-center" style={{ marginBottom: "5px" }}>
              <span
                className="w-24 text-sm text-slate-600"
                style={{ marginRight: "10px" }}
              >
                Prize Item:
              </span>
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                Claim Item
              </button>
            </div>

            <div className="flex items-center">
              <span
                className="w-24 text-sm text-slate-600"
                style={{ marginRight: "10px" }}
              >
                Cash Out Money:
              </span>
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                Cash Out
              </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                CLAIMED TICKET SECTION
                White container + soft shadow (verification style).
                Shows the claim that has already been made in the past.
                ═══════════════════════════════════════════════════════════ */}
            {claimedTicket && isDrawDone && (
              <div style={resultCardStyle}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <span style={{ fontSize: "1.25rem" }}>✅</span>
                  <p
                    className="text-slate-800"
                    style={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    Ticket Claimed
                  </p>
                </div>

                {/* Structured details */}
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex">
                    <span className="w-32 text-slate-500" style={{ marginRight: "10px" }} >Ticket No:</span>
                    <span className="font-mono text-slate-800">
                      {claimedTicket.ticket_no}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-500" style={{ marginRight: "10px" }} >Claimed by:</span>
                    <span className="font-medium text-slate-800">
                      {claimedTicket.name}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-500" style={{ marginRight: "10px" }} >Prize won:</span>
                    <span className="font-medium text-slate-800">
                      {claimedTicket.prize}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-500" style={{ marginRight: "10px" }} >
                      Date claimed:
                    </span>
                    <span className="text-slate-800">
                      {claimedTicket.date_claimed || "—"}
                    </span>
                  </div>
                </div>

                {/* Minimal, modern, professional closing note */}
                <p
                  className="mt-4 italic text-slate-500"
                  style={{ fontSize: "0.75rem" }}
                >
                  Thank you for being part of this campaign. A new raffle is
                  coming soon — we'd love to see you again.
                </p>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────
                NOT THIS TIME — apology note
                Same white container + soft shadow style.
                No colored border, no rainbow divider.
                ─────────────────────────────────────────────────────────── */}
            {ticketCheckPerformed && !claimedTicket && isDrawDone && (
              <div style={resultCardStyle}>
                <p
                  className="text-slate-800 mb-2"
                  style={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  🙏 Thank You for Participating
                </p>
                <p
                  className="text-slate-600"
                  style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
                >
                  Thank you for your trust and participation. Although your ticket was not selected in this draw, we truly appreciate your support and being part of the Goodwillstores community. We warmly invite you to join our upcoming raffle campaign for another opportunity to win. <br /><strong>Stay persistent. Every opportunity brings you closer to the next possibility.</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
