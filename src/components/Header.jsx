import React, { useState } from "react";

export default function Header({ setView, onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  // Accordion states inside drawer
  const [showAddress, setShowAddress] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  function openMenu() {
    setMenuOpen(true);
    setClosing(false);
  }

  function closeMenu() {
    setClosing(true);
    setTimeout(() => setMenuOpen(false), 220);
  }

  return (
    <>
      <style>{`
        .impact-paragraph {
          position: relative;
        }
        .impact-paragraph::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('/logo.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 0.1;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      {/* HEADER with Amazon‑style gradient fading to white before Smart Finds row */}
      <header
        className="w-full shadow-md sticky top-0 z-40"
        style={{
          background: "linear-gradient(180deg, #1E3A8A 0%, #FFFFFF 30%, #FFFFFF 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto p-4">
          {/* TOP ROW: Logo + Decorative Column + Title + Menu button */}
          <div className="flex items-center justify-between">
            {/* Left group: logo, column, title */}
            <div className="flex items-center" style={{ gap: '1rem' }}>
              <button
                onClick={() => setView("home")}
                className="focus:outline-none active:opacity-80"
                aria-label="Go to home"
              >
                <img
                  src="/logo.png"
                  alt="Goodwillstores logo"
                  className="h-[50px] w-[50px] object-contain rounded cursor-pointer"
                />
              </button>

              {/* Vertical decorative column */}
              <div className="flex flex-col h-[50px] w-[3px] rounded-full overflow-hidden" style={{ gap: '1px', background: 'white' }}>
                <div className="flex-1" style={{ background: '#1E3A8A', boxShadow: 'inset 0 0 4px rgba(255,255,255,0.3)' }}></div>
                <div className="flex-1" style={{ background: '#111', boxShadow: 'inset 0 0 4px rgba(255,255,255,0.3)' }}></div>
                <div className="flex-1" style={{ background: '#1E3A8A', boxShadow: 'inset 0 0 4px rgba(255,255,255,0.3)' }}></div>
              </div>

              {/* Clickable title – white for contrast on dark top */}
              <div
                style={{ backgroundColor: "transparent" }}
                className="inline-block"
              >
                <button
                  onClick={() => setView("home")}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'white',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    lineHeight: 1.2
                  }}
                  className="focus:outline-none"
                >
                  Goodwillstores
                  <span style={{ display: 'block' }}>Foundation</span>
                </button>
              </div>
            </div>

            {/* Menu button on the right – transparent background, white icon, larger */}
            <button
              className="px-3 py-1 text-white bg-transparent border-none cursor-pointer"
              onClick={() => onMenuClick && onMenuClick()}
              aria-label="Open menu"
              style={{ marginRight: '20px', color: 'white', fontSize: '20px' }}
            >
              ☰
            </button>
          </div>

          {/* Smart Finds row – now on solid white background */}
          <div style={{ marginTop: "35px" }}>
            <h2
              className="font-semibold tracking-tight"
              style={{ fontSize: "16px", lineHeight: "1.3", color: "#1E3A8A" }}
            >
              Smart Finds • Discover Value • Win Quality
            </h2>
          </div>

          {/* Paragraph container – white background, separated */}
          <div
            className="mt-4"
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "16px",
              border: "1.5px dotted #cbd5e1",
            }}
          >
            <p
              className="impact-paragraph"
              style={{
                fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '1.6',
                letterSpacing: '0.01em',
                color: '#334155',
                margin: 0,
                position: 'relative'
              }}
            >
              Curated raffles featuring quality pre-owned finds, fashion, home, and electronics — giving you access to exceptional value, responsibly.<br />
              Every ticket supports academic sponsorships, palliative care for the vulnerable, and emergency relief. The more you participate, the greater the impact you help create.
            </p>
          </div>
        </div>
      </header>
    </>
  );
}
