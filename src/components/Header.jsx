import React, { useState } from "react";

export default function Header({ setView }) {
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

          {/* TOP ROW: Menu (left) - Logo (center) - placeholder (right) */}
          <div className="flex items-center justify-between">
            {/* LEFT: small menu button */}
            <button
              className="px-3 py-2 bg-sky-600 text-white rounded shadow hover:bg-sky-700"
              onClick={() => setView("menu")}
              aria-label="Open menu"
            >
              ☰
            </button>
               
            <button
              onClick={() => setView("home")}
              className="focus:outline-none active:opacity-80"
              aria-label="Go to home"
            >

              {/* CENTER: small standard logo */}
              <img
                src="/logo.png"
                alt="Goodwillstores logo"
                className="h-[100px] w-[100px] object-contain rounded cursor-pointer"
              />
            </button>
 
            {/* RIGHT: placeholder to keep the logo centered */}
            <div className="w-10" />
          </div>

          {/* SECOND ROW: centered title + subtitle */}
          <div className="text-center mt-2">
            <h1 className="text-xl font-extrabold">Goodwillstores — Lucrative Raffles</h1>
            <div
              className="text-sm font-medium"
              style={{ color: "#1E3A8A" }}
            >
              Buy tickets. Win prizes. Transparent draws.
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
