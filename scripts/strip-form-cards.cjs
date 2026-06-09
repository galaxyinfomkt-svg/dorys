#!/usr/bin/env node
/**
 * strip-form-cards.cjs — removes the white/coloured "card" wrapper (and its
 * header/badge/heading chrome) around every GoHighLevel form iframe in a
 * page's mainHtml, leaving ONLY the bare GHL iframe (as it comes from GHL).
 *
 * For each iframe whose src points at leadconnectorhq.com/widget/form, the
 * immediate parent <div> is treated as the card. If that parent looks like a
 * visible card (has a background colour/gradient or the .form-embed class), the
 * whole parent is replaced by a transparent, centred wrapper containing only
 * the iframe. Parents that aren't cards are left untouched (safety guard).
 *
 * Usage:
 *   node scripts/strip-form-cards.cjs --dry  file1.json [file2.json ...]
 *   node scripts/strip-form-cards.cjs --apply file1.json [file2.json ...]
 */
const fs = require("fs")

const IFRAME_SRC = "leadconnectorhq.com/widget/form"
const CARD_RE = /class="[^"]*\bform-embed\b|background\s*:\s*(?:#|var\(|rgb|hsl|linear-gradient|radial-gradient)/i

function immediateParentDivOpen(html, beforeIdx) {
  const re = /<div\b|<\/div>/gi
  const stack = []
  let m
  while ((m = re.exec(html)) && m.index < beforeIdx) {
    if (m[0][1] === "/") stack.pop()
    else stack.push(m.index)
  }
  return stack.length ? stack[stack.length - 1] : -1
}

function matchingClose(html, openIdx) {
  const re = /<div\b|<\/div>/gi
  re.lastIndex = openIdx
  let depth = 0, m
  while ((m = re.exec(html))) {
    if (m[0][1] === "/") {
      depth--
      if (depth === 0) return m.index + m[0].length
    } else depth++
  }
  return -1
}

function stripHtml(html) {
  // Collect all GHL form iframes
  const targets = []
  let from = 0
  while (true) {
    const srcIdx = html.indexOf(IFRAME_SRC, from)
    if (srcIdx < 0) break
    from = srcIdx + IFRAME_SRC.length
    const ifOpen = html.lastIndexOf("<iframe", srcIdx)
    const ifCloseTag = html.indexOf("</iframe>", srcIdx)
    if (ifOpen < 0 || ifCloseTag < 0) continue
    const ifClose = ifCloseTag + "</iframe>".length
    const iframe = html.substring(ifOpen, ifClose)

    const parentOpen = immediateParentDivOpen(html, ifOpen)
    if (parentOpen < 0) continue
    const tagEnd = html.indexOf(">", parentOpen) + 1
    const openTag = html.substring(parentOpen, tagEnd)
    if (!CARD_RE.test(openTag)) continue // not a card → leave alone
    const parentClose = matchingClose(html, parentOpen)
    if (parentClose < 0) continue
    targets.push({ start: parentOpen, end: parentClose, iframe })
  }
  // Apply non-overlapping replacements from last to first
  targets.sort((a, b) => b.start - a.start)
  let out = html
  let changed = 0
  let lastStart = Infinity
  for (const t of targets) {
    if (t.end > lastStart) continue // overlaps a later (already-applied) card; skip
    const replacement =
      '<div class="form-bare" style="max-width:620px;margin:1.5rem auto;width:100%;">' +
      t.iframe +
      "</div>"
    out = out.substring(0, t.start) + replacement + out.substring(t.end)
    lastStart = t.start
    changed++
  }
  return { out, changed }
}

const path = require("path")
function expand(p, acc) {
  const st = fs.statSync(p)
  if (st.isDirectory()) {
    for (const e of fs.readdirSync(p)) expand(path.join(p, e), acc)
  } else if (p.endsWith(".json")) acc.push(p)
  return acc
}

const args = process.argv.slice(2)
const apply = args.includes("--apply")
const dry = args.includes("--dry") || !apply
const inputs = args.filter((a) => !a.startsWith("--"))
const files = inputs.reduce((acc, p) => expand(p, acc), [])

let totalFiles = 0, totalCards = 0, touched = 0
for (const file of files) {
  let d
  try {
    d = JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (e) {
    console.error(`SKIP ${file}: ${e.message}`)
    continue
  }
  if (typeof d.mainHtml !== "string" || d.mainHtml.indexOf(IFRAME_SRC) < 0) continue
  totalFiles++
  const { out, changed } = stripHtml(d.mainHtml)
  if (changed > 0) {
    totalCards += changed
    touched++
    if (apply) {
      d.mainHtml = out
      fs.writeFileSync(file, JSON.stringify(d))
    }
  }
  if (dry) console.log(`${changed > 0 ? "WOULD STRIP" : "no card   "} ${String(changed).padStart(2)}  ${file}`)
}
console.log(`\n${apply ? "APPLIED" : "DRY-RUN"}: ${touched}/${totalFiles} files with cards, ${totalCards} cards ${apply ? "stripped" : "to strip"}.`)
