import React, { useEffect } from "react";

export default function MenuPanel({ isOpen, onClose, setView }) {
  // Lock body scroll when menu opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sliding panel – Amazon style, light grey background, full viewport height */}
      <div
        className={`fixed inset-y-0 left-0 w-[360px] bg-gray-50 shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: '100vh', maxHeight: '100vh' }}
      >
        {/* Flex column container */}
        <div className="h-full flex flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-medium text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation items – flex-grow to push footer down */}
          <div className="flex-1 overflow-y-auto py-2 bg-gray-50">
            <div className="px-3">
              <button
                className="w-full flex items-center px-3 py-3 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
                onClick={() => { setView("home"); onClose(); }}
              >
                <span className="mr-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                <span className="flex-1 text-left">Home</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              <button
                className="w-full flex items-center px-3 py-3 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
                onClick={() => { setView("catalog"); onClose(); }}
              >
                <span className="mr-3 text-gray-500 text-lg">🛒</span>
                <span className="flex-1 text-left">Products</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              <button
                className="w-full flex items-center px-3 py-3 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
                onClick={() => { setView("tickets"); onClose(); }}
              >
                <span className="mr-3 text-gray-500 text-lg">🎟️</span>
                <span className="flex-1 text-left">My Tickets</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              <div className="border-t border-gray-200 my-3"></div>

              <button
                className="w-full flex items-center px-3 py-3 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
                onClick={() => { setView("address"); onClose(); }}
              >
                <span className="mr-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="flex-1 text-left">Physical Address</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              <button
                className="w-full flex items-center px-3 py-3 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
                onClick={() => { setView("contact"); onClose(); }}
              >
                <span className="mr-3 text-gray-500 text-lg">✉️</span>
                <span className="flex-1 text-left">Contact</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              <button
                className="w-full flex items-center px-3 py-3 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
                onClick={() => { setView("about"); onClose(); }}
              >
                <span className="mr-3 text-gray-500 text-lg">ℹ️</span>
                <span className="flex-1 text-left">About Us</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>
            </div>
          </div>

          {/* Footer – minimal, no border */}
          <div className="px-6 py-4 text-xs text-gray-500 text-center bg-gray-50 border-t border-gray-200">
            © {new Date().getFullYear()} Goodwillstores
          </div>
        </div>
      </div>
    </>
  );
}
