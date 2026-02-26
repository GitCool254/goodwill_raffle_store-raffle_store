import React, { useEffect, useMemo, useState } from "react";

/*
  Holiday System
  - Auto date-based activation
  - Manual toggle support
  - Black Friday now runs EVERY Friday (00:00 → 23:59 local time guaranteed)
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
        weeklyFriday: true,
        countdown: true,
      },
      {
        id: "christmas",
        name: "Christmas Raffle Specials",
        start: new Date(year, 1, 25),
        end: new Date(year, 1, 26),
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

  // Helper: check if a date is within the next 2 days (inclusive)
  const isWithinNextTwoDays = (date) => {
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(now.getDate() + 2);
    twoDaysFromNow.setHours(23, 59, 59, 999); // end of that day
    return date > now && date <= twoDaysFromNow;
  };

  const activeHolidays = holidays.filter((h) => {
    if (h.weeklyFriday) {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);

      const isFriday = now.getDay() === 5;

      return isFriday && now >= todayStart && now <= todayEnd;
    }

    return now >= h.start && now <= h.end;
  });

  const upcomingHolidays = holidays.filter((h) => {
    if (h.weeklyFriday) {
      // For Black Friday: find the next Friday date
      const nextFriday = new Date(now);
      nextFriday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7));
      nextFriday.setHours(0, 0, 0, 0);
      const nextFridayEnd = new Date(nextFriday);
      nextFridayEnd.setHours(23, 59, 59, 999);
      // If today is Friday, it's active → not upcoming
      if (now.getDay() === 5) return false;
      return isWithinNextTwoDays(nextFriday);
    } else {
      // For fixed‑date holidays: exclude if already active
      if (now >= h.start && now <= h.end) return false;
      return isWithinNextTwoDays(h.start);
    }
  });

  const [visible] = useState(true);

  if (!HOLIDAY_SYSTEM_ENABLED || !visible || (activeHolidays.length === 0 && upcomingHolidays.length === 0)) {
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

        .blackfriday .premium-title::before {
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
        
        /* Marquee for upcoming banner */
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
        .marquee-content span {
          display: inline-block;
          margin-right: 2rem; /* gap between repeated messages */
        }
        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {isWinter && <SnowLayer isMobile={isMobile} />}

      <div className="holiday-slide">
        {activeHolidays.map((holiday) => (
          <HolidayBanner key={holiday.id} holiday={holiday} onNavigate={onNavigate} />
        ))}
        {upcomingHolidays.map((holiday) => (
          <UpcomingBanner key={`upcoming-${holiday.id}`} holiday={holiday} onNavigate={onNavigate} />
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

      if (holiday.weeklyFriday) {
        const endOfFriday = new Date(now);
        endOfFriday.setHours(23, 59, 59, 999);

        const diff = endOfFriday - now;

        if (diff <= 0) {
          setTimeLeft("");
          return;
        }

        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);

        setTimeLeft(`${h}h ${m}m`);
        return;
      }

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
        <div className="text-sm tracking-wide flex flex-col items-center md:items-start">

          <h3 className="premium-title" data-text={holiday.name}>
            {holiday.name}
          </h3>

          {holiday.countdown && timeLeft && (
            <span className="mt-1 opacity-80 text-sm">
              Draw closes in <strong>{timeLeft}</strong>
            </span>
          )}

          {/* Holiday special offer */}
          <div 
            className="mt-1 text-xs md:text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full"
            style={{ color: "#64748b" }}
          >
            <strong>Buy 5 tickets. Get 2 on Us.</strong>
          </div>
        </div>

        <br />

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
   UPCOMING HOLIDAY BANNER (2 days ahead)
---------------------------------- */
function UpcomingBanner({ holiday, onNavigate }) {
  return (
    <section className={`w-full text-center py-4 bg-white text-slate-800 border-b border-slate-200 ${holiday.id}`}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full overflow-hidden md:mr-4">
          <div className="marquee-container">
            <div className="marquee-content">
              <div className="inline-flex items-center">
                <span className="inline-block text-base">🎉</span><h3 className="premium-title inline-block" data-text={`${holiday.name} starts in 2 days! Get ready for special offers.`}>
                  {holiday.name} starts in 2 days! Get ready for special offers.
                </h3>
              </div>
              <div className="inline-flex items-center">
                <span className="inline-block text-base">🎉</span><h3 className="premium-title inline-block" data-text={`${holiday.name} starts in 2 days! Get ready for special offers.`}>
                  {holiday.name} starts in 2 days! Get ready for special offers.
                </h3>
              </div>
            </div>
          </div>
        </div>

        <br />
        <button
          onClick={() => onNavigate("catalog")}
          className="mt-3 md:mt-0 px-4 py-2 rounded-lg text-sm font-medium transition bg-black text-white whitespace-nowrap"
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
