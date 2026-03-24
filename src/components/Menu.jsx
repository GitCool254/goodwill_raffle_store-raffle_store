import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default function Menu({ isOpen, onClose, setView }) {
  const scrollRef = useRef(null);
  const panelRef = useRef(null);
  const backdropRef = useRef(null);

  // Lock body scroll when menu opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Diagnostic effect – runs on every render (no logs)
  useEffect(() => {
    // intentionally empty – keeps hook order consistent
  }, [isOpen]);

  return ReactDOM.createPortal(
    <>
      {/* Backdrop - only visible when open */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black transition-opacity duration-300"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99999,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Sliding Panel - always in DOM, transform toggles */}
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
          transition: 'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          display: 'block',
          overflow: 'hidden',
        }}
      >
        {/* Full height flex column */}
        <div className="flex flex-col h-full">

          {/* Header - Amazon style: dark blue, fixed height */}
          <div
            className="flex items-center justify-between px-6"
            style={{
              backgroundColor: '#232f3e',
              height: '100px',
            }}
          >
            {/* Plain‑text button for Browse Goodwillstores */}
            <button
              onClick={() => { setView("home"); onClose(); }}
              style={{
                fontSize: '16px',
                lineHeight: '1.2',
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'white',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
              className="hover:underline focus:outline-none"
            >
              <span className="block">Browse</span>
              <span className="block">Goodwillstores</span>
            </button>
            {/* Close button: white, no background, 10px margin-right */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: 1,
                marginRight: '10px',
                cursor: 'pointer',
              }}
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
                style={{ marginBottom: '15px' }}
                onClick={() => { setView("home"); onClose(); }}
              >
                <span className="mr-3 text-gray-500" style={{ marginRight: '0.8rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z"/>
                  </svg>
                </span>
                <span className="flex-1 text-left">Home</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* Products */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                style={{ marginBottom: '15px' }}
                onClick={() => { setView("catalog"); onClose(); }}
              >
                <span className="mr-3 text-lg" style={{ marginRight: '0.8rem' }}>🛒</span>
                <span className="flex-1 text-left">Shop Raffles</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* Tickets */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                style={{ marginBottom: '15px' }}
                onClick={() => { setView("tickets"); onClose(); }}
              >
                <span className="mr-3 text-lg" style={{ marginRight: '0.8rem' }}>🎟️</span>
                <span className="flex-1 text-left">My Tickets</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Address */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                style={{ marginBottom: '15px' }}
                onClick={() => { setView("address"); onClose(); }}
              >
                <span className="mr-3 text-gray-500" style={{ marginRight: '0.8rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
                  </svg>
                </span>
                <span className="flex-1 text-left">Physical Address</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* Contact */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                style={{ marginBottom: '15px' }}
                onClick={() => { setView("contact"); onClose(); }}
              >
                <span className="mr-3 text-lg" style={{ marginRight: '0.8rem' }}>✉️</span>
                <span className="flex-1 text-left">Contact</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* About */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                style={{ marginBottom: '15px' }}
                onClick={() => { setView("about"); onClose(); }}
              >
                <span className="mr-3 text-lg" style={{ marginRight: '0.8rem' }}>ℹ️</span>
                <span className="flex-1 text-left">About Us</span>
                <span className="text-gray-400 text-xl group-hover:text-gray-600">›</span>
              </button>

              {/* Donations & Impact – replaced emoji with handshake heart SVG */}
              <button
                className="w-full flex items-center px-3 py-2 mb-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition group"
                style={{ marginBottom: '15px' }}
                onClick={() => { setView("donations"); onClose(); }}
              >
                <span className="mr-3" style={{ marginRight: '0.8rem', width: '1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 50.000000 50.000000"
                    preserveAspectRatio="xMidYMid meet"
                    fill="currentColor"
                  >
                    <g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                      <path d="M78 425 c-34 -19 -58 -63 -58 -106 0 -31 34 -99 49 -99 4 0 18 11 31 25 13 14 30 25 38 25 7 0 52 -39 99 -86 63 -62 88 -82 94 -72 6 9 -4 25 -28 50 -48 50 -34 63 16 14 34 -33 39 -35 51 -21 11 14 8 21 -25 55 -46 47 -35 53 15 10 39 -32 55 -37 63 -16 3 8 -20 38 -54 72 l-59 58 -40 -39 c-36 -35 -43 -38 -67 -29 -41 14 -42 49 -2 90 l33 34 -21 21 c-27 28 -98 35 -135 14z"/>
                      <path d="M315 429 c-33 -19 -125 -112 -125 -126 0 -32 33 -24 76 18 l44 43 69 -68 68 -67 18 37 c23 48 14 99 -23 137 -32 32 -94 45 -127 26z"/>
                      <path d="M111 226 c-23 -24 -21 -46 3 -46 7 0 22 10 34 23 17 18 19 26 10 35 -17 17 -21 15 -47 -12z"/>
                      <path d="M155 180 c-17 -18 -15 -50 3 -50 16 0 54 48 47 59 -10 17 -30 13 -50 -9z"/>
                      <path d="M201 136 c-23 -24 -21 -46 3 -46 7 0 22 10 34 23 17 18 19 26 10 35 -17 17 -21 15 -47 -12z"/>
                      <path d="M245 90 c-17 -18 -15 -50 3 -50 16 0 54 48 47 59 -10 17 -30 13 -50 -9z"/>
                    </g>
                  </svg>
                </span>
                <span className="flex-1 text-left">Donations & Impact</span>
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
