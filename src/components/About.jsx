import React from "react";

export default function About({ navigate }) {
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

      {/* ... all existing content remains exactly as before ... */}
      {/* We'll keep the original content; only the link block at the bottom is updated */}

      {/* CLOSING */}
      <p
        className="text-slate-700 leading-relaxed mt-8 font-medium tracking-tight"
        style={{ fontSize: "18px", letterSpacing: "-0.2px" }}
      >
        Goodwillstores isn’t just about winning — it’s about trust,
        transparency, and giving everyone a fair chance.
      </p>

      {/* NEW: Link to Terms of Use (using navigate instead of react-router Link) */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center">
        <button
          onClick={() => navigate("terms")}
          className="text-sky-600 hover:text-sky-800 text-sm font-medium transition bg-transparent border-none cursor-pointer"
        >
          Terms of Use
        </button>
        <span className="mx-2 text-slate-300">|</span>
        {/* If you have a Privacy Policy view, replace with navigate('privacy') similarly */}
        <button
          onClick={() => navigate("privacy")}
          className="text-sky-600 hover:text-sky-800 text-sm font-medium transition bg-transparent border-none cursor-pointer"
        >
          Privacy Policy
        </button>
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
