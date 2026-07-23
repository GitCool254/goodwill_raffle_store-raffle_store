import React, { useEffect, useState, useRef } from "react";
import "./App.css";

// eruda console

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
import Donations from "./components/Donations";
import TermsOfUse from "./components/TermsOfUse";
import PrivacyPolicy from "./components/PrivacyPolicy";
import RecentWinners from "./components/RecentWinners";
import RecentlyViewed from "./components/RecentlyViewed";

// 👇 Import catalog items for URL resolution fallback
import { catalogItems } from "./components/Catalog";

/**
 * Goodwill Raffle Store - Upgraded UI
 * Place logo at: public/logo.png
 * Remove banner
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

  const [menuOpen, setMenuOpen] = useState(false);

  // -------------------- SAMPLE DATA --------------------
  const sampleProducts = [
    {
      id: "p1",
      title: "4D-V15 Drone Zeros Mini Quadcopter",
      description:
        "Drone with 1080P camera. Comes with an extra battery, battery charging adapter, and propellers restrains.\nThe V15 mini drone captures great in-flight pictures and videos. FPV Real-time transmission, you can upload the HD footage from your iphone/ipad.\nComes with instruction book and accessories.\n\nPerfect working condition.",
      price: 6,
      image: "/Drone zeros.png",
      images: ["/Drone zeros.png", "/Drone zeros1.png", "/Drone zeros2.png", "Drone zeros3.png", "/Drone zeros4.png", "/Drone zeros5.png"],
      ticketPrice: 6,
      totalTickets: 100,
      category: "Sports",
      marketPrice: 200,
    },
    {
      id: "p2",
      title: "Beachcroft Patio set",
      description:
        "2 Swivel rocking outdoors chairs, fire pit, and 5 pc sectional.\nBrand is Beachcroft.",
      price: 6,
      image: "/BeachCroft.png",
      images: ["/BeachCroft.png", "/BeachCroft1.png", "/BeachCroft3.png", "/BeachCroft2.png"],
      ticketPrice: 6,
      totalTickets: 200,
      category: "Households",
      marketPrice: 400,
    },
    {
      id: "p3",
      title: "Coolster 125cc",
      description: "Coolster 125cc.\nGreat little starter for your kid",
      price: 10,
      image: "/coolster.png",
      images: ["/coolster.png", "/coolster1.png", "/coolster2.png", "/coolster3.png"],
      ticketPrice: 10,
      totalTickets: 150,
      category: "Eletronics",
      marketPrice: 650,
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
          parsed.some((p, i) => JSON.stringify(p) !== JSON.stringify(sampleProducts[i]));

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

  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);

  const [activeImage, setActiveImage] = useState(null);
  const [imageImages, setImageImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageReturnView, setImageReturnView] = useState("home");

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

    fetchTicketState();
    intervalId = setInterval(() => {
      fetchTicketState();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
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
    return () => window.removeEventListener("ticketsPurchased", handleTicketsPurchased);
  }, []);

  useEffect(() => {
    localStorage.setItem("gw_entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    window.addEventListener("goMyTickets", () => navigate("myTickets"));
    return () => window.removeEventListener("goMyTickets", () => setView("myTickets"));
  }, []);

  // -------------------- URL / ROUTING HELPERS --------------------
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Mapping view name -> URL path
  const viewToPath = {
    home: "/",
    catalog: "/catalog",
    about: "/about",
    contact: "/contact",
    address: "/address",
    donations: "/donations",
    terms: "/terms",
    privacy: "/privacy",
    myTickets: "/tickets",
    tickets: "/tickets",   // ← ADDED: supports both "myTickets" and "tickets"
  };

  // Reverse mapping: path -> view name (excluding detail and image)
  const pathToView = Object.fromEntries(
    Object.entries(viewToPath).map(([view, path]) => [path, view])
  );

  // Determine if a path is a product slug (and return the product if found)
  function findProductBySlug(slug) {
    // 1️⃣ Check main products (featured)
    let product = products.find((p) => generateSlug(p.title) === slug);
    if (product) return product;
    // 2️⃣ Check catalog items
    product = catalogItems.find((p) => generateSlug(p.title) === slug);
    return product || null;
  }

  // Core navigation: update view and URL (push state)
  function navigate(nextView, product = null) {
    let path;
    let newView = nextView;

    if (nextView === "detail") {
      if (!product) return;
      path = `/${generateSlug(product.title)}`;
      setSelected(product);
    } else if (nextView === "image") {
      // Image view uses the same path as the product (if available)
      path = viewToPath[imageReturnView] || "/";
      // but we actually want to keep the product slug if coming from detail
      // we handle image separately via openImage
      return;
    } else {
      path = viewToPath[nextView] || "/";
      setSelected(null);
    }

    // Update view state
    setView(newView);
    // Push new history entry
    window.history.pushState({ view: newView, product: product || null }, "", path);
  }

  // Restore view from a given path (used on initial load and popstate)
  function restoreViewFromPath(path) {
    // 1. Check if it's a known static view
    if (path === "/") {
      setView("home");
      setSelected(null);
      return;
    }
    const viewName = pathToView[path];
    if (viewName) {
      setView(viewName);
      setSelected(null);
      return;
    }

    // 2. Check if it's a product slug
    const slug = path.startsWith("/") ? path.slice(1) : path;
    const product = findProductBySlug(slug);
    if (product) {
      setSelected(product);
      setView("detail");
      return;
    }

    // 3. Fallback to home
    setView("home");
    setSelected(null);
  }

  // -------------------- INITIAL LOAD & POPSTATE --------------------
  useEffect(() => {
    // On initial load, read the current path and set the view
    const path = window.location.pathname;
    restoreViewFromPath(path);

    // Handle browser back/forward
    const handlePopState = (event) => {
      const currentPath = window.location.pathname;
      restoreViewFromPath(currentPath);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [products]); // re-run when products load (for slug matching)

  // -------------------- PRODUCT & IMAGE INTERACTIONS --------------------
  function addToRecentlyViewed(product) {
    if (!product || !product.id) return;
    const stored = localStorage.getItem("gw_recently_viewed");
    let recent = stored ? JSON.parse(stored) : [];
    recent = recent.filter((p) => p.id !== product.id);
    recent.unshift(product);
    if (recent.length > 10) recent.pop();
    localStorage.setItem("gw_recently_viewed", JSON.stringify(recent));
  }

  function openProduct(p) {
    addToRecentlyViewed(p);
    // Use navigate with detail view and product
    navigate("detail", p);
  }

  function openTicketProduct(ticket) {
    const product = products.find((p) => p.id === ticket.productId);
    if (!product) return;
    setSelected({
      ...product,
      _ticket: ticket,
    });
    navigate("detail", product);
  }

  function openImage(images, index = 0, returnView = "home", product = null) {
    setImageImages(images);
    setImageIndex(index);
    setActiveImage(images[index]);
    setImageReturnView(returnView);
    setView("image");

    // If product is provided, push a history entry with the product slug
    if (product) {
      const slug = generateSlug(product.title);
      window.history.pushState({ view: "image", productId: product.id }, "", `/${slug}`);
    } else {
      // Fallback: push the current view path
      const path = viewToPath[returnView] || "/";
      window.history.pushState({ view: "image" }, "", path);
    }
  }

  // Close image viewer by going back in history
  function closeImageViewer() {
    window.history.back();
  }

  // -------------------- HERO COMPONENT --------------------
  function Hero({ remainingTickets, ticketsSold }) {
    const [scale, setScale] = useState(1);

    const ticketStateReady = remainingTickets !== null && ticketStateLoaded;

    useEffect(() => {
      if (!ticketStateReady) return;
      setScale(1.3);
      const timeout = setTimeout(() => setScale(1), 300);
      return () => clearTimeout(timeout);
    }, [remainingTickets, ticketStateReady]);

    return (
      <section className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start p-6 px-4">
          <div className="flex-1">
            <div className="mt-6 flex gap-3">
              <button
                className="bg-white text-sky-700 px-4 py-2 rounded-lg font-semibold"
                style={{ marginTop: "20px" }}
                onClick={() => navigate("catalog")}
              >
                Explore Finds
              </button>
            </div>

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
                <>✔ <strong>{ticketsSold}</strong> tickets sold so far</>
              )}
            </div>

            {ticketStateLoaded && Number(remainingTickets) <= 0 && (
              <div
                className="mt-3"
                style={{
                  color: "#1e293b",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  marginLeft: "0",
                  fontSize: "1.08rem",
                  marginBottom: "20px",
                  textAlign: "left",
                  lineHeight: "1.6",
                  border: "1.5px dotted #d4af37",
                  backgroundColor: "#fffdf7",
                  padding: "14px 16px",
                  borderRadius: "10px",
                }}
              >
                This raffle is now officially closed. We sincerely appreciate your participation
                and continued support. Stay tuned — our next raffle opportunity will be
                announced shortly.
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // -------------------- AUTO-ROTATING WINNERS --------------------
  function AutoRotateWinners() {
    const winners = [
      {
        name: "Melissa D.",
        date: "26 May 2026",
        ticketNo: "RF-48219",
        product: "Larchmont Dining Set",
        winnerImg: "",
        productImg: "/Dining set_melissa.png",
        verified: true,
        countryFlag: "🇺🇸",
        location: "New York, USA on",
      },
      {
        name: "Liam J..",
        date: "26 Jan 2026",
        ticketNo: "RF-37922",
        product: "Ballinasloe 3-piece Sectional",
        winnerImg: "",
        productImg: "/Ballinasloe_Liam.png",
        verified: true,
        countryFlag: "🇺🇸",
        location: "Texas, USA",
      },
      {
        name: "Alexander G.",
        date: "29 Dec 2025",
        ticketNo: "RF-29410",
        product: "NSF Surf Betty",
        winnerImg: "",
        productImg: "/Surf Betty.png",
        verified: true,
        countryFlag: "🇱🇷",
        location: "Toronto, Canada",
      },
      {
        name: "Mae W.",
        date: "26 Jun 2026",
        ticketNo: "RF-18177",
        product: "Trek Marlin 5 Gen 2",
        winnerImg: "",
        productImg: "/Trek Marlin_mae.png",
        verified: true,
        countryFlag: "🇺🇸",
        location: "Missouri, USA",
      },
      {
        name: "Joshua T.",
        date: "18 Dec 2025",
        ticketNo: "RF-18177",
        product: "Venom X21(Dongfang DF50SRT)",
        winnerImg: "",
        productImg: "/Venom X21_Joshua.png",
        verified: true,
        countryFlag: "🇺🇸",
        location: "Missouri, USA",
      },
    ];

    const [index, setIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [animate, setAnimate] = useState(true);
    const [paused, setPaused] = useState(false);
    const [imgError, setImgError] = useState(false);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const getInitials = (name) => {
      const parts = name.trim().split(/\s+/);
      if (parts.length === 0) return "";
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    useEffect(() => {
      if (paused) return;
      const interval = setInterval(() => {
        setAnimate(false);
        setTimeout(() => {
          setExpanded(false);
          setIndex((i) => (i + 1) % winners.length);
          setAnimate(true);
          setImgError(false);
        }, 250);
      }, 4500);
      return () => clearInterval(interval);
    }, [paused]);

    useEffect(() => {
      setImgError(false);
    }, [index]);

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const delta = touchStartX.current - touchEndX.current;
      if (Math.abs(delta) < 15) {
        setPaused((p) => !p);
        return;
      }
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
    const initials = getInitials(w.name);
    const hasValidImage = w.winnerImg && w.winnerImg.trim() !== "";

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
            marginTop: "15px",
            backdropFilter: "blur(6px)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: "2px",
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
              marginTop: "15px",
            }}
          >
            6500+ Winners Since Launch
          </p>

          <p
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: "#94a3b8", letterSpacing: "0.15em" }}
          >
            RECENT WINNERS
          </p>

          <div className="flex items-center justify-center gap-2">
            <p className="text-base font-semibold text-slate-800">{w.name}</p>
            {w.verified && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                ✔ Verified
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-1">
            <p className="text-xs text-slate-500">{w.location}</p>
            <span className="text-sm">{w.countryFlag}</span>
          </div>

          {hasValidImage && !imgError ? (
            <img
              src={w.winnerImg}
              alt="Winner"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                margin: "0 auto",
                border: "1px solid #cbd5e1",
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#d1fae5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                border: "1px solid #cbd5e1",
              }}
            >
              <span
                style={{
                  color: "#10b981",
                  fontWeight: "bold",
                  fontSize: "18px",
                  textTransform: "uppercase",
                }}
              >
                {initials}
              </span>
            </div>
          )}

          <p className="text-sm font-semibold text-slate-800">
            {expanded ? w.product : shortProduct}
            {w.product.length > 75 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1 text-xs underline text-slate-500"
              >
                {expanded ? "See less" : "See more"}
              </button>
            )}
          </p>

          <img
            src={w.productImg}
            alt="Product"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              objectFit: "cover",
              display: "block",
              margin: "12px auto 0 auto",
              border: "1px solid #cbd5e1",
            }}
          />

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

          <p className="text-xs text-slate-500" style={{ color: "#94a3b8" }}>
            Draw date: {w.date}
          </p>
        </div>

        <br />

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
                  setImgError(false);
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

        <p className="text-xs mt-3" style={{ color: "#94a3b8", fontStyle: "italic" }}>
          Recent raffle winners. Names are partially anonymized for privacy.
        </p>
      </section>
    );
  }

  // -------------------- IMAGE PAGE (overlay) --------------------
  function ImagePage({ images, index, setIndex, onBack }) {
    const [touchStartX, setTouchStartX] = useState(null);
    const [scale, setScale] = useState(1);
    const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const lastDistanceRef = useRef(null);
    const lastTapRef = useRef(0);
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
      setIsLoading(true);
    }, [index]);

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

    useEffect(() => {
      if (imgRef.current && imgRef.current.complete) {
        setNaturalSize({
          width: imgRef.current.naturalWidth,
          height: imgRef.current.naturalHeight,
        });
        setIsLoading(false);
      }
    }, [index]);

    useEffect(() => {
      if (scale > 1 && naturalSize.width && containerRef.current) {
        const scaledWidth = naturalSize.width * scale;
        const scaledHeight = naturalSize.height * scale;
        containerRef.current.scrollLeft = (scaledWidth - containerRef.current.clientWidth) / 2;
        containerRef.current.scrollTop = (scaledHeight - containerRef.current.clientHeight) / 2;
      }
    }, [scale, naturalSize]);

    function handleImageLoad(e) {
      const img = e.target;
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setIsLoading(false);
    }

    function handleImageError() {
      setIsLoading(false);
    }

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
      <>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spinner {
            width: 36px;
            height: 36px;
            animation: spin 1s linear infinite;
          }
          .ring {
            fill: none;
            stroke: #e0e0e0;
            stroke-width: 4;
          }
          .star {
            fill: #3b82f6;
          }
        `}</style>
        <div
          ref={containerRef}
          className="fixed inset-0 bg-black z-50"
          style={{
            overflow: scale > 1 ? "auto" : "hidden",
            width: "100vw",
            height: "100vh",
            WebkitOverflowScrolling: "touch",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={(e) => {
            handleTouchEnd(e);
            handleTouchEndZoom();
          }}
        >
          {isLoading && (
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10001 }}>
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="ring" cx="25" cy="25" r="20"></circle>
                <path className="star" d="M25 12 L28 22 L39 22 L30 28 L33 38 L25 32 L17 38 L20 28 L11 22 L22 22 Z" />
              </svg>
            </div>
          )}

          <button
            onClick={onBack}
            style={{
              position: "fixed",
              top: "16px",
              right: "16px",
              zIndex: 10000,
              fontWeight: 800,
            }}
            className="text-white font-extrabold bg-black/70 w-12 h-12 flex items-center justify-center text-4xl"
          >
            ✕
          </button>

          {images.length > 1 && index > 0 && (
            <button
              onClick={prev}
              style={{
                position: "fixed",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10001,
                fontSize: "64px",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          {images.length > 1 && index < images.length - 1 && (
            <button
              onClick={next}
              style={{
                position: "fixed",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10001,
                fontSize: "64px",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Next image"
            >
              ›
            </button>
          )}

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
            <div
              style={{
                position: "relative",
                maxWidth: "90vw",
                maxHeight: "45vh",
                width: "auto",
                height: "auto",
              }}
            >
              <img
                ref={imgRef}
                key={index}
                src={images[index]}
                alt="Full view"
                onClick={handleDoubleTap}
                onLoad={handleImageLoad}
                onError={handleImageError}
                draggable={false}
                style={{
                  position: "fixed",
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
      </>
    );
  }

  // -------------------- HOME COMPONENT (featured products) --------------------
  function Home() {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <div id="products" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
              <div
                style={{
                  width: "100%",
                  marginBottom: "12px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "0.5rem",
                    cursor: "zoom-in",
                  }}
                  onClick={() => {
                    addToRecentlyViewed(p);
                    openImage(p.images?.length ? p.images : [p.image], 0, "home", p);
                  }}
                />
              </div>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{p.description?.slice(0, 50)}…</p>
              <div className="mt-3 flex items-center justify-between" style={{ marginBottom: "15px" }}>
                <div className="text-slate-700 font-medium">$ {p.ticketPrice} / ticket</div>
                <button
                  className="bg-sky-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => openProduct(p)}
                >
                  Enter
                </button>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(255,0,0,0.4), rgba(255,136,0,0.4), rgba(255,255,0,0.4), rgba(0,255,0,0.3), rgba(0,136,255,0.4), rgba(68,0,255,0.4), rgba(255,0,0,0.4))",
                  marginBottom: "16px",
                }}
              />
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
      {view !== "image" && (
        <Header
          setView={navigate}   // ← FIXED: now uses navigate to update URL as well
          onMenuClick={() => setMenuOpen(true)}
          onDonateClick={() => navigate("donations")}
        />
      )}

      {view !== "image" && (
        <>
          {remainingTickets !== null && remainingTickets > 0 && (
            <HolidaySystem onNavigate={navigate} />
          )}
          <RecentWinners />
        </>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {view === "home" && (
          <>
            <Hero remainingTickets={remainingTickets} ticketsSold={ticketsSold} />

            {ticketStateLoaded && Number(remainingTickets) > 0 && (
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
                    style={{ fontSize: "1.25rem", color: "#64748b" }}
                  >
                    Raffle Event Details
                  </h2>

                  <div
                    className="space-y-2 text-slate-700"
                    style={{ fontSize: "0.9rem", textAlign: "left", marginLeft: "0", paddingLeft: "10px" }}
                  >
                    <p>
                      • <strong>Location:</strong>{" "}
                      <button
                        onClick={() => navigate("address")}
                        style={{
                          color: "#3b82f6",
                          textDecoration: "none",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          fontSize: "1.1rem",
                          font: "inherit",
                        }}
                        className="hover:underline"
                      >
                        Our Physical Stores
                      </button>
                    </p>
                    <p>
                      • <strong>Date & Time:</strong> [EVENT DATE & TIME]
                    </p>
                    <p>
                      • <strong>Fair Play:</strong> All tickets are digitally generated and remain valid until the official draw.
                    </p>
                  </div>

                  <p
                    className="text-slate-500 mt-4"
                    style={{ fontSize: "0.8rem", fontStyle: "italic" }}
                  >
                    Winners are announced publicly on this website and contacted via the email used during ticket purchase.
                  </p>
                </div>
              </section>
            )}

            <Home />
            <br />
            <RecentlyViewed onProductClick={openProduct} />
            <AutoRotateWinners />
            <RecentWinners />
          </>
        )}

        {view === "detail" && selected && (
          <Detail
            product={selected}
            remainingTickets={remainingTickets}
            onBack={() => navigate("home")}
            openImage={openImage}
          />
        )}

        {view === "catalog" && <Catalog openProduct={openProduct} />}

        {view === "address" && <Address />}
        {view === "contact" && <Contact />}
        {view === "about" && <About navigate={navigate} />}
        {view === "donations" && <Donations />}
        {view === "terms" && <TermsOfUse onBack={() => navigate("about")} />}
        {view === "privacy" && <PrivacyPolicy onBack={() => navigate("about")} />}
        {(view === "tickets" || view === "myTickets") && (
          <MyTickets openTicketProduct={openTicketProduct} />
        )}
      </main>

      {/* Sliding menu panel */}
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} setView={navigate} />

      {view === "image" && activeImage && (
        <ImagePage
          images={imageImages}
          index={imageIndex}
          setIndex={(i) => {
            setImageIndex(i);
            setActiveImage(imageImages[i]);
          }}
          onBack={closeImageViewer}
        />
      )}

      <br />

      {/* FOOTER */}
      {view !== "image" && (
        <footer
          className="w-full text-center py-6"
          style={{
            background: "linear-gradient(180deg, #1E3A8A 0%, #E0F0FF 100%)",
            color: "white",
          }}
        >
          <div className="mb-4">
            <button
              onClick={() => navigate("terms")}
              className="text-white hover:text-gray-300 text-sm font-medium transition bg-transparent border-none cursor-pointer"
              style={{ color: "white" }}
            >
              Terms of Use
            </button>
            <span className="mx-2 text-gray-400">|</span>
            <button
              onClick={() => navigate("privacy")}
              className="text-white hover:text-gray-300 text-sm font-medium transition bg-transparent border-none cursor-pointer"
              style={{ color: "white" }}
            >
              Privacy Policy
            </button>
            <span className="mx-2 text-gray-400">|</span>
            <a
              href="mailto:goodwillstores.support@gmail.com"
              className="text-white hover:text-gray-300 text-sm font-medium transition"
              style={{ color: "white" }}
            >
              Contact
            </a>
          </div>
          <div className="text-white text-sm">
            © {new Date().getFullYear()} Goodwillstores. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}
