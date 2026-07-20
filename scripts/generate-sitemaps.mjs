#!/usr/bin/env node
/**
 * Generate the sitemap set from the page data itself.
 *
 * The previous sitemaps were the site's quietest and most expensive bug: the
 * five per-service files each held exactly ONE url — the service hub — and that
 * one url carried a trailing slash, so it 308-redirected. Roughly 1,485 pages,
 * 82% of the site, were in no sitemap at all. The files existed, the build
 * passed, and nothing looked wrong.
 *
 * So this generator derives everything from the page records rather than a
 * hand-maintained list, and refuses to emit a sitemap it knows is broken:
 *  - a page is included only if its own `robots` field says index
 *  - urls never carry a trailing slash, because the site is trailingSlash:false
 *  - an empty or suspiciously small segment fails the run rather than shipping
 *
 *   node scripts/generate-sitemaps.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const company = JSON.parse(readFileSync(join(ROOT, 'data/company.json'), 'utf8'))
const SITE = company.site.url
const PUB = join(ROOT, 'public')

const isIndexable = (d) => !/noindex/i.test(d?.robots || '')

/** mtime of the data file, so lastmod moves only when the content moved. */
function lastmod(file) {
  try {
    return statSync(file).mtime.toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

function readJson(p) {
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

const segments = {}

// --- static pages -----------------------------------------------------------
const pagesDir = join(ROOT, 'data/pages')
const corePages = [{ loc: SITE, lastmod: lastmod(join(ROOT, 'data/home.json')), priority: 1.0 }]
if (existsSync(pagesDir)) {
  for (const f of readdirSync(pagesDir).filter((f) => f.endsWith('.json'))) {
    const d = readJson(join(pagesDir, f))
    if (!d || !isIndexable(d)) continue
    corePages.push({
      loc: `${SITE}/${f.replace(/\.json$/, '')}`,
      lastmod: lastmod(join(pagesDir, f)),
      priority: 0.7,
    })
  }
}
segments['sitemap-pages.xml'] = corePages

// --- city hubs --------------------------------------------------------------
const locDir = join(ROOT, 'data/locations')
const locations = []
if (existsSync(locDir)) {
  for (const f of readdirSync(locDir).filter((f) => f.endsWith('.json') && f !== 'index.json')) {
    const d = readJson(join(locDir, f))
    if (!d || !isIndexable(d)) continue
    locations.push({
      loc: `${SITE}/locations/${f.replace(/\.json$/, '')}`,
      lastmod: lastmod(join(locDir, f)),
      priority: 0.8,
    })
  }
}
segments['sitemap-locations.xml'] = locations

// --- service hubs + one segment per service ---------------------------------
const svcRoot = join(ROOT, 'data/services')
const serviceHubs = []
for (const svc of readdirSync(svcRoot)) {
  const dir = join(svcRoot, svc)
  if (svc.startsWith('_') || !statSync(dir).isDirectory()) continue

  const hub = readJson(join(dir, 'index.json'))
  if (hub && isIndexable(hub)) {
    serviceHubs.push({
      loc: `${SITE}/services/${svc}`,
      lastmod: lastmod(join(dir, 'index.json')),
      priority: 0.9,
    })
  }

  const cityPages = []
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'index.json')) {
    const d = readJson(join(dir, f))
    if (!d || !isIndexable(d)) continue
    cityPages.push({
      loc: `${SITE}/services/${svc}/${f.replace(/\.json$/, '')}`,
      lastmod: lastmod(join(dir, f)),
      priority: 0.7,
    })
  }
  if (cityPages.length) segments[`sitemap-services-${svc}.xml`] = cityPages
}
segments['sitemap-services.xml'] = serviceHubs

// --- blog -------------------------------------------------------------------
const blogDir = join(ROOT, 'data/blog')
const blog = []
if (existsSync(blogDir)) {
  for (const f of readdirSync(blogDir).filter((f) => f.endsWith('.json') && f !== 'index.json')) {
    const d = readJson(join(blogDir, f))
    if (!d || !isIndexable(d)) continue
    blog.push({
      loc: `${SITE}/blog/${f.replace(/\.json$/, '')}`,
      lastmod: lastmod(join(blogDir, f)),
      priority: 0.6,
    })
  }
}
if (blog.length) segments['sitemap-blog.xml'] = blog

// --- guards -----------------------------------------------------------------
// The bug being fixed here shipped because nobody checked the files had content.
const problems = []
for (const [name, urls] of Object.entries(segments)) {
  if (!urls.length) problems.push(`${name} is EMPTY`)
  for (const u of urls) {
    if (u.loc.endsWith('/') && u.loc !== SITE) problems.push(`${name}: trailing slash on ${u.loc}`)
  }
}
const total = Object.values(segments).reduce((a, u) => a + u.length, 0)
if (total < 100) problems.push(`only ${total} urls in total — expected several hundred`)

if (problems.length) {
  console.error('✖ refusing to write:')
  for (const p of problems) console.error(`   ${p}`)
  process.exit(1)
}

// --- write ------------------------------------------------------------------
const urlset = (urls) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod>` +
        `<changefreq>monthly</changefreq><priority>${u.priority}</priority></url>`
    )
    .join('\n') +
  `\n</urlset>\n`

const names = Object.keys(segments).sort()
const index =
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  names
    .map((n) => {
      const newest = segments[n].reduce((a, u) => (u.lastmod > a ? u.lastmod : a), '1970-01-01')
      return `  <sitemap><loc>${SITE}/${n}</loc><lastmod>${newest}</lastmod></sitemap>`
    })
    .join('\n') +
  `\n</sitemapindex>\n`

if (!DRY) {
  for (const [name, urls] of Object.entries(segments)) writeFileSync(join(PUB, name), urlset(urls))
  writeFileSync(join(PUB, 'sitemap.xml'), index)

  // Remove sitemaps from the old service taxonomy so nothing stale is served.
  for (const f of readdirSync(PUB).filter((f) => /^sitemap-services-.*\.xml$/.test(f))) {
    if (!names.includes(f)) {
      writeFileSync(join(PUB, f), urlset([]))
      console.log(`  (emptied stale ${f} — delete after Search Console drops it)`)
    }
  }
}

console.log(`${DRY ? 'DRY RUN — ' : ''}sitemaps: ${names.length + 1}  urls: ${total}`)
for (const n of names) console.log(`  ${n.padEnd(44)} ${String(segments[n].length).padStart(4)}`)
