import React from "react";
import { Link } from "react-router-dom"; // Import Link if using React Router

export default function About() {
  return (
    <div
      className="max-w-3xl mx-auto p-6 text-left"
      style={{
        backgroundColor: "#f8fafc",
        fontFamily:
          '"Inter", "Segoe UI", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* PAGE TITLE */}
      <h1
        className="font-bold mb-5 tracking-tight"
        style={{ fontSize: "24px", letterSpacing: "-0.3px" }}
      >
        ℹ️ About Us
      </h1>

      {/* ... (all existing content remains exactly as before) ... */}
      {/* We'll add the link just before the closing div, after the closing paragraph */}

      {/* CLOSING */}
      <p
        className="text-slate-700 leading-relaxed mt-8 font-medium tracking-tight"
        style={{ fontSize: "18px", letterSpacing: "-0.2px" }}
      >
        Goodwillstores isn’t just about winning — it’s about trust,
        transparency, and giving everyone a fair chance.
      </p>

      {/* NEW: Link to Terms of Use */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center">
        <Link
          to="/terms"
          className="text-sky-600 hover:text-sky-800 text-sm font-medium transition"
        >
          Terms of Use
        </Link>
        <span className="mx-2 text-slate-300">|</span>
        <Link
          to="/privacy"
          className="text-sky-600 hover:text-sky-800 text-sm font-medium transition"
        >
          Privacy Policy
        </Link>
        <span className="mx-2 text-slate-300">|</span>
        <a
          href="mailto:goodwillstores.support@gmail.com"
          className="text-sky-600 hover:text-sky-800 text-sm font-medium transition"
        >
          Contact
        </a>
      </div>
    </div>
  );
}
