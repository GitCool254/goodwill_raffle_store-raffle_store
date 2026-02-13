import React, { useEffect, useMemo, useState } from "react";

/*
  Holiday System
  - Auto date-based activation
  - Manual toggle support
  - Black Friday countdown
  - Snow (winter only)
  - Adaptive snow density
  - Smooth slide animation
  - Premium animated zebra + color wave + pulsing gradient glow
*/

export default function HolidaySystem({ onNavigate }) {
  const now = new Date();

  const HOLIDAY_SYSTEM_ENABLED = true;

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const month = now.getMonth();
  const isWinter = month === 11 || month === 0 || month === 1;

  const holidays = useMemo(() => {
    const year = now.getFullYear();

    return [
      {
        id: "blackfriday",
        name: "Black Friday Raffle Days",
        start: new Date(year, 1, 12),
        end: new Date(year, 1, 30),
        countdown: true,
      },
      {
        id: "christmas",
        name: "Christmas Raffle Specials",
        start: new Date(year, 11, 10),
        end: new Date(year, 11, 31),
      },
      {
        id: "newyear",
        name: "New Year Celebration Draw",
        start: new Date(year, 0, 1),
        end: new Date(year, 0, 7),
      },
      {
        id: "valentine",
        name: "Valentine’s Special Raffles",
        start: new Date(year, 1, 10),
        end: new Date(year, 1, 14),
      },
      {
        id: "easter",
        name: "Easter Celebration Draw",
        start: new Date(year, 3, 1),
        end: new Date(year, 3, 10),
      },
    ];
  }, []);

  const activeHolidays = holidays.filter(
    (h) => now >= h.start && now <= h.end
  );

  const [visible] = useState(true);

  if (!HOLIDAY_SYSTEM_ENABLED || !visible || activeHolidays.length === 0) {
    return null;
  }

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

        @keyframes glowPulseGradient {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(0,0,0,0.35));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(0,0,0,0.45));
          }
        }

        .premium-title {
          position: relative;
          display: inline-block;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: transparent;
          animation: glowPulseGradient 2.5s ease-in-out infinite;
        }

        /* DEFAULT (Valentine + Christmas remain unchanged) */
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

        /* BLACK FRIDAY — graphite + subtle gold ONLY */
        .blackfriday .premium-title::before {
          background: linear-gradient(
            90deg,
            #1f2937,
            #374151,
            #4b5563,
            #d4af37,
            #374151
          );
          background-size: 200% auto;
        }

        /* EASTER — soft modern spring palette */
        .easter .premium-title::before {
          background: linear-gradient(
            90deg,
            #84cc16,
            #a7f3d0,
            #facc15,
            #c4b5fd,
            #84cc16
          );
          background-size: 200% auto;
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
      `}</style>

      {isWinter && <SnowLayer isMobile={isMobile} />}

      <div className="holiday-slide">
        {activeHolidays.map((holiday) => (
          <HolidayBanner
            key={holiday.id}
            holiday={holiday}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </>
  );
}

/* ----------------------------------
   HOLIDAY BANNER
---------------------------------- */

function HolidayBanner({ holiday, onNavigate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!holiday.countdown) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = holiday.end - now;

      if (diff <= 0) {
        setTimeLeft("");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [holiday]);

  return (
    <section
      className={`w-full text-center py-4 bg-white text-slate-800 border-b border-slate-200 ${holiday.id}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm tracking-wide">
          <h3
            className="premium-title"
            data-text={holiday.name}
          >
            {holiday.name}
          </h3>

          {holiday.countdown && timeLeft && (
            <span className="ml-3 opacity-80">
              • Draw closes in {timeLeft}
            </span>
          )}
        </div>

        <button
          onClick={() => onNavigate("catalog")}
          className="mt-3 md:mt-0 px-4 py-2 rounded-lg text-sm font-medium transition bg-black text-white"
        >
          Explore Raffles
        </button>
      </div>
    </section>
  );
}

/* ----------------------------------
   SNOW LAYER
---------------------------------- */

function SnowLayer({ isMobile }) {
  const snowCount = isMobile ? 25 : 60;
  const snowflakes = Array.from({ length: snowCount });

  return (
    <div className="snow-container">
      {snowflakes.map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 5}s`,
            opacity: Math.random(),
            fontSize: `${8 + Math.random() * 10}px`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
