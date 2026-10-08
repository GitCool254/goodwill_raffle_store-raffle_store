import React, { useEffect, useState } from "react";
import { FALLBACK_SAMPLE_PRODUCTS, FALLBACK_CATALOG_ITEMS } from "../data/products";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const TOKEN_KEY = "gw_admin_token";

const EMPTY_PRODUCT = {
  id: "",
  title: "",
  description: "",
  price: 0,
  image: "",
  images: [],
  ticketPrice: 0,
  totalTickets: 0,
  category: "",
  marketPrice: 0,
};

export default function AdminPortal() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState("catalog"); // "featured" | "catalog"
  const [sampleProducts, setSampleProducts] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [draft, setDraft] = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- LOGIN ----------------
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch(`${BACKEND}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("Network error — check backend URL.");
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  }

  function seedFromDefaults() {
    if (!confirm(
      "This will replace the current admin lists with the built-in default products. " +
      "You'll still need to click 'Save All' to persist them to the backend. Continue?"
    )) return;

    setSampleProducts(FALLBACK_SAMPLE_PRODUCTS);
    setCatalogItems(FALLBACK_CATALOG_ITEMS);
    setSaveMsg(
      `✅ Loaded ${FALLBACK_SAMPLE_PRODUCTS.length} featured and ` +
      `${FALLBACK_CATALOG_ITEMS.length} catalog items into admin. ` +
      `Now click 'Save All' to persist them.`
    );
  }

  // ---------------- LOAD PRODUCTS ----------------
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/admin/products`, {
          headers: { "X-Admin-Token": token },
        });
        if (res.status === 401) {
          logout();
          return;
        }
        const data = await res.json();
        setSampleProducts(data.sampleProducts || []);
        setCatalogItems(data.catalogItems || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // ---------------- IMAGE UPLOAD ----------------
  async function uploadImage(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${BACKEND}/admin/upload_image`, {
      method: "POST",
      headers: { "X-Admin-Token": token },
      body: fd,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url; // "/products/<filename>"
  }

  async function handleImageFiles(e, targetField) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadImage(f));
      if (targetField === "image") {
        setDraft((d) => ({ ...d, image: urls[0], images: [urls[0], ...d.images.filter((u) => u !== d.image)] }));
      } else {
        setDraft((d) => ({ ...d, images: [...d.images, ...urls] }));
      }
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
  }

  function removeImage(url) {
    setDraft((d) => ({
      ...d,
      images: d.images.filter((u) => u !== url),
      image: d.image === url ? (d.images.find((u) => u !== url) || "") : d.image,
    }));
  }

  // ---------------- ADD / UPDATE ----------------
  function startEdit(item) {
    setDraft({ ...EMPTY_PRODUCT, ...item });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setDraft(EMPTY_PRODUCT);
    setEditingId(null);
  }

  function saveDraft() {
    if (!draft.title.trim()) {
      alert("Title is required.");
      return;
    }
    const list = tab === "featured" ? sampleProducts : catalogItems;
    const setList = tab === "featured" ? setSampleProducts : setCatalogItems;

    if (editingId) {
      setList(list.map((p) => (p.id === editingId ? { ...draft } : p)));
    } else {
      const newId = draft.id?.trim() || `p${Date.now()}`;
      setList([...list, { ...draft, id: newId }]);
    }
    cancelEdit();
    setSaveMsg("");
  }

  function deleteItem(id) {
    if (!confirm("Delete this product?")) return;
    if (tab === "featured") setSampleProducts((l) => l.filter((p) => p.id !== id));
    else setCatalogItems((l) => l.filter((p) => p.id !== id));
  }

  // ---------------- SAVE TO BACKEND ----------------
  async function saveAll() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`${BACKEND}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify({ sampleProducts, catalogItems }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveMsg("✅ Saved successfully. Refresh the main site to see changes.");
    } catch (err) {
      setSaveMsg("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // ---------------- UI ----------------
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm"
        >
          <h1 className="text-lg font-semibold mb-4 text-slate-800">Admin Login</h1>
          <input
            className="w-full border rounded px-3 py-2 mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && (
            <div className="text-red-500 text-sm mb-3">{loginError}</div>
          )}
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full bg-sky-600 text-white rounded py-2 font-semibold hover:bg-sky-700 disabled:opacity-60"
          >
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  const activeList = tab === "featured" ? sampleProducts : catalogItems;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                localStorage.removeItem("gw_products_dynamic");
                alert(
                  "Local product cache cleared. Refresh the main site if it shows stale data."
                );
              }}
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-300"
            >
              Clear Local Cache
            </button>
            <button
              onClick={saveAll}
              disabled={saving}
              className="bg-emerald-600 text-white px-4 py-2 rounded font-semibold hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save All"}
            </button>
            <button
              onClick={logout}
              className="bg-slate-300 text-slate-800 px-4 py-2 rounded hover:bg-slate-400"
            >
              Logout
            </button>
          </div>
        </div>

        {saveMsg && (
          <div className="mb-4 text-sm text-slate-700">{saveMsg}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setTab("featured"); cancelEdit(); }}
            className={`px-3 py-1 rounded ${tab === "featured" ? "bg-sky-600 text-white" : "bg-white"}`}
          >
            Featured ({sampleProducts.length})
          </button>
          <button
            onClick={() => { setTab("catalog"); cancelEdit(); }}
            className={`px-3 py-1 rounded ${tab === "catalog" ? "bg-sky-600 text-white" : "bg-white"}`}
          >
            Catalog ({catalogItems.length})
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h2 className="font-semibold mb-3 text-slate-800">
            {editingId ? `Edit ${editingId}` : `Add to ${tab === "featured" ? "Featured" : "Catalog"}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              className="border rounded px-3 py-2"
              placeholder="ID (leave blank to auto-generate)"
              value={draft.id}
              onChange={(e) => setDraft({ ...draft, id: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Category"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              type="number"
              placeholder="Ticket Price"
              value={draft.ticketPrice}
              onChange={(e) => setDraft({ ...draft, ticketPrice: Number(e.target.value) })}
            />
            <input
              className="border rounded px-3 py-2"
              type="number"
              placeholder="Market Price"
              value={draft.marketPrice}
              onChange={(e) => setDraft({ ...draft, marketPrice: Number(e.target.value) })}
            />
            <input
              className="border rounded px-3 py-2"
              type="number"
              placeholder="Total Tickets"
              value={draft.totalTickets}
              onChange={(e) => setDraft({ ...draft, totalTickets: Number(e.target.value) })}
            />
          </div>

          <textarea
            className="border rounded px-3 py-2 w-full mb-3"
            rows={5}
            placeholder="Description"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />

          {/* Image upload */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Images (upload multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageFiles(e, "images")}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {draft.images.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url.startsWith("/") ? `${BACKEND}${url}` : url}
                    alt=""
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveDraft}
              className="bg-sky-600 text-white px-4 py-2 rounded font-semibold hover:bg-sky-700"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="bg-slate-300 text-slate-800 px-4 py-2 rounded hover:bg-slate-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="font-semibold mb-3 text-slate-800">
            {tab === "featured" ? "Featured Products" : "Catalog Items"}
          </h2>
          {loading && <div className="text-sm text-slate-500">Loading…</div>}
          <div className="space-y-2">
            {activeList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded p-2"
              >
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image.startsWith("/") ? `${BACKEND}${item.image}` : item.image}
                      alt=""
                      className="w-12 h-12 object-cover rounded border"
                    />
                  )}
                  <div>
                    <div className="font-medium text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">
                      {item.id} · {item.category} · ${item.ticketPrice}/ticket
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-sky-600 text-sm underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 text-sm underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!activeList.length && !loading && (
              <div className="text-sm text-slate-500">
                No products yet. Add one above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
