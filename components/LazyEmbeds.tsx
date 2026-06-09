"use client"

import { useEffect } from "react"

// Performance: defer the heavy third-party embeds until the user actually needs
// them, instead of loading everything during initial paint.
//   - GHL form iframes (they pull reCAPTCHA ~1.1MB + libphonenumber + chunks):
//     rendered with data-src; we set src only when the form scrolls near the
//     viewport, on first user interaction, or after a short idle fallback.
//   - GHL chat widget + GA4 gtag.js: injected on first interaction or idle.
// This keeps LCP/FCP/TBT focused on the page content. gtag() itself is stubbed
// in layout.tsx <head> so analytics events queue until gtag.js loads.
export default function LazyEmbeds() {
  useEffect(() => {
    let done = false
    let timer: ReturnType<typeof setTimeout> | undefined
    // Real intent signals only — NOT mousemove (fires instantly) and NOT a
    // near-viewport observer (the hero form sits high on the page, so it would
    // trigger during the first paint and defeat the whole point).
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, onTrigger))
      if (timer) clearTimeout(timer)
    }

    const loadForms = () => {
      document.querySelectorAll<HTMLIFrameElement>("iframe[data-src]").forEach((f) => {
        const ds = f.getAttribute("data-src")
        if (ds) {
          f.setAttribute("src", ds)
          f.removeAttribute("data-src")
        }
      })
    }

    const loadThirdParty = () => {
      if (done) return
      done = true
      loadForms()

      // GHL chat widget
      if (!document.getElementById("ghl-chat-loader")) {
        const s = document.createElement("script")
        s.id = "ghl-chat-loader"
        s.src = "https://beta.leadconnectorhq.com/loader.js"
        s.setAttribute("data-resources-url", "https://beta.leadconnectorhq.com/chat-widget/loader.js")
        s.setAttribute("data-widget-id", "6a1b542f7645b2ba9a1194ac")
        document.body.appendChild(s)
      }

      // GA4 library (config is already queued via the gtag stub in <head>)
      if (!document.getElementById("ga4-lib")) {
        const g = document.createElement("script")
        g.id = "ga4-lib"
        g.async = true
        g.src = "https://www.googletagmanager.com/gtag/js?id=G-2MP9G52LW7"
        document.body.appendChild(g)
      }

      cleanup()
    }

    const onTrigger = () => loadThirdParty()

    events.forEach((e) => window.addEventListener(e, onTrigger, { passive: true }))
    // Idle fallback so the form/chat/analytics still appear for passive
    // visitors — but only AFTER the initial paint window, so it doesn't
    // compete with FCP/LCP. First real interaction loads them sooner.
    timer = setTimeout(loadThirdParty, 2500)

    return cleanup
  }, [])

  return null
}
