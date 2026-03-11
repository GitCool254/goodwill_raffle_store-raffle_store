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
      {/* HEADER */}
      <header className="w-full bg-white shadow-md sticky top-0 z-40">
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

              {/* Clickable title styled like plain text */}
              <div
                style={{ backgroundColor: "#f8fafc" }}
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
                    color: 'inherit',
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

            {/* Menu button on the right */}
            <button
              className="px-3 py-1 bg-sky-600 text-white rounded shadow hover:bg-sky-700"
              onClick={() => onMenuClick && onMenuClick()}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>

          {/* Subtitle – modernised paragraph */}
          <div
            style = {{ backgroundColor: "#f8fafc", marginTop: "35px" }}
          >
            <h2
              className="font-semibold tracking-tight"
              style={{ fontSize: "16px", lineHeight: "1.3", color: "#1E3A8A" }}
            >
              Smart Finds • Discover Value • Win Quality
            </h2>
            <p className="mt-4 max-w-xl" style={{ fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 600, fontSize: '16px', lineHeight: '1.6', letterSpacing: '0.01em', color: '#334155' }}>
              Curated raffles featuring quality pre-owned finds, fashion, home, and electronics — giving you access to exceptional value, responsibly.
              Every ticket supports academic sponsorships, palliative care for the vulnerable, and emergency relief. The more you participate, the greater the impact you help create.
            </p>
          </div>
        </div>
      </header>
    </>
  );
}
