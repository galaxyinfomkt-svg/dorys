#!/usr/bin/env node
/**
 * Add verifiable geography to every served town: land and water area,
 * municipal form (city/town), an interior point, and the town's ZIP codes.
 *
 *   data/geo/ma-county-subdivisions-2016.tsv — the Massachusetts rows of the
 *     U.S. Census Bureau 2016 Gazetteer county-subdivision file
 *     (2016_Gaz_cousubs_national). Every Massachusetts town and city is a
 *     county subdivision, so each served municipality has exactly one row.
 *   zipcodes (npm) — USPS ZIP codes by place name.
 *
 * Writes city.geo into data/cities/{slug}.json and fills city.zipCodes. Values
 * are copied, never estimated; a town with no match keeps null.
 *
 *   node scripts/build-city-geo.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const zipcodes = require('zipcodes')
const ROOT = process.cwd()

const rows = readFileSync(join(ROOT, 'data/geo/ma-county-subdivisions-2016.tsv'), 'utf8')
  .trim()
  .split('\n')
  .map((l) => l.split('\t').map((c) => c.trim()))
const byName = new Map()
for (const r of rows) {
  const full = r[3]
  const m = full.match(/^(.*?)(?: Town)? (city|town)$/)
  if (!m) continue
  byName.set(m[1], {
    municipalType: m[2], // Massachusetts legal form: "city" or "town"
    geoid: r[1],
    landSqMi: Number(r[7]),
    waterSqMi: Number(r[8]),
    lat: Number(r[9]),
    lng: Number(r[10]),
  })
}

// Changes of municipal form after the 2016 file was published.
const FORM_CHANGES = { Framingham: { municipalType: 'city', since: 2018 } }
// USPS spells some places differently from the municipality.
const USPS_NAME = { Foxborough: 'Foxboro' }

const dir = join(ROOT, 'data/cities')
let n = 0
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  const p = join(dir, f)
  const raw = readFileSync(p, 'utf8')
  const city = JSON.parse(raw)
  const g = byName.get(city.name)
  if (!g) {
    console.warn(`no gazetteer row for ${city.name}`)
    continue
  }
  city.geo = {
    ...g,
    ...(FORM_CHANGES[city.name] || {}),
    source: 'U.S. Census Bureau, 2016 Gazetteer Files (county subdivisions)',
  }
  const zips = (zipcodes.lookupByName(USPS_NAME[city.name] || city.name, 'MA') || []).map((z) => z.zip).sort()
  city.zipCodes = [...new Set(zips)]
  city.zipSource = zips.length ? 'USPS ZIP codes by place name (zipcodes npm package)' : null
  writeFileSync(p, JSON.stringify(city, null, 2) + '\n')
  n++
}
console.log(`geo written for ${n} towns`)
