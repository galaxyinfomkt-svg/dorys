#!/usr/bin/env node
/**
 * Point internal links at the pages that can rank.
 *
 * Run after build-service-city-pages.mjs, which decides per page whether a
 * /services/{service}/{town} page is index or noindex. Two passes:
 *
 *  1. Each service hub's city list is rebuilt to hold exactly the indexable
 *     town pages for that service. The hubs used to list a fixed set of towns,
 *     so most indexable town pages had one inbound link or none (orphans).
 *  2. Any link, anywhere in data/, to a noindex town page is retargeted to that
 *     service's hub. A crawl on 2026-09-22 found 548 links from indexable pages
 *     into noindex pages — link equity poured into pages told not to rank.
 *     noindex pages linking to each other is left alone: nothing ranks there.
 *
 *   node scripts/relink-service-pages.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const SVC = join(ROOT, 'data/services')
const read = (p) => JSON.parse(readFileSync(p, 'utf8'))
const noindex = (d) => /noindex/i.test(d?.robots || '')
const save = (p, raw, d) =>
  !DRY && writeFileSync(p, JSON.stringify(d, null, raw.startsWith('{\n') ? 2 : undefined) + (raw.endsWith('\n') ? '\n' : ''))

const indexable = {} // service -> [{slug, city}]
const dead = new Set() // "/services/x/town-ma" paths that are noindex
for (const svc of readdirSync(SVC)) {
  const dir = join(SVC, svc)
  if (svc.startsWith('_') || !statSync(dir).isDirectory()) continue
  for (const f of readdirSync(dir).filter((f) => f.endsWith('-ma.json'))) {
    const d = read(join(dir, f))
    const path = `/services/${svc}/${f.replace(/\.json$/, '')}`
    if (noindex(d)) dead.add(path)
    else (indexable[svc] ||= []).push({ slug: f.replace(/\.json$/, ''), city: d.city })
  }
}

// --- 1. hub city lists ------------------------------------------------------
// A service with no indexable town page (dental, today) links its town list to
// the /locations hubs instead — never to itself or to noindex pages.
const allTowns = JSON.parse(readFileSync(join(ROOT, 'data/cities-list.json'), 'utf8'))
let hubs = 0
for (const svc of readdirSync(SVC)) {
  const hubFile = join(SVC, svc, 'index.json')
  if (svc.startsWith('_') || !existsSync(hubFile)) continue
  const hubData = read(hubFile)
  if (!/nearby-cities__list/.test(hubData.mainHtml) || indexable[svc]) continue
  const list = hubData.mainHtml.match(/<div class="nearby-cities__list">([\s\S]*?)<\/div><\/div>/)
  const names = list ? [...list[1].matchAll(/>([^<]+)<\/a>/g)].map((m) => m[1]) : []
  const towns = allTowns.filter((t) => names.includes(t.n))
  if (!towns.length) continue
  const raw = readFileSync(hubFile, 'utf8')
  hubData.mainHtml = hubData.mainHtml.replace(
    /(<div class="nearby-cities__list">)[\s\S]*?(<\/div><\/div>)/,
    `$1${towns.map((t) => `<a href="/locations/${t.s}" class="nearby-cities__link">${t.n}</a>`).join('')}$2`
  )
  hubs++
  save(hubFile, raw, hubData)
}
for (const [svc, list] of Object.entries(indexable)) {
  const p = join(SVC, svc, 'index.json')
  if (!existsSync(p)) continue
  const raw = readFileSync(p, 'utf8')
  const d = JSON.parse(raw)
  const links = list
    .sort((a, b) => a.city.localeCompare(b.city))
    .map((c) => `<a href="/services/${svc}/${c.slug}" class="nearby-cities__link">${c.city}</a>`)
    .join('')
  const next = d.mainHtml.replace(
    /(<div class="nearby-cities__list">)[\s\S]*?(<\/div><\/div>)/,
    `$1${links}$2`
  )
  if (next !== d.mainHtml) {
    d.mainHtml = next
    hubs++
    save(p, raw, d)
  }
}

// --- 2. retarget links into noindex town pages --------------------------------
function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (f.endsWith('.json')) out.push(p)
  }
  return out
}
let files = 0, links = 0
for (const p of walk(join(ROOT, 'data'))) {
  const raw = readFileSync(p, 'utf8')
  let d
  try { d = JSON.parse(raw) } catch { continue }
  if (!d || typeof d.mainHtml !== 'string' || noindex(d)) continue
  const next = d.mainHtml.replace(/href="(\/services\/([a-z-]+)\/[a-z-]+-ma)"/g, (m, path, svc) => {
    if (!dead.has(path)) return m
    links++
    return `href="/services/${svc}"`
  })
  if (next !== d.mainHtml) {
    d.mainHtml = next
    files++
    save(p, raw, d)
  }
}
// --- 3. a link whose text is just a town name goes to that town -------------
// City-name chips ("Worcester", "Natick") in service blocks must not all point
// at one hub: link the town's service page when it is indexable, otherwise the
// town page /locations/{town}-ma.
const townSlug = new Map(allTowns.map((t) => [t.n, t.s]))
const live = new Set(Object.entries(indexable).flatMap(([svc, l]) => l.map((c) => `/services/${svc}/${c.slug}`)))
let chips = 0
for (const p of walk(join(ROOT, 'data'))) {
  const raw = readFileSync(p, 'utf8')
  let d
  try { d = JSON.parse(raw) } catch { continue }
  if (!d || typeof d.mainHtml !== 'string' || noindex(d)) continue
  const next = d.mainHtml.replace(
    /<a href="\/services\/([a-z-]+)(?:\/[a-z-]+-ma)?"([^>]*)>((?:<svg[\s\S]*?<\/svg>)?\s*)([^<]+)<\/a>/g,
    (m, svc, attrs, icon, text) => {
      const slug = townSlug.get(text.trim())
      if (!slug) return m
      const want = live.has(`/services/${svc}/${slug}`) ? `/services/${svc}/${slug}` : `/locations/${slug}`
      const out = `<a href="${want}"${attrs}>${icon}${text}</a>`
      if (out !== m) chips++
      return out
    }
  )
  if (next !== d.mainHtml) {
    d.mainHtml = next
    save(p, raw, d)
  }
}

const total = Object.values(indexable).reduce((a, l) => a + l.length, 0)
console.log(`${DRY ? 'DRY — ' : ''}hub lists rebuilt ${hubs} (${total} town pages), links retargeted ${links} in ${files} files, town chips fixed ${chips}`)
