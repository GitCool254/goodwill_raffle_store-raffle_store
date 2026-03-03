import React, { useEffect, useState } from "react";

export default function MenuPanel({ isOpen, onClose, setView }) {
  const [panelHeight, setPanelHeight] = useState('100vh');

  useEffect(() => {
    if (!isOpen) return;

    const updateHeight = () => {
      setPanelHeight(`${window.innerHeight}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sliding panel with custom class */}
      <div
        className={`menu-panel fixed top-0 left-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: panelHeight }}
      >
        {/* Inner flex column to push footer down */}
        <div className="h-full flex flex-col">
          
          {/* User profile section (Jumia style) */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">Guest User</h2>
                <p className="text-white/70 text-sm">Sign in for more</p>
              </div>
            </div>
          </div>

          {/* Close button inside panel */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable navigation area – flex-grow takes remaining space */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Browse</p>
              
              <NavItem icon="🏠" label="Home" onClick={() => { setView("home"); onClose(); }} />
              <NavItem icon="🛒" label="Products" onClick={() => { setView("catalog"); onClose(); }} />
              <NavItem icon="🎟️" label="My Tickets" onClick={() => { setView("tickets"); onClose(); }} />

              <div className="border-t border-gray-200 my-4"></div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Information</p>

              <NavItem icon="📍" label="Address" onClick={() => { setView("address"); onClose(); }} />
              <NavItem icon="✉️" label="Contact" onClick={() => { setView("contact"); onClose(); }} />
              <NavItem icon="ℹ️" label="About Us" onClick={() => { setView("about"); onClose(); }} />
            </div>
          </div>

          {/* Footer – always at bottom */}
          <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-500">
            <div>© {new Date().getFullYear()} Goodwillstores</div>
            <div className="mt-1">All rights reserved.</div>
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable nav item component
function NavItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center px-3 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span className="flex-1 text-left font-medium">{label}</span>
      <span className="text-gray-400">›</span>
    </button>
  );
}
