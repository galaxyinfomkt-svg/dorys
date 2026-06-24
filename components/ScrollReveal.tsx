"use client"

import { useEffect } from "react"

// Site-wide scroll-reveal motion (like RS, which is React/Next too). Adds
// html.reveal-ready + per-element .in-view as elements enter the viewport, so
// the legacy .animate-* / .stagger-children classes fade up on scroll. Safe by
// design: if JS is off, IntersectionObserver is missing, or reduced-motion is
// set, it bails and content stays visible (CSS default opacity:1).
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("IntersectionObserver" in window)) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const sel =
      ".animate-on-scroll, .animate-fade-up, .animate-fade-down, .animate-fade-left," +
      " .animate-fade-right, .animate-fade-scale, .animate-zoom-in, .stagger-children"
    const els = Array.from(document.querySelectorAll<HTMLElement>(sel))
    if (!els.length) return

    document.documentElement.classList.add("reveal-ready")

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view")
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    )
    els.forEach((el) => io.observe(el))

    // Safety net: never leave anything hidden — reveal all after 1.2s so a
    // missed IntersectionObserver fire can't leave a section blank (the empty
    // space under the services header was animate-on-scroll stuck at opacity:0).
    const t = window.setTimeout(() => els.forEach((el) => el.classList.add("in-view")), 1200)

    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])

  return null
}
