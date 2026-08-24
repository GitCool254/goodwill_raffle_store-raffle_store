import React, { useState, useEffect, useRef } from "react";

export default function WinnersDetail() {
  const winners = [
    {
      name: "Melissa D.",
      date: "30 July 2026",
      ticketNo: "GWS-240715B9",
      product: "Larchmont Dining Set",
      winnerImg: "",
      productImg: "/Dining set_melissa.png",
      verified: true,
      countryFlag: "🇦🇺",
      location: "Dodges Ferry TAS",
    },
    {
      name: "Liam J..",
      date: "30 July 2026",
      ticketNo: "GWS-3B8381E",
      product: "Ballinasloe 3-piece Sectional",
      winnerImg: "",
      productImg: "/Ballinasloe_Liam.png",
      verified: true,
      countryFlag: "🇦🇺",
      location: "Albans VIC",
    },
    {
      name: "Alexander G.",
      date: "1 August 2026",
      ticketNo: "GWS-74BD35F1",
      product: "NSF Surf Betty",
      winnerImg: "",
      productImg: "/Surf Betty.png",
      verified: true,
      countryFlag: "🇦🇺",
      location: "Dodges Ferry TAS",
    },
    {
      name: "Mae W.",
      date: "30 July 2026",
      ticketNo: "GWS-8B43622A",
      product: "Trek Marlin 5 Gen 2",
      winnerImg: "",
      productImg: "/Trek Marlin_mae.png",
      verified: true,
      countryFlag: "🇦🇺",
      location: "Elanora QLD",
    },
    {
      name: "Joshua T.",
      date: "31 July 2026",
      ticketNo: "GWS-C2C2621C",
      product: "Venom X21(Dongfang DF50SRT)",
      winnerImg: "",
      productImg: "/Venom X21_Joshua.png",
      verified: true,
      countryFlag: "🇦🇺",
      location: "Applecross WA",
    },
  ];

  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [imgError, setImgError] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setExpanded(false);
        setIndex((i) => (i + 1) % winners.length);
        setAnimate(true);
        setImgError(false);
      }, 250);
    }, 4500);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    setImgError(false);
  }, [index]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) < 15) {
      setPaused((p) => !p);
      return;
    }
    if (Math.abs(delta) < 50) return;
    setAnimate(false);
    setTimeout(() => {
      setExpanded(false);
      if (delta > 0) {
        setIndex((i) => (i + 1) % winners.length);
      } else {
        setIndex((i) => (i - 1 + winners.length) % winners.length);
      }
      setAnimate(true);
    }, 200);
  };

  const w = winners[index];
  const shortProduct = w.product.slice(0, 75);
  const initials = getInitials(w.name);
  const hasValidImage = w.winnerImg && w.winnerImg.trim() !== "";

  return (
    <section className="max-w-6xl mx-auto px-6 py-8 text-center">
      <div
        key={index}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="rounded-2xl p-7 shadow-sm"
        style={{
          border: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          marginTop: "15px",
          backdropFilter: "blur(6px)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(10px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: "2px",
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{
            background: "#f1f5f9",
            padding: "4px 10px",
            borderRadius: "999px",
            display: "inline-block",
            fontWeight: 500,
            color: "#94a3b8",
            marginTop: "15px",
          }}
        >
          6500+ Winners Since Launch
        </p>

        <p
          className="text-xs uppercase tracking-widest font-medium"
          style={{ color: "#94a3b8", letterSpacing: "0.15em" }}
        >
          RECENT WINNERS
        </p>

        <div className="flex items-center justify-center gap-2">
          <p className="text-base font-semibold text-slate-800">{w.name}</p>
          {w.verified && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              ✔ Verified
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-1">
          <p className="text-xs text-slate-500">{w.location}</p>
          <span className="text-sm">{w.countryFlag}</span>
        </div>

        {hasValidImage && !imgError ? (
          <img
            src={w.winnerImg}
            alt="Winner"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              margin: "0 auto",
              border: "1px solid #cbd5e1",
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#d1fae5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              border: "1px solid #cbd5e1",
            }}
          >
            <span
              style={{
                color: "#10b981",
                fontWeight: "bold",
                fontSize: "18px",
                textTransform: "uppercase",
              }}
            >
              {initials}
            </span>
          </div>
        )}

        <p className="text-sm font-semibold text-slate-800">
          {expanded ? w.product : shortProduct}
          {w.product.length > 75 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-xs underline text-slate-500"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </p>

        <img
          src={w.productImg}
          alt="Product"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "8px",
            objectFit: "cover",
            display: "block",
            margin: "12px auto 0 auto",
            border: "1px solid #cbd5e1",
          }}
        />

        <p
          className="text-xs"
          style={{
            background: "#f1f5f9",
            padding: "4px 10px",
            borderRadius: "999px",
            display: "inline-block",
            fontWeight: 500,
            color: "#475569",
          }}
        >
          Ticket {w.ticketNo}
        </p>

        <p className="text-xs text-slate-500" style={{ color: "#94a3b8" }}>
          Draw date: {w.date}
        </p>
      </div>

      <br />

      <div className="mt-4 text-center select-none">
        {winners.map((_, i) => (
          <span
            key={i}
            onClick={() => {
              setAnimate(false);
              setTimeout(() => {
                setExpanded(false);
                setIndex(i);
                setAnimate(true);
                setImgError(false);
              }, 150);
            }}
            style={{
              cursor: "pointer",
              fontSize: "18px",
              margin: "0 6px",
              color: i === index ? "#0f172a" : "#cbd5e1",
              transition: "color 0.3s ease",
            }}
            aria-label={`Show winner ${i + 1}`}
          >
            {i === index ? "●" : "○"}
          </span>
        ))}
      </div>

      <p className="text-xs mt-3" style={{ color: "#94a3b8", fontStyle: "italic" }}>
        Recent raffle winners. Names are partially anonymized for privacy.
      </p>
    </section>
  );
}
