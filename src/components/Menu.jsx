import React from "react";

export default function MenuPanel({ isOpen, onClose, setView }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sliding panel */}
      <div
        className={`fixed left-0 w-80 bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: 0, bottom: 0 }}
      >
        <div className="h-full overflow-y-auto p-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-extrabold text-white tracking-tight text-xl">Menu</h1>
            <button
              onClick={onClose}
              className="text-slate-300 text-xl font-bold px-3 py-1 border border-slate-600 hover:bg-slate-700/40 hover:text-white transition-all rounded-md"
              aria-label="Close menu"
            >
              <strong>✖️</strong>
            </button>
          </div>

          {/* Navigation items */}
          <div className="flex flex-col space-y-4">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => { setView("home"); onClose(); }}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
                </svg>
                <span className="text-lg text-white font-semibold">Home</span>
              </div>
              <span className="text-xl text-blue-400">›</span>
            </button>

            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => { setView("catalog"); onClose(); }}
            >
              <span className="text-lg text-white font-semibold">🛒 Products</span>
              <span className="text-xl text-blue-400">›</span>
            </button>

            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => { setView("tickets"); onClose(); }}
            >
              <span className="text-lg text-white font-semibold">🎟️ My Tickets</span>
              <span className="text-xl text-blue-400">›</span>
            </button>

            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => { setView("address"); onClose(); }}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
                </svg>
                <span className="text-lg text-white font-semibold">Physical Address</span>
              </div>
              <span className="text-xl text-blue-400">›</span>
            </button>

            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => { setView("contact"); onClose(); }}
            >
              <span className="text-lg text-white font-semibold">✉️ Contact</span>
              <span className="text-xl text-blue-400">›</span>
            </button>

            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => { setView("about"); onClose(); }}
            >
              <span className="text-lg text-white font-semibold">ℹ️ About Us</span>
              <span className="text-xl text-blue-400">›</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-slate-400 text-sm pt-4 border-t border-slate-700">
            © {new Date().getFullYear()} Goodwillstores
            <br />
            <span className="text-slate-500 text-xs">All rights reserved.</span>
          </div>
        </div>
      </div>
    </>
  );
}
