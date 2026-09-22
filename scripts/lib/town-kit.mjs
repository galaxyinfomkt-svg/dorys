/**
 * Shared helpers for the town-level page builders
 * (build-service-city-pages.mjs, build-location-pages.mjs): sourced town data,
 * geography computed from it, and deterministic per-page selection.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
export const company = JSON.parse(readFileSync(join(ROOT, 'data/company.json'), 'utf8'))
export const SITE = company.site.url
export const PHONE = company.phone
export const PHONE_DISP = company.phoneDisplay
export const FORM_ID = company.ghl.formId
export const YEARS = company.yearsClinicalExperience
export const HQ = { lat: company.geo.lat, lng: company.geo.lng, name: company.address.city }

export const cities = JSON.parse(readFileSync(join(ROOT, 'data/cities-list.json'), 'utf8')).map((r) => {
  const slug = r.s.replace(/-ma$/, '')
  const p = join(ROOT, `data/cities/${slug}.json`)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : { slug, name: r.n }
})

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const titleCase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
/** Lower-case a proper label for use mid-sentence ("Dental Office Cleaning" -> "dental office cleaning"). */
export const lc = (s) => s.toLowerCase()
/** Capitalise the first letter only, keeping acronyms such as X-ray or ENT. */
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
export const num = (n) => Number(n).toLocaleString('en-US')

export const UNIVERSAL = new Set([
  'medical-office-cleaning',
  'dental-office-cleaning',
  'specialty-clinics',
  'rehabilitation-clinics',
  'skilled-nursing',
  'assisted-living-cleaning',
  'ambulatory-outpatient',
  'urgent-care-cleaning',
])

/** Which verified facilities are relevant to a service (type + name match). */
export const FACILITY_MATCH = {
  'dental-office-cleaning': /dental|dentist|orthodont|oral surg|periodont/i,
  'urgent-care-cleaning': /urgent care|walk-in|express care/i,
  'skilled-nursing': /nursing|skilled|long-term care|post-acute|transitional care/i,
  'assisted-living-cleaning': /assisted living|rest home|memory care|senior living|independent living|retirement/i,
  'rehabilitation-clinics': /rehab|physical therap|occupational therap|sports medicine/i,
  'ambulatory-outpatient': /outpatient|ambulatory|surgery center|surgical|day surgery|endoscopy/i,
  'specialty-clinics': /specialty|pediatric|behavioral|oncology|cancer|cardio|nephrology|dialysis|imaging|eye|ophthalm|dermatolog|orthop|\bENT\b/i,
  'medical-office-cleaning': /primary care|medical office|physician|practice|health center|medical building|multi-specialty|internal medicine|family medicine/i,
}

/** Shorter labels so "<service> in <Town>, MA | Dory's" fits in ~60 chars. */
export const SHORT = {
  'assisted-living-cleaning': 'Assisted Living Cleaning',
  'ambulatory-outpatient': 'Outpatient Facility Cleaning',
  'skilled-nursing': 'Nursing Home Cleaning',
  'rehabilitation-clinics': 'Rehab Clinic Cleaning',
  'urgent-care-cleaning': 'Urgent Care Cleaning',
  'specialty-clinics': 'Specialty Clinic Cleaning',
  'medical-office-cleaning': 'Medical Office Cleaning',
  'dental-office-cleaning': 'Dental Office Cleaning',
}

/** What the service calls the places it cleans, singular/plural. */
export const NOUN = {
  'medical-office-cleaning': ['medical office', 'medical offices'],
  'dental-office-cleaning': ['dental practice', 'dental practices'],
  'urgent-care-cleaning': ['urgent care center', 'urgent care centers'],
  'specialty-clinics': ['specialty clinic', 'specialty clinics'],
  'ambulatory-outpatient': ['outpatient or ambulatory surgery center', 'outpatient and ambulatory surgery centers'],
  'rehabilitation-clinics': ['rehabilitation clinic', 'rehabilitation clinics'],
  'skilled-nursing': ['skilled nursing facility', 'skilled nursing facilities'],
  'assisted-living-cleaning': ['assisted living residence', 'assisted living residences'],
}

/** Real assets in public/assets/images/services — the closest clinical match. */
export const HERO = {
  'medical-office-cleaning': 'medical-office-new',
  'dental-office-cleaning': 'dental-operatory',
  'specialty-clinics': 'specialty-clinic',
  'rehabilitation-clinics': 'rehab-nursing',
  'skilled-nursing': 'infection-control-disinfection',
  'assisted-living-cleaning': 'assisted-living-senior-care',
  'ambulatory-outpatient': 'ambulatory-facility',
  'urgent-care-cleaning': 'clinic-outpatient-sanitation',
}

// --- deterministic selection ------------------------------------------------
/** FNV-1a: a stable 32-bit hash so every rebuild picks the same variants. */
export function hash(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}
/** Pick one of `arr` for this page + slot. */
export const pick = (arr, key) => arr[hash(key) % arr.length]
/** k items from arr, chosen by key, returned in their original order. */
export function subset(arr, k, key) {
  if (!arr || arr.length <= k) return arr || []
  const idx = arr.map((_, i) => i).sort((a, b) => hash(`${key}:${a}`) - hash(`${key}:${b}`))
  return idx.slice(0, k).sort((a, b) => a - b).map((i) => arr[i])
}

// --- geography ---------------------------------------------------------------
export const R = 3958.8
export function miles(a, b) {
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}
export function compass(a, b) {
  const rad = (d) => (d * Math.PI) / 180
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat))
  const x =
    Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) -
    Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng))
  const brg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
  return ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'][
    Math.round(brg / 45) % 8
  ]
}
export const pt = (c) => (c.geo ? { lat: c.geo.lat, lng: c.geo.lng } : null)
export const round1 = (n) => Math.round(n * 10) / 10

export function hqFacts(city) {
  const p = pt(city)
  if (!p) return null
  const d = miles(HQ, p)
  if (d < 1.5) return { d: 0, dir: null }
  return { d: Math.round(d), dir: compass(HQ, p) }
}

/** Served towns ordered by distance from this one. */
export function nearest(city) {
  const p = pt(city)
  if (!p) return []
  return cities
    .filter((c) => c.slug !== city.slug && pt(c))
    .map((c) => ({ c, d: miles(p, pt(c)) }))
    .sort((a, b) => a.d - b.d)
}

const DENTAL = /dental|dentist|orthodont|oral surg|periodont/i
const RESIDENTIAL = /nursing|skilled|assisted|senior living|memory care|rest home/i
const THERAPY = /physical therap|rehabilitation clinic|sports medicine/i
const SENIOR = new Set(['skilled-nursing', 'assisted-living-cleaning'])
export const relevantFacilities = (city, service) =>
  ((city.healthcareLandscape || {}).majorFacilities || []).filter((f) => {
    if (!f || !f.name) return false
    const text = `${f.type || ''} ${f.name}`
    // Dental practices match only the dental service ("practice" and
    // "pediatric" would otherwise pull them into medical/specialty pages).
    if (service.slug !== 'dental-office-cleaning' && DENTAL.test(text)) return false
    // Therapy clinics and residential senior care belong to their own pages:
    // an outpatient PT clinic is not a surgery center ("outpatient"), and a
    // "Nursing and Rehabilitation Center" is not an outpatient rehab clinic.
    const type = f.type || ''
    if (RESIDENTIAL.test(type)) return SENIOR.has(service.slug) && FACILITY_MATCH[service.slug].test(text)
    if (THERAPY.test(type)) return service.slug === 'rehabilitation-clinics'
    return FACILITY_MATCH[service.slug]?.test(text)
  })

/** Town facts, every one from a sourced field or computed from them. */
export function townFacts(city) {
  const g = city.geo || {}
  const pop = city.population?.value
  const rows = []
  if (g.municipalType) rows.push(['Municipal form', g.municipalType === 'city' ? 'City' : 'Town'])
  if (city.county) rows.push(['County', `${city.county} County`])
  if (city.region) rows.push(['Region', city.region])
  if (pop) rows.push(['Population', `${num(pop)} (2020 U.S. Census)`])
  if (g.landSqMi) rows.push(['Land area', `${g.landSqMi.toFixed(1)} sq mi`])
  if (g.waterSqMi && g.waterSqMi >= 0.05) rows.push(['Water area', `${g.waterSqMi.toFixed(1)} sq mi`])
  if (pop && g.landSqMi) rows.push(['Density', `about ${num(Math.round(pop / g.landSqMi))} residents per sq mi`])
  if (city.zipCodes?.length) rows.push([city.zipCodes.length > 1 ? 'ZIP codes' : 'ZIP code', city.zipCodes.join(', ')])
  const hq = hqFacts(city)
  if (hq) rows.push(['From our base', hq.d ? `about ${hq.d} miles ${hq.dir} of ${HQ.name} (straight line)` : `${HQ.name} is our home base`])
  const dom = city.healthcareLandscape?.dominantFacilityType
  if (dom) rows.push(['Typical healthcare setting', dom])
  return rows
}


/** A verified hospital or medical campus in town — the anchor that outpatient
 * practices cluster around. Used when no facility matches a service directly,
 * so a city like Worcester is described by UMass Memorial rather than by
 * "no verified medical office". Never presented as a client. */
export function anchorFacility(city) {
  return ((city.healthcareLandscape || {}).majorFacilities || []).find(
    (f) => f && f.name && /hospital|medical center|medical campus|health system|outpatient campus/i.test(`${f.type || ''} ${f.name}`)
  )
}

/** The town's local health authority (name + official page), when recorded. */
export function healthAuthority(city) {
  const lh = city.localHealth || {}
  return lh.boardOfHealthName && lh.boardOfHealthUrl ? { name: lh.boardOfHealthName, url: lh.boardOfHealthUrl } : null
}

/** Paragraph linking the local health authority's official page. */
export function healthAuthorityHtml(city, esc) {
  const h = healthAuthority(city)
  if (!h) return ''
  return (
    `<p>Local health authority: <a href="${esc(h.url)}" rel="noopener nofollow" target="_blank">${esc(h.name)}</a> ` +
    `(official ${esc(city.name)} page). Healthcare facilities are licensed and surveyed by the Massachusetts ` +
    `Department of Public Health; the local board handles environmental-health matters under the State Sanitary Code and local rules.</p>`
  )
}

/** FAQ entry about the local health authority. */
export function healthAuthorityFaq(city) {
  const h = healthAuthority(city)
  if (!h) return null
  return {
    q: `Who is the local health authority in ${city.name}?`,
    a: `The ${h.name}; its official page is ${h.url}. Clinics, hospitals and long-term care facilities are licensed and surveyed by the Massachusetts Department of Public Health, while the local board of health handles local environmental-health matters under the State Sanitary Code and local regulations. Our cleaning records are kept so they serve both.`,
  }
}
