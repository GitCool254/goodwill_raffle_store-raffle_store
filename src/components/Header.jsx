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

          {/* TOP ROW: centered logo */}
          <div className="flex items-center justify-between">
            <div className="w-10" />

            <button
              onClick={() => setView("home")}
              className="focus:outline-none active:opacity-80"
              aria-label="Go to home"
            >
              <img
                src="/logo.png"
                alt="Goodwillstores logo"
                className="h-[100px] w-[100px] object-contain rounded cursor-pointer"
              />
            </button>

            <div className="w-10" />
          </div>

          {/* MENU + TITLE + SUBTITLE */}
          <div className="mt-2 w-full">

            {/* Menu button ABOVE title — strictly right */}
            <div className="flex justify-end w-full mb-1">
              <button
                className="px-3 py-1 bg-sky-600 text-white rounded shadow hover:bg-sky-700"
                onClick={() => setView("menu")}
                aria-label="Open menu"
              >
                ☰
              </button>
            </div>

            {/* Title */}
            <div
              style = {{ backgroundColor: "#f8fafc" }}
            >
              <h1 className="text-xl font-extrabold">
                Goodwillstores — Lucrative Raffles
              </h1>
            </div>

            {/* Subtitle */}
            <span
              className="block mt-1 text-sm font-medium"
              style={{ color: "#1E3A8A" }}
            >
              Buy tickets. Win prizes. Transparent draws.
            </span>
          </div>

        </div>
      </header>
    </>
  );
}
