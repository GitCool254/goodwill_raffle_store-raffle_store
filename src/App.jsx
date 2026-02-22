import React, { useEffect, useState, useRef } from "react";
import "./App.css";

// eruda console
import eruda from "eruda";
eruda.init({
  tool: ["console", "network", "resources"],
  useShadowDom: true,
});

import Header from "./components/Header";
import Home from "./components/Home";
import Detail from "./components/Detail";
import Catalog from "./components/Catalog";
import Address from "./components/Address";
import Contact from "./components/Contact";
import About from "./components/About";
import Menu from "./components/Menu";
import MyTickets from "./components/MyTickets";
import HolidaySystem from "./components/HolidaySystem";

/**
 * Goodwill Raffle Store - Upgraded UI
 * Place logo at: public/logo.png
 * Remove banne
 *
 * Minimal client-only app (localStorage) for testing.
 * Later we'll wire payments and Google Sheets via server endpoints.
 */

export default function App() {
  const DATA_VERSION = "v3"; // bump this when products change

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) console.error("VITE_BACKEND_URL is not set!");

  const [remainingTickets, setRemainingTickets] = useState(null);
  const [ticketStateLoaded, setTicketStateLoaded] = useState(false);
  const [ticketsSold, setTicketsSold] = useState(null);

  // -------------------- SAMPLE DATA --------------------
  const sampleProducts = [
    {
      id: "p1",
      title: "Wonderfold wagon",
      description: "Barely used wagon, excellent condition(only selling because my kids have outgrown it)\nPick up or delivery\nThe W4Luxe stroller Wagon Model\nHolds up to 4passengers\nExtra storage all sides\nDeep carriage with mesh sides\nRemovable canopy with Adjustable canopy Fabric and Rods\nEasy to fold",
      price: 6,
      image: "/Wonderfold.jpg",
      images: [
        "/Wonderfold.jpg",
        "/Wonderfold1.jpg",
        "/Wonderfold2.jpg",
        "/Wonderfold3.jpg",
        "/Wonderfold4.jpg",
      ],
      ticketPrice: 6,
      totalTickets: 100,
      category: "Eletronics",
    },

    {
      id: "p2",
      title: "Beachcroft Patio set",
      description: "2 Swivel rocking outdoors chairs, fire pit, and 5 pc sectional.\nBrand is Beachcroft.",
      price: 6,
      image: "/Beachcroft Patio.jpg",
      images: [
        "/Beachcroft Patio.jpg",
        "/Beachcroft Patio1.jpg",
        "/Beachcroft Patio2.jpg",
      ],
      ticketPrice: 6,
      totalTickets: 200,
      category: "Households",
    },

    {
      id: "p3",
      title: "Coolster 125cc",
      description: "Coolster 125cc.\nGreat little starter for your kid",
      price: 7,
      image: "/Coolster 125cc.png",
      images: [
        "/Coolster 125cc.png",
        "/Coolster 125cc1.png",
        "/Coolster 125cc2.png",
        "/Coolster 125cc3.png",
        "/Coolster 125cc4.png",
      ],
      ticketPrice: 8,
      totalTickets: 150,
      category: "Eletronics",
    },
  ];

  // -------------------- STATE --------------------
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("gw_products");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // 🔍 compare images
        // 🔍 compare full product content
        const changed =
          parsed.length !== sampleProducts.length ||
          parsed.some((p, i) =>
            JSON.stringify(p) !== JSON.stringify(sampleProducts[i])
          );

        if (!changed) return parsed;
      } catch {}
    }

    localStorage.setItem("gw_products", JSON.stringify(sampleProducts));
    return sampleProducts;
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

  const [imageReturnView, setImageReturnView] = useState("home");

  const navStackRef = React.useRef(["home"]);

  console.log("App mounted — view =", view);

  // -------------------- HISTORY SYNC --------------------
  const VIEW_KEY = "gw_view";

  // -------------------- LOCAL STORAGE SYNC --------------------
  useEffect(() => {
    localStorage.setItem("gw_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    async function fetchTicketState() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${backendUrl}/ticket_state`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await res.json();
        if (!isMounted) return;

        if (!isNaN(data.remaining)) {
          setRemainingTickets(Number(data.remaining));
        }

        if (!isNaN(data.tickets_sold)) {
          setTicketsSold(Number(data.tickets_sold));
        }

        setTicketStateLoaded(true);
      } catch (err) {
        console.warn("Ticket state fetch failed — retrying...");
        setTimeout(() => {
          if (isMounted) fetchTicketState();
        }, 2500);
      }
    }

    // Initial load
    fetchTicketState();

    // ✅ Auto-refresh every 30 seconds
    intervalId = setInterval(() => {
      fetchTicketState();
    }, 30000); // 30,000ms = 30 sec

    return () => {
      isMounted = false;
      clearInterval(intervalId); // cleanup
    };
  }, [backendUrl]);


  useEffect(() => {
    async function handleTicketsPurchased() {
      try {
        const res = await fetch(`${backendUrl}/ticket_state`);

        const data = await res.json();

        if (!isNaN(data.remaining)) {
          setRemainingTickets(Number(data.remaining));
        }

        if (!isNaN(data.tickets_sold)) {
          setTicketsSold(Number(data.tickets_sold));
        }
      } catch (err) {
        console.error("Ticket sync failed:", err);
      }
    }

    window.addEventListener("ticketsPurchased", handleTicketsPurchased);
    return () =>
      window.removeEventListener("ticketsPurchased", handleTicketsPurchased);
  }, []);

  useEffect(() => {
    localStorage.setItem("gw_entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    window.addEventListener("goMyTickets", () => navigate("myTickets"));
    return () =>
      window.removeEventListener("goMyTickets", () => setView("myTickets"));
  }, []);


  // -------------------- CORE FUNCTIONS --------------------

  function navigate(nextView) {
    setView((prev) => {
      if (prev !== nextView) {
        navStackRef.current.push(nextView);
        window.history.pushState(
          { view: nextView },
          "",
          `#${nextView}`
        );
      }
      return nextView;
    });
  }

  useEffect(() => {
    const handlePopState = () => {
      const stack = navStackRef.current;

      // 🚫 Prevent browser exit
      if (stack.length <= 1) {
        window.history.pushState({ view: "home" }, "", "#home");
        setView("home");
        return;
      }

      // 🔙 Go back internally
      stack.pop();
      const previous = stack[stack.length - 1];
      setView(previous);
    };

    // 🔒 Lock root
    window.history.replaceState({ view: "home" }, "", "#home");
    window.addEventListener("popstate", handlePopState);

    return () =>
      window.removeEventListener("popstate", handlePopState);
  }, []);

  function openProduct(p) {
    setSelected(p);
    navigate("detail");
  }

  function openTicketProduct(ticket) {
    const product = products.find((p) => p.id === ticket.productId);
    if (!product) return;

    setSelected({
      ...product,
      _ticket: ticket, // marks read-only ticket view
    });
    navigate("detail");
  }

  function openImage(images, index = 0, returnView = "home") {
    setImageImages(images);
    setImageIndex(index);
    setActiveImage(images[index]);
    setImageReturnView(returnView);
    setView("image");
  }



  // -------------------- COMPONENTS --------------------


  // -------------------- HERO COMPONENT --------------------
  function Hero({ remainingTickets, ticketsSold }) {
    const [scale, setScale] = useState(1);

    // Determine actual remaining tickets

    const ticketStateReady =
      remainingTickets !== null && ticketStateLoaded;

    // Animate when ticket count changes
    useEffect(() => {
      if (!ticketStateReady) return; // skip if not ready
      setScale(1.3); // grow
      const timeout = setTimeout(() => setScale(1), 300); // shrink
      return () => clearTimeout(timeout);
    }, [remainingTickets, ticketStateReady]);

    
    return (
      <section className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center p-6 px-4">
          <div className="flex-1">
            <div
              style = {{ backgroundColor: "#f8fafc" }}
            >
              <h2 className="text-3xl font-bold">
                Win big — join our raffles today
              </h2>
              <p className="mt-3 text-slate-100 max-w-xl">
                Buy low-cost tickets for a chance to win high-value tech items.
                Each ticket helps us support community initiatives.
              </p>

            </div>
          
            <div className="mt-6 flex gap-3">
              <button
                className="bg-white text-sky-700 px-4 py-2 rounded-lg font-semibold"
                onClick={() => navigate("catalog")}
              >
                Product Raffles
              </button>
            </div>

            {/* Tickets remaining — now below button */}
            <div
              style={{
                textAlign: "left",
                fontWeight: "700",
                marginTop: "12px",
                marginLeft: "0",
                marginBottom: "20px",
              }}
              className="text-sm text-slate-100 tracking-wide"
            >
              <span
                style={{
                  display: "inline-block",
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                {ticketStateLoaded
                  ? `${remainingTickets} tickets remaining`
                  : "Loading ticket availability…"}
              </span>
            </div>

            <div
              className="text-xs text-slate-200"
              style={{ textAlign: "left", marginTop: "4px", marginLeft: "0", marginBottom: "20px", letterSpacing: "0.03em" }}
            >
              {ticketsSold !== null && (
                <>✅ <strong>{ticketsSold}</strong> tickets sold so far</>
              )}
            </div>

            {/* RAFFLE ENDED MESSAGE */}
            {ticketStateLoaded && Number(remainingTickets) <= 0 && (
              <div
                className="mt-3 inline-flex items-center px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#ffffff",
                  fontWeight: "500",
                  backdropFilter: "blur(6px)",
                }}
              >
                This raffle has now concluded. Thank you for participating and supporting our community.
              </div>
            )}

          </div>
        </div>
      </section>
    );
  }

  // -------------------- AUTO-ROTATING WINNERS (ENHANCED + SLIDE/FADE + PAUSE + SWIPE + DOTS) -----
  function AutoRotateWinners() {
    const winners = [
      {
        name: "Jane M.",
        date: "12 Jan 2026",
        ticketNo: "RF-48219",
        product: "Wonderfold Wagon",
        winnerImg: "/Win2 fe.jpg",
        productImg: "/Beachcroft Patio.jpg",
        verified: true,
        countryFlag: "🇺🇸",
        location: "New York, USA",
      },
      {
        name: "Samuel K.",
        date: "05 Jan 2026",
        ticketNo: "RF-37922",
        product: "Beachcroft Patio Set",
        winnerImg: "/Win1 ma.jpg",
        productImg: "/Wonderfold.jpg",
        verified: true,
        countryFlag: "🇰🇪",
        location: "Nwirobi, Kenya",
      },
      {
        name: "Brian O.",
        date: "29 Dec 2025",
        ticketNo: "RF-29410",
        product: "Coolster 125cc",
        winnerImg: "/Win3 ma.jpg",
        productImg: "/images/products/coolster.jpg",
        verified: true,
        countryFlag: "🇱🇷",
        location: "Toronto, Canada",
      },
      {
        name: "Lucy A.",
        date: "18 Dec 2025",
        ticketNo: "RF-18177",
        product: "Smart Home Bundle",
        winnerImg: "/Win4 ma.jpg",
        productImg: "/images/products/smarthome.jpg",
        verified: true,
        countryFlag: "🇬🇧",
        location: "Missouri, USA",
      },
    ];

    const [index, setIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [animate, setAnimate] = useState(true);
    const [paused, setPaused] = useState(false);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
      if (paused) return;

      const interval = setInterval(() => {
        setAnimate(false);

        setTimeout(() => {
          setExpanded(false);
          setIndex((i) => (i + 1) % winners.length);
          setAnimate(true);
        }, 250);
      }, 4500);

      return () => clearInterval(interval);
    }, [paused]);

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const delta = touchStartX.current - touchEndX.current;

      // 👉 TAP (pause / resume)
      if (Math.abs(delta) < 15) {
        setPaused((p) => !p);
        return;
      }

      // 👉 SWIPE (normal behavior)
      if (Math.abs(delta) < 50) return;

      setAnimate(false);

      setTimeout(() => {
        setExpanded(false);

        if (delta > 0) {
          setIndex((i) => (i + 1) % winners.length);
        } else {
          setIndex((i) => (i - 1 + winners.length) % winners.length);
        }

        setAnimate(true);
      }, 200);
    };

    const w = winners[index];
    const shortProduct = w.product.slice(0, 75);
                                                                           return (
      <section className="max-w-6xl mx-auto px-6 py-8 text-center">
        <div
          key={index}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="rounded-2xl p-7 shadow-sm"
          style={{
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            backdropFilter: "blur(6px)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(10px)",

            // 👇 Controlled vertical spacing
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: "2px", // ← Adjust this value to control spacing
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{
              background: "#f1f5f9",
              padding: "4px 10px",
              borderRadius: "999px",
              display: "inline-block",
              fontWeight: 500,
              color: "#94a3b8",
            }}
          >
            1000+ Winners Since Launch
          </p>

          <p
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: "#94a3b8", letterSpacing: "0.15em" }}
          >
            RECENT WINNERS
          </p>

          {/* 1. Winner Name */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-base font-semibold text-slate-800">
              {w.name}
            </p>

            {w.verified && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                ✔ Verified
              </span>
            )}
          </div>

          {/* 2. Location Row */}
          <div className="flex items-center justify-center gap-1">
            <p className="text-xs text-slate-500">
              {w.location}
            </p>
            <span className="text-sm">
              {w.countryFlag}
            </span>
          </div>

          {/* 2. Winner Image */}
          <img
            src={w.winnerImg}                                                      alt="Winner"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",                                                      margin: "0 auto",
              border: "1px solid #cbd5e1",
            }}
          />

          {/* 3. Product Name */}
          <p className="text-sm font-semibold text-slate-800">
            {expanded ? w.product : shortProduct}
            {w.product.length > 75 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1 text-xs underline text-slate-500"
              >
                {expanded ? "See less" : "See more"}
              </button>                                                            )}                                                                   </p>

          {/* 4. Product Image */}
          <img                                                                     src={w.productImg}                                                     alt="Product"
            style={{
              width: "48px",                                                         height: "48px",
              borderRadius: "8px",                                                   objectFit: "cover",
              display: "block",                                                      margin: "12px auto 0 auto",                                            border: "1px solid #cbd5e1",                                         }}                                                                   />

          {/* 6. Ticket No */}
          <p
            className="text-xs"
            style={{
              background: "#f1f5f9",
              padding: "4px 10px",
              borderRadius: "999px",
              display: "inline-block",
              fontWeight: 500,
              color: "#475569",
            }}
          >
            Ticket {w.ticketNo}
          </p>
          
          {/* 5. Date */}
          <p 
            className="text-xs text-slate-500"
            style={{ color: "#94a3b8" }}
          >
            Draw date: {w.date}
          </p>                                                                 </div>

        <br />

        {/* PROGRESS DOTS */}
        <div className="mt-4 text-center select-none">
          {winners.map((_, i) => (
            <span
              key={i}
              onClick={() => {
                setAnimate(false);
                setTimeout(() => {
                  setExpanded(false);
                  setIndex(i);
                  setAnimate(true);
                }, 150);
              }}
              style={{
                cursor: "pointer",
                fontSize: "18px",
                margin: "0 6px",
                color: i === index ? "#0f172a" : "#cbd5e1",
                transition: "color 0.3s ease",
              }}
              aria-label={`Show winner ${i + 1}`}
            >
              {i === index ? "●" : "○"}
            </span>
          ))}
        </div>

        <p
          className="text-xs mt-3"
          style={{ color: "#94a3b8", fontStyle: "italic" }}
        >
          Recent raffle winners. Names are partially anonymized for privacy.                                                                          </p>
      </section>
    );
  }

  function ImagePage({ images, index, setIndex, onBack }) {
    const [touchStartX, setTouchStartX] = useState(null);
    const [scale, setScale] = useState(1);                                 const lastDistanceRef = React.useRef(null);
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
          left: 0,                                                               behavior: "auto",
        });                                                                  }
    }, [index]);                                                       
    function next() {
      if (index < images.length - 1) setIndex(index + 1);
    }

    function prev() {
      if (index > 0) setIndex(index - 1);
    }
                                                                           function handleTouchStart(e) {                                           if (scale > 1) return;                                                 setTouchStartX(e.touches[0].clientX);
    }

    function handleTouchEnd(e) {
      if (touchStartX === null) return;
      const diff = touchStartX - e.changedTouches[0].clientX;                if (scale === 1) {
        if (diff > 50) next();
        if (diff < -50) prev();
      }
      setTouchStartX(null);                                                }

    function handleDoubleTap() {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        setScale((s) => (s > 1 ? 1 : 2));
      }                                                                      lastTapRef.current = now;                                            }

    function getDistance(touches) {                                          const dx = touches[0].clientX - touches[1].clientX;                    const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);                                 }
                                                                           function handleTouchMove(e) {                                            if (e.touches.length === 2) {
        const dist = getDistance(e.touches);                                   if (lastDistanceRef.current) {
          const delta = dist - lastDistanceRef.current;                          setScale((s) => Math.min(3, Math.max(1, s + delta * 0.005)));
        }
        lastDistanceRef.current = dist;
      }
    }

    function handleTouchEndZoom() {
      lastDistanceRef.current = null;                                      }                                                                                                                                             return (                                                                 <div
        ref={containerRef}
        className="fixed inset-0 bg-black z-50"
        style={{
          position: "relative",
          overflowX: scale > 1 ? "auto" : "hidden",
          overflowY: scale > 1 ? "auto" : "hidden",
          touchAction: scale > 1 ? "pan-x pan-y" : "pan-x",
          WebkitOverflowScrolling: "touch",
        }}
        onTouchStart={handleTouchStart}                                        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => {
          handleTouchEnd(e);
          handleTouchEndZoom();
        }}
      >
        <div                                                                     style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",                                                  justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* IMAGE WRAPPER */}
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "45vh",
              width: "auto",                                                         height: "auto",                                                      }}                                                                   >                                                                        {/* BACK BUTTON */}                                                    <button
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
                position: "fixed",          // ✅ absolute for true centering
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                maxWidth: "80vw",                                                      maxHeight: "45vh",
                objectFit: "contain",
                cursor: scale > 1 ? "zoom-out" : "zoom-in",                            userSelect: "none",
                transition: "transform 0.25s ease",                                    zIndex: 1,
              }}
            />

            {/* IMAGE INDEX */}
            <div
              style={{
                position: "fixed",
                bottom: "48px",                                                        right: "24px",
                zIndex: 9999,
                color: "#fff",
                background: "rgba(0,0,0,0.7)",                                         padding: "6px 12px",
                borderRadius: "999px",                                                 fontSize: "14px",
                pointerEvents: "none",
              }}
            >
              {index + 1} / {images.length}
            </div>
          </div>
        </div>                                                               </div>
    );
  }

  function Home() {                                                        console.log("Home render — products count:", Array.isArray(products) ? products.length : typeof products);
    return (
      <main className="max-w-6xl mx-auto p-6">
        <div id="products" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (                                                   <div                                                                     key={p.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-44 w-full object-cover rounded-lg mb-3 cursor-zoom-in"
                onClick={() => openImage(p.images?.length ? p.images : [p.image], 0)}
              />                                                                     <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-1">                              {p.description?.slice(0, 50)}…
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-slate-700 font-medium">                             $ {p.ticketPrice} / ticket
                </div>                                                                 <button
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
        </div>                                                               </main>
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

      {view !== "image" && (
        <HolidaySystem onNavigate={navigate} />
      )}

      {/* MAIN CONTENT - grows to push footer down */}                       <main className="flex-grow">
        {view === "home" && (
          <>
            <Hero
              remainingTickets={remainingTickets}
              ticketsSold={ticketsSold}
            />

            {/* EVENT INFORMATION */}
            <section
              className="max-w-5xl mx-auto px-6 py-6"
              style={{ marginBottom: "2.5rem" }}
            >
              <div
                className="bg-white rounded-xl p-6"
                style={{ border: "1.5px dotted #cbd5e1", backgroundColor: "#f8fafc" }}
              >
                <h2
                  className="font-semibold mb-4"
                  style={{ fontSize: "1.25rem", color: "#64748b" }} // slate-600
                >                                                                        Raffle Event Details
                </h2>

                <div
                  className="space-y-2 text-slate-700"
                  style={{ fontSize: "0.9rem", textAlign: "left", marginLeft: "0" }}
                >
                  <p>
                    • <strong>Location:</strong> [EVENT PLACE]                           </p>
                  <p>
                    • <strong>Date & Time:</strong> [EVENT DATE & TIME]
                  </p>
                  <p>
                    • <strong>Fair Play:</strong> All tickets are digitally generated and remain valid until the official draw.                                 </p>
                </div>
                                                                                       <p
                  className="text-slate-500 mt-4"
                  style={{ fontSize: "0.8rem", fontStyle: "italic" }}

                >                                                                        Winners are announced publicly on this website and contacted via the email used during ticket purchase.
                </p>
              </div>
            </section>
                                                                                   <Home />
            <br />
            <AutoRotateWinners />                                                </>
        )}

        {view === "detail" && selected && (
          <Detail
            product={selected}
            remainingTickets={remainingTickets}
            onBack={() => navigate("home")}
            openImage={openImage}
          />
        )}

        {view === "catalog" && (
          <Catalog openProduct={openProduct} />
        )}

        {view === "address" && <Address />}
        {view === "contact" && <Contact />}                                    {view === "about" && <About />}                                        {(view === "tickets" || view === "myTickets") && (
          <MyTickets openTicketProduct={openTicketProduct} />
        )}                                                                     {view === "menu" && <Menu setView={navigate} />}
      </main>

      {view === "image" && activeImage && (
        <ImagePage
          images={imageImages}
          index={imageIndex}
          setIndex={(i) => {
            setImageIndex(i);                                                      setActiveImage(imageImages[i]);                                      }}                                                                     onBack={() => setView(imageReturnView)}
        />
      )}
                                                                             <br />                                                                                                                                        {/* FOOTER (sticky bottom + broken line) */}
      {view !== "image" && (
        <footer
          className="w-full text-center py-6 border-t-2 border-slate-400 text-slate-500 text-sm"
          style={{ borderTopStyle: "dotted" }}                                 >
          © {new Date().getFullYear()} Goodwillstores
        </footer>
      )}

    </div>
  );
}
