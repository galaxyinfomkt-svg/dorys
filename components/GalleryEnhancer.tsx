"use client"

import { useEffect } from "react"

// JS-driven gallery filtering (like RS, which is also React). Progressively
// enhances the CSS-only .home-gallery markup: takes over the filter tabs with
// real click state + animated transitions. Falls back to the CSS :checked
// filtering if JS is disabled.
export default function GalleryEnhancer() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-gallery")
    if (!root) return
    // Swap each <label> tab for a real <button>: a label with role="button" is
    // invalid ARIA (Lighthouse aria-allowed-role), and a button gives keyboard
    // and screen-reader behaviour for free. Styling uses .gallery-tab/.is-active.
    const tabs = Array.from(root.querySelectorAll<HTMLElement>(".gallery-tab")).map(label => {
      const b = document.createElement("button")
      b.type = "button"
      b.className = label.className
      b.innerHTML = label.innerHTML
      b.dataset.cat = (label.getAttribute("for") || "gf-all").replace("gf-", "")
      label.replaceWith(b)
      return b
    })
    const items = Array.from(root.querySelectorAll<HTMLElement>(".gallery-item"))
    if (!tabs.length || !items.length) return

    root.classList.add("gallery--js") // CSS switches to JS-controlled mode

    const apply = (cat: string) => {
      tabs.forEach(t => t.classList.toggle("is-active", (t.dataset.cat || "all") === cat))
      items.forEach(it => {
        const show = cat === "all" || it.classList.contains("cat-" + cat)
        it.classList.toggle("is-hidden", !show)
        if (show) {
          it.classList.remove("is-anim")
          // force reflow so the fade-in animation replays on each filter
          void it.offsetWidth
          it.classList.add("is-anim")
        }
      })
    }

    const cleanups: Array<() => void> = []
    tabs.forEach(t => {
      const cat = t.dataset.cat || "all"
      const onClick = () => {
        apply(cat)
        tabs.forEach(o => o.setAttribute("aria-pressed", String(o === t)))
      }
      t.setAttribute("aria-pressed", String(cat === "all"))
      t.addEventListener("click", onClick)
      cleanups.push(() => t.removeEventListener("click", onClick))
    })

    apply("all")

    // Turn the grid into a horizontal slider with prev/next arrows.
    const grid = root.querySelector<HTMLElement>(".gallery-grid")
    const wrap = grid?.parentElement
    if (grid && wrap) {
      wrap.classList.add("gallery-slider-wrap")
      const mk = (dir: "prev" | "next") => {
        const b = document.createElement("button")
        b.type = "button"
        b.className = `gallery-arrow gallery-arrow--${dir}`
        b.setAttribute("aria-label", dir === "prev" ? "Previous photos" : "Next photos")
        b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${dir === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}"/></svg>`
        const onClick = () => grid.scrollBy({ left: (dir === "prev" ? -1 : 1) * Math.max(280, grid.clientWidth * 0.8), behavior: "smooth" })
        b.addEventListener("click", onClick)
        cleanups.push(() => { b.removeEventListener("click", onClick); b.remove() })
        wrap.appendChild(b)
      }
      mk("prev")
      mk("next")
    }

    return () => cleanups.forEach(fn => fn())
  }, [])

  return null
}
