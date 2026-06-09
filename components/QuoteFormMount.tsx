"use client"

import { useEffect } from "react"
import { createRoot, type Root } from "react-dom/client"
import QuoteForm from "./QuoteForm"

// Mounts the native React <QuoteForm> into any `.quote-form-mount` placeholder
// inside the legacy HTML blobs (home.json / location & service pages render
// their body via dangerouslySetInnerHTML, so the form can't be a child there).
// data-heading="" renders the form without its own title (when the surrounding
// card already has a heading); a non-empty value renders the title.
export default function QuoteFormMount() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".quote-form-mount"))
    const roots: Root[] = []
    nodes.forEach((node) => {
      if (node.dataset.mounted) return
      node.dataset.mounted = "1"
      const heading = node.dataset.heading || ""
      const root = createRoot(node)
      root.render(<QuoteForm heading={heading} />)
      roots.push(root)
    })
    return () => {
      // defer so we never unmount synchronously during a parent render
      setTimeout(() => roots.forEach((r) => r.unmount()), 0)
    }
  }, [])
  return null
}
