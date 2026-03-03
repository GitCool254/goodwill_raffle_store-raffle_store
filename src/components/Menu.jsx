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
        className={`fixed inset-y-0 left-0 w-1/3 bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Flex column container to push footer to bottom */}
        <div className="h-full flex flex-col p-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-bold text-white tracking-wide text-2xl">Menu</h1>
            <button
              onClick={onClose}
              className="text-slate-300 text-2xl font-bold px-3 py-1 border border-slate-600 hover:bg-slate-700/40 hover:text-white transition-all rounded-md"
              aria-label="Close menu"
            >
              <strong>✖️</strong>
            </button>
          </div>

          {/* Navigation items – flex-grow to push footer down */}
          <div className="flex-grow">
            <div className="flex flex-col space-y-3">
              <button
                className="w-full text-left py-4 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all shadow-sm flex items-center justify-between group"
                onClick={() => { setView("home"); onClose(); }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
                  </svg>
                  <span className="text-base text-white font-medium">Home</span>
                </div>
                <span className="text-xl text-blue-400 group-hover:translate-x-1 transition-transform">›</span>
              </button>

              <button
                className="w-full text-left py-4 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all shadow-sm flex items-center justify-between group"
                onClick={() => { setView("catalog"); onClose(); }}
              >
                <span className="text-base text-white font-medium">🛒 Products</span>
                <span className="text-xl text-blue-400 group-hover:translate-x-1 transition-transform">›</span>
              </button>

              <button
                className="w-full text-left py-4 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all shadow-sm flex items-center justify-between group"
                onClick={() => { setView("tickets"); onClose(); }}
              >
                <span className="text-base text-white font-medium">🎟️ My Tickets</span>
                <span className="text-xl text-blue-400 group-hover:translate-x-1 transition-transform">›</span>
              </button>

              <button
                className="w-full text-left py-4 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all shadow-sm flex items-center justify-between group"
                onClick={() => { setView("address"); onClose(); }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
                  </svg>
                  <span className="text-base text-white font-medium">Physical Address</span>
                </div>
                <span className="text-xl text-blue-400 group-hover:translate-x-1 transition-transform">›</span>
              </button>

              <button
                className="w-full text-left py-4 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all shadow-sm flex items-center justify-between group"
                onClick={() => { setView("contact"); onClose(); }}
              >
                <span className="text-base text-white font-medium">✉️ Contact</span>
                <span className="text-xl text-blue-400 group-hover:translate-x-1 transition-transform">›</span>
              </button>

              <button
                className="w-full text-left py-4 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all shadow-sm flex items-center justify-between group"
                onClick={() => { setView("about"); onClose(); }}
              >
                <span className="text-base text-white font-medium">ℹ️ About Us</span>
                <span className="text-xl text-blue-400 group-hover:translate-x-1 transition-transform">›</span>
              </button>
            </div>
          </div>

          {/* Footer – automatically pushed to bottom */}
          <div className="mt-8 text-center text-slate-400 text-sm pt-4 border-t border-slate-700">
            <div>© {new Date().getFullYear()} Goodwillstores</div>
            <div className="text-slate-500 text-xs mt-1">All rights reserved.</div>
          </div>
        </div>
      </div>
    </>
  );
}
