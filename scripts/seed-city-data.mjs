#!/usr/bin/env node
/**
 * Seed /data/cities/{slug}.json for the 109 served municipalities.
 *
 * MERGE, NEVER OVERWRITE. The healthcare-landscape and board-of-health fields
 * are researched by hand over time and that research is the expensive part; a
 * re-run only refreshes what is mechanically derivable and leaves everything
 * else exactly as a human left it.
 *
 * The governing rule for this whole layer: a field with no source stays null,
 * and a null field means the block does not render. Nothing here may be filled
 * with a plausible guess. A fabricated hospital name or a wrong Board of Health
 * phone number on a page selling regulatory compliance does more damage than an
 * empty section ever could.
 *
 * Also emits:
 *   data/_coverage.md                  — honest scoreboard, per field
 *   data/_todo-boards-of-health.csv    — the research worklist
 *
 *   node scripts/seed-city-data.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const OUT = join(ROOT, 'data/cities')
mkdirSync(OUT, { recursive: true })

/**
 * County, region and population come from the sibling RS Development Group
 * project, which serves the identical 109 municipalities and where these were
 * researched against sources: counties and regions hand-verified, populations
 * from the 2020 Decennial Census. Reused rather than re-derived, with the
 * provenance carried across so it stays auditable here.
 */
const RS_DATA = process.env.RS_DATA || 'C:/Users/RHAIDELINE/Downloads/RS DEVELOP NOVO/data/cities'

const cities = JSON.parse(readFileSync(join(ROOT, 'data/cities-list.json'), 'utf8'))

/** Drive time from the Marlborough base drives what we promise, not the reverse. */
function responseCommitment(minutes) {
  if (minutes === null || minutes === undefined) return null
  if (minutes <= 20) return 'same-day site visit'
  if (minutes <= 40) return 'site visit within 24 hours'
  return 'site visit within 48 hours'
}

const blank = (slug, name) => ({
  slug,
  name,
  county: null,
  region: null,
  zipCodes: [],
  population: null,
  distanceFromBaseMiles: null,
  driveTimeMinutes: null,
  responseCommitment: null,

  healthcareLandscape: {
    majorFacilities: [],
    healthSystems: [],
    licensedFacilityCounts: {
      clinics: null,
      longTermCare: null,
      ambulatorySurgery: null,
      assistedLiving: null,
    },
    dominantFacilityType: null,
    medicalCorridors: [],
  },

  localHealth: {
    boardOfHealthName: null,
    boardOfHealthPhone: null,
    boardOfHealthUrl: null,
    notes: null,
  },

  facilityTypesPresent: [],
  facilityDensity: null,
  nearbyCities: [],

  verified: false,
  _howToFill:
    'Every non-null value needs a source you actually read. majorFacilities is MARKET CONTEXT, never a client list — copy must say "serving practices in and around the {facility} corridor". Leave null rather than guess.',
})

let created = 0
let merged = 0
let enriched = 0

for (const row of cities) {
  const slug = row.s.replace(/-ma$/, '')
  const name = row.n
  const file = join(OUT, `${slug}.json`)

  const existing = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null
  const next = existing ? { ...blank(slug, name), ...existing } : blank(slug, name)
  next.slug = slug
  next.name = name

  // Mechanically derivable, refreshed on every run.
  const rsFile = join(RS_DATA, `${slug}.json`)
  if (existsSync(rsFile)) {
    const rs = JSON.parse(readFileSync(rsFile, 'utf8'))
    if (rs.county) next.county = rs.county
    if (rs.region) next.region = rs.region
    if (rs.population?.value) {
      next.population = {
        value: rs.population.value,
        source: rs.population.source,
        sourceName: rs.population.sourceName,
        checked: rs.population.checked,
      }
    }
    enriched++
  }

  next.responseCommitment = responseCommitment(next.driveTimeMinutes)

  if (!DRY) writeFileSync(file, JSON.stringify(next, null, 2) + '\n')
  existing ? merged++ : created++
}

// ---- reports ---------------------------------------------------------------
const all = readdirSync(OUT)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => JSON.parse(readFileSync(join(OUT, f), 'utf8')))

const filled = (fn) => all.filter(fn).length
const stats = {
  county: filled((d) => d.county),
  region: filled((d) => d.region),
  population: filled((d) => d.population),
  zipCodes: filled((d) => d.zipCodes?.length),
  driveTime: filled((d) => d.driveTimeMinutes !== null),
  majorFacilities: filled((d) => d.healthcareLandscape?.majorFacilities?.length),
  medicalCorridors: filled((d) => d.healthcareLandscape?.medicalCorridors?.length),
  boardOfHealth: filled((d) => d.localHealth?.boardOfHealthName),
  verified: filled((d) => d.verified),
}
const pct = (n) => `${((n / all.length) * 100).toFixed(0)}%`
const row = (label, n, note) => `| ${label} | ${n} / ${all.length} | ${pct(n)} | ${note} |`

if (!DRY) {
  writeFileSync(
    join(ROOT, 'data/_coverage.md'),
    `# City data coverage

Generated by \`npm run seed:cities\`. Do not edit by hand.

A \`/services/{service}/{city}-ma\` page earns \`index, follow\` and a place in the
sitemap only once it carries real local substance. This table is the honest
scoreboard for how far that is from true — not a list to be closed by inventing
values.

| Field | Filled | | Source |
|---|---:|---:|---|
${row('County', stats.county, 'reused from the RS project (same 109 towns)')}
${row('Region', stats.region, 'reused from the RS project')}
${row('Population', stats.population, '2020 Decennial Census')}
${row('ZIP codes', stats.zipCodes, 'needs a source — do not generate ranges')}
${row('Drive time from base', stats.driveTime, 'needs Google Distance Matrix (billed key)')}
${row('Major facilities', stats.majorFacilities, 'manual research — market context, never clients')}
${row('Medical corridors', stats.medicalCorridors, 'manual research')}
${row('Board of Health', stats.boardOfHealth, 'manual — see _todo-boards-of-health.csv')}
${row('**verified: true**', stats.verified, '**gate for publishing the page**')}

## What blocks publication today

\`verified\` is the publish gate. A city reaches it when it has at least one of
\`majorFacilities\` or \`medicalCorridors\`, plus enough unique body copy to clear
the similarity check. Right now ${stats.verified} of ${all.length} qualify, so the
service x city pages stay \`noindex\` — they measure 67% similarity against each
other, and publishing 545 near-duplicates is what suppressed the sibling RS site.

## Blocked on credentials

- **Drive time / distance** — Google Distance Matrix API key with billing.
- **ZIP codes** — needs a real assignment source. Do NOT synthesise ranges like
  "01101-01199"; most of those ZIPs do not exist.
`
  )

  const todo = all
    .filter((d) => !d.localHealth?.boardOfHealthName)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((d) => [d.slug, d.name, d.county || '', '', '', ''].join(','))
  writeFileSync(
    join(ROOT, 'data/_todo-boards-of-health.csv'),
    ['slug,city,county,board_of_health_name,phone,url', ...todo].join('\n') + '\n'
  )
}

console.log(`${DRY ? 'DRY RUN — ' : ''}cities: ${created} created, ${merged} merged (${all.length} total)`)
console.log(`  enriched from RS data: ${enriched}`)
console.log(
  `  county ${stats.county} · region ${stats.region} · population ${stats.population} · ` +
    `zips ${stats.zipCodes} · driveTime ${stats.driveTime} · facilities ${stats.majorFacilities} · ` +
    `boardOfHealth ${stats.boardOfHealth} · verified ${stats.verified}`
)
