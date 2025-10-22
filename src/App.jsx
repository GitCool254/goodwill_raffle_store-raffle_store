import React, { useEffect, useState } from "react";

/**
 * Goodwill Raffle Store - Upgraded UI
 * Place logo at: public/logo.png
 * Place hero/banner at: public/banner.jpg
 *
 * Minimal client-only app (localStorage) for testing.
 * Later we'll wire payments and Google Sheets via server endpoints.
 */

export default function App() {
  const sampleProducts = [
    {
      id: "p1",
      title: "iPhone 15 Pro",
      description: "Brand new iPhone 15 Pro — unopened box.",
      price: 5,
      image: "/banner.jpg",
      ticketPrice: 5,
      totalTickets: 100,
    },
    {
      id: "p2",
      title: "PlayStation 5",
      description: "PS5 console with DualSense controller.",
      price: 5,
      image: "https://via.placeholder.com/600x360?text=PS5",
      ticketPrice: 5,
      totalTickets: 200,
    },
    {
      id: "p3",
      title: "MacBook Air M3",
      description: "Lightweight MacBook Air with M3 chip.",
      price: 5,
      image: "https://via.placeholder.com/600x360?text=MacBook+Air+M3",
      ticketPrice: 5,
      totalTickets: 150,
    },
  ];

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

  useEffect(() => {
    localStorage.setItem("gw_products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("gw_entries", JSON.stringify(entries));
  }, [entries]);
  useEffect(() => {
    localStorage.setItem("gw_admin", adminAuth ? "1" : "0");
  }, [adminAuth]);

  function openProduct(p) {
    setSelected(p);
    setView("detail");
  }

  function createTickets(productId, buyer) {
    // buyer = { name, email, quantity }
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
    // attach winner to product record
    setProducts((prev) => prev.map(p => p.id === productId ? {...p, winner } : p));
    return winner;
  }

  // Admin helpers
  function loginAdmin(password) {
    // demo password: admin-pass (you should replace with real auth)
    if (password === "admin-pass") {
      setAdminAuth(true);
      alert("Admin unlocked (demo).");
    } else alert("Wrong password.");
  }

  // UI Pieces
  function Header() {
    return (
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-12 w-12 object-contain rounded" onError={(e)=>{e.target.src='https://via.placeholder.com/64'}} />
            <div>
              <h1 className="text-xl font-extrabold">Goodwillstores — Lucrative Raffles</h1>
              <div className="text-sm text-slate-500">Buy tickets. Win prizes. Transparent draws.</div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button className="px-3 py-2 rounded hover:bg-slate-100" onClick={()=>setView('home')}>Home</button>
            <button className="px-3 py-2 rounded hover:bg-slate-100" onClick={()=>setView('admin')}>Admin</button>
          </nav>
        </div>
      </header>
    );
  }

  function Hero() {
    return (
      <section className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 px-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Win big — join our raffles today</h2>
            <p className="mt-3 text-slate-100 max-w-xl">
              Buy low-cost tickets for a chance to win high-value tech items. Each ticket helps us support community initiatives.
            </p>
            <div className="mt-6 flex gap-3">
              <button className="bg-white text-sky-700 px-4 py-2 rounded-lg font-semibold" onClick={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}>Browse Raffles</button>
              <button className="border border-white px-4 py-2 rounded-lg" onClick={()=>setView('admin')}>Admin</button>
            </div>
          </div>
          <div className="flex-1">
            <img src="/banner.jpg" alt="banner" className="rounded-lg shadow-lg w-full h-56 object-cover" onError={(e)=>{e.target.src='https://via.placeholder.com/600x360'}} />
          </div>
        </div>
      </section>
    );
  }

  function Home() {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <div id="products" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
              <img src={p.image} alt={p.title} className="h-44 w-full object-cover rounded-lg mb-3" />
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-slate-700 font-medium">Ksh {p.ticketPrice} / ticket</div>
                <button className="bg-sky-600 text-white px-3 py-1 rounded-lg" onClick={()=>openProduct(p)}>Enter</button>
              </div>
              {p.winner && <div className="mt-3 text-sm text-green-700">Winner: {p.winner.name} ({p.winner.ticketNo})</div>}
            </div>
          ))}
        </div>
      </main>
    );
  }

  function Detail({ product }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [lastTicket, setLastTicket] = useState(null);

    async function submit(e) {
      e.preventDefault();
      if (!name || !email) return alert("Provide name and email.");

      const formData = {
        name,
        email,
        product: product.title || product.name || "Unknown Product",
        quantity,
      };

      try {
        const res = await fetch("http://localhost:5000/api/raffle-entry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
          alert(`✅ Entry recorded! Ticket ID: ${data.ticketNumber}`);
          setLastTicket(data.ticketNumber);
        } else {
          alert("⚠️ Failed to record entry.");
        }

        setName("");
        setEmail("");
        setQuantity(1);
      } catch (err) {
        console.error(err);
        alert("❌ Error submitting entry.");
      }
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <button className="mb-4 text-sm" onClick={()=>setView('home')}>← back</button>
        <div className="grid md:grid-cols-2 gap-6">
          <img src={product.image} alt={product.title} className="rounded-lg w-full h-64 object-cover" />
          <div>
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="mt-2 text-slate-600">{product.description}</p>
            <div className="mt-4 text-lg font-medium">Ksh {product.ticketPrice} per ticket</div>

            <form onSubmit={submit} className="mt-6 space-y-3">
              <div><label className="block text-sm">Full name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-sm">Email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-sm">Quantity</label>
                <input type="number" min={1} max={20} value={quantity} onChange={(e)=>setQuantity(parseInt(e.target.value)||1)} className="w-28 p-2 border rounded" /></div>

              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded">Buy & Enter (demo)</button>
                <button type="button" className="px-4 py-2 border rounded" onClick={()=>{
                  // quick add without form
                  const r = createTickets(product.id, { name: name || "Demo", email: email || "demo@gw.com", quantity: 1 });
                  setLastTicket(r.lastTicket);
                  alert("Added demo ticket: " + r.lastTicket);
                }}>Add Free Ticket</button>
              </div>
            </form>

            {lastTicket && <div className="mt-4 p-3 bg-slate-50 rounded">Your ticket: <strong>{lastTicket}</strong></div>}
          </div>
        </div>
      </div>
    );
  }

  function Admin() {
    const [password, setPassword] = useState("");
    const [selectedPid, setSelectedPid] = useState(products[0]?.id || null);

    if (!adminAuth) {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <h2 className="text-xl font-semibold">Admin (demo)</h2>
          <p className="text-sm text-slate-500">Demo password: <code>admin-pass</code></p>
          <div className="mt-4">
            <input value={password} onChange={(e)=>setPassword(e.target.value)} className="p-2 border rounded mr-2" placeholder="password" />
            <button className="px-3 py-1 bg-sky-600 text-white rounded" onClick={()=>loginAdmin(password)}>Unlock</button>
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
              {products.map(p => (
                <li key={p.id} className="p-3 bg-white border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-slate-500">{(entries[p.id]||[]).length} entries</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded" onClick={()=>setSelectedPid(p.id)}>View</button>
                    <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={()=>{
                      const w = pickWinner(p.id);
                      if (w) alert(`Winner: ${w.name} (${w.ticketNo})`); else alert('No entries');
                    }}>Pick winner</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-1/2">
            <h3 className="text-lg font-semibold">Entries</h3>
            <div className="mt-3 bg-white border rounded p-3 max-h-96 overflow-auto">
              <div className="mb-2 font-medium">{products.find(x=>x.id===selectedPid)?.title}</div>
              {(entries[selectedPid]||[]).map((r,i)=>(
                <div key={r.ticketNo} className="text-sm border-b py-2">
                  {i+1}. {r.name} — {r.ticketNo} — <span className="text-xs text-slate-500">{r.email}</span>
                </div>
              ))}
              {!(entries[selectedPid]||[]).length && <div className="text-sm text-slate-500">No entries yet.</div>}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 border rounded" onClick={()=>{
                // export CSV for selectedPid
                const pool = entries[selectedPid]||[];
                const csv = ["ticketNo,name,email,createdAt", ...pool.map(r=>[r.ticketNo, r.name, r.email, r.createdAt].join(','))].join('\n');
                const blob = new Blob([csv], {type:'text/csv'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `${selectedPid}_entries.csv`; a.click(); URL.revokeObjectURL(url);
              }}>Export CSV</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>{
                if (confirm('Clear all entries for this raffle?')) {
                  const c = {...entries}; c[selectedPid] = []; setEntries(c);
                }
              }}>Clear Entries</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <Hero />
      {view === 'home' && <Home />}
      {view === 'detail' && selected && <Detail product={selected} />}
      {view === 'admin' && <Admin />}
      <footer className="mt-12 border-t bg-white">
        <div className="max-w-6xl mx-auto p-4 text-sm text-slate-500">© {new Date().getFullYear()} Goodwillstores — Terms & Conditions apply.</div>
      </footer>
    </div>
  );
}
