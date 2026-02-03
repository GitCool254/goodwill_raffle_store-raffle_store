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
import Catalog from "./components/Catalog";
import Address from "./components/Address";
import Contact from "./components/Contact";
import About from "./components/About";
import Menu from "./components/Menu";
import MyTickets from "./components/MyTickets";

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
  const SYNC_KEY = "gw_last_sync_date";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) console.error("VITE_BACKEND_URL is not set!");

  // -------------------- TICKET COUNTDOWN --------------------
  // change only if needed
  const RAFFLE_START_DATE = "2026-01-30";
  const INITIAL_TICKETS = 50;
  const DEDICATED_DAYS = 10;

  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Days passed since raffle started
  const daysPassed = Math.floor(
    (Date.now() - new Date(RAFFLE_START_DATE).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  // Decay factor over dedicated days
  const decayFactor = Math.min(daysPassed / DEDICATED_DAYS, 1);

  // Per-day min & max
  const minDaily = Math.min(
    5 + decayFactor * 3,
    INITIAL_TICKETS / Math.max(daysPassed, 1)
  );

  const maxDaily = Math.min(
    10 + decayFactor * 3,
    INITIAL_TICKETS / Math.max(daysPassed, 1)
  );

  // Deterministic daily random
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Total decrement (stable per day)
  const ticketsDecremented = Math.floor(
    seededRandom(daysPassed) *
      (maxDaily * daysPassed - minDaily * daysPassed + 1) +
    minDaily * daysPassed
  );

  const [remainingTickets, setRemainingTickets] = useState(() => {
    const saved = localStorage.getItem("gw_last_remaining");
    return saved !== null ? Number(saved) : null;
  });
  const [ticketsSold, setTicketsSold] = useState(0);
  const [ticketStateLoaded, setTicketStateLoaded] = useState(false);

  // ✅ Guaranteed fair finish at day 10
  const computedRemaining =
    daysPassed >= DEDICATED_DAYS
      ? 0
      : Math.max(INITIAL_TICKETS - ticketsDecremented, 0);

  
  const finalRemainingTickets =
    remainingTickets !== null
      ? remainingTickets
      : computedRemaining !== null
        ? computedRemaining
        : null;


  console.log({
    daysPassed,
    minDaily,
    maxDaily,
    ticketsDecremented,
    remainingTickets
  });

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
    async function loadTicketState() {
      try {
        const res = await fetch(`${backendUrl}/ticket_state`);
        const data = await res.json();

        const backendDate = data.last_calc_date;
        const backendRemaining = data.remaining;

        // 🟢 Case 1: backend already has today's baseline
        if (backendRemaining !== null && backendDate >= todayKey) {
          setRemainingTickets(backendRemaining);
          setTicketsSold(data.total_sold || 0);
          setTicketStateLoaded(true);
          return;
        }

        // 🟡 Case 2: backend needs today's recalculation
        const recalculated = computedRemaining;

        setRemainingTickets(recalculated);
        setTicketsSold(data.total_sold || 0);
        setTicketStateLoaded(true);

        // 🔁 Sync to backend ONCE per day
        const lastSync = localStorage.getItem(SYNC_KEY);

        if (
          lastSync !== todayKey &&
          (backendRemaining === null || recalculated < backendRemaining)
        ) {
          await fetch(`${backendUrl}/sync_remaining`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ remaining: recalculated }),
            }
          );

          localStorage.setItem(SYNC_KEY, todayKey);
        }

      } catch (err) {
        console.error("Failed to load ticket state:", err);
      }
    }

    loadTicketState();
  }, []);

  useEffect(() => {
    if (remainingTickets !== null) {
      localStorage.setItem("gw_last_remaining", remainingTickets);
    }
  }, [remainingTickets]);

  useEffect(() => {
    async function handleTicketsPurchased(e) {
      const detail = e.detail || {};
      const qty = Number(detail.quantity || 0);
      if (qty <= 0) return;

      try {
        // ----------------------------
        // 1️⃣ Record sale to backend
        const res = await fetch(`${backendUrl}/record_sale`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tickets: qty }),
        });
        const data = await res.json();
        if (!data.success) {
          console.warn("Server rejected ticket update:", data);
        }

        // ----------------------------
        // 2️⃣ Fetch authoritative ticket state
        const stateRes = await fetch(`${backendUrl}/ticket_state`);
        const stateData = await stateRes.json();
        const backendSold = Number(stateData.total_sold);
        const backendRemaining = Number(stateData.remaining);

        // ----------------------------
        // 3️⃣ Update ticketsSold (authoritative)
        if (!isNaN(backendSold)) {
          setTicketsSold(backendSold);
        } else {
          setTicketsSold(prev => prev + qty); // fallback
        }

        // ----------------------------
        // 4️⃣ Update remainingTickets (decay-based)
        // ✅ Backend is authoritative after purchase
        // ✅ Backend is authoritative after purchase
        setRemainingTickets(prev => {
          const base =
            prev !== null
              ? prev
              : !isNaN(backendRemaining)
                ? backendRemaining
                : computedRemaining;

          const afterPurchase = Math.max(base - qty, 0);

          // 🔒 Never allow increase
          if (!isNaN(backendRemaining)) {
            return Math.min(afterPurchase, backendRemaining);
          }

          return afterPurchase;
        });

      

        console.log("Tickets synced after purchase:", {
          qty,
          backendSold,
          backendRemaining,
        });
      } catch (err) {
        console.error("Failed to record purchase or fetch state:", err);
      }
    }

    window.addEventListener("ticketsPurchased", handleTicketsPurchased);
    return () => window.removeEventListener("ticketsPurchased", handleTicketsPurchased);
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
  function Hero({ remainingTickets }) {
    const [scale, setScale] = useState(1);

    // Determine actual remaining tickets
    const finalRemainingTickets = remainingTickets;

    const ticketStateReady =
      finalRemainingTickets !== null && finalRemainingTickets >= 0;

    // Animate when ticket count changes
    useEffect(() => {
      if (!ticketStateReady) return; // skip if not ready
      setScale(1.3); // grow
      const timeout = setTimeout(() => setScale(1), 300); // shrink
      return () => clearTimeout(timeout);
    }, [finalRemainingTickets, ticketStateReady]);

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
                key={finalRemainingTickets} // trigger re-render on change
                style={{
                  display: "inline-block",
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                {ticketStateReady
                  ? `${finalRemainingTickets} tickets remaining`
                  : "Loading ticket availability…"}
              </span>
            </div>
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
      if (index < images.length - 1) setIndex(index + 1);
    }

    function prev() {
      if (index > 0) setIndex(index - 1);
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
          setScale((s) => Math.min(3, Math.max(1, s + delta * 0.005)));
        }
        lastDistanceRef.current = dist;
      }
    }

    function handleTouchEndZoom() {
      lastDistanceRef.current = null;
    }

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
          {/* IMAGE WRAPPER */}
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "45vh",
              width: "auto",
              height: "auto",
            }}
          >
            {/* BACK BUTTON */}
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
                position: "fixed",          // ✅ absolute for true centering
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                maxWidth: "80vw",
                maxHeight: "45vh",
                objectFit: "contain",
                cursor: scale > 1 ? "zoom-out" : "zoom-in",
                userSelect: "none",
                transition: "transform 0.25s ease",
                zIndex: 1,
              }}
            />

            {/* IMAGE INDEX */}
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
              <p className="text-sm text-slate-600 mt-1">
                {p.description?.slice(0, 50)}…
              </p>
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
            <Hero
              remainingTickets={finalRemainingTickets}
            />
            <Home />
          </>
        )}

        {view === "detail" && selected && (
          <Detail
            product={selected}
            remainingTickets={finalRemainingTickets}
            onBack={() => navigate("home")}
            openImage={openImage}
          />
        )}

        {view === "catalog" && (
          <Catalog openProduct={openProduct} />
        )}

        {view === "address" && <Address />}
        {view === "contact" && <Contact />}
        {view === "about" && <About />}
        {(view === "tickets" || view === "myTickets") && (
          <MyTickets openTicketProduct={openTicketProduct} />
        )}
        {view === "menu" && <Menu setView={navigate} />}
      </main>

      {view === "image" && activeImage && (
        <ImagePage
          images={imageImages}
          index={imageIndex}
          setIndex={(i) => {
            setImageIndex(i);
            setActiveImage(imageImages[i]);
          }}
          onBack={() => setView(imageReturnView)}
        />
      )}

      <br />

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
