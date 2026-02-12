import React, { useEffect, useMemo, useState } from "react";

/*
  Holiday System
  - Auto date-based activation
  - Manual toggle support
  - Black Friday countdown
  - Snow (winter only)
  - Adaptive snow density
  - Smooth slide animation
*/

export default function HolidaySystem({ onNavigate }) {
  const now = new Date();

  const HOLIDAY_SYSTEM_ENABLED = true;

  const isMobile = window.innerWidth < 768;

  const month = now.getMonth();
  const isWinter = month === 11 || month === 0 || month === 1;

  const holidays = useMemo(() => {
    const year = now.getFullYear();

    return [
      {
        id: "blackfriday",
        name: "Black Friday Raffle Days",
        start: new Date(year, 10, 20),
        end: new Date(year, 10, 30),
        dark: true,
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

  const [visible, setVisible] = useState(true);

  if (!HOLIDAY_SYSTEM_ENABLED || !visible || activeHolidays.length === 0) {
    return null;
  }

  return (
    <>
      {/* Modern Color Wave Animation Styles */}
      <style>{`
        @keyframes modernColorWave {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .modern-wave-title {
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
          animation: modernColorWave 4s linear infinite;
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
      className={`w-full text-center py-4 ${
        holiday.dark ? "bg-black text-white" : "bg-white text-slate-800"
      } border-b border-slate-200`}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

        {/* ✅ MODERN COLOR WAVE TITLE */}
        <div className="text-sm tracking-wide">
          <h3
            className="font-semibold modern-wave-title"
            style={{
              letterSpacing: "0.04em",
            }}
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
          className={`mt-3 md:mt-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
            holiday.dark
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
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
