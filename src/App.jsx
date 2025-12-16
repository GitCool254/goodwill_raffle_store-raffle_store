import React, { useEffect, useState } from "react";
import "./App.css";

import eruda from "eruda";
eruda.init({
  tool: ["console", "network", "resources"],
  useShadowDom: true,
});

import Header from "./components/Header";
import Home from "./components/Home";
import Detail from "./components/Detail";
import PayPalButton from "./components/PayPalButton";
import Catalog from "./components/Catalog";
import Address from "./components/Address";
import Contact from "./components/Contact";
import About from "./components/About";
import Menu from "./components/Menu";

/**
 * Goodwill Raffle Store - Upgraded UI
 * Place logo at: public/logo.png
 * Place hero/banner at: public/banner.jpg
 *
 * Minimal client-only app (localStorage) for testing.
 * Later we'll wire payments and Google Sheets via server endpoints.
 */

export default function App() {
  // -------------------- SAMPLE DATA --------------------
  const sampleProducts = [
    {
      id: "p1",
      title: "iPhone 15 Pro",
      description: "Brand new iPhone 15 Pro — unopened box.",
      price: 5,
      image: "/Screenshot_20251002-233129~2.png",
      images: [
        "/Screenshot_20251002-233129~2.png",
        "/Screenshot_20251007-201731~2.png",
      ],
      ticketPrice: 5,
      totalTickets: 100,
      category: "Eletronics",
    },
    {
      id: "p2",
      title: "PlayStation 5",
      description: "PS5 console with DualSense controller.",
      price: 5,
      image: "/Screenshot_20251007-201731~2.png",
      images: [
        "/Screenshot_20251007-201731~2.png",
        "/Screenshot_20251002-233129~2.png",
      ],
      ticketPrice: 5,
      totalTickets: 200,
      category: "Households",
    },
    {
      id: "p3",
      title: "MacBook Air M3",
      description: "Lightweight MacBook Air with M3 chip.",
      price: 5,
      image: "/Screenshot_20251007-094253~2.png",
      images: [
        "/Screenshot_20251007-094253~2.png",
        "/Screenshot_20251007-201731~2.png",
      ],
      ticketPrice: 5,
      totalTickets: 150,
      category: "Eletronics",
    },
  ];

  // -------------------- STATE --------------------
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("gw_products");
    return saved ? JSON.parse(saved) : sampleProducts;
  });

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("gw_entries");
    return saved ? JSON.parse(saved) : {};
  });

  const [view, setView] = useState("home"); // home | detail
  const [selected, setSelected] = useState(null);

  const [galleryProduct, setGalleryProduct] = useState(null);
   
  console.log("App mounted — view =", view);
  // -------------------- LOCAL STORAGE SYNC --------------------
  useEffect(() => {
    localStorage.setItem("gw_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("gw_entries", JSON.stringify(entries));
  }, [entries]);

  // -------------------- CORE FUNCTIONS --------------------
  function openProduct(p) {
    setSelected(p);
    setView("detail");
  }

  function openGallery(product) {
    setGalleryProduct(product);
    setView("gallery");
  }


  // -------------------- COMPONENTS --------------------


  function Hero() {
    console.log("Hero render");
    return (
      <section className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 px-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">
              Win big — join our raffles today
            </h2>
            <p className="mt-3 text-slate-100 max-w-xl">
              Buy low-cost tickets for a chance to win high-value tech items.
              Each ticket helps us support community initiatives.
            </p>
            <div className="mt-6 flex gap-3">
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

  function Gallery({ product }) {
    const images = product.images?.length
      ? product.images
      : [product.image];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);

    function next() {
      setCurrentIndex((i) =>
        i < images.length - 1 ? i + 1 : i
      );
    }

    function prev() {
      setCurrentIndex((i) =>
        i > 0 ? i - 1 : i
      );
    }

    function handleTouchStart(e) {
      setTouchStartX(e.touches[0].clientX);
    }

    function handleTouchEnd(e) {
      if (touchStartX === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (diff > 50) next();     // swipe left
      if (diff < -50) prev();    // swipe right

      setTouchStartX(null);
    }

    return (
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => setView("home")}
          className="mb-4 text-sky-600 font-semibold"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow p-6 overflow-hidden h-[75vh]">
          <div className="w-full relative overflow-hidden">
            {/* SLIDER */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${images.length * 100}%`,
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex justify-center"
                >
                  <img
                    src={img}
                    alt={product.title}
                    className="max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* ARROWS */}
            <div className="flex justify-between mt-4">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
              >
                ‹
              </button>

              <button
                onClick={next}
                disabled={currentIndex === images.length - 1}
                className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
              >
                ›
              </button>
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 justify-center flex-wrap mt-6">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    idx === currentIndex
                      ? "border-sky-600"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>

            <h2 className="mt-6 text-xl font-bold text-center">
              {product.title}
            </h2>
          </div>
        </div>
      </div>
    );
  }
  
  function Home() {
    console.log("Home render — products count:", Array.isArray(products) ? products.length : typeof products);
    return (
      <main className="max-w-6xl mx-auto p-6">
        <div id="products" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-44 w-full object-cover rounded-lg mb-3 cursor-zoom-in"
                onClick={() => openGallery(p)}
              />
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-slate-700 font-medium">
                  $ {p.ticketPrice} / ticket
                </div>
                <button
                  className="bg-sky-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => openProduct(p)}
                >
                  Enter
                </button>
              </div>
              {p.winner && (
                <div className="mt-3 text-sm text-green-700">
                  Winner: {p.winner.name} ({p.winner.ticketNo})
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    );
  }


  // -------------------- MAIN RETURN --------------------
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* HEADER */}
      <Header setView={setView} />

      {/* MAIN CONTENT - grows to push footer down */}
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

      {view === "gallery" && galleryProduct && (
        <Gallery product={galleryProduct} />
      )}

      {/* FOOTER (sticky bottom + broken line) */}
      <footer className="w-full text-center py-6 border-t-2 border-slate-400 text-slate-500 text-sm"
        style={{ borderTopStyle: "dotted" }}
      >
        © {new Date().getFullYear()} Goodwillstores
      </footer>

    </div>
  );
}
