import React, { useEffect, useState } from "react";
import "./App.css";

import eruda from "eruda";
eruda.init({
  tool: ["console", "network", "resources"],
  useShadowDom: true,
});

import Header from "./components/Header";
import Detail from "./components/Detail";
import Catalog from "./components/Catalog";
import Address from "./components/Address";
import Contact from "./components/Contact";
import About from "./components/About";
import Menu from "./components/Menu";

/**
 * Goodwill Raffle Store
 * Buyer-facing frontend only (no admin)
 */

export default function App() {
  // -------------------- SAMPLE DATA --------------------
  const sampleProducts = [
    {
      id: "p1",
      title: "iPhone 15 Pro",
      description: "Brand new iPhone 15 Pro — unopened box.",
      ticketPrice: 5,
      image: "/Screenshot_20251002-233129~2.png",
      totalTickets: 100,
      category: "Electronics",
    },
    {
      id: "p2",
      title: "PlayStation 5",
      description: "PS5 console with DualSense controller.",
      ticketPrice: 5,
      image: "/Screenshot_20251007-201731~2.png",
      totalTickets: 200,
      category: "Households",
    },
    {
      id: "p3",
      title: "MacBook Air M3",
      description: "Lightweight MacBook Air with M3 chip.",
      ticketPrice: 5,
      image: "/Screenshot_20251007-094253~2.png",
      totalTickets: 150,
      category: "Electronics",
    },
  ];

  // -------------------- STATE --------------------
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("gw_products");
    return saved ? JSON.parse(saved) : sampleProducts;
  });

  const [view, setView] = useState("home"); // home | detail | catalog | address | contact | about | menu
  const [selected, setSelected] = useState(null);

  console.log("App mounted — view =", view);

  // -------------------- LOCAL STORAGE SYNC --------------------
  useEffect(() => {
    localStorage.setItem("gw_products", JSON.stringify(products));
  }, [products]);

  // -------------------- CORE FUNCTIONS --------------------
  function openProduct(product) {
    setSelected(product);
    setView("detail");
  }

  // -------------------- HERO --------------------
  function Hero() {
    return (
      <section className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 px-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">
              Win big — join our raffles today
            </h2>
            <p className="mt-3 text-slate-100 max-w-xl">
              Buy low-cost tickets for a chance to win high-value tech items.
              Each ticket supports community initiatives.
            </p>
            <div className="mt-6">
              <button
                className="bg-white text-sky-700 px-4 py-2 rounded-lg font-semibold"
                onClick={() => setView("catalog")}
              >
                Browse Raffles
              </button>
            </div>
          </div>

          <div className="flex-1">
            <img
              src="/banner.jpg"
              alt="banner"
              className="rounded-lg shadow-lg w-full h-56 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x360";
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  // -------------------- HOME --------------------
  function Home() {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-44 w-full object-cover rounded-lg mb-3"
              />

              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-1">
                {p.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-slate-700 font-medium">
                  ${p.ticketPrice} / ticket
                </div>
                <button
                  className="bg-sky-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => openProduct(p)}
                >
                  Enter
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // -------------------- MAIN RENDER --------------------
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* HEADER */}
      <Header setView={setView} />

      {/* CONTENT */}
      <main className="flex-grow">
        {view === "home" && (
          <>
            <Hero />
            <Home />
          </>
        )}

        {view === "detail" && selected && (
          <Detail product={selected} onBack={() => setView("home")} />
        )}

        {view === "catalog" && (
          <Catalog openProduct={openProduct} />
        )}

        {view === "address" && <Address />}
        {view === "contact" && <Contact />}
        {view === "about" && <About />}
        {view === "menu" && <Menu setView={setView} />}
      </main>

      {/* FOOTER */}
      <footer
        className="w-full text-center py-6 border-t-2 border-slate-400 text-slate-500 text-sm"
        style={{ borderTopStyle: "dotted" }}
      >
        © {new Date().getFullYear()} Goodwillstores
      </footer>
    </div>
  );
}
