import React, { useState, useEffect, useRef } from "react";

export default function RecentWinners() {
  const [winners, setWinners] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recent_winners`);
        const data = await res.json();
        setShow(data.show);
        setWinners(data.winners || []);
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
  const combinedMessage = `${statementText}  •  ${winnerText}`;

  // Safety check: if no winners or show is false, don't render anything
  if (!show || winners.length === 0) return null;

  // Start the animation after content is rendered
  useEffect(() => {
    // Clear any existing timeouts or animation frames
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (contentRef.current && containerRef.current && !isAnimating && combinedMessage) {
      // Small delay to ensure DOM is ready
      timeoutRef.current = setTimeout(() => {
        try {
          const contentWidth = contentRef.current.scrollWidth;
          const containerWidth = containerRef.current.clientWidth;
          
          if (contentWidth > containerWidth && containerWidth > 0) {
            const distance = contentWidth + containerWidth; // Total distance to travel
            const speed = 50; // pixels per second (adjust for desired speed)
            const duration = distance / speed;
            
            setIsAnimating(true);
            
            // Start the animation
            const startTime = performance.now();
            const startPosition = containerWidth;
            
            const animate = (currentTime) => {
              try {
                const elapsed = (currentTime - startTime) / 1000;
                const progress = Math.min(elapsed / duration, 1);
                const position = startPosition - (distance * progress);
                
                if (contentRef.current) {
                  contentRef.current.style.transform = `translateX(${position}px)`;
                }
                
                if (progress < 1) {
                  animationFrameRef.current = requestAnimationFrame(animate);
                } else {
                  // Animation complete, reset and start again
                  if (contentRef.current) {
                    contentRef.current.style.transform = `translateX(${containerWidth}px)`;
                  }
                  setIsAnimating(false);
                  // Force reflow to reset animation
                  setTimeout(() => {
                    if (contentRef.current) {
                      contentRef.current.style.transform = '';
                    }
                  }, 50);
                }
              } catch (err) {
                console.error("Animation error:", err);
                setIsAnimating(false);
              }
            };
            
            // Set initial position
            if (contentRef.current) {
              contentRef.current.style.transform = `translateX(${containerWidth}px)`;
            }
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            // Content fits in container, no animation needed
            if (contentRef.current) {
              contentRef.current.style.transform = 'translateX(0)';
            }
          }
        } catch (err) {
          console.error("Animation setup error:", err);
          setIsAnimating(false);
        }
      }, 100);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, combinedMessage, winners]);

  // Reset animation when winners change
  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      setIsAnimating(false);
      if (contentRef.current) {
        contentRef.current.style.transform = '';
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [combinedMessage]);

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

        .scroll-content {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
        }
      `}</style>

      <section className="w-full text-center py-4 bg-white text-slate-800 border-b border-slate-200 recent-winners">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full overflow-hidden md:mr-4">
            <div className="marquee-container" ref={containerRef}>
              <div className="scroll-content" ref={contentRef}>
                <div className="inline-flex items-center" style={{ fontSize: 0 }}>
                  <h3
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
