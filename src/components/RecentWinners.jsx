import React, { useState, useEffect, useRef } from "react";

export default function RecentWinners({ show: propShow, winners: propWinners }) {
  // If the parent supplies both props, we trust them and skip our own fetch.
  const useExternalData = propWinners !== undefined && propShow !== undefined;

  const [internalWinners, setInternalWinners] = useState([]);
  const [internalShow, setInternalShow] = useState(false);

  // Final values used for rendering.
  const winners = useExternalData ? propWinners : internalWinners;
  const show = useExternalData ? propShow : internalShow;

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const animationRef = useRef(null);

  // Fallback fetch — only when App.jsx does NOT supply data.
  useEffect(() => {
    if (useExternalData) return;

    const fetchWinners = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/recent_winners`
        );
        const data = await res.json();
        setInternalShow(data.show);
        setInternalWinners(data.winners || []);
      } catch (err) {
        console.error("Failed to fetch recent winners:", err);
        setInternalShow(false);
        setInternalWinners([]);
      }
    };

    // Defer the fetch to avoid blocking initial render.
    const deferFetch = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
          setTimeout(fetchWinners, 300);
        });
      } else {
        setTimeout(fetchWinners, 500);
      }
    };

    deferFetch();
  }, [useExternalData]);

  const statementText =
    "❖❖❖ Empowerment Raffle Campaign 20/03/2026 - Winners ❖❖❖";
  const winnerItems = winners.map(
    (w) =>
      `${w.name} (${w.state}, ${w.country}) won: ${
        w.cash_out ? `$${w.prize} cash` : w.prize
      } – Ticket ${w.ticket_no}`
  );
  const winnerText = winnerItems.join("  •  ");
  const combinedMessage = `${statementText}  •  ${winnerText}...`;

  if (!show || winners.length === 0) return null;

  const messageLength = combinedMessage.length;
  const animationDuration = Math.max(20, Math.min(45, messageLength * 0.08));

  const handleAnimationEnd = () => {
    if (animationRef.current) {
      animationRef.current.style.animation = "none";
      setTimeout(() => {
        if (animationRef.current) {
          animationRef.current.style.animation = `scrollOnce ${animationDuration}s linear forwards`;
        }
      }, 10);
    }
  };

  return (
    <>
      <style>{`
        @keyframes colorWave {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes zebraMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes scrollOnce {
          0% { transform: translateX(100vw); }
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

        .recent-winners .premium-title::before {
          background: linear-gradient(
            90deg,
            #000000,
            #1a5c1a,
            #1f2937,
            #111827,
            #1a5c1a,
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
          display: flex;
          align-items: center;
          border: none;
        }

        /* Simple solid lines (0px height — kept for parity) */
        .marquee-container::before,
        .marquee-container::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          height: 0px;
          background: #cbd5e1;
          pointer-events: none;
        }

        .marquee-container::before {
          top: 0;
        }

        .marquee-container::after {
          bottom: 0;
        }

        .scroll-once {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
          transform: translateX(100vw);
        }
      `}</style>

      <section className="w-full text-center py-4 bg-white text-slate-800 border-b border-slate-200 recent-winners">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full overflow-hidden md:mr-4">
            <div className="marquee-container" ref={containerRef}>
              <div
                ref={animationRef}
                className="scroll-once"
                style={{
                  animation: `scrollOnce ${animationDuration}s linear forwards`,
                  transform: "translateX(100vw)",
                }}
                onAnimationEnd={handleAnimationEnd}
              >
                <div
                  className="inline-flex items-center"
                  style={{ fontSize: 0 }}
                >
                  <h3
                    ref={contentRef}
                    className="premium-title inline-block text-base"
                    style={{ fontSize: "1rem", whiteSpace: "pre" }}
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
