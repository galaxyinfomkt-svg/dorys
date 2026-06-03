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
          <svg className="qf__success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4 12 14.01l-3-3" />
          </svg>
          <h3>Thank you!</h3>
          <p>We&rsquo;ve received your request and will respond within 24 hours with your free facility assessment.</p>
        </div>
      </div>
    )
  }

  return (
    <form className="qf" onSubmit={onSubmit} noValidate>
      <div className="qf__head">
        <h2 className="qf__title">{heading}</h2>
        <span className="qf__rule" aria-hidden="true" />
      </div>

      <div className="qf__field">
        <input className="qf__input" type="text" name="name" placeholder="Name*" autoComplete="name" required />
      </div>

      <div className="qf__field">
        <input className="qf__input" type="tel" name="phone" placeholder="Phone*" autoComplete="tel" required />
      </div>

      <div className="qf__field qf__field--icon">
        <svg className="qf__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 5L2 7" />
        </svg>
        <input className="qf__input" type="email" name="email" placeholder="Email*" autoComplete="email" required />
      </div>

      <div className="qf__field">
        <select
          className={`qf__select${serviceFilled ? " qf__select--filled" : ""}`}
          name="service"
          defaultValue=""
          onChange={(e) => setServiceFilled(!!e.target.value)}
        >
          <option value="" disabled>Select Service Needed</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button className="qf__btn" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Request Free Estimate"}
      </button>

      {status === "error" && <p className="qf__msg qf__msg--err">{errorMsg}</p>}
      <p className="qf__note">Free facility assessment · 24-hour response · For commercial healthcare facilities only.</p>
    </form>
  )
}
