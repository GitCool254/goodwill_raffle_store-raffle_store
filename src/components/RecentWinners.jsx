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

  // Build a single text line from all winners
  const winnerItems = winners.map(
    (w) =>
      `${w.name} (${w.state}, ${w.country}) ${w.flag} won: ${
        w.cash_out ? `$${w.prize} cash` : w.prize
      } – Ticket ${w.ticketNo}`
  );
  const fullText = winnerItems.join("  •  ");
  // Duplicate the text to ensure smooth infinite scrolling
  const scrollContent = `${fullText}  •  ${fullText}  •  ${fullText}`;

  return (
    <>
      <style>{`
        /* Premium text styles – adapted from HolidaySystem */
        @keyframes colorWave {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes zebraMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }

        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        .premium-title {
          position: relative;
          display: inline-block;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: transparent;
        }

        .premium-title::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #ef4444,
            #ec4899,
            #d946ef,
            #a855f7,
            #ef4444
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: colorWave 4s linear infinite;
        }

        /* Black Friday style (used for recent winners) */
        .recent-winners .premium-title::before {
          background: linear-gradient(
            90deg,
            #000000,
            #1f2937,
            #111827,
            #d4af37,
            #000000
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: colorWave 4s linear infinite;
        }

        .premium-title::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.9) 0px,
            rgba(255,255,255,0.9) 3px,
            transparent 3px,
            transparent 8px
          );
          background-size: 40px 40px;
          animation: zebraMove 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: scrollText 20s linear infinite;
        }
      `}</style>

      <section className="w-full text-center py-4 bg-white text-slate-800 border-b border-slate-200 recent-winners">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full overflow-hidden md:mr-4">
            <div className="marquee-container">
              <div className="marquee-content">
                <div className="inline-flex items-center" style={{ fontSize: 0 }}>
                  <h3
                    className="premium-title inline-block text-base"
                    style={{ fontSize: '1rem' }}
                    data-text={scrollContent}
                  >
                    {scrollContent}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
