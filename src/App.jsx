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
import Admin from "./components/Admin";
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
      ticketPrice: 5,
      totalTickets: 100,
      category: "Eletronics",
    },
    {
      id: "p2",
      title: "PlayStation 5",
      description: "PS5 console with DualSense controller.",
      price: 5,
      image: "Screenshot_20251007-201731~2.png",
      ticketPrice: 5,
      totalTickets: 200,
      category: "Households",
    },
    {
      id: "p3",
      title: "MacBook Air M3",
      description: "Lightweight MacBook Air with M3 chip.",
      price: 5,
      image: "Screenshot_20251007-094253~2.png",
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

  const [view, setView] = useState("home"); // home | detail | admin
  const [selected, setSelected] = useState(null);
  const [adminAuth, setAdminAuth] = useState(() => {
    return localStorage.getItem("gw_admin") === "1";
  });
  
  console.log("App mounted — view =", view);
  // -------------------- LOCAL STORAGE SYNC --------------------
  useEffect(() => {
    localStorage.setItem("gw_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("gw_entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("gw_admin", adminAuth ? "1" : "0");
  }, [adminAuth]);

  // -------------------- CORE FUNCTIONS --------------------
  function openProduct(p) {
    setSelected(p);
    setView("detail");
  }

  function createTickets(productId, buyer) {
    const now = new Date().toISOString();
    const base = Math.random().toString(36).slice(2, 9).toUpperCase();
    const copy = { ...entries };
    if (!copy[productId]) copy[productId] = [];
    for (let i = 0; i < buyer.quantity; i++) {
      const ticketNo = `${productId.toUpperCase()}-${base}-${i + 1}`;
      copy[productId].push({
        ticketNo,
        name: buyer.name,
        email: buyer.email,
        createdAt: now,
      });
    }
    setEntries(copy);
    return { lastTicket: `${productId.toUpperCase()}-${base}-1` };
  }

  function pickWinner(productId) {
    const pool = entries[productId] || [];
    if (!pool.length) return null;
    const winner = pool[Math.floor(Math.random() * pool.length)];
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, winner } : p))
    );
    return winner;
  }

  // -------------------- ADMIN LOGIN --------------------
  function loginAdmin(password) {
    if (password === "admin-pass") {
      setAdminAuth(true);
      alert("Admin unlocked (demo).");
    } else {
      alert("Wrong password.");
    }
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
              <button
                className="border border-white px-4 py-2 rounded-lg"
                onClick={() => setView("admin")}
              >
                Admin
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
                className="h-44 w-full object-cover rounded-lg mb-3"
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

  function Admin() {
    console.log("Admin render — adminAuth:", adminAuth);
    const [password, setPassword] = useState("");
    const [selectedPid, setSelectedPid] = useState(products[0]?.id || null);

    if (!adminAuth) {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <h2 className="text-xl font-semibold">Admin (demo)</h2>
          <p className="text-sm text-slate-500">
            Demo password: <code>admin-pass</code>
          </p>
          <div className="mt-4">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded mr-2"
              placeholder="password"
            />
            <button
              className="px-3 py-1 bg-sky-600 text-white rounded"
              onClick={() => loginAdmin(password)}
            >
              Unlock
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-start gap-6">
          <div className="w-1/2">
            <h3 className="text-lg font-semibold">Raffles</h3>
            <ul className="mt-3 space-y-3">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="p-3 bg-white border rounded flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-slate-500">
                      {(entries[p.id] || []).length} entries
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => setSelectedPid(p.id)}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded"
                      onClick={() => {
                        const w = pickWinner(p.id);
                        if (w)
                          alert(`Winner: ${w.name} (${w.ticketNo})`);
                        else alert("No entries");
                      }}
                    >
                      Pick winner
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-1/2">
            <h3 className="text-lg font-semibold">Entries</h3>
            <div className="mt-3 bg-white border rounded p-3 max-h-96 overflow-auto">
              <div className="mb-2 font-medium">
                {products.find((x) => x.id === selectedPid)?.title}
              </div>
              {(entries[selectedPid] || []).map((r, i) => (
                <div key={r.ticketNo} className="text-sm border-b py-2">
                  {i + 1}. {r.name} — {r.ticketNo} —{" "}
                  <span className="text-xs text-slate-500">{r.email}</span>
                </div>
              ))}
              {!(entries[selectedPid] || []).length && (
                <div className="text-sm text-slate-500">No entries yet.</div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => {
                  const pool = entries[selectedPid] || [];
                  const csv = [
                    "ticketNo,name,email,createdAt",
                    ...pool.map((r) =>
                      [r.ticketNo, r.name, r.email, r.createdAt].join(",")
                    ),
                  ].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${selectedPid}_entries.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export CSV
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => {
                  if (confirm("Clear all entries for this raffle?")) {
                    const c = { ...entries };
                    c[selectedPid] = [];
                    setEntries(c);
                  }
                }}
              >
                Clear Entries
              </button>
            </div>
          </div>
        </div>
      </div>
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

        {view === "admin" && <Admin />}

        {view === "catalog" && (
          <Catalog openProduct={openProduct} />
        )}

        {view === "address" && <Address />}
        {view === "contact" && <Contact />}
        {view === "about" && <About />}
        {view === "menu" && <Menu setView={setView} />}
      </main>

      {/* FOOTER (sticky bottom + broken line) */}
      <footer className="w-full text-center py-6 border-t-2 border-slate-400 text-slate-500 text-sm"
        style={{ borderTopStyle: "dotted" }}
      >
        © {new Date().getFullYear()} Goodwillstores
      </footer>

    </div>
  );
}
