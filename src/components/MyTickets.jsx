import React, { useState } from "react";

export default function MyTickets() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState(null);

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

    const stored = localStorage.getItem("gw_entries");
    if (!stored) {
      setTickets([]);
      return;
    }

    const entries = JSON.parse(stored);
    setTickets(entries[email] || []);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-left">
      <h1
        className="font-bold mb-4"
        style={{ fontSize: "24px" }}
      >
        🎟️ My Tickets
      </h1>

      <p className="text-slate-600 mb-6">
        Enter the email address you used during ticket purchase to view all your
        generated tickets.
      </p>

      {/* EMAIL FORM */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border rounded-lg px-4 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
