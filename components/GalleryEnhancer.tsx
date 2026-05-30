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
    const tabs = Array.from(root.querySelectorAll<HTMLElement>(".gallery-tab"))
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
      const cat = (t.getAttribute("for") || "gf-all").replace("gf-", "")
      t.dataset.cat = cat
      t.removeAttribute("for") // disable native radio toggle — JS owns filtering
      t.setAttribute("role", "button")
      t.setAttribute("tabindex", "0")
      const onClick = () => apply(cat)
      const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apply(cat) } }
      t.addEventListener("click", onClick)
      t.addEventListener("keydown", onKey)
      cleanups.push(() => { t.removeEventListener("click", onClick); t.removeEventListener("keydown", onKey) })
    })

    apply("all")
    return () => cleanups.forEach(fn => fn())
  }, [])

  return null
}
