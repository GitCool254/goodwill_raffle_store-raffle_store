import React, { useEffect, useRef, useState } from "react";
import {
  FALLBACK_SAMPLE_PRODUCTS,
  FALLBACK_CATALOG_ITEMS,
} from "../data/products";
import { FALLBACK_DONATION_PROGRAMS } from "../data/donations";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const TOKEN_KEY = "gw_admin_token";
const IDLE_MS = 15 * 60 * 1000;  // 15-minute idle auto-logout

function formatCountdown(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

const EMPTY_PRODUCT = {
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

const EMPTY_DONATION = {
  id: "",
  title: "",
  description: "",
  quote: "",
  quoteName: "",
  quotePosition: "",
  overlayImage: "",
  images: [],
};

// ---------- Inline style constants ----------
const S = {
  page: { minHeight: "100vh", background: "#f1f5f9", padding: "20px 14px", fontFamily: "system-ui, -apple-system, sans-serif" },
  container: { maxWidth: 1100, margin: "0 auto" },

  topbar: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 },
  buttonsRow: { display: "flex", flexWrap: "wrap", gap: 8 },

  btn: { padding: "9px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnAmber:   { background: "#f59e0b", color: "#fff" },
  btnEmerald: { background: "#059669", color: "#fff" },
  btnSlate:   { background: "#e2e8f0", color: "#334155" },
  btnSky:     { background: "#0284c7", color: "#fff" },
  btnDisabled:{ opacity: 0.55, cursor: "not-allowed" },

  card: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)", padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0" },

  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 },
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

function imgSrc(url) {
  if (!url) return "";
  return url.startsWith("/products/") ? `${BACKEND}${url}` : url;
}

export default function AdminPortal() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [me, setMe] = useState(null);
  const lastActivityMs = useRef(Date.now());

  // Idle auto-logout (15 min of inactivity)
  useEffect(() => {
    if (!token) return;
    lastActivityMs.current = Date.now();
    const bump = () => { lastActivityMs.current = Date.now(); };
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const id = setInterval(() => {
      if (Date.now() - lastActivityMs.current > IDLE_MS) {
        clearInterval(id);
        logout();
      }
    }, 30000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(id);
    };
  }, [token]);

  // Fetch current identity on mount (and when token changes)
  useEffect(() => {
    if (!token) { setMe(null); return; }
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/team/me`, { headers: { "X-Admin-Token": token } });
        if (!res.ok) return;
        const data = await res.json();
        setMe({ username: data.username, role: data.role, is_root: !!data.is_root });
      } catch {}
    })();
  }, [token]);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Reset-password flow (OTP via SMSGate)
  const [resetMode, setResetMode] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [otpUsername, setOtpUsername] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetPhoneMask, setResetPhoneMask] = useState("");
  const [resetMsg, setResetMsg] = useState(null);
  const [resetting, setResetting] = useState(false);

  const [tab, setTab] = useState("catalog"); // "featured" | "catalog" | "donations"

  const [sampleProducts, setSampleProducts] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [donations, setDonations] = useState([]);

  const [draftP, setDraftP] = useState(EMPTY_PRODUCT);
  const [editingProductId, setEditingProductId] = useState(null);

  const [draftD, setDraftD] = useState(EMPTY_DONATION);
  const [editingDonationId, setEditingDonationId] = useState(null);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Raffle campaign + UI toggles state
  const [raffleState, setRaffleState] = useState(null);
  const [raffleInitialInput, setRaffleInitialInput] = useState(250);
  const [uiToggles, setUiToggles] = useState(null);
  const [uiTogglesOverridden, setUiTogglesOverridden] = useState([]);

  // ---- Recent Winners editor state ----
  const [recentWinnersEdit, setRecentWinnersEdit] = useState([]);
  const [recentWinnersSaving, setRecentWinnersSaving] = useState(false);

  // ---- Winners Detail editor state ----
  const [winnersDetailEdit, setWinnersDetailEdit] = useState([]);
  const [winnersDetailSaving, setWinnersDetailSaving] = useState(false);

  // Fetch editor data (admin view) on token change
  useEffect(() => {
    if (!token) { setRecentWinnersEdit([]); setWinnersDetailEdit([]); return; }
    (async () => {
      try {
        const [rwRes, wdRes] = await Promise.all([
          fetch(`${BACKEND}/admin/recent-winners-data`, { headers: { "X-Admin-Token": token } }),
          fetch(`${BACKEND}/admin/winners-detail-data`, { headers: { "X-Admin-Token": token } }),
        ]);
        if (rwRes.ok) {
          const rwd = await rwRes.json();
          setRecentWinnersEdit(Array.isArray(rwd.winners) ? rwd.winners : []);
        }
        if (wdRes.ok) {
          const wdd = await wdRes.json();
          setWinnersDetailEdit(Array.isArray(wdd.winners) ? wdd.winners : []);
        }
      } catch {}
    })();
  }, [token]);

  async function saveRecentWinners() {
    if (!token) return;
    setRecentWinnersSaving(true);
    try {
      const res = await fetch(`${BACKEND}/admin/recent-winners-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ winners: recentWinnersEdit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMsg({ type: "success", text: `\u2705 Recent winners saved (${recentWinnersEdit.length} entries)` });
    } catch (err) {
      setMsg({ type: "error", text: "\u274c " + err.message });
    } finally {
      setRecentWinnersSaving(false);
    }
  }

  async function saveWinnersDetail() {
    if (!token) return;
    setWinnersDetailSaving(true);
    try {
      const res = await fetch(`${BACKEND}/admin/winners-detail-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ winners: winnersDetailEdit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMsg({ type: "success", text: `\u2705 Winners detail saved (${winnersDetailEdit.length} entries)` });
    } catch (err) {
      setMsg({ type: "error", text: "\u274c " + err.message });
    } finally {
      setWinnersDetailSaving(false);
    }
  }

  function addRecentWinnerRow() {
    setRecentWinnersEdit([...recentWinnersEdit, { name: "", state: "", country: "Australia", prize: "", cash_out: false, date_claimed: "", ticket_no: "" }]);
  }

  function removeRecentWinnerRow(idx) {
    setRecentWinnersEdit(recentWinnersEdit.filter((_, i) => i !== idx));
  }

  function updateRecentWinnerField(idx, field, value) {
    setRecentWinnersEdit(recentWinnersEdit.map((w, i) => i === idx ? { ...w, [field]: value } : w));
  }

  function addWinnersDetailRow() {
    setWinnersDetailEdit([...winnersDetailEdit, { name: "", date: "", ticketNo: "", product: "", winnerImg: "", productImg: "", verified: true, countryFlag: "\U0001F1E6\U0001F1FA", location: "" }]);
  }

  function removeWinnersDetailRow(idx) {
    setWinnersDetailEdit(winnersDetailEdit.filter((_, i) => i !== idx));
  }

  function updateWinnersDetailField(idx, field, value) {
    setWinnersDetailEdit(winnersDetailEdit.map((w, i) => i === idx ? { ...w, [field]: value } : w));
  }

  async function seedWinnersDetailDefaults() {
    try {
      const mod = await import("../data/winnersDefaults");
      setWinnersDetailEdit(JSON.parse(JSON.stringify(mod.WINNERS_DETAIL_DEFAULTS)));
      setMsg({ type: "info", text: "Seeded with defaults \u2014 click Save Winners Detail to persist." });
    } catch (e) {
      setMsg({ type: "error", text: "\u274c Could not load defaults: " + e.message });
    }
  }

  // ---- login ----
  async function handleLogin(e) {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) return;
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
        setMe({ username: data.username, role: data.role, is_root: !!data.is_root });
        setLockedUntil(null);
        setSecondsRemaining(0);
      } else if (res.status === 429 && data.locked) {
        const until = data.locked_until
          ? new Date(data.locked_until).getTime()
          : Date.now() + (data.seconds_remaining || 900) * 1000;
        setLockedUntil(until);
        setSecondsRemaining(data.seconds_remaining || Math.round((until - Date.now()) / 1000));
        setLoginError(data.error || "Account locked.");
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Network error — check backend URL.");
    } finally {
      setLoggingIn(false);
    }
  }

  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const remaining = Math.max(0, Math.round((lockedUntil - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        setLockedUntil(null);
        setLoginError("");
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  function logout() {
    if (token) {
      fetch(`${BACKEND}/team/logout`, {
        method: "POST",
        headers: { "X-Admin-Token": token },
      }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setMe(null);
  }

  // ---- reset-password handlers ----
  async function handleRequestOtp(e) {
    e.preventDefault();
    setResetMsg(null);
    setResetting(true);
    try {
      const res = await fetch(`${BACKEND}/auth/request-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: otpUsername }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetMsg({ type: "error", text: data.error || "Could not send code" });
      } else {
        setResetPhoneMask(data.phone_masked || "");
        setResetStep(2);
        setResetMsg({ type: "info", text: data.message || "If this account exists, an OTP was sent." });
      }
    } catch {
      setResetMsg({ type: "error", text: "Network error — check backend URL." });
    } finally {
      setResetting(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setResetMsg(null);
    setResetting(true);
    try {
      const res = await fetch(`${BACKEND}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: otpUsername, otp: otpCode, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetMsg({ type: "error", text: data.error || "Could not reset password" });
      } else {
        setResetMsg({ type: "success", text: data.message || "Password updated. You can log in now." });
        setResetMode(false);
        setResetStep(1);
        setOtpCode("");
        setNewPassword("");
        setResetPhoneMask("");
      }
    } catch {
      setResetMsg({ type: "error", text: "Network error — check backend URL." });
    } finally {
      setResetting(false);
    }
  }

  function cancelReset() {
    setResetMode(false);
    setResetStep(1);
    setOtpCode("");
    setNewPassword("");
    setResetMsg(null);
    setResetPhoneMask("");
  }

  // ---- load all three ----
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const [pRes, dRes] = await Promise.all([
          fetch(`${BACKEND}/admin/products`, { headers: { "X-Admin-Token": token } }),
          fetch(`${BACKEND}/admin/donations`, { headers: { "X-Admin-Token": token } }),
        ]);
        if (pRes.status === 401 || dRes.status === 401) return logout();

        const pData = await pRes.json();
        setSampleProducts(Array.isArray(pData.sampleProducts) ? pData.sampleProducts : []);
        setCatalogItems(Array.isArray(pData.catalogItems) ? pData.catalogItems : []);

        const dData = await dRes.json();
        setDonations(Array.isArray(dData.programs) ? dData.programs : []);
      } catch (err) {
        setMsg({ type: "error", text: "Load failed: " + err.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Fetch raffle campaign state
  useEffect(() => {
    if (!token) { setRaffleState(null); return; }
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/admin/raffle/state`, { headers: { "X-Admin-Token": token } });
        if (!res.ok) return;
        const data = await res.json();
        setRaffleState(data);
        if (!data.is_active && data.initial_tickets) {
          setRaffleInitialInput(data.initial_tickets);
        }
      } catch {}
    })();
  }, [token]);

  // Fetch UI toggles
  useEffect(() => {
    if (!token) { setUiToggles(null); setUiTogglesOverridden([]); return; }
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/admin/ui-toggles`, { headers: { "X-Admin-Token": token } });
        if (!res.ok) return;
        const data = await res.json();
        setUiToggles(data.toggles || null);
        setUiTogglesOverridden(data.overridden || []);
      } catch {}
    })();
  }, [token]);

  async function startCampaign() {
    if (!token) return;
    const n = parseInt(raffleInitialInput, 10);
    if (!Number.isInteger(n) || n < 1 || n > 1000000) {
      setMsg({ type: "error", text: "Initial tickets must be between 1 and 1,000,000" });
      return;
    }
    if (!window.confirm(`Start a new campaign with ${n} tickets? This will reset the sales ledger for the new campaign (audit history preserved).`)) return;
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND}/admin/raffle/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ initial_tickets: n }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Start failed");
      setMsg({ type: "success", text: `✅ Campaign started with ${n} tickets` });
      const stateRes = await fetch(`${BACKEND}/admin/raffle/state`, { headers: { "X-Admin-Token": token } });
      if (stateRes.ok) setRaffleState(await stateRes.json());
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally {
      setBusy(false);
    }
  }

  async function endCampaign() {
    if (!token) return;
    if (!window.confirm("End the current campaign? Remaining tickets will be set to 0.")) return;
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND}/admin/raffle/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "End failed");
      setMsg({ type: "success", text: "✅ Campaign ended" });
      const stateRes = await fetch(`${BACKEND}/admin/raffle/state`, { headers: { "X-Admin-Token": token } });
      if (stateRes.ok) setRaffleState(await stateRes.json());
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally {
      setBusy(false);
    }
  }

  async function flipToggle(key, value) {
    if (!token) return;
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND}/admin/ui-toggles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Toggle failed");
      setMsg({ type: "success", text: `✅ Toggle "${key}" set to ${value}` });
      const togglesRes = await fetch(`${BACKEND}/admin/ui-toggles`, { headers: { "X-Admin-Token": token } });
      if (togglesRes.ok) {
        const td = await togglesRes.json();
        setUiToggles(td.toggles || null);
        setUiTogglesOverridden(td.overridden || []);
      }
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally {
      setBusy(false);
    }
  }

  // ---- persist products ----
  async function persistProducts(nextSample, nextCatalog) {
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ sampleProducts: nextSample, catalogItems: nextCatalog }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed");
      localStorage.removeItem("gw_products_dynamic");
      setMsg({ type: "success", text: `✅ Saved ${nextSample.length} featured + ${nextCatalog.length} catalog items. Refresh the main site.` });
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally {
      setBusy(false);
    }
  }

  // ---- persist donations ----
  async function persistDonations(nextDonations) {
    setBusy(true);
    try {
      const res = await fetch(`${BACKEND}/admin/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ programs: nextDonations }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed");
      setMsg({ type: "success", text: `✅ Saved ${nextDonations.length} donation programs. Refresh the main site.` });
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally {
      setBusy(false);
    }
  }

  function seedDonationsFromDefaults() {
    const count = FALLBACK_DONATION_PROGRAMS.length;
    if (count === 0) {
      setMsg({ type: "error", text: "No fallback donation data found." });
      return;
    }
    if (!confirm(`Load ${count} donation programs into the admin? You'll still need to click Save All.`)) {
      return;
    }
    setDonations([...FALLBACK_DONATION_PROGRAMS]);
    setMsg({
      type: "info",
      text: `Loaded ${count} donation programs into the form. Now click Save All to publish to the backend.`,
    });
  }
  
  // ---- seed products ----
  function seedFromDefaults() {
    const feat = FALLBACK_SAMPLE_PRODUCTS.length;
    const cat = FALLBACK_CATALOG_ITEMS.length;
    if (feat === 0 && cat === 0) {
      setMsg({ type: "error", text: "No fallback product data found." });
      return;
    }
    if (!confirm(`Load ${feat} featured + ${cat} catalog items?`)) return;
    setSampleProducts([...FALLBACK_SAMPLE_PRODUCTS]);
    setCatalogItems([...FALLBACK_CATALOG_ITEMS]);
    setMsg({ type: "info", text: `Loaded ${feat} + ${cat} into admin. Click Save All to publish.` });
  }

  function clearLocalCache() {
    localStorage.removeItem("gw_products_dynamic");
    setMsg({ type: "info", text: "Local product cache cleared." });
  }

  // ---- uploads ----
  async function uploadImage(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${BACKEND}/admin/upload_image`, {
      method: "POST",
      headers: { "X-Admin-Token": token },
      body: fd,
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed");
    return (await res.json()).url;
  }

  async function handleProductImages(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadImage(f));
      setDraftP((d) => ({ ...d, image: d.image || urls[0], images: [...d.images, ...urls] }));
      setMsg({ type: "info", text: `Uploaded ${urls.length} image(s).` });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDonationImages(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadImage(f));
      setDraftD((d) => ({ ...d, images: [...d.images, ...urls] }));
      setMsg({ type: "info", text: `Uploaded ${urls.length} image(s).` });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDonationOverlay(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setDraftD((d) => ({ ...d, overlayImage: url }));
      setMsg({ type: "info", text: "Overlay image uploaded." });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeProductImage(url) {
    setDraftP((d) => {
      const next = d.images.filter((u) => u !== url);
      return { ...d, images: next, image: d.image === url ? (next[0] || "") : d.image };
    });
  }

  function removeDonationImage(url) {
    setDraftD((d) => ({ ...d, images: d.images.filter((u) => u !== url) }));
  }

  // ---- product add/edit/delete ----
  function cleanProduct() {
    return {
      id: draftP.id.trim() || undefined,
      title: draftP.title.trim(),
      category: draftP.category.trim(),
      description: draftP.description,
      ticketPrice: Number(draftP.ticketPrice) || 0,
      marketPrice: Number(draftP.marketPrice) || 0,
      totalTickets: Number(draftP.totalTickets) || 0,
      price: Number(draftP.ticketPrice) || 0,
      image: draftP.image || (draftP.images[0] ?? ""),
      images: draftP.images.length ? draftP.images : (draftP.image ? [draftP.image] : []),
    };
  }

  async function addProduct() {
    if (!draftP.title.trim()) return setMsg({ type: "error", text: "Title is required." });
    const item = { ...cleanProduct(), id: draftP.id.trim() || `p${Date.now()}` };
    let nextSample = sampleProducts;
    let nextCatalog = catalogItems;
    if (tab === "featured") {
      nextSample = [...sampleProducts, item];
      setSampleProducts(nextSample);
    } else {
      nextCatalog = [...catalogItems, item];
      setCatalogItems(nextCatalog);
    }
    setDraftP(EMPTY_PRODUCT);
    setMsg({ type: "info", text: `Added "${item.title}". Saving…` });
    await persistProducts(nextSample, nextCatalog);
  }

  async function updateProduct() {
    if (!draftP.title.trim()) return setMsg({ type: "error", text: "Title is required." });
    const item = { ...cleanProduct(), id: editingProductId };
    let nextSample = sampleProducts;
    let nextCatalog = catalogItems;
    if (tab === "featured") {
      nextSample = sampleProducts.map((p) => (p.id === editingProductId ? item : p));
      setSampleProducts(nextSample);
    } else {
      nextCatalog = catalogItems.map((p) => (p.id === editingProductId ? item : p));
      setCatalogItems(nextCatalog);
    }
    setDraftP(EMPTY_PRODUCT);
    setEditingProductId(null);
    setMsg({ type: "info", text: `Updated "${item.title}". Saving…` });
    await persistProducts(nextSample, nextCatalog);
  }

  async function deleteProduct(id) {
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
    await persistProducts(nextSample, nextCatalog);
  }

  function startEditProduct(item) {
    setDraftP({
      id: item.id || "",
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      ticketPrice: item.ticketPrice ?? "",
      marketPrice: item.marketPrice ?? "",
      totalTickets: item.totalTickets ?? "",
      image: item.image || "",
      images: Array.isArray(item.images) ? item.images : item.image ? [item.image] : [],
    });
    setEditingProductId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelProductEdit() {
    setDraftP(EMPTY_PRODUCT);
    setEditingProductId(null);
  }

  // ---- donation add/edit/delete ----
  function cleanDonation() {
    return {
      id: draftD.id.trim() || undefined,
      title: draftD.title.trim(),
      description: draftD.description,
      quote: draftD.quote,
      quoteName: draftD.quoteName,
      quotePosition: draftD.quotePosition,
      overlayImage: draftD.overlayImage || draftD.images[0] || "",
      image: draftD.images[0] || "",
      images: draftD.images,
    };
  }

  async function addDonation() {
    if (!draftD.title.trim()) return setMsg({ type: "error", text: "Title is required." });
    const item = { ...cleanDonation(), id: draftD.id.trim() || Date.now() };
    const next = [...donations, item];
    setDonations(next);
    setDraftD(EMPTY_DONATION);
    setMsg({ type: "info", text: `Added "${item.title}". Saving…` });
    await persistDonations(next);
  }

  async function updateDonation() {
    if (!draftD.title.trim()) return setMsg({ type: "error", text: "Title is required." });
    const item = { ...cleanDonation(), id: editingDonationId };
    const next = donations.map((p) => (p.id === editingDonationId ? item : p));
    setDonations(next);
    setDraftD(EMPTY_DONATION);
    setEditingDonationId(null);
    setMsg({ type: "info", text: `Updated "${item.title}". Saving…` });
    await persistDonations(next);
  }

  async function deleteDonation(id) {
    if (!confirm("Delete this donation program?")) return;
    const next = donations.filter((p) => p.id !== id);
    setDonations(next);
    await persistDonations(next);
  }

  function startEditDonation(item) {
    setDraftD({
      id: item.id ?? "",
      title: item.title || "",
      description: item.description || "",
      quote: item.quote || "",
      quoteName: item.quoteName || "",
      quotePosition: item.quotePosition || "",
      overlayImage: item.overlayImage || "",
      images: Array.isArray(item.images) ? item.images : [],
    });
    setEditingDonationId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelDonationEdit() {
    setDraftD(EMPTY_DONATION);
    setEditingDonationId(null);
  }

  async function saveAll() {
    setMsg({ type: "info", text: "Saving…" });
    if (tab === "donations") {
      await persistDonations(donations);
    } else {
      await persistProducts(sampleProducts, catalogItems);
    }
  }

  // ---- RESET PASSWORD CARD ----
  if (!token && resetMode) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...S.card, width: "100%", maxWidth: 400, marginBottom: 0 }}>
          <h1 style={{ ...S.sectionTitle, fontSize: 20, textAlign: "center" }}>Reset Admin Password</h1>

          {resetStep === 1 && (
            <form onSubmit={handleRequestOtp}>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
                Enter your admin username. We will send a 6-digit code to the phone on file.
              </p>
              <div style={S.field}>
                <label style={S.label}>Username</label>
                <input style={S.input} value={otpUsername} onChange={(e) => setOtpUsername(e.target.value)} autoComplete="username" required />
              </div>
              {resetMsg && <div style={{ ...S.msg, ...(resetMsg.type === "error" ? S.msgError : resetMsg.type === "success" ? S.msgSuccess : S.msgInfo), marginBottom: 12 }}>{resetMsg.text}</div>}
              <button type="submit" disabled={resetting} style={{ ...S.btn, ...S.btnSky, width: "100%", ...(resetting ? S.btnDisabled : {}) }}>
                {resetting ? "Sending…" : "Send OTP"}
              </button>
            </form>
          )}

          {resetStep === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
                OTP sent{resetPhoneMask ? ` to ${resetPhoneMask}` : ""}. Enter the code and your new password.
              </p>
              <div style={S.field}>
                <label style={S.label}>OTP code</label>
                <input style={S.input} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" required />
              </div>
              <div style={S.field}>
                <label style={S.label}>New password (min 8 chars)</label>
                <input style={S.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" required />
              </div>
              {resetMsg && <div style={{ ...S.msg, ...(resetMsg.type === "error" ? S.msgError : resetMsg.type === "success" ? S.msgSuccess : S.msgInfo), marginBottom: 12 }}>{resetMsg.text}</div>}
              <button type="submit" disabled={resetting} style={{ ...S.btn, ...S.btnEmerald, width: "100%", ...(resetting ? S.btnDisabled : {}) }}>
                {resetting ? "Updating…" : "Update password"}
              </button>
            </form>
          )}

          <button type="button" onClick={cancelReset} style={{ ...S.btn, ...S.btnSlate, width: "100%", marginTop: 10 }}>
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  // ---- LOGIN SCREEN ----
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
          {lockedUntil && secondsRemaining > 0 && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>🔒</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>Account Locked</div>
                <div style={{ fontSize: 13, color: "#7f1d1d", lineHeight: 1.5 }}>
                  Too many failed login attempts. Try again in <strong>{formatCountdown(secondsRemaining)}</strong>.
                </div>
              </div>
            </div>
          )}
          {loginError && !(lockedUntil && secondsRemaining > 0) && <div style={{ ...S.msg, ...S.msgError, marginBottom: 12 }}>{loginError}</div>}
          <button type="submit" disabled={loggingIn || (lockedUntil && secondsRemaining > 0)} style={{ ...S.btn, ...S.btnSky, width: "100%", ...((loggingIn || (lockedUntil && secondsRemaining > 0)) ? S.btnDisabled : {}) }}>
            {lockedUntil && secondsRemaining > 0 ? `Locked (${formatCountdown(secondsRemaining)})` : loggingIn ? "Signing in…" : "Sign in"}
          </button>
          <p style={{ textAlign: "center", marginTop: 14, marginBottom: 0, fontSize: 13 }}>
            <button type="button" onClick={() => { setResetMode(true); setResetMsg(null); setOtpUsername(username); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#0284c7", fontWeight: 600, padding: 0, fontSize: 13 }}>
              Forgot password?
            </button>
          </p>
        </form>
      </div>
    );
  }

  // ---- MAIN UI ----
  const activeProductList = tab === "featured" ? sampleProducts : catalogItems;

  return (
    <div style={S.page}>
      <div style={S.container}>
        {me && me.username && (
          <div style={{
            background: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
            color: "#fff",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            boxShadow: "0 2px 8px rgba(3,105,161,0.15)",
            fontSize: 14,
            fontWeight: 500,
          }}>
            <span>
              Signed in as <strong style={{ fontWeight: 700 }}>{me.username}</strong>
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", opacity: 0.8, textTransform: "uppercase" }}>
              Admin
            </span>
          </div>
        )}
        {/* Top bar */}
        <div style={S.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/icon-tab.png"
              alt="Goodwillstores logo"
              style={{ height: 32, width: "auto", display: "block" }}
            />
            <h1 style={S.title}>Admin Portal</h1>
          </div>
          <div style={S.buttonsRow}>
            {tab === "donations" ? (
              <button style={{ ...S.btn, ...S.btnAmber }} onClick={seedDonationsFromDefaults}>
                Seed Donations from Defaults
              </button>
            ) : (
              <button style={{ ...S.btn, ...S.btnAmber }} onClick={seedFromDefaults}>
                Seed from Defaults
              </button>
            )}
            <button style={{ ...S.btn, ...S.btnSlate }} onClick={clearLocalCache}>Clear Local Cache</button>
            <button
              style={{ ...S.btn, ...S.btnEmerald, ...(busy ? S.btnDisabled : {}) }}
              onClick={saveAll}
              disabled={busy}
            >
              {busy ? "Saving…" : "Save All"}
            </button>
            <button
              onClick={logout}
              title="Sign out"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                background: "#fff",
                border: "1px solid #cbd5e1",
                color: "#334155",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#dc2626";
                e.currentTarget.style.color = "#dc2626";
                e.currentTarget.style.background = "#fef2f2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = "#334155";
                e.currentTarget.style.background = "#fff";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {msg && (
          <div style={{ ...S.msg, ...(msg.type === "success" ? S.msgSuccess : msg.type === "error" ? S.msgError : S.msgInfo) }}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div style={S.tabBar}>
          <button
            style={{ ...S.tab, ...(tab === "featured" ? S.tabActive : {}) }}
            onClick={() => { setTab("featured"); cancelProductEdit(); cancelDonationEdit(); }}
          >
            Featured ({sampleProducts.length})
          </button>
          <button
            style={{ ...S.tab, ...(tab === "catalog" ? S.tabActive : {}) }}
            onClick={() => { setTab("catalog"); cancelProductEdit(); cancelDonationEdit(); }}
          >
            Catalog ({catalogItems.length})
          </button>
          <button
            style={{ ...S.tab, ...(tab === "donations" ? S.tabActive : {}) }}
            onClick={() => { setTab("donations"); cancelProductEdit(); cancelDonationEdit(); }}
          >
            Donations ({donations.length})
          </button>
        </div>

        {/* ============= PRODUCT FORM (featured/catalog) ============= */}
        {tab !== "donations" && (
          <>
            <div style={S.card}>
              <h2 style={S.sectionTitle}>
                {editingProductId ? `Edit "${draftP.title || editingProductId}"` : `Add to ${tab === "featured" ? "Featured" : "Catalog"}`}
              </h2>

              <div style={S.grid2}>
                <div>
                  <label style={S.label}>Product ID</label>
                  <input style={S.input} placeholder="Leave blank to auto-generate" value={draftP.id} onChange={(e) => setDraftP({ ...draftP, id: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Title *</label>
                  <input style={S.input} placeholder="e.g. Beachcroft Patio Set" value={draftP.title} onChange={(e) => setDraftP({ ...draftP, title: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Category</label>
                  <input style={S.input} placeholder="e.g. Furniture" value={draftP.category} onChange={(e) => setDraftP({ ...draftP, category: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Ticket Price (USD)</label>
                  <input style={S.input} type="number" min="0" step="1" placeholder="0" value={draftP.ticketPrice} onChange={(e) => setDraftP({ ...draftP, ticketPrice: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Market Price (USD)</label>
                  <input style={S.input} type="number" min="0" step="1" placeholder="0" value={draftP.marketPrice} onChange={(e) => setDraftP({ ...draftP, marketPrice: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Total Tickets</label>
                  <input style={S.input} type="number" min="0" step="1" placeholder="0" value={draftP.totalTickets} onChange={(e) => setDraftP({ ...draftP, totalTickets: e.target.value })} />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Description</label>
                <textarea style={S.textarea} placeholder="Enter product description…" value={draftP.description} onChange={(e) => setDraftP({ ...draftP, description: e.target.value })} />
              </div>

              <div style={S.field}>
                <label style={S.label}>Images</label>
                <input type="file" accept="image/*" multiple disabled={uploading} onChange={handleProductImages} />
                {uploading && <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>Uploading…</div>}
                {draftP.images.length > 0 && (
                  <div style={S.thumbRow}>
                    {draftP.images.map((url) => (
                      <div key={url} style={S.thumbWrap}>
                        <img src={imgSrc(url)} alt="" style={S.thumb} />
                        <button type="button" style={S.thumbRemove} onClick={() => removeProductImage(url)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={S.buttonsRow}>
                {editingProductId ? (
                  <>
                    <button style={{ ...S.btn, ...S.btnSky, ...(busy ? S.btnDisabled : {}) }} onClick={updateProduct} disabled={busy}>
                      {busy ? "Saving…" : "Update Product"}
                    </button>
                    <button style={{ ...S.btn, ...S.btnSlate }} onClick={cancelProductEdit}>Cancel</button>
                  </>
                ) : (
                  <button style={{ ...S.btn, ...S.btnSky, ...(busy ? S.btnDisabled : {}) }} onClick={addProduct} disabled={busy}>
                    {busy ? "Saving…" : "Add Product"}
                  </button>
                )}
              </div>
            </div>

            <div style={S.card}>
              <h2 style={S.sectionTitle}>
                {tab === "featured" ? "Featured Products" : "Catalog Items"} ({activeProductList.length})
              </h2>

              {loading && <div style={S.empty}>Loading…</div>}

              {!loading && activeProductList.length === 0 && (
                <div style={S.empty}>
                  No products yet. Click <strong>Seed from Defaults</strong> above to load the built-in list.
                </div>
              )}

              {!loading && activeProductList.length > 0 && (
                <div style={S.list}>
                  {activeProductList.map((item) => (
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
                        <button style={{ ...S.linkBtn, color: "#0284c7" }} onClick={() => startEditProduct(item)}>Edit</button>
                        <button style={{ ...S.linkBtn, color: "#dc2626" }} onClick={() => deleteProduct(item.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ============= DONATIONS FORM ============= */}
        {tab === "donations" && (
          <>
            <div style={S.card}>
              <h2 style={S.sectionTitle}>
                {editingDonationId
                  ? `Edit "${draftD.title || editingDonationId}"`
                  : "Add Donation Program"}
              </h2>

              <div style={S.grid2}>
                <div>
                  <label style={S.label}>Program ID</label>
                  <input
                    style={S.input}
                    placeholder="Leave blank to auto-generate"
                    value={draftD.id}
                    onChange={(e) => setDraftD({ ...draftD, id: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Title *</label>
                  <input
                    style={S.input}
                    placeholder="e.g. Academic Sponsorships"
                    value={draftD.title}
                    onChange={(e) => setDraftD({ ...draftD, title: e.target.value })}
                  />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Description</label>
                <textarea
                  style={S.textarea}
                  placeholder="Describe this program…"
                  value={draftD.description}
                  onChange={(e) => setDraftD({ ...draftD, description: e.target.value })}
                />
              </div>

              <div style={S.field}>
                <label style={S.label}>Quote</label>
                <textarea
                  style={S.textarea}
                  placeholder="Beneficiary quote…"
                  value={draftD.quote}
                  onChange={(e) => setDraftD({ ...draftD, quote: e.target.value })}
                />
              </div>

              <div style={S.grid2}>
                <div>
                  <label style={S.label}>Quote Name</label>
                  <input
                    style={S.input}
                    placeholder="e.g. —Juliana George,"
                    value={draftD.quoteName}
                    onChange={(e) => setDraftD({ ...draftD, quoteName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Quote Position</label>
                  <input
                    style={S.input}
                    placeholder="e.g. Academic Sponsorship Beneficiary"
                    value={draftD.quotePosition}
                    onChange={(e) => setDraftD({ ...draftD, quotePosition: e.target.value })}
                  />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Gallery Images (multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={handleDonationImages}
                />
                {draftD.images.length > 0 && (
                  <div style={S.thumbRow}>
                    {draftD.images.map((url) => (
                      <div key={url} style={S.thumbWrap}>
                        <img src={imgSrc(url)} alt="" style={S.thumb} />
                        <button type="button" style={S.thumbRemove} onClick={() => removeDonationImage(url)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={S.field}>
                <label style={S.label}>Overlay Image</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={handleDonationOverlay}
                />
                {draftD.overlayImage && (
                  <div style={S.thumbRow}>
                    <div style={S.thumbWrap}>
                      <img src={imgSrc(draftD.overlayImage)} alt="" style={S.thumb} />
                      <button
                        type="button"
                        style={S.thumbRemove}
                        onClick={() => setDraftD({ ...draftD, overlayImage: "" })}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {uploading && (
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>Uploading…</div>
              )}

              <div style={S.buttonsRow}>
                {editingDonationId ? (
                  <>
                    <button
                      style={{ ...S.btn, ...S.btnSky, ...(busy ? S.btnDisabled : {}) }}
                      onClick={updateDonation}
                      disabled={busy}
                    >
                      {busy ? "Saving…" : "Update Program"}
                    </button>
                    <button style={{ ...S.btn, ...S.btnSlate }} onClick={cancelDonationEdit}>Cancel</button>
                  </>
                ) : (
                  <button
                    style={{ ...S.btn, ...S.btnSky, ...(busy ? S.btnDisabled : {}) }}
                    onClick={addDonation}
                    disabled={busy}
                  >
                    {busy ? "Saving…" : "Add Program"}
                  </button>
                )}
              </div>
            </div>

            <div style={S.card}>
              <h2 style={S.sectionTitle}>Donation Programs ({donations.length})</h2>

              {!donations.length && (
                <div style={S.empty}>No donation programs yet. Add one above.</div>
              )}

              {donations.length > 0 && (
                <div style={S.list}>
                  {donations.map((item) => (
                    <div key={item.id} style={S.listItem}>
                      <div style={S.listLeft}>
                        {item.overlayImage || item.image ? (
                          <img
                            src={imgSrc(item.overlayImage || item.image)}
                            alt=""
                            style={S.listThumb}
                          />
                        ) : (
                          <div style={{ ...S.listThumb, background: "#f1f5f9" }} />
                        )}
                        <div style={S.listText}>
                          <div style={S.listTitle}>{item.title}</div>
                          <div style={S.listMeta}>
                            ID {item.id} · {item.images?.length || 0} gallery image(s)
                          </div>
                        </div>
                      </div>
                      <div style={S.buttonsRow}>
                        <button
                          style={{ ...S.linkBtn, color: "#0284c7" }}
                          onClick={() => startEditDonation(item)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...S.linkBtn, color: "#dc2626" }}
                          onClick={() => deleteDonation(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ========== RAFFLE CAMPAIGN CONTROL ========== */}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>Raffle Campaign</h2>
          {!raffleState ? (
            <div style={S.empty}>Loading campaign status…</div>
          ) : raffleState.is_active ? (
            <>
              <div style={{ ...S.msg, ...S.msgSuccess, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Campaign Active</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  <div><strong>Remaining:</strong> {raffleState.remaining} of {raffleState.initial_tickets}</div>
                  <div><strong>Tickets Sold:</strong> {raffleState.tickets_sold}</div>
                  <div><strong>Started:</strong> {raffleState.campaign_start_date || "—"}</div>
                </div>
              </div>
              <button
                style={{ ...S.btn, background: "#dc2626", color: "#fff", ...(busy ? S.btnDisabled : {}) }}
                onClick={endCampaign}
                disabled={busy}
              >
                {busy ? "Ending…" : "End Campaign"}
              </button>
            </>
          ) : (
            <>
              <div style={{ ...S.msg, ...S.msgInfo, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Campaign Not Active</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  {raffleState.sold_out_at
                    ? `Previous campaign ended ${new Date(raffleState.sold_out_at).toLocaleString()}.`
                    : "No campaign has been started yet."}
                  <div style={{ marginTop: 6 }}>Starting a new campaign <strong>resets the sales ledger</strong> for the fresh campaign (audit history preserved).</div>
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>Initial Tickets</label>
                <input
                  style={S.input}
                  type="number"
                  min="1"
                  max="1000000"
                  value={raffleInitialInput}
                  onChange={(e) => setRaffleInitialInput(e.target.value)}
                />
              </div>
              <button
                style={{ ...S.btn, ...S.btnEmerald, ...(busy ? S.btnDisabled : {}) }}
                onClick={startCampaign}
                disabled={busy}
              >
                {busy ? "Starting…" : "Start Campaign"}
              </button>
            </>
          )}
        </div>

        {/* ========== SITE TOGGLES ========== */}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>Site Toggles</h2>
          <div style={{ ...S.msg, ...S.msgInfo, marginBottom: 16, fontSize: 13 }}>
            Changes take effect for users on their next page load (existing browser caches preserved).
          </div>
          {!uiToggles ? (
            <div style={S.empty}>Loading toggles…</div>
          ) : (
            <div style={S.list}>
              {[
                { key: "address_usa",        label: "USA Addresses" },
                { key: "address_canada",     label: "Canada Addresses" },
                { key: "address_australia",  label: "Australia Addresses" },
                { key: "address_newzealand", label: "New Zealand Addresses" },
                { key: "recent_winners",     label: "Recent Winners Section" },
                { key: "winners_detail",     label: "Winners Detail Section" },
              ].map(({ key, label }) => {
                const enabled = !!uiToggles[key];
                const isOverridden = uiTogglesOverridden.includes(key);
                return (
                  <div key={key} style={S.listItem}>
                    <div style={S.listLeft}>
                      <div style={S.listText}>
                        <div style={S.listTitle}>
                          {label}
                          {isOverridden && (
                            <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>(admin override)</span>
                          )}
                        </div>
                        <div style={S.listMeta}>{enabled ? "✅ Enabled" : "⛔ Disabled"}</div>
                      </div>
                    </div>
                    <button
                      style={{ ...S.btn, ...(enabled ? S.btnSlate : S.btnSky), ...(busy ? S.btnDisabled : {}) }}
                      onClick={() => flipToggle(key, !enabled)}
                      disabled={busy}
                    >
                      {busy ? "…" : enabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========== RECENT WINNERS EDITOR ========== */}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>Recent Winners Editor ({recentWinnersEdit.length})</h2>
          <div style={{ ...S.msg, ...S.msgInfo, marginBottom: 16, fontSize: 13 }}>
            Public RecentWinners strip reflects saved entries. Empty list falls back to the 5 built-in defaults.
          </div>
          {recentWinnersEdit.length === 0 && (
            <div style={S.empty}>No entries. Click "+ Add Winner" to start, or save to revert to defaults.</div>
          )}
          {recentWinnersEdit.map((w, idx) => (
            <div key={idx} style={{ ...S.listItem, flexWrap: "wrap", gap: 8, alignItems: "stretch" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, flex: 1, minWidth: 0 }}>
                <input style={S.input} placeholder="Name" value={w.name || ""} onChange={(e) => updateRecentWinnerField(idx, "name", e.target.value)} />
                <input style={S.input} placeholder="State/Region" value={w.state || ""} onChange={(e) => updateRecentWinnerField(idx, "state", e.target.value)} />
                <input style={S.input} placeholder="Country" value={w.country || ""} onChange={(e) => updateRecentWinnerField(idx, "country", e.target.value)} />
                <input style={S.input} placeholder="Prize" value={w.prize || ""} onChange={(e) => updateRecentWinnerField(idx, "prize", e.target.value)} />
                <input style={S.input} placeholder="Date claimed" value={w.date_claimed || ""} onChange={(e) => updateRecentWinnerField(idx, "date_claimed", e.target.value)} />
                <input style={S.input} placeholder="Ticket no." value={w.ticket_no || ""} onChange={(e) => updateRecentWinnerField(idx, "ticket_no", e.target.value)} />
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
                  <input type="checkbox" checked={!!w.cash_out} onChange={(e) => updateRecentWinnerField(idx, "cash_out", e.target.checked)} />
                  Cash out
                </label>
              </div>
              <button style={{ ...S.linkBtn, color: "#dc2626" }} onClick={() => removeRecentWinnerRow(idx)}>Remove</button>
            </div>
          ))}
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={{ ...S.btn, ...S.btnSlate }} onClick={addRecentWinnerRow}>+ Add Winner</button>
            <button style={{ ...S.btn, ...S.btnEmerald, ...(recentWinnersSaving ? S.btnDisabled : {}) }} onClick={saveRecentWinners} disabled={recentWinnersSaving}>
              {recentWinnersSaving ? "Saving\u2026" : "Save Recent Winners"}
            </button>
          </div>
        </div>

        {/* ========== WINNERS DETAIL EDITOR ========== */}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>Winners Detail Editor ({winnersDetailEdit.length})</h2>
          <div style={{ ...S.msg, ...S.msgInfo, marginBottom: 16, fontSize: 13 }}>
            Drives the WinnersDetail carousel. Empty list shows the built-in 5-item default set.
          </div>
          {winnersDetailEdit.length === 0 && (
            <div style={S.empty}>No custom winners. Public component falls back to hardcoded defaults. Use "Seed Defaults" to populate with the default 5, then edit.</div>
          )}
          {winnersDetailEdit.map((w, idx) => (
            <div key={idx} style={{ ...S.listItem, flexWrap: "wrap", gap: 8, alignItems: "stretch" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, flex: 1, minWidth: 0 }}>
                <input style={S.input} placeholder="Name" value={w.name || ""} onChange={(e) => updateWinnersDetailField(idx, "name", e.target.value)} />
                <input style={S.input} placeholder="Date" value={w.date || ""} onChange={(e) => updateWinnersDetailField(idx, "date", e.target.value)} />
                <input style={S.input} placeholder="Ticket no." value={w.ticketNo || ""} onChange={(e) => updateWinnersDetailField(idx, "ticketNo", e.target.value)} />
                <input style={S.input} placeholder="Product" value={w.product || ""} onChange={(e) => updateWinnersDetailField(idx, "product", e.target.value)} />
                <input style={S.input} placeholder="Winner img URL" value={w.winnerImg || ""} onChange={(e) => updateWinnersDetailField(idx, "winnerImg", e.target.value)} />
                <input style={S.input} placeholder="Product img URL" value={w.productImg || ""} onChange={(e) => updateWinnersDetailField(idx, "productImg", e.target.value)} />
                <input style={S.input} placeholder="Flag emoji" value={w.countryFlag || ""} onChange={(e) => updateWinnersDetailField(idx, "countryFlag", e.target.value)} />
                <input style={S.input} placeholder="Location" value={w.location || ""} onChange={(e) => updateWinnersDetailField(idx, "location", e.target.value)} />
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
                  <input type="checkbox" checked={!!w.verified} onChange={(e) => updateWinnersDetailField(idx, "verified", e.target.checked)} />
                  Verified
                </label>
              </div>
              <button style={{ ...S.linkBtn, color: "#dc2626" }} onClick={() => removeWinnersDetailRow(idx)}>Remove</button>
            </div>
          ))}
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={{ ...S.btn, ...S.btnSlate }} onClick={addWinnersDetailRow}>+ Add Winner</button>
            <button style={{ ...S.btn, ...S.btnSlate }} onClick={seedWinnersDetailDefaults}>Seed Defaults</button>
            <button style={{ ...S.btn, ...S.btnEmerald, ...(winnersDetailSaving ? S.btnDisabled : {}) }} onClick={saveWinnersDetail} disabled={winnersDetailSaving}>
              {winnersDetailSaving ? "Saving\u2026" : "Save Winners Detail"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
