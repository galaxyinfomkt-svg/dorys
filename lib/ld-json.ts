/**
 * Serialise a schema.org object for an inline <script type="application/ld+json">.
 *
 * Rendered with a plain <script>, never next/script: next/script only ships the
 * JSON in the RSC payload and injects it after hydration, so the served HTML
 * carried zero structured data — invisible to Bing, AI crawlers and Google's
 * first (non-rendered) pass. `<` is escaped so a string containing "</script>"
 * can never close the tag early.
 */
export function ldJson(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c")
}
