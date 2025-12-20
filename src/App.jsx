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

  const [activeImage, setActiveImage] = useState(null);

  const [imageImages, setImageImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
   
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

  function openImage(images, index = 0) {
    setImageImages(images);
    setImageIndex(index);
    setActiveImage(images[index]);
    setView("image");
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

  function ImagePage({ images, index, setIndex, onBack }) {
    const [touchStartX, setTouchStartX] = useState(null);

    const [scale, setScale] = useState(1);
    const lastDistanceRef = React.useRef(null);    
    const lastTapRef = React.useRef(0);
    const containerRef = React.useRef(null);
    
    useEffect(() => {
      const originalOverflow = document.body.style.overflow;
      const originalBg = document.body.style.backgroundColor;

      document.body.style.overflow = "hidden";
      document.body.style.backgroundColor = "#000";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.backgroundColor = originalBg;
      };
    }, []);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      }
    }, [index]);

    function next() {
      if (index < images.length - 1) {
        setIndex(index + 1);
      }
    }

    function prev() {
      if (index > 0) {
        setIndex(index - 1);
      }
    }

    function handleTouchStart(e) {
      if (scale > 1) return;
      setTouchStartX(e.touches[0].clientX);
    }

    function handleTouchEnd(e) {
      if (touchStartX === null) return;

      const diff = touchStartX - e.changedTouches[0].clientX;

      if (scale === 1) {
        if (diff > 50) next();
        if (diff < -50) prev();
      }

      setTouchStartX(null);
    }
    
    function handleDoubleTap() {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        setScale((s) => (s > 1 ? 1 : 2));
          // nothing needed here anymore
      }
      lastTapRef.current = now;
    }

    function getDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchMove(e) {
      if (e.touches.length === 2) {
        const dist = getDistance(e.touches);

        if (lastDistanceRef.current) {
          const delta = dist - lastDistanceRef.current;
          setScale((s) => {
            let next = s + delta * 0.005;
            return Math.min(3, Math.max(1, next));
          });
        }

        lastDistanceRef.current = dist;
      }
    }

    function handleTouchEndZoom() {
      lastDistanceRef.current = null;
    }

    console.log("index:", index, "image:", images[index]);

    return (
      <div
        ref={containerRef}
        className="fixed inset-0 bg-black z-50"
        style={{
          position: "relative",
          overflowX: scale > 1 ? "auto" : "hidden",
          overflowY: scale > 1 ? "auto" : "hidden",
          touchAction: scale > 1 ? "pan-x pan-y" : "pan-x",
          WebkitOverflowScrolling: "touch",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => {
          handleTouchEnd(e);
          handleTouchEndZoom();
        }}
      >
        {/* IMAGE + CONTROLS */}

        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* IMAGE WRAPPER (reference box) */}
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "45vh",
              width: "100%",
              height: "60%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* BACK BUTTON — top right of image */}
            <button
              onClick={onBack}
              style={{
                position: "fixed",
                top: "16px",
                right: "16px",
                zIndex: 10000,
              }}
              className="text-white font-extrabold bg-black/70 w-12 h-12 flex items-center justify-center text-4xl"
            >
              ×
            </button>

            {/* IMAGE */}
            <img
              key={index}
              src={images[index]}
              alt="Full view"
              onClick={handleDoubleTap}
              draggable={false}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                transform: `scale(${scale})`,
                cursor: scale > 1 ? "zoom-out" : "zoom-in",
                userSelect: "none",
                transition: "transform 0.25s ease",
                zIndex: 1,
              }}
            />

            {/* IMAGE INDEX — bottom right of image */}
            {/* IMAGE INDEX — fixed overlay (always visible) */}
            <div
              style={{
                position: "fixed",
                bottom: "48px",
                right: "24px",
                zIndex: 9999,
                color: "#fff",
                background: "rgba(0,0,0,0.7)",
                padding: "6px 12px",
                borderRadius: "999px",
                fontSize: "14px",
                pointerEvents: "none",
              }}
            >
              {index + 1} / {images.length}
            </div>
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
                onClick={() => openImage(p.images?.length ? p.images : [p.image], 0)}
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
    <div
      className={`min-h-screen flex flex-col ${
        view === "image" ? "bg-black" : "bg-slate-50"
      }`}
    >

      {/* HEADER */}
      {view !== "image" && <Header setView={setView} />}

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

      {view === "image" && activeImage && (
        <ImagePage
          images={imageImages}
          index={imageIndex}
          setIndex={(i) => {
            setImageIndex(i);
            setActiveImage(imageImages[i]);
          }}
          onBack={() => setView("home")}
        />
      )}

      {/* FOOTER (sticky bottom + broken line) */}
      {view !== "image" && (
        <footer
          className="w-full text-center py-6 border-t-2 border-slate-400 text-slate-500 text-sm"
          style={{ borderTopStyle: "dotted" }}
        >
          © {new Date().getFullYear()} Goodwillstores
        </footer>
      )}

    </div>
  );
}
