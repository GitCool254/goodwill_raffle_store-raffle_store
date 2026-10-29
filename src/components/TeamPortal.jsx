import React, { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const TOKEN_KEY = "gw_team_token";

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
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("employee");
  const [newPassword, setNewPassword] = useState("");

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
            <button style={{ ...S.btn, ...S.btnSlate }} onClick={logout}>Logout</button>
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
                    <button style={{ ...S.linkBtn, color: "#dc2626" }} onClick={() => deleteUser(u.id, u.username)} disabled={busy || u.is_root}>Delete</button>
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
