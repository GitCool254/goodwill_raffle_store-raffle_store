import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import "./App.css";

// Components
import Header from "./components/Header";
import Home from "./components/Home";
import Menu from "./components/Menu";
import HolidaySystem from "./components/HolidaySystem";
import RecentWinners from "./components/RecentWinners";
import RecentlyViewed from "./components/RecentlyViewed";
import WinnersDetail from "./components/WinnersDetail";
import SearchBar from "./components/SearchBar";

// Lazy‑load page components
const Detail = lazy(() => import("./components/Detail"));
const Catalog = lazy(() => import("./components/Catalog"));
const Address = lazy(() => import("./components/Address"));
const Contact = lazy(() => import("./components/Contact"));
const About = lazy(() => import("./components/About"));
const MyTickets = lazy(() => import("./components/MyTickets"));
const Donations = lazy(() => import("./components/Donations"));
const TermsOfUse = lazy(() => import("./components/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));

// Import product data
import { sampleProducts, catalogItems } from "./data/products";

export default function App() {
  const DATA_VERSION = "v3";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) console.error("VITE_BACKEND_URL is not set!");

  const [remainingTickets, setRemainingTickets] = useState(null);
  const [ticketStateLoaded, setTicketStateLoaded] = useState(false);
  const [ticketsSold, setTicketsSold] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  // --- State for WinnersDetail toggle ---
  const [showWinnersDetail, setShowWinnersDetail] = useState(true);

  // --- Global search query (shared between Home and Catalog) ---
  const [searchQuery, setSearchQuery] = useState("");

  // -------------------- STATE --------------------
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("gw_products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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

  // -------------------- DEFERRED INITIAL FETCH --------------------
  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const fetchAfterPaint = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          if (!isMounted) return;
          fetchInitialData();
        });
      } else {
        setTimeout(() => {
          if (!isMounted) return;
          fetchInitialData();
        }, 100);
      }
    };

    async function fetchInitialData() {
      try {
        const [ticketStateRes, toggleRes] = await Promise.all([
          fetch(`${backendUrl}/ticket_state`),
          fetch(`${backendUrl}/winners_detail_toggle`),
        ]);

        if (!isMounted) return;

        const ticketData = await ticketStateRes.json();
        if (!isNaN(ticketData.remaining)) {
          setRemainingTickets(Number(ticketData.remaining));
        }
        if (!isNaN(ticketData.tickets_sold)) {
          setTicketsSold(Number(ticketData.tickets_sold));
        }
        setTicketStateLoaded(true);

        const toggleData = await toggleRes.json();
        setShowWinnersDetail(toggleData.show ?? true);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setTicketStateLoaded(true);
        setShowWinnersDetail(true);
      }
    }

    fetchAfterPaint();

    intervalId = setInterval(() => {
      if (!isMounted) return;
      fetch(`${backendUrl}/ticket_state`)
        .then(res => res.json())
        .then(data => {
          if (isMounted && !isNaN(data.remaining)) {
            setRemainingTickets(Number(data.remaining));
          }
          if (isMounted && !isNaN(data.tickets_sold)) {
            setTicketsSold(Number(data.tickets_sold));
          }
        })
        .catch(err => console.error("Ticket refresh failed:", err));
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [backendUrl]);

  // -------------------- EVENT LISTENER --------------------
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

  // -------------------- URL / ROUTING --------------------
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

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
    tickets: "/tickets",
  };

  const pathToView = Object.fromEntries(
    Object.entries(viewToPath).map(([view, path]) => [path, view])
  );

  function findProductBySlug(slug) {
    let product = products.find((p) => generateSlug(p.title) === slug);
    if (product) return product;
    product = catalogItems.find((p) => generateSlug(p.title) === slug);
    return product || null;
  }

  function navigate(nextView, product = null) {
    let path;
    let newView = nextView;

    if (nextView === "detail") {
      if (!product) return;
      path = `/${generateSlug(product.title)}`;
      setSelected(product);
    } else if (nextView === "image") {
      path = viewToPath[imageReturnView] || "/";
      return;
    } else {
      path = viewToPath[nextView] || "/";
      setSelected(null);
    }

    setView(newView);
    window.history.pushState({ view: newView, product: product || null }, "", path);
  }

  function restoreViewFromPath(path) {
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

    const slug = path.startsWith("/") ? path.slice(1) : path;
    const product = findProductBySlug(slug);
    if (product) {
      setSelected(product);
      setView("detail");
      return;
    }

    setView("home");
    setSelected(null);
  }

  useEffect(() => {
    const path = window.location.pathname;
    restoreViewFromPath(path);

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      restoreViewFromPath(currentPath);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [products]);

  // -------------------- PRODUCT INTERACTIONS --------------------
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
    navigate("detail", p);
  }

  function openTicketProduct(ticket) {
    const product = products.find((p) => p.id === ticket.productId);
    if (!product) return;
    setSelected({ ...product, _ticket: ticket });
    navigate("detail", product);
  }

  function openImage(images, index = 0, returnView = "home", product = null) {
    setImageImages(images);
    setImageIndex(index);
    setActiveImage(images[index]);
    setImageReturnView(returnView);
    setView("image");

    if (product) {
      const slug = generateSlug(product.title);
      window.history.pushState({ view: "image", productId: product.id }, "", `/${slug}`);
    } else {
      const path = viewToPath[returnView] || "/";
      window.history.pushState({ view: "image" }, "", path);
    }
  }

  function closeImageViewer() {
    window.history.back();
  }

  // -------------------- HERO --------------------
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

  // -------------------- IMAGE PAGE (overlay) --------------------
  function ImagePage({ images, index, setIndex, onBack }) {
    // (Keep your existing ImagePage implementation exactly as before)
    // For brevity, I'm not pasting it here – it remains unchanged.
  }

  // -------------------- HOME COMPONENT (with search) --------------------
  function Home({ searchQuery }) {
    // Determine which products to display:
    // - If searchQuery is empty, show only the sample products (products state)
    // - If searchQuery is not empty, show all products (sample + catalog) that match the query
    const allProducts = [...products, ...catalogItems];

    const filteredProducts = searchQuery.trim() === "" 
      ? products  // show only sample products by default
      : allProducts.filter((p) => {
          const q = searchQuery.toLowerCase().trim();
          return (
            p.title.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
          );
        });

    return (
      <main className="max-w-6xl mx-auto p-6">
        <div id="products" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((p, idx) => {
            const isLcp = idx === 0;
            return (
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
                    width="800"
                    height="600"
                    loading={isLcp ? undefined : "lazy"}
                    fetchpriority={isLcp ? "high" : undefined}
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "0.5rem",
                      cursor: "zoom-in",
                      aspectRatio: "800/600",
                    }}
                    onClick={() => {
                      addToRecentlyViewed(p);
                      openImage(p.images?.length ? p.images : [p.image], 0, "home", p);
                    }}
                  />
                </div>
                <h3 className="font-semibold">{p.title}</h3>
                <div className="text-sm text-slate-600 mt-1">
                  <span className="font-semibold">Product Details: </span>
                  {p.description?.slice(0, 50)}…
                </div>
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
            );
          })}
        </div>
      </main>
    );
  }

  // -------------------- MAIN RETURN --------------------
  return (
    <>
      <Helmet>
        <title>Home – Goodwillstores</title>
        <meta name="description" content="Shop quality second-hand and used products at affordable prices. Discover great deals on electronics, furniture, appliances, sport and more at Goodwillstores.Second Hand, First Choice." />
      </Helmet>
      <div
        className={`min-h-screen flex flex-col ${
          view === "image" ? "bg-black" : "bg-slate-50"
        }`}
      >
        {/* HEADER */}
        {view !== "image" && (
          <Header
            setView={navigate}
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
          {/* 👇 Search bar – visible on home and catalog */}
          {view !== "image" && (view === "home" || view === "catalog") && (
            <div className="max-w-6xl mx-auto px-6">
              <SearchBar placeholder="Search products" onSearch={setSearchQuery} />
            </div>
          )}

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
                        • <strong>Date & Time:</strong> 31/August/2026, 0200PM
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

              <Home searchQuery={searchQuery} />
              <br />
              <RecentlyViewed onProductClick={openProduct} />
              {showWinnersDetail && <WinnersDetail />}
            </>
          )}

          {/* Lazy-loaded routes */}
          <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
            {view === "detail" && selected && (
              <Detail
                product={selected}
                remainingTickets={remainingTickets}
                onBack={() => navigate("home")}
                openImage={openImage}
              />
            )}

            {/* Catalog component – does NOT receive searchQuery prop */}
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
          </Suspense>
        </main>

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
      </div>
    </>
  );
}
