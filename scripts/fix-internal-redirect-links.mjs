#!/usr/bin/env node
/**
 * Rewrite internal hrefs that point at a 301 so every link lands on the final
 * URL in one hop. Source of truth for the redirects is the same data the
 * middleware reads (data/redirects-pruned-cities.json + the root→hub moves),
 * so this can be re-run after any future prune.
 *
 * A crawl on 2026-09-22 found ~4,100 internal links that 301'd: four footer
 * links on every page, 218 per-city cards on the /locations pages, a pruned
 * town in the /locations directory and a relative href="./".
 *
 *   node scripts/fix-internal-redirect-links.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const MAP = new Map()
for (const r of JSON.parse(readFileSync(join(ROOT, 'data/redirects-pruned-cities.json'), 'utf8')))
  MAP.set(r.source, r.destination)
for (const s of ['dental-office-cleaning', 'urgent-care-cleaning', 'assisted-living-cleaning'])
  MAP.set(`/${s}`, `/services/${s}`)

const resolve = (p) => {
  const seen = new Set()
  while (MAP.has(p) && !seen.has(p)) { seen.add(p); p = MAP.get(p) }
  return p
}

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (f.endsWith('.json') && f !== 'redirects-pruned-cities.json') out.push(p)
  }
  return out
}

let files = 0, links = 0, removed = 0
for (const file of [...walk(join(ROOT, 'data')), join(ROOT, 'components/Footer.tsx'), join(ROOT, 'components/Header.tsx')]) {
  const src = readFileSync(file, 'utf8')
  let out = src
  // A town that 301s to the /locations directory is not a place we serve: drop
  // the whole <a>, not just retarget it (a "Westwood" link to the directory lies).
  out = out.replace(/ ?<a href=\\"(\/locations\/[a-z-]+-ma)\\">[^<]*<\/a>(\\n)?/g, (m, p) => {
    if (resolve(p) === '/locations') { removed++; return '' }
    return m
  })
  out = out.replace(/(href=\\?")(\/[^"\\#?]*)/g, (m, pre, p) => {
    const to = resolve(p.length > 1 ? p.replace(/\/$/, '') : p)
    if (to !== p) { links++; return pre + to }
    return m
  })
  if (file.includes('/locations/')) out = out.replace(/href=\\"\.\/\\"/g, () => { links++; return 'href=\\"/locations\\"' })
  if (out !== src) { files++; if (!DRY) writeFileSync(file, out) }
}
console.log(`${DRY ? 'DRY — ' : ''}files ${files}, links retargeted ${links}, dead town links removed ${removed}`)
