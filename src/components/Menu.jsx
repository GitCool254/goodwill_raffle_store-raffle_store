import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default function Menu({ isOpen, onClose, setView }) {
  const scrollRef = useRef(null);
  const panelRef = useRef(null);
  const backdropRef = useRef(null);

  // Lock body scroll when menu opens
  useEffect(() => {
    console.log("Menu useEffect (scroll lock) - isOpen:", isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Diagnostic effect – runs on every render but only logs when refs exist
  useEffect(() => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      console.log("Panel rect:", rect);
      console.log("Panel computed style:", window.getComputedStyle(panelRef.current));
    }
    if (backdropRef.current) {
      console.log("Backdrop present");
    }
  }, [isOpen]);

  console.log("Menu render - isOpen:", isOpen);
  if (!isOpen) {
    console.log("Menu render - returning null");
    return null;
  }

  console.log("Menu render - creating portal");

  return ReactDOM.createPortal(
    <>
      {/* Backdrop - semi-transparent */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99999,
        }}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        ref={panelRef}
        className="fixed"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '360px',
          backgroundColor: '#f9fafb',
          border: '1px solid #d1d5db',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          zIndex: 100000,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms',
          display: 'block',
          overflow: 'hidden',
        }}
      >
        {/* Full height flex column */}
        <div className="flex flex-col h-full">

          {/* Header - Amazon style: dark blue, fixed height, no border */}
          <div
            className="flex items-center justify-between px-6"
            style={{
              backgroundColor: '#232f3e',
              height: '80px',
            }}
          >
            <button
                onClick={() => { setView("home"); onClose(); }}
              className="text-white font-medium hover:underline focus:outline-none text-left"
              style={{ fontSize: '16px', lineHeight: '1.2' }}
            >
              <span className="block">Browse</span>
              <span className="block">Goodwillstores</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl leading-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto py-2"
          >
            <div className="px-3">

              {/* Home */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                onClick={() => { setView("home"); onClose(); }}
              >
                <span className="mr-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                <span className="flex-1 text-left">Home</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* Products */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                onClick={() => { setView("catalog"); onClose(); }}
              >
                <span className="mr-3 text-lg">🛒</span>
                <span className="flex-1 text-left">Shop Raffles</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* Tickets */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                onClick={() => { setView("tickets"); onClose(); }}
              >
                <span className="mr-3 text-lg">🎟️</span>
                <span className="flex-1 text-left">My Tickets</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Address */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                onClick={() => { setView("address"); onClose(); }}
              >
                <span className="mr-3 text-lg">📍</span>
                <span className="flex-1 text-left">Physical Address</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* Contact */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                onClick={() => { setView("contact"); onClose(); }}
              >
                <span className="mr-3 text-lg">✉️</span>
                <span className="flex-1 text-left">Contact</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* About */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                onClick={() => { setView("about"); onClose(); }}
              >
                <span className="mr-3 text-lg">ℹ️</span>
                <span className="flex-1 text-left">About Us</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

            </div>
          </div>

          {/* Footer – only copyright */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} Goodwillstores
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
