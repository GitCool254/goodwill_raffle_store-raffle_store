import React, { useEffect, useRef, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const TOKEN_KEY = "gw_team_token";
const IDLE_MS = 15 * 60 * 1000;  // 15-minute idle auto-logout

function formatCountdown(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

const S = {
  page: { minHeight: "100vh", background: "#f1f5f9", padding: "20px 14px", fontFamily: "system-ui, -apple-system, sans-serif" },
  container: { maxWidth: 1100, margin: "0 auto" },
  topbar: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 },
  buttonsRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btn: { padding: "9px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnEmerald: { background: "#059669", color: "#fff" },
  btnSlate:   { background: "#e2e8f0", color: "#334155" },
  btnSky:     { background: "#0284c7", color: "#fff" },
  btnDisabled:{ opacity: 0.55, cursor: "not-allowed" },
  card: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)", padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", fontSize: 15, outline: "none", boxSizing: "border-box", background: "#fff", color: "#0f172a" },
  field: { marginBottom: 16 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 4 },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  listItem: { display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, gap: 12, background: "#fff" },
  listLeft: { display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 },
  listText: { minWidth: 0, flex: 1 },
  listTitle: { fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 2 },
  listMeta: { fontSize: 12, color: "#64748b" },
  linkBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "4px 6px" },
  msg: { padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14, lineHeight: 1.5 },
  msgSuccess: { background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" },
  msgError:   { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
  msgInfo:    { background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" },
  empty: { padding: 24, textAlign: "center", color: "#64748b", fontSize: 14 },
  badge: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, marginLeft: 6 },
  badgeRoot: { background: "#e0f2fe", color: "#0369a1" },
  badgeSup:  { background: "#fef3c7", color: "#92400e" },
  badgeEmp:  { background: "#e0e7ff", color: "#3730a3" },
};

export default function TeamPortal() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [me, setMe] = useState(null);
  const lastActivityMs = useRef(Date.now());
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("employee");
  const [newPassword, setNewPassword] = useState("");
  const [auditWindow, setAuditWindow] = useState("24h");
  const [auditEntries, setAuditEntries] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [holidayCfg, setHolidayCfg] = useState(null);
  const [holidayLoading, setHolidayLoading] = useState(false);

  async function loadAudit(win) {
    setAuditLoading(true);
    try {
      const res = await fetch(`${BACKEND}/team/audit?window=${win}`, {
        headers: { "X-Team-Token": token },
      });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setAuditEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch (err) {
      setMsg({ type: "error", text: "Audit load failed: " + err.message });
    } finally {
      setAuditLoading(false);
    }
  }

  async function loadHolidays() {
    setHolidayLoading(true);
    try {
      const res = await fetch(`${BACKEND}/team/holidays`, { headers: { "X-Team-Token": token } });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setHolidayCfg(data);
    } catch (err) {
      setMsg({ type: "error", text: "Holidays load failed: " + err.message });
    } finally {
      setHolidayLoading(false);
    }
  }

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

  useEffect(() => { if (token) loadAudit(auditWindow); }, [token, auditWindow]);
  useEffect(() => { if (token) loadHolidays(); }, [token]);

  async function handleLogin(e) {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) return;
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch(`${BACKEND}/team/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setMe({ username: data.username, role: data.role });
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

  async function logout() {
    try {
      await fetch(`${BACKEND}/team/logout`, { method: "POST", headers: { "X-Team-Token": token } });
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    setToken(""); setMe(null); setUsers([]);
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/team/users`, { headers: { "X-Team-Token": token } });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      setMsg({ type: "error", text: "Load failed: " + err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (token) loadUsers(); }, [token]);

  async function createUser(e) {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      const res = await fetch(`${BACKEND}/team/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Team-Token": token },
        body: JSON.stringify({ username: newUsername, phone: newPhone, role: newRole, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      setMsg({ type: "success", text: `✅ Created ${data.user.username}` });
      setNewUsername(""); setNewPhone(""); setNewPassword(""); setNewRole("employee");
      await loadUsers();
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally { setBusy(false); }
  }

  async function toggleActive(id, action) {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`${BACKEND}/team/users/${id}/${action}`, { method: "POST", headers: { "X-Team-Token": token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setMsg({ type: "success", text: `✅ ${action} succeeded` });
      await loadUsers();
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally { setBusy(false); }
  }

  async function deleteUser(id, name) {
    if (!confirm(`Delete user "${name}"? Cannot be undone.`)) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`${BACKEND}/team/users/${id}/delete`, { method: "POST", headers: { "X-Team-Token": token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMsg({ type: "success", text: `✅ Deleted ${name}` });
      await loadUsers();
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally { setBusy(false); }
  }

  async function handleSetPassword(id, name) {
    const pw = prompt(`New password for "${name}" (min 8 chars):`);
    if (!pw) return;
    if (pw.length < 8) { setMsg({ type: "error", text: "Password must be at least 8 characters" }); return; }
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`${BACKEND}/team/users/${id}/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Team-Token": token },
        body: JSON.stringify({ new_password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Set-password failed");
      setMsg({ type: "success", text: `✅ Password updated for ${name}` });
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally { setBusy(false); }
  }

  async function handleEditPhone(id, name, currentPhone) {
    const next = prompt(`New phone for "${name}" (E.164, e.g. +254712345678):`, currentPhone || "");
    if (!next) return;
    const trimmed = next.trim();
    if (!/^\+\d{8,15}$/.test(trimmed)) {
      setMsg({ type: "error", text: "Phone must be E.164 format (e.g. +254712345678)" });
      return;
    }
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`${BACKEND}/team/users/${id}/phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Team-Token": token },
        body: JSON.stringify({ phone: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Set phone failed");
      setMsg({ type: "success", text: `✅ Phone updated for ${name}` });
      await loadUsers();
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally { setBusy(false); }
  }

  async function postHolidays(payload) {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`${BACKEND}/team/holidays`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Team-Token": token },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setHolidayCfg({ holidays: data.holidays, effects: data.effects });
      setMsg({ type: "success", text: "✅ Holidays updated" });
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    } finally { setBusy(false); }
  }

  async function toggleHoliday(hid, enabled) {
    await postHolidays({ holidays: { [hid]: { enabled: !enabled } } });
  }

  async function updateGeneralHoliday(patch) {
    await postHolidays({ holidays: { general: patch } });
  }

  async function toggleSnowfall(enabled) {
    await postHolidays({ effects: { snowfall: { enabled: !enabled } } });
  }

  function badgeFor(u) {
    if (u.is_root) return <span style={{ ...S.badge, ...S.badgeRoot }}>ROOT</span>;
    if (u.role === "superior") return <span style={{ ...S.badge, ...S.badgeSup }}>SUPERIOR</span>;
    return <span style={{ ...S.badge, ...S.badgeEmp }}>EMPLOYEE</span>;
  }

  if (!token) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={handleLogin} style={{ ...S.card, width: "100%", maxWidth: 380, marginBottom: 0 }}>
          <h1 style={{ ...S.sectionTitle, fontSize: 20, textAlign: "center" }}>Team Login</h1>
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
          <p style={{ textAlign: "center", marginTop: 14, marginBottom: 0, fontSize: 12, color: "#64748b" }}>
            Reset password? Visit <a href="/admin" style={{ color: "#0284c7" }}>/admin</a>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/icon-tab.png" alt="Goodwillstores logo" style={{ height: 32, width: "auto", display: "block" }} />
            <h1 style={S.title}>Team Portal</h1>
          </div>
          <div style={S.buttonsRow}>
            <span style={{ ...S.btn, ...S.btnSlate, cursor: "default" }}>
              {me?.username || "…"} · {me?.role || "…"}
            </span>
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

        {msg && <div style={{ ...S.msg, ...(msg.type === "success" ? S.msgSuccess : msg.type === "error" ? S.msgError : S.msgInfo) }}>{msg.text}</div>}

        <div style={S.card}>
          <h2 style={S.sectionTitle}>Add Team Member</h2>
          <form onSubmit={createUser}>
            <div style={S.grid2}>
              <div style={S.field}>
                <label style={S.label}>Username</label>
                <input style={S.input} value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Phone (E.164, e.g. +254712345678)</label>
                <input style={S.input} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Role</label>
                <select style={S.input} value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option value="employee">Employee</option>
                  <option value="superior">Superior</option>
                </select>
              </div>
              <div style={S.field}>
                <label style={S.label}>Password (min 8 chars)</label>
                <input style={S.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
            </div>
            <button type="submit" disabled={busy} style={{ ...S.btn, ...S.btnEmerald, ...(busy ? S.btnDisabled : {}) }}>
              {busy ? "Saving…" : "Create user"}
            </button>
          </form>
        </div>

        <div style={S.card}>
          <h2 style={S.sectionTitle}>Team Members ({users.length})</h2>
          {loading ? <div style={S.empty}>Loading…</div> : users.length === 0 ? <div style={S.empty}>No team members yet.</div> : (
            <div style={S.list}>
              {users.map((u) => (
                <div key={u.id} style={S.listItem}>
                  <div style={S.listLeft}>
                    <div style={S.listText}>
                      <div style={S.listTitle}>{u.username}{badgeFor(u)}</div>
                      <div style={S.listMeta}>
                        {u.phone || "no phone"} · {u.is_active ? "✅ Active" : "⛔ Inactive"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {u.is_active ? (
                      <button style={{ ...S.linkBtn, color: "#f59e0b" }} onClick={() => toggleActive(u.id, "deactivate")} disabled={busy || u.is_root}>Deactivate</button>
                    ) : (
                      <button style={{ ...S.linkBtn, color: "#059669" }} onClick={() => toggleActive(u.id, "reactivate")} disabled={busy}>Reactivate</button>
                    )}
                    <button style={{ ...S.linkBtn, color: "#0284c7" }} onClick={() => handleSetPassword(u.id, u.username)} disabled={busy}>Set password</button>
                    <button style={{ ...S.linkBtn, color: "#7c3aed" }} onClick={() => handleEditPhone(u.id, u.username, u.phone)} disabled={busy}>Edit phone</button>
                    <button style={{ ...S.linkBtn, color: "#dc2626" }} onClick={() => deleteUser(u.id, u.username)} disabled={busy || u.is_root}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========== AUDIT LOG ========== */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <h2 style={{ ...S.sectionTitle, margin: 0 }}>Activity Audit Log</h2>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["24h", "3d", "7d", "14d"].map((w) => (
                <button
                  key={w}
                  onClick={() => setAuditWindow(w)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "1px solid " + (auditWindow === w ? "#0284c7" : "#e2e8f0"),
                    background: auditWindow === w ? "#0284c7" : "#fff",
                    color: auditWindow === w ? "#fff" : "#475569",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
          {auditLoading ? (
            <div style={S.empty}>Loading audit trail…</div>
          ) : auditEntries.length === 0 ? (
            <div style={S.empty}>No audit entries in the last {auditWindow}.</div>
          ) : (
            <div style={{ overflow: "auto", maxHeight: "780px", border: "1px solid #e2e8f0", borderRadius: 8 }}>
              <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>Time</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>User</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>Role</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>Action</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>Target</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>Detail</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>IP</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditEntries.map((e, i) => (
                    <tr key={(e.ts || "") + i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "9px 12px", color: "#334155", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                        {(() => { try { return new Date(e.ts).toLocaleString(); } catch { return e.ts; } })()}
                      </td>
                      <td style={{ padding: "9px 12px", fontWeight: 600, color: "#0f172a" }}>{e.actor}</td>
                      <td style={{ padding: "9px 12px", color: "#64748b", textTransform: "capitalize" }}>{e.role}</td>
                      <td style={{ padding: "9px 12px", color: "#0369a1", fontWeight: 600 }}>{e.action}</td>
                      <td style={{ padding: "9px 12px", color: "#334155" }}>{e.target || "—"}</td>
                      <td style={{ padding: "9px 12px", color: "#64748b", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={e.detail || ""}>{e.detail || "—"}</td>
                      <td style={{ padding: "9px 12px", color: "#94a3b8", fontFamily: "monospace", fontSize: 12 }}>{e.ip || "—"}</td>
                      <td style={{ padding: "9px 12px" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: e.success ? "#dcfce7" : "#fee2e2",
                          color: e.success ? "#166534" : "#991b1b",
                        }}>{e.success ? "OK" : "FAIL"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========== HOLIDAY CALENDAR ========== */}
        <div style={S.card}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ ...S.sectionTitle, margin: 0 }}>Holiday Calendar</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 0" }}>
              Toggle holidays on or off. Disabled holidays will not show banners or offers on the main site.
            </p>
          </div>
          {holidayLoading ? (
            <div style={S.empty}>Loading holidays…</div>
          ) : !holidayCfg ? (
            <div style={S.empty}>No holiday data.</div>
          ) : (
            <div style={S.list}>
              {[
                { id: "blackfriday", label: "Black Friday", dateText: "Every Friday" },
                { id: "christmas", label: "Christmas", dateText: "Dec 10 – Dec 31" },
                { id: "newyear", label: "New Year", dateText: "Jan 1 – Jan 7" },
                { id: "valentine", label: "Valentine's", dateText: "Feb 10 – Feb 14" },
                { id: "easter", label: "Easter", dateText: "Good Friday – Easter Monday" },
                { id: "general", label: "General Holiday", dateText: "Custom dates (ISO)" },
              ].map((h) => {
                const cfg = holidayCfg.holidays?.[h.id] || {};
                const isEnabled = cfg.enabled !== false;
                const isGeneral = h.id === "general";
                return (
                  <div key={h.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, background: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{h.label}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{h.dateText}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleHoliday(h.id, isEnabled)}
                        disabled={busy}
                        title={isEnabled ? "Click to disable" : "Click to enable"}
                        style={{
                          width: 52, height: 28, borderRadius: 999, border: "none",
                          background: isEnabled ? "#059669" : "#cbd5e1",
                          position: "relative", cursor: busy ? "not-allowed" : "pointer",
                          transition: "background 0.15s ease",
                          opacity: busy ? 0.55 : 1, flexShrink: 0,
                        }}
                      >
                        <span style={{
                          position: "absolute", top: 3, left: isEnabled ? 27 : 3,
                          width: 22, height: 22, borderRadius: "50%", background: "#fff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "left 0.15s ease",
                        }} />
                      </button>
                    </div>
                    {isGeneral && isEnabled && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed #e2e8f0" }}>
                        <div style={S.grid2}>
                          <div style={S.field}>
                            <label style={S.label}>Title</label>
                            <input
                              style={S.input}
                              value={cfg.title || "Labor's Day Special Raffle"}
                              onChange={(e) => setHolidayCfg((prev) => ({
                                ...prev,
                                holidays: { ...prev.holidays, general: { ...(prev.holidays?.general || {}), title: e.target.value } }
                              }))}
                              onBlur={(e) => updateGeneralHoliday({ title: e.target.value })}
                            />
                          </div>
                          <div style={S.field}>
                            <label style={S.label}>Start date (YYYY-MM-DD)</label>
                            <input
                              style={S.input}
                              type="date"
                              value={cfg.startDate || ""}
                              onChange={(e) => updateGeneralHoliday({ startDate: e.target.value })}
                            />
                          </div>
                          <div style={S.field}>
                            <label style={S.label}>End date (YYYY-MM-DD)</label>
                            <input
                              style={S.input}
                              type="date"
                              value={cfg.endDate || ""}
                              onChange={(e) => updateGeneralHoliday({ endDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: -6 }}>
                          Leave both dates empty to use defaults (Apr 30 – May 1). Dates are exact-year; edit each year.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>


        {/* ========== SITE EFFECTS ========== */}
        <div style={S.card}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ ...S.sectionTitle, margin: 0 }}>Site Effects</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 0" }}>
              Visual effects rendered across the main site.
            </p>
          </div>
          {!holidayCfg ? (
            <div style={S.empty}>Loading effects…</div>
          ) : (
            <div style={S.list}>
              {(() => {
                const sf = holidayCfg.effects?.snowfall || {};
                const isOn = sf.enabled === true;
                return (
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>❄</span>
                        Snowfall
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        Snow particles across the whole site. No scheduled range — controlled only by this toggle.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSnowfall(isOn)}
                      disabled={busy}
                      title={isOn ? "Click to turn off" : "Click to turn on"}
                      style={{
                        width: 52, height: 28, borderRadius: 999, border: "none",
                        background: isOn ? "#0284c7" : "#cbd5e1",
                        position: "relative", cursor: busy ? "not-allowed" : "pointer",
                        transition: "background 0.15s ease",
                        opacity: busy ? 0.55 : 1, flexShrink: 0,
                      }}
                    >
                      <span style={{
                        position: "absolute", top: 3, left: isOn ? 27 : 3,
                        width: 22, height: 22, borderRadius: "50%", background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "left 0.15s ease",
                      }} />
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
