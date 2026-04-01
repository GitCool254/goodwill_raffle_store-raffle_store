import React, { useState, useEffect, useRef } from "react";

export default function RecentWinners() {
  const [winners, setWinners] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const scrollRef = useRef(null);
  const contentRef = useRef(null);

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

  // Statement text
  const statementText = "❖❖❖ Empowerment Raffle Campaign 20/03/2026 - Winners ❖❖❖";

  // Build winner text - include ALL winners, each as a separate item
  const winnerItems = winners.map(
    (w) =>
      `${w.name} (${w.state}, ${w.country}) won: ${
        w.cash_out ? `$${w.prize} cash` : w.prize
      } – Ticket ${w.ticket_no}`
  );
  // Join all winners with separator
  const winnerText = winnerItems.join("  •  ");

  // Single, non-repeating message: statement + all winners (once)
  const combinedMessage = `${statementText}  •  ${winnerText}  •  ${statementText}  •  ${winnerText}  •  ${statementText}  •  ${winnerText}`;

  if (!show || winners.length === 0) return null;

  // Calculate animation duration based on content length (approx 0.2 seconds per character)
  const messageLength = combinedMessage.length;
  const animationDuration = Math.max(15, Math.min(45, messageLength * 0.08));

  // Handle animation end - reset to start
  const handleAnimationEnd = () => {
    setResetKey(prev => prev + 1);
  };

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

        @keyframes scrollOnce {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
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
          position: relative;
          height: 3rem;
        }

        .scroll-once {
          position: relative;
          white-space: nowrap;
          animation: scrollOnce ${animationDuration}s linear forwards;
        }
      `}</style>

      <section className="w-full text-center py-4 bg-white text-slate-800 border-b border-slate-200 recent-winners">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full overflow-hidden md:mr-4">
            <div className="marquee-container" key={resetKey}>
              <div
                className="scroll-once"
                onAnimationEnd={handleAnimationEnd}
              >
                <div className="inline-flex items-center" style={{ fontSize: 0 }}>
                  <h3
                    ref={contentRef}
                    className="premium-title inline-block text-base"
                    style={{ fontSize: '1rem' }}
                    data-text={combinedMessage}
                  >
                    {combinedMessage}
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
