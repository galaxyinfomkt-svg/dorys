"use client"

import { useEffect, useRef } from "react"

// Reliable mobile menu toggle. The legacy navigation.js only does
// `window.initNavigation = initNavigation` and never calls it under Next, so
// the hamburger was never wired. This React island controls the drawer
// directly (toggles .is-open on .header__nav + .header__overlay), independent
// of the legacy JS. CSS for the drawer lives in critical.min.css + elevate.css.
export default function HeaderMenuToggle() {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = ref.current
    if (!btn) return
    const nav = document.querySelector(".header__nav")
    const overlay = document.querySelector(".header__overlay")
    const set = (open: boolean) => {
      nav?.classList.toggle("is-open", open)
      overlay?.classList.toggle("is-open", open)
      btn.classList.toggle("is-active", open)
      btn.setAttribute("aria-expanded", String(open))
      document.body.classList.toggle("nav-open", open)
    }
    const toggle = () => set(!nav?.classList.contains("is-open"))
    const close = () => set(false)
    btn.addEventListener("click", toggle)
    overlay?.addEventListener("click", close)
    const links = nav ? Array.from(nav.querySelectorAll("a")) : []
    links.forEach(a => a.addEventListener("click", close))
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("keydown", onKey)
    return () => {
      btn.removeEventListener("click", toggle)
      overlay?.removeEventListener("click", close)
      links.forEach(a => a.removeEventListener("click", close))
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <button ref={ref} className="header__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="main-navigation" type="button">
      <span className="header__toggle-icon"><span></span><span></span><span></span></span>
    </button>
  )
}
