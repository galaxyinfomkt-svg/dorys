#!/usr/bin/env node
/**
 * Import researched healthcare-landscape data into data/cities/{slug}.json.
 *
 * These facility names are the single most sensitive content on the site. They
 * appear as LOCAL MARKET CONTEXT — "serving the medical offices and practices in
 * and around the {facility} corridor" — and must never read as a client list.
 * Naming a hospital as a customer when it is not is a false statement about a
 * third party, and in healthcare procurement it is the kind of claim that ends
 * a vendor relationship rather than starting one.
 *
 * Rules enforced here rather than trusted upstream:
 *  - No sourceUrls => nothing is written. A facility name with no source is
 *    exactly the fabrication this data layer exists to prevent.
 *  - A city is marked `verified: true` only when it has majorFacilities or
 *    medicalCorridors. That flag is the publish gate: it is what lets the
 *    service x city page drop its noindex.
 *
 *   node scripts/import-healthcare-landscape.mjs results.json [--dry]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const CITIES = join(process.cwd(), 'data/cities')
const TODAY = process.env.CHECKED_DATE || new Date().toISOString().slice(0, 10)

const input = process.argv[2]
if (!input || !existsSync(input)) {
  console.error('usage: node scripts/import-healthcare-landscape.mjs <results.json> [--dry]')
  process.exit(1)
}

const entries = JSON.parse(readFileSync(input, 'utf8'))
const decode = (s) =>
  typeof s === 'string' ? s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim() : s

let written = 0
let verified = 0
const skipped = []

for (const e of entries) {
  const file = join(CITIES, `${e.slug}.json`)
  if (!existsSync(file)) {
    console.error(`  ! unknown city: ${e.slug}`)
    continue
  }
  if (!(e.sourceUrls || []).length) {
    skipped.push(e.slug)
    continue
  }

  const d = JSON.parse(readFileSync(file, 'utf8'))
  const facilities = (e.majorFacilities || [])
    .filter((f) => f && f.name)
    .map((f) => ({ name: decode(f.name), type: decode(f.type) || null }))

  d.healthcareLandscape = {
    ...d.healthcareLandscape,
    majorFacilities: facilities,
    healthSystems: (e.healthSystems || []).map(decode),
    medicalCorridors: (e.medicalCorridors || []).map(decode),
    dominantFacilityType: decode(e.dominantFacilityType) || null,
    _context:
      'Market context only. These facilities are NOT clients of Dory’s Cleaning Services and no copy may imply they are.',
    source: e.sourceUrls[0],
    checked: TODAY,
    ...(e.notes ? { note: decode(e.notes) } : {}),
  }

  // The publish gate. A page may claim local authority only once it carries a
  // real, sourced local fact.
  const hasDepth = facilities.length > 0 || (e.medicalCorridors || []).length > 0
  d.verified = hasDepth
  if (hasDepth) verified++

  if (!DRY) writeFileSync(file, JSON.stringify(d, null, 2) + '\n')
  written++
}

console.log(`${DRY ? 'DRY RUN — ' : ''}cities written: ${written}`)
console.log(`  now verified (publish gate passed): ${verified}`)
if (skipped.length) console.log(`  skipped (no source): ${skipped.join(', ')}`)
