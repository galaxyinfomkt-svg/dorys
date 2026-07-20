// Hero form — same GHL iframe Dory's already uses (form id oaN0aNeRAK8fPG4AnIzl)
// plus the service picker pills above it. The dropdown of services in the
// FORM itself is configured in GHL UI; the picker passes ?service=<value>
// so GHL's URL-parameter mapping prefills the hidden Service Type field.
//
// To migrate the form to a fully custom HTML form (so we control the dropdown
// directly), uncomment the second branch and set GHL_PIT in Vercel env vars.

"use client"

import { useState } from "react"

const SERVICES = [
  { id: "Medical Office", label: "Medical\nOffice" },
  { id: "Specialty Clinic", label: "Specialty\nClinic" },
  { id: "Ambulatory Outpatient", label: "Outpatient" },
  { id: "Rehab Nursing", label: "Rehab\nNursing" },
  { id: "Healthcare Admin", label: "Admin\nOffice" },
] as const

const GHL_FORM_ID = "oaN0aNeRAK8fPG4AnIzl"
const GHL_LOCATION_ID = "BQd0L6DeFvVbjKS8VYZ9"

export default function HeroForm() {
  const [selected, setSelected] = useState<string | null>(null)
  const iframeUrl =
    selected
      ? `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_ID}?service=${encodeURIComponent(selected)}&locationId=${GHL_LOCATION_ID}`
      : `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_ID}?locationId=${GHL_LOCATION_ID}`

  const handlePick = (id: string) => {
    setSelected(id)
    if (typeof window !== "undefined" && typeof (window as { gtag?: unknown }).gtag === "function") {
      // @ts-expect-error gtag is globally injected by GA4 in layout.tsx
      window.gtag("event", "select", { event_category: "Service Picker", event_label: id })
    }
    try { sessionStorage.setItem("selected_service", id) } catch {}
  }

  return (
    <div
      id="hero-form-card"
      className="hero-premium__form"
      style={{
        minHeight: 760,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 16,
        boxShadow:
          "0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(245,158,11,0.15)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", padding: "0.75rem 1.25rem", textAlign: "center" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.15rem", opacity: 0.95 }}>
          Free Facility Assessment · 24-Hour Response
        </div>
        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
          Get Your Custom Quote
        </div>
      </div>

      <div style={{ padding: "1rem 1.1rem 0.5rem" }}>
        <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "0.78rem", margin: "0 0 0.8rem", textAlign: "center", lineHeight: 1.45 }}>
          <strong style={{ color: "#fbbf24" }}>Step 1 · </strong>What kind of facility?
        </p>
        <div role="radiogroup" aria-label="Choose your facility type" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.35rem", marginBottom: "0.85rem" }}>
          {SERVICES.map((s) => {
            const isSel = selected === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handlePick(s.id)}
                aria-pressed={isSel}
                style={{
                  background: isSel ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isSel ? "#fbbf24" : "rgba(255,255,255,0.18)"}`,
                  borderRadius: 8,
                  padding: "0.55rem 0.25rem",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.3rem",
                  lineHeight: 1.1,
                  boxShadow: isSel ? "0 4px 14px rgba(245,158,11,0.45)" : "none",
                }}
              >
                <span style={{ whiteSpace: "pre-line" }}>{s.label}</span>
              </button>
            )
          })}
        </div>
        <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "0.78rem", margin: "0 0 0.5rem", textAlign: "center", lineHeight: 1.45 }}>
          <strong style={{ color: "#fbbf24" }}>Step 2 · </strong>Tell us about your facility
        </p>
      </div>

      <iframe
        src={iframeUrl}
        width="100%"
        height={500}
        style={{ width: "100%", height: 500, border: "none", display: "block", background: "#fff" }}
        id="hero-form-oaN0aNeRAK8fPG4AnIzl"
        data-form-id={GHL_FORM_ID}
        title="Healthcare facility assessment form — commercial facilities only"
      />

      <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.0) 100%)", padding: "0.85rem 1rem 1rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.85rem", flexWrap: "wrap", fontSize: "0.7rem", color: "rgba(255,255,255,0.75)" }}>
          {/* The Google rating badge that used to sit here is removed. It was
              hardcoded 4.7/5 while the stats bar said 4.8 and schema claimed
              4.7 from 10 reviews — three unsourced, mutually contradictory
              figures. The only reachable review source for this location holds
              a single 5.00 entry written by the business about itself. It comes
              back when the figure comes from the Google Business Profile; see
              googleRating in data/company.json. */}
          <span><strong style={{ color: "#fff" }}>22+ yrs</strong> clinical</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span><strong style={{ color: "#fff" }}>$2M</strong> insured</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span><strong style={{ color: "#fff" }}>CDC/OSHA</strong></span>
        </div>
      </div>
    </div>
  )
}
