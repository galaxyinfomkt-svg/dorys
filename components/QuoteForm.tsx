"use client"

import { useState } from "react"

// Native quote form in Dory's colours (blue CTA + gold accent), styled by the
// .qf-* rules in elevate.css. Posts JSON to /api/submit-lead, which forwards to
// GHL's Contacts API using the server-side GHL_PIT token (Vercel env var). On
// any failure it shows a "please call" fallback so a lead is never lost silently.

const SERVICES = [
  "Medical Office Cleaning",
  "Clinic & Outpatient Facility Sanitation",
  "Assisted Living & Senior Care Cleaning",
  "Infection Control & High-Touch Disinfection",
  "Compliance Documentation & Scheduled Sanitation",
  "Not sure / Other",
]

const TRUST = [
  {
    label: "24-Hour Response",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    label: "$2M Insured",
    icon: (
      <>
        <path d="M12 3 4 6v6c0 4.4 3.1 7.7 8 9 4.9-1.3 8-4.6 8-9V6l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    label: "CDC Compliant",
    icon: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),
  },
]

type Status = "idle" | "loading" | "success" | "error"

export default function QuoteForm({ heading = "Get Your Free Quote" }: { heading?: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [serviceFilled, setServiceFilled] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get("name") || "").trim()
    const parts = name.split(/\s+/)
    const firstName = parts.shift() || name
    const payload = {
      firstName,
      lastName: parts.join(" "),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      service: String(fd.get("service") || ""),
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(d.error || "Could not submit. Please call (978) 307-8107.")
      }
      setStatus("success")
      form.reset()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not submit. Please call (978) 307-8107.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="qf">
        <div className="qf__success">
          <span className="qf__success-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <h3>Thank you!</h3>
          <p>We&rsquo;ve received your request and will respond within 24 hours with your free facility assessment.</p>
        </div>
      </div>
    )
  }

  return (
    <form className="qf" onSubmit={onSubmit} noValidate>
      {heading ? (
        <div className="qf__head">
          <h2 className="qf__title">{heading}</h2>
          <span className="qf__rule" aria-hidden="true" />
          <p className="qf__sub">Free facility assessment · response within 24 hours</p>
        </div>
      ) : null}

      <div className="qf__field qf__field--icon">
        <svg className="qf__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        <input className="qf__input" type="text" name="name" placeholder="Full name*" autoComplete="name" required />
      </div>

      <div className="qf__field qf__field--icon">
        <svg className="qf__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
        </svg>
        <input className="qf__input" type="tel" name="phone" placeholder="Phone number*" autoComplete="tel" required />
      </div>

      <div className="qf__field qf__field--icon">
        <svg className="qf__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 5L2 7" />
        </svg>
        <input className="qf__input" type="email" name="email" placeholder="Email address*" autoComplete="email" required />
      </div>

      <div className="qf__field qf__field--icon">
        <svg className="qf__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 7h18M3 12h18M3 17h12" />
        </svg>
        <select
          className={`qf__select${serviceFilled ? " qf__select--filled" : ""}`}
          name="service"
          defaultValue=""
          onChange={(e) => setServiceFilled(!!e.target.value)}
        >
          <option value="" disabled>Select service needed</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button className="qf__btn" type="submit" disabled={status === "loading"}>
        {status === "loading" ? (
          "Sending…"
        ) : (
          <>
            Request Free Estimate
            <svg className="qf__btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </>
        )}
      </button>

      {status === "error" && <p className="qf__msg qf__msg--err">{errorMsg}</p>}

      <ul className="qf__trust" aria-hidden="true">
        {TRUST.map((t) => (
          <li key={t.label} className="qf__trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              {t.icon}
            </svg>
            {t.label}
          </li>
        ))}
      </ul>

      <p className="qf__note">For commercial healthcare facilities only. We never share your information.</p>
    </form>
  )
}
