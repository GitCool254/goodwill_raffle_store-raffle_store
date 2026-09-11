import { useEffect, useState } from "react";

/**
 * VerifyTicket
 * -------------
 * Public verification page reached by scanning the QR code printed
 * on a raffle ticket.
 *
 * URL pattern:  /verify-ticket/<token>
 *
 * The backend is the authoritative source of truth. This component
 * only renders the record it receives from the API.
 *
 * Possible ticket_status values returned by the backend:
 *   - "ACTIVE"   → ticket is currently valid.
 *   - "EXPIRED"  → ticket was valid previously but its validity
 *                  period ended 48 hours after the raffle sold out.
 *
 * NOTE: an EXPIRED ticket is never reactivated. It will remain
 * EXPIRED permanently.
 */
export default function VerifyTicket({ token }) {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (!token) {
        if (isMounted) {
          setError("Missing verification token.");
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(
          `${backendUrl}/verify_ticket/${encodeURIComponent(token)}`
        );
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.status === "VALID") {
          setRecord(data);
        } else {
          setError(data.message || "This ticket could not be verified.");
        }
      } catch (err) {
        if (!isMounted) return;
        setError(
          "We could not reach the verification service. Please try again."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, backendUrl]);

  const isExpired = record?.ticket_status === "EXPIRED";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f8fafc",
        fontFamily:
          '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
          padding: "28px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "4px",
          }}
        >
          Ticket Verification
        </h1>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#64748b",
            marginBottom: "20px",
          }}
        >
          Goodwillstores Raffle Verification
        </p>

        {loading && (
          <div style={{ padding: "24px 0" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                border: "3px solid #cbd5e1",
                borderTopColor: "#2563eb",
                borderRadius: "50%",
                margin: "0 auto 12px",
                animation: "verifySpin 0.8s linear infinite",
              }}
            />
            <p style={{ fontSize: "0.9rem", color: "#475569" }}>
              Verifying ticket…
            </p>
            <style>{`
              @keyframes verifySpin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#9a3412",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>⚠️</div>
            <strong style={{ display: "block", marginBottom: "4px" }}>
              Not Verified
            </strong>
            {error}
          </div>
        )}

        {!loading && record && (
          <>
            {/* -------- Top status banner -------- */}
            {isExpired ? (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "#fff7ed",
                  border: "1px solid #fdba74",
                  color: "#9a3412",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginBottom: "18px",
                }}
              >
                ⌛ Ticket Expired
              </div>
            ) : (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#065f46",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginBottom: "18px",
                }}
              >
                ✅ Ticket Verified
              </div>
            )}

            {/* -------- Record details -------- */}
            <div
              style={{
                textAlign: "left",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "16px",
                fontSize: "0.9rem",
                color: "#1e293b",
                lineHeight: 1.7,
              }}
            >
              <Row label="Ticket No" value={record.ticket_no} mono />
              <Row label="Name" value={record.full_name} />
              <Row label="Product" value={record.product} />
              <Row label="CMST No" value={record.cmst_no} />
              <Row
                label="Issued"
                value={
                  record.created_at
                    ? new Date(record.created_at).toLocaleString()
                    : "—"
                }
              />
              <Row label="Raffle" value={record.raffle_id} />
              <Row
                label="Status"
                value={record.ticket_status || "ACTIVE"}
                statusType={record.ticket_status || "ACTIVE"}
              />
            </div>

            {/* -------- Contextual footer note -------- */}
            {isExpired ? (
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "0.82rem",
                  color: "#7c2d12",
                  lineHeight: 1.6,
                  textAlign: "center",
                }}
              >
                Thank you for joining this raffle — your support truly
                mattered. Although your ticket is no longer eligible for
                the current draw, we hope to see you back for the next
                one. A new round of prizes will be announced soon, and we
                would be delighted to have you participate again.
              </p>
            ) : (
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "0.78rem",
                  color: "#64748b",
                  fontStyle: "italic",
                }}
              >
                This page confirms the ticket was issued by Goodwillstores.
                It does not indicate a winning entry — winners are announced
                separately during the official draw.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Row
 * ---
 * Small helper that renders one labelled field.
 *
 * `statusType` (optional) is used only for the "Status" row so the
 * highlight colour reflects ACTIVE (green) or EXPIRED (amber).
 */
function Row({ label, value, mono = false, statusType = null }) {
  const isActive = statusType === "ACTIVE";
  const isExpired = statusType === "EXPIRED";

  let highlightColor = "#1e293b";
  let fontWeight = 500;
  let fontWeightLabel = 600;

  if (isActive) {
    highlightColor = "#047857";
    fontWeight = 700;
    fontWeightLabel = 700;
  } else if (isExpired) {
    highlightColor = "#b45309";
    fontWeight = 700;
    fontWeightLabel = 700;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        padding: "6px 0",
        borderBottom: "1px dashed #e2e8f0",
      }}
    >
      <span style={{ color: "#64748b", flex: "0 0 auto" }}>{label}:</span>
      <span
        style={{
          fontWeight,
          color: highlightColor,
          fontFamily: mono
            ? 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
            : "inherit",
          textAlign: "right",
          wordBreak: "break-word",
          letterSpacing: isActive || isExpired ? "0.02em" : "normal",
          fontWeight: isActive || isExpired ? fontWeightLabel : fontWeight,
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}
