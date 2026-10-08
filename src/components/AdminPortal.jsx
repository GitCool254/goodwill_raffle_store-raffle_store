import React, { useEffect, useState } from "react";
import {
  FALLBACK_SAMPLE_PRODUCTS,
  FALLBACK_CATALOG_ITEMS,
} from "../data/products";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const TOKEN_KEY = "gw_admin_token";

const EMPTY_DRAFT = {
  id: "",
  title: "",
  category: "",
  description: "",
  ticketPrice: "",
  marketPrice: "",
  totalTickets: "",
  image: "",
  images: [],
};

// ---------- Inline style constants (guaranteed to apply) ----------
const S = {
  page: { minHeight: "100vh", background: "#f1f5f9", padding: "20px 14px", fontFamily: "system-ui, -apple-system, sans-serif" },
  container: { maxWidth: 1100, margin: "0 auto" },

  topbar: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 },
  buttonsRow: { display: "flex", flexWrap: "wrap", gap: 8 },

  btn: { padding: "9px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "opacity 0.15s" },
  btnAmber:   { background: "#f59e0b", color: "#fff" },
  btnEmerald: { background: "#059669", color: "#fff" },
  btnSlate:   { background: "#e2e8f0", color: "#334155" },
  btnSky:     { background: "#0284c7", color: "#fff" },
  btnRed:     { background: "#dc2626", color: "#fff" },
  btnDisabled:{ opacity: 0.55, cursor: "not-allowed" },

  card: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)", padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0" },

  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6, letterSpacing: "0.01em" },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", fontSize: 15, outline: "none", boxSizing: "border-box", background: "#fff", color: "#0f172a" },
  textarea: { width: "100%", border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", fontSize: 15, outline: "none", boxSizing: "border-box", minHeight: 130, fontFamily: "inherit", resize: "vertical", color: "#0f172a" },
  field: { marginBottom: 16 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 4 },

  thumbRow: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 },
  thumbWrap: { position: "relative", display: "inline-block" },
  thumb: { width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0", display: "block" },
  thumbRemove: { position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#dc2626", color: "#fff", border: "2px solid #fff", cursor: "pointer", fontSize: 14, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 },

  tabBar: { display: "flex", gap: 8, marginBottom: 16 },
  tab: { padding: "9px 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#334155" },
  tabActive: { background: "#0284c7", color: "#fff", borderColor: "#0284c7" },

  list: { display: "flex", flexDirection: "column", gap: 10 },
  listItem: { display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, gap: 12, background: "#fff" },
  listLeft: { display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 },
  listThumb: { width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid #e2e8f0", flexShrink: 0, display: "block" },
  listText: { minWidth: 0, flex: 1 },
  listTitle: { fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  listMeta: { fontSize: 12, color: "#64748b" },
  linkBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "4px 6px" },

  msg: { padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14, lineHeight: 1.5 },
  msgSuccess: { background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" },
  msgError:   { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
  msgInfo:    { background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" },

  empty: { padding: 24, textAlign: "center", color: "#64748b", fontSize: 14 },
};

export default function AdminPortal() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState("catalog");
  const [sampleProducts, setSampleProducts] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'success'|'error'|'info', text }
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    } catch {
      setLoginError("Network error — check backend URL.");
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  }

  // ---------------- LOAD ----------------
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/admin/products`, {
          headers: { "X-Admin-Token": token },
        });
        if (res.status === 401) return logout();
        const data = await res.json();
        setSampleProducts(Array.isArray(data.sampleProducts) ? data.sampleProducts : []);
        setCatalogItems(Array.isArray(data.catalogItems) ? data.catalogItems : []);
      } catch (err) {
        setMsg({ type: "error", text: "Failed to load products: " + err.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // ---------------- PERSIST ----------------
  async function persist(nextSample, nextCatalog) {
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify({
          sampleProducts: nextSample,
          catalogItems: nextCatalog,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      // Clear the main site's cached product list so a refresh pulls fresh data
      localStorage.removeItem("gw_products_dynamic");
      setMsg({
        type: "success",
        text: `✅ Saved ${nextSample.length} featured + ${nextCatalog.length} catalog items. Open the main site in a new tab to see the changes.`,
      });
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally {
      setBusy(false);
    }
  }

  // ---------------- SEED ----------------
  function seedFromDefaults() {
    const feat = FALLBACK_SAMPLE_PRODUCTS.length;
    const cat = FALLBACK_CATALOG_ITEMS.length;
    if (feat === 0 && cat === 0) {
      setMsg({ type: "error", text: "No fallback data found in products.js." });
      return;
    }
    if (!confirm(`Load ${feat} featured + ${cat} catalog items into the admin? You'll still need to click Save All.`)) return;
    setSampleProducts([...FALLBACK_SAMPLE_PRODUCTS]);
    setCatalogItems([...FALLBACK_CATALOG_ITEMS]);
    setMsg({
      type: "info",
      text: `Loaded ${feat} featured + ${cat} catalog items into the form. Now click Save All to publish to the backend.`,
    });
  }

  function clearLocalCache() {
    localStorage.removeItem("gw_products_dynamic");
    setMsg({ type: "info", text: "Local product cache cleared. Refresh the main site to force a fresh fetch." });
  }

  // ---------------- IMAGE UPLOAD ----------------
  async function uploadImage(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${BACKEND}/admin/upload_image`, {
      method: "POST",
      headers: { "X-Admin-Token": token },
      body: fd,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Upload failed");
    }
    return (await res.json()).url; // e.g. "/products/abc.jpg"
  }

  async function handleImageFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadImage(f));
      setDraft((d) => ({
        ...d,
        image: d.image || urls[0],
        images: [...d.images, ...urls],
      }));
      setMsg({ type: "info", text: `Uploaded ${urls.length} image(s).` });
    } catch (err) {
      setMsg({ type: "error", text: "Image upload failed: " + err.message });
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-upload of same file
    }
  }

  function removeImage(url) {
    setDraft((d) => {
      const nextImages = d.images.filter((u) => u !== url);
      return {
        ...d,
        images: nextImages,
        image: d.image === url ? (nextImages[0] || "") : d.image,
      };
    });
  }

  // ---------------- ADD / EDIT / DELETE ----------------
  function buildCleanItem() {
    return {
      id: draft.id.trim() || undefined,
      title: draft.title.trim(),
      category: draft.category.trim(),
      description: draft.description,
      ticketPrice: Number(draft.ticketPrice) || 0,
      marketPrice: Number(draft.marketPrice) || 0,
      totalTickets: Number(draft.totalTickets) || 0,
      price: Number(draft.ticketPrice) || 0,
      image: draft.image || (draft.images[0] ?? ""),
      images: draft.images.length ? draft.images : (draft.image ? [draft.image] : []),
    };
  }

  async function addProduct() {
    if (!draft.title.trim()) {
      setMsg({ type: "error", text: "Title is required." });
      return;
    }

    const cleaned = buildCleanItem();
    const newId = cleaned.id || `p${Date.now()}`;
    const newItem = { ...cleaned, id: newId };

    let nextSample = sampleProducts;
    let nextCatalog = catalogItems;

    if (tab === "featured") {
      nextSample = [...sampleProducts, newItem];
      setSampleProducts(nextSample);
    } else {
      nextCatalog = [...catalogItems, newItem];
      setCatalogItems(nextCatalog);
    }

    setDraft(EMPTY_DRAFT);
    setMsg({ type: "info", text: `Added "${newItem.title}". Saving to backend…` });

    await persist(nextSample, nextCatalog);
  }

  async function updateProduct() {
    if (!draft.title.trim()) {
      setMsg({ type: "error", text: "Title is required." });
      return;
    }

    const cleaned = { ...buildCleanItem(), id: editingId };

    let nextSample = sampleProducts;
    let nextCatalog = catalogItems;

    if (tab === "featured") {
      nextSample = sampleProducts.map((p) => (p.id === editingId ? cleaned : p));
      setSampleProducts(nextSample);
    } else {
      nextCatalog = catalogItems.map((p) => (p.id === editingId ? cleaned : p));
      setCatalogItems(nextCatalog);
    }

    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setMsg({ type: "info", text: `Updated "${cleaned.title}". Saving to backend…` });

    await persist(nextSample, nextCatalog);
  }

  async function deleteItem(id) {
    if (!confirm("Delete this product?")) return;

    let nextSample = sampleProducts;
    let nextCatalog = catalogItems;

    if (tab === "featured") {
      nextSample = sampleProducts.filter((p) => p.id !== id);
      setSampleProducts(nextSample);
    } else {
      nextCatalog = catalogItems.filter((p) => p.id !== id);
      setCatalogItems(nextCatalog);
    }

    setMsg({ type: "info", text: "Deleted. Saving to backend…" });
    await persist(nextSample, nextCatalog);
  }

  function startEdit(item) {
    setDraft({
      id: item.id || "",
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      ticketPrice: item.ticketPrice ?? "",
      marketPrice: item.marketPrice ?? "",
      totalTickets: item.totalTickets ?? "",
      image: item.image || "",
      images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
    });
    setEditingId(item.id);
    setMsg({ type: "info", text: `Editing "${item.title}"` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setMsg(null);
  }

  async function saveAll() {
    setMsg({ type: "info", text: "Saving…" });
    await persist(sampleProducts, catalogItems);
  }

  // ---------------- IMAGE URL HELPER ----------------
  function imgSrc(url) {
    if (!url) return "";
    return url.startsWith("/") ? `${BACKEND}${url}` : url;
  }

  // ---------------- LOGIN SCREEN ----------------
  if (!token) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={handleLogin} style={{ ...S.card, width: "100%", maxWidth: 380, marginBottom: 0 }}>
          <h1 style={{ ...S.sectionTitle, fontSize: 20, textAlign: "center" }}>Admin Login</h1>
          <div style={S.field}>
            <label style={S.label}>Username</label>
            <input style={S.input} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {loginError && <div style={{ ...S.msg, ...S.msgError, marginBottom: 12 }}>{loginError}</div>}
          <button type="submit" disabled={loggingIn} style={{ ...S.btn, ...S.btnSky, width: "100%", ...(loggingIn ? S.btnDisabled : {}) }}>
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------
  const activeList = tab === "featured" ? sampleProducts : catalogItems;

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Top bar */}
        <div style={S.topbar}>
          <h1 style={S.title}>Admin Portal</h1>
          <div style={S.buttonsRow}>
            <button style={{ ...S.btn, ...S.btnAmber }} onClick={seedFromDefaults}>Seed from Defaults</button>
            <button style={{ ...S.btn, ...S.btnSlate }} onClick={clearLocalCache}>Clear Local Cache</button>
            <button style={{ ...S.btn, ...S.btnEmerald, ...(busy ? S.btnDisabled : {}) }} onClick={saveAll} disabled={busy}>
              {busy ? "Saving…" : "Save All"}
            </button>
            <button style={{ ...S.btn, ...S.btnSlate }} onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Feedback message */}
        {msg && (
          <div style={{ ...S.msg, ...(msg.type === "success" ? S.msgSuccess : msg.type === "error" ? S.msgError : S.msgInfo) }}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div style={S.tabBar}>
          <button
            style={{ ...S.tab, ...(tab === "featured" ? S.tabActive : {}) }}
            onClick={() => { setTab("featured"); cancelEdit(); }}
          >
            Featured ({sampleProducts.length})
          </button>
          <button
            style={{ ...S.tab, ...(tab === "catalog" ? S.tabActive : {}) }}
            onClick={() => { setTab("catalog"); cancelEdit(); }}
          >
            Catalog ({catalogItems.length})
          </button>
        </div>

        {/* Form */}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>
            {editingId ? `Edit "${draft.title || editingId}"` : `Add to ${tab === "featured" ? "Featured" : "Catalog"}`}
          </h2>

          <div style={S.grid2}>
            <div>
              <label style={S.label}>Product ID</label>
              <input
                style={S.input}
                placeholder="Leave blank to auto-generate"
                value={draft.id}
                onChange={(e) => setDraft({ ...draft, id: e.target.value })}
              />
            </div>
            <div>
              <label style={S.label}>Title *</label>
              <input
                style={S.input}
                placeholder="e.g. Beachcroft Patio Set"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <div>
              <label style={S.label}>Category</label>
              <input
                style={S.input}
                placeholder="e.g. Furniture"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </div>
            <div>
              <label style={S.label}>Ticket Price (USD)</label>
              <input
                style={S.input}
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={draft.ticketPrice}
                onChange={(e) => setDraft({ ...draft, ticketPrice: e.target.value })}
              />
            </div>
            <div>
              <label style={S.label}>Market Price (USD)</label>
              <input
                style={S.input}
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={draft.marketPrice}
                onChange={(e) => setDraft({ ...draft, marketPrice: e.target.value })}
              />
            </div>
            <div>
              <label style={S.label}>Total Tickets</label>
              <input
                style={S.input}
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={draft.totalTickets}
                onChange={(e) => setDraft({ ...draft, totalTickets: e.target.value })}
              />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Description</label>
            <textarea
              style={S.textarea}
              placeholder="Enter product description…"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleImageFiles}
            />
            {uploading && (
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>Uploading…</div>
            )}
            {draft.images.length > 0 && (
              <div style={S.thumbRow}>
                {draft.images.map((url) => (
                  <div key={url} style={S.thumbWrap}>
                    <img src={imgSrc(url)} alt="" style={S.thumb} />
                    <button
                      type="button"
                      style={S.thumbRemove}
                      onClick={() => removeImage(url)}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={S.buttonsRow}>
            {editingId ? (
              <>
                <button
                  style={{ ...S.btn, ...S.btnSky, ...(busy ? S.btnDisabled : {}) }}
                  onClick={updateProduct}
                  disabled={busy}
                >
                  {busy ? "Saving…" : "Update Product"}
                </button>
                <button style={{ ...S.btn, ...S.btnSlate }} onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <button
                style={{ ...S.btn, ...S.btnSky, ...(busy ? S.btnDisabled : {}) }}
                onClick={addProduct}
                disabled={busy}
              >
                {busy ? "Saving…" : "Add Product"}
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>
            {tab === "featured" ? "Featured Products" : "Catalog Items"} ({activeList.length})
          </h2>

          {loading && <div style={S.empty}>Loading…</div>}

          {!loading && activeList.length === 0 && (
            <div style={S.empty}>
              No products yet. Click <strong>Seed from Defaults</strong> above to load the built-in list.
            </div>
          )}

          {!loading && activeList.length > 0 && (
            <div style={S.list}>
              {activeList.map((item) => (
                <div key={item.id} style={S.listItem}>
                  <div style={S.listLeft}>
                    {item.image ? (
                      <img src={imgSrc(item.image)} alt="" style={S.listThumb} />
                    ) : (
                      <div style={{ ...S.listThumb, background: "#f1f5f9" }} />
                    )}
                    <div style={S.listText}>
                      <div style={S.listTitle}>{item.title}</div>
                      <div style={S.listMeta}>
                        {item.id} · {item.category || "—"} · ${item.ticketPrice ?? 0}/ticket
                      </div>
                    </div>
                  </div>
                  <div style={S.buttonsRow}>
                    <button style={{ ...S.linkBtn, color: "#0284c7" }} onClick={() => startEdit(item)}>Edit</button>
                    <button style={{ ...S.linkBtn, color: "#dc2626" }} onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
