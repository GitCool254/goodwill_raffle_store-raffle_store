import React from "react";

/**
 * Menu.jsx
 * Replaced with an explicit wrapper + paddings to guarantee visible row spacing.
 */

export default function Menu({ setView }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen p-6 flex justify-center items-start">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-2xl shadow-2xl rounded-2xl border border-slate-700 p-6 relative">

        {/* HEADER WITH CLOSE BUTTON */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: "20px" }}
          >
            Menu
          </h1>

          <button
            onClick={() => setView("home")}
            className="text-slate-300 text-xl font-bold px-3 py-1 border border-slate-600 hover:bg-slate-700/40 hover:text-white transition-all rounded-md"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex flex-col">

          {/* HOME */}
          <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("home")}
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "16px", height: "16px" }}
                  className="text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
                </svg>
                <span className="text-lg text-white font-semibold">Home</span>
              </div>
              <span className="text-xl text-blue-400">›</span>
            </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>

          {/* PRODUCTS */}
          <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("catalog")}
            >
              <span className="text-lg text-white font-semibold">🛒 Products</span>
              <span className="text-xl text-blue-400">›</span>
            </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>

          {/* 🎟️ MY TICKETS (NEW) */}
          <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("tickets")}
            >
              <span className="text-lg text-white font-semibold">🎟️ My Tickets</span>
              <span className="text-xl text-blue-400">›</span>
            </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>

          {/* ADDRESS */}
          <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("address")}
            >
              <span className="text-lg text-white font-semibold">
                📍 Physical Address
              </span>
              <span className="text-xl text-blue-400">›</span>
            </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>

          {/* CONTACT */}
          <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("contact")}
            >
              <span className="text-lg text-white font-semibold">✉️ Contact</span>
              <span className="text-xl text-blue-400">›</span>
            </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>

          {/* ABOUT */}
          <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("about")}
            >
              <span className="text-lg text-white font-semibold">ℹ️ About Us</span>
              <span className="text-xl text-blue-400">›</span>
            </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-slate-400 text-sm pt-4">
          © {new Date().getFullYear()} Goodwillstores
          <br />
          <span className="text-slate-500 text-xs">All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
