import React, { useState, useEffect } from "react";

export default function RecentWinners() {
  const [winners, setWinners] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recent_winners`);
        const data = await res.json();
        setShow(data.show);
        setWinners(data.winners);
      } catch (err) {
        console.error("Failed to fetch recent winners:", err);
        setShow(false);
        setWinners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWinners();
  }, []);

  if (!show || winners.length === 0) return null;

  // Map winners to display lines (multiple winners in one continuous line)
  const lines = winners.map(
    (w) =>
      `${w.name} (${w.state}, ${w.country}) ${w.flag} won: ${
        w.cash_out ? `$${w.prize} cash` : w.prize
      } – Ticket ${w.ticketNo}`
  );

  // Join with separator
  const marqueeText = lines.join("  •  ");

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-2 overflow-hidden whitespace-nowrap">
      <div
        className="inline-block animate-marquee"
        style={{ animation: "marquee 20s linear infinite" }}
      >
        🎉  {marqueeText}  🎉
      </div>
    </div>
  );
}
