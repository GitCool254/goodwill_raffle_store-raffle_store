import React from "react";

/**
 * Menu.jsx
 * Replaced with an explicit wrapper + paddings to guarantee visible row spacing.
 *
 * Paste/overwrite src/components/Menu.jsx with this file, save, then restart the dev server if needed.
 */

export default function Menu({ setView }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen p-6 flex justify-center items-start">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-2xl shadow-2xl rounded-2xl border border-slate-700 p-6 relative">

        {/* HEADER WITH CLOSE BUTTON */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="font-extrabold text-white tracking-tight"
            style={{ fontSize: "20px" }}                                         >
            Menu                                                                 </h1>

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
          {/* Wrap each item in a wrapper DIV with bottom margin so spacing is guaranteed */}
          <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("home")}
            >

              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "16px", height: "16px" }}   // ← SAME SIZE AS LOCATION ICON
                  className="text-blue-400"                                              viewBox="0 0 24 24"
                  fill="currentColor"                                                  >
                  <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />                   </svg>
                                                                                       <span className="text-lg text-white font-semibold">Home</span>                                                                              </div>
              <span className="text-xl text-blue-400">›</span>                     </button>
            {/* optional thin separator (centered and short) */}                   <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />             </div>
          <br />

          <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"                                                                          onClick={() => setView("catalog")}
            >                                                                        <span className="text-lg text-white font-semibold">🛒 Catalog</span>
              <span className="text-xl text-blue-400">›</span>                     </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>
          <br />

          <div className="mb-6">
            <button                                                                  className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"                                                                          onClick={() => setView("admin")}
            >
              <span className="text-lg text-white font-semibold">🔐 Admin</span>
              <span className="text-xl text-blue-400">›</span>
            </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>                                                       
          {/* spacer between sections */}                                        <div className="my-6" />

          <br />                                                                 <div className="mb-6">
            <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("address")}
            >                                                                        <div className="flex items-center gap-3">
                <svg                                                                     xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "16px", height: "16px" }}                              className="text-blue-400"                                              viewBox="0 0 24 24"
                  fill="currentColor"                                                  >                                                                        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />                                                     </svg>
                                                                                       <span className="text-lg text-white font-semibold">Physical Address</span>
              </div>                                                                 <span className="text-xl text-blue-400">›</span>                     </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />             </div>                                                       
          <br />                                                                 <div className="mb-6">                                                   <button
              className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"
              onClick={() => setView("contact")}                                   >                                                                        <div className="flex items-center gap-3">
                <svg                                                                     xmlns="http://www.w3.org/2000/svg"                                     style={{ width: "16px", height: "16px" }} // same size as your location icon                                                                  className="text-blue-400"                                              viewBox="0 0 24 24"
                  fill="currentColor"                                                  >                                                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />                         </svg>                                                 
                <span className="text-lg text-white font-semibold">Email</span>                                                                             </div>
              <span className="text-xl text-blue-400">›</span>                     </button>                                                              <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />
          </div>                                                                                                                                        <br />
          <div className="mb-6">                                                   <button                                                                  className="w-full text-left py-5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700/60 transition shadow-sm flex items-center justify-between"                                                                          onClick={() => setView("about")}
            >                                                                        <span className="text-lg text-white font-semibold">ℹ️ About Us</span>
              <span className="text-xl text-blue-400">›</span>                     </button>
            <div className="mx-auto mt-4 h-px w-1/2 bg-slate-700" />             </div>
        </div>
                                                                               <br />                                                                 <br />
        <br />
        <br />                                                                 {/* FOOTER */}
        <div className="mt-10 text-center text-slate-400 text-sm pt-4">
          © {new Date().getFullYear()} Goodwillstores                            <br />
          <span className="text-slate-500 text-xs">All rights reserved.</span>                                                                        </div>
      </div>                                                               </div>
  );                                                                   }
