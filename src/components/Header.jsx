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

          {/* TOP ROW: Logo + Title + Menu button */}
          <div className="flex items-center justify-between">
            {/* Left group: logo and title */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("home")}
                className="focus:outline-none active:opacity-80"
                aria-label="Go to home"
              >
                <img
                  src="/logo.png"
                  alt="Goodwillstores logo"
                  className="[50px] w-[50px] object-contain rounded cursor-pointer"
                />
              </button>

              {/* Title with original background */}
              <div
                style={{ backgroundColor: "#f8fafc" }}
                className="inline-block"
              >
                <h1 className="text-xl font-extrabold">
                  Goodwillstores
                </h1>
              </div>
            </div>

            {/* Menu button on the right */}
            <button
              className="px-3 py-1 bg-sky-600 text-white rounded shadow hover:bg-sky-700"
              onClick={() => setView("menu")}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>

          {/* Subtitle – unchanged */}
          <div className="mt-2 w-full">
            <span
              className="block mt-1 text-sm font-medium"
              style={{ color: "#1E3A8A" }}
            >
              Curated Pre-Owned Finds • Fair & Transparent Raffles
            </span>
          </div>

        </div>
      </header>
    </>
  );
}
