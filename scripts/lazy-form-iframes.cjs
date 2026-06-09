#!/usr/bin/env node
/**
 * lazy-form-iframes.cjs — convert each GHL form iframe's `src` to `data-src`
 * so the heavy embed (reCAPTCHA + libphonenumber + form chunks) does NOT load
 * during initial paint. components/LazyEmbeds.tsx restores src on first
 * interaction / when the form scrolls near the viewport / after an idle
 * fallback. Only touches iframes pointing at leadconnectorhq.com/widget/form
 * (maps, booking and review widgets are left as-is).
 *
 * Usage:
 *   node scripts/lazy-form-iframes.cjs --dry  data
 *   node scripts/lazy-form-iframes.cjs --apply data
 */
const fs = require("fs")
const path = require("path")

const FORM = "leadconnectorhq.com/widget/form"

function lazify(html) {
  let n = 0
  const out = html.replace(/<iframe\b[^>]*>/gi, (tag) => {
    if (tag.indexOf(FORM) < 0) return tag
    if (/\sdata-src=/.test(tag)) return tag // already lazy
    if (!/\ssrc=/.test(tag)) return tag
    n++
    return tag.replace(/\ssrc=/, " data-src=")
  })
  return { out, n }
}

function expand(p, acc) {
  const st = fs.statSync(p)
  if (st.isDirectory()) for (const e of fs.readdirSync(p)) expand(path.join(p, e), acc)
  else if (p.endsWith(".json")) acc.push(p)
  return acc
}

const args = process.argv.slice(2)
const apply = args.includes("--apply")
const inputs = args.filter((a) => !a.startsWith("--"))
const files = inputs.reduce((acc, p) => expand(p, acc), [])

let touched = 0, total = 0
for (const file of files) {
  let d
  try { d = JSON.parse(fs.readFileSync(file, "utf8")) } catch { continue }
  if (typeof d.mainHtml !== "string" || d.mainHtml.indexOf(FORM) < 0) continue
  const { out, n } = lazify(d.mainHtml)
  if (n > 0) {
    touched++
    total += n
    if (apply) { d.mainHtml = out; fs.writeFileSync(file, JSON.stringify(d)) }
  }
}
console.log(`${apply ? "APPLIED" : "DRY-RUN"}: ${touched} files, ${total} form iframes -> data-src`)
