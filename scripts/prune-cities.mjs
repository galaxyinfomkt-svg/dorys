#!/usr/bin/env node
/**
 * Cut the service area from 296 postal place names to the 109 Massachusetts
 * municipalities inside the real ~60-minute operating radius, and emit the
 * redirect map for everything removed.
 *
 * Why prune at all: 187 of the 296 entries were either municipalities the
 * company does not serve (Springfield is 80 miles from the Marlborough base) or
 * not municipalities at all — village and postal place names like Nonantum,
 * Waverley and Hanscom AFB. Ranking for a town you cannot serve is worse than
 * not ranking: it buys a click that ends in a "sorry, we don't cover that".
 *
 * Redirect targets differ by kind, because only one of these is a genuine
 * content equivalence:
 *   - village/neighbourhood -> its parent municipality's page. Real equivalence,
 *     so the 301 preserves what the old URL earned.
 *   - everything else -> /locations. Not equivalent; Google may treat these as
 *     soft 404s, which is an accepted outcome — the content really is gone —
 *     and the visitor still lands somewhere useful.
 *   - /services/{service}/{removed-city} -> /services/{service}. Keeps the
 *     service intent, drops the locality claim.
 *
 *   node scripts/prune-cities.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()

const KEEP = `marlborough hudson framingham westborough northborough southborough shrewsbury natick
ashland sudbury hopkinton milford wayland holliston grafton clinton maynard stow acton concord berlin
bolton lincoln weston wellesley needham dover medfield millis sherborn boxborough boylston
west-boylston holden sterling lancaster harvard upton mendon hopedale littleton westford carlisle
chelmsford groton ayer shirley lunenburg leominster fitchburg princeton paxton rutland leicester
spencer charlton dudley northbridge uxbridge douglas blackstone medway norfolk wrentham lexington
bedford burlington waltham newton brookline dedham norwood franklin bellingham cambridge somerville
medford malden melrose wakefield reading stoneham woburn winchester arlington belmont watertown
quincy braintree weymouth milton canton randolph stoughton sharon walpole foxborough lynn saugus
peabody salem beverly danvers worcester auburn millbury sutton oxford webster`
  .trim()
  .split(/\s+/)

if (KEEP.length !== 109) {
  console.error(`✖ keep list is ${KEEP.length}, expected 109 — refusing to run`)
  process.exit(1)
}
const keep = new Set(KEEP)

/** Village / neighbourhood -> the served municipality it belongs to. */
const PARENT = {
  'newton-center': 'newton', 'newton-highlands': 'newton', 'newton-lower-falls': 'newton',
  'newton-upper-falls': 'newton', newtonville: 'newton', 'west-newton': 'newton',
  nonantum: 'newton', auburndale: 'newton', 'chestnut-hill': 'newton', waban: 'newton',
  'babson-park': 'newton',
  'wellesley-hills': 'wellesley', 'needham-heights': 'needham',
  'north-grafton': 'grafton', 'south-grafton': 'grafton',
  'west-millbury': 'millbury', 'north-waltham': 'waltham',
  'arlington-heights': 'arlington', waverley: 'belmont', 'cherry-valley': 'leicester',
  linwood: 'northbridge', whitinsville: 'northbridge', woodville: 'hopkinton',
  'still-river': 'harvard', 'village-of-nagog-woods': 'acton', fayville: 'southborough',
  jefferson: 'holden', 'east-princeton': 'princeton', 'west-groton': 'groton',
  'north-uxbridge': 'uxbridge', 'south-lancaster': 'lancaster',
}

const list = JSON.parse(readFileSync(join(ROOT, 'data/cities-list.json'), 'utf8'))
const rows = Array.isArray(list) ? list : Object.values(list)
const all = rows.map((r) => r.s.replace(/-ma$/, ''))
const remove = all.filter((s) => !keep.has(s))

const services = readdirSync(join(ROOT, 'data/services')).filter((d) =>
  existsSync(join(ROOT, 'data/services', d)) && !d.endsWith('.json')
)

const redirects = []
for (const slug of remove) {
  const parent = PARENT[slug]
  redirects.push({
    source: `/locations/${slug}-ma`,
    destination: parent ? `/locations/${parent}-ma` : '/locations',
    permanent: true,
    kind: parent ? 'village->parent' : 'removed',
  })
  for (const svc of services) {
    redirects.push({
      source: `/services/${svc}/${slug}-ma`,
      destination: parent ? `/services/${svc}/${parent}-ma` : `/services/${svc}`,
      permanent: true,
      kind: parent ? 'village->parent' : 'removed',
    })
  }
}

// --- delete the pruned data -------------------------------------------------
let deleted = 0
for (const slug of remove) {
  const loc = join(ROOT, `data/locations/${slug}-ma.json`)
  if (existsSync(loc)) {
    if (!DRY) rmSync(loc)
    deleted++
  }
  for (const svc of services) {
    const p = join(ROOT, `data/services/${svc}/${slug}-ma.json`)
    if (existsSync(p)) {
      if (!DRY) rmSync(p)
      deleted++
    }
  }
}

// --- rewrite the indexes ----------------------------------------------------
if (!DRY) {
  const kept = rows.filter((r) => keep.has(r.s.replace(/-ma$/, '')))
  writeFileSync(join(ROOT, 'data/cities-list.json'), JSON.stringify(kept, null, 2) + '\n')

  const locIdx = join(ROOT, 'data/locations-index.json')
  if (existsSync(locIdx)) {
    const idx = JSON.parse(readFileSync(locIdx, 'utf8'))
    const next = Array.isArray(idx)
      ? idx.filter((s) => keep.has(String(s).replace(/-ma$/, '')))
      : idx
    writeFileSync(locIdx, JSON.stringify(next, null, 2) + '\n')
  }

  const scIdx = join(ROOT, 'data/services-cities.json')
  if (existsSync(scIdx)) {
    const idx = JSON.parse(readFileSync(scIdx, 'utf8'))
    for (const k of Object.keys(idx)) {
      if (Array.isArray(idx[k])) {
        idx[k] = idx[k].filter((s) => keep.has(String(s).replace(/-ma$/, '')))
      }
    }
    writeFileSync(scIdx, JSON.stringify(idx, null, 2) + '\n')
  }

  writeFileSync(
    join(ROOT, 'data/redirects-pruned-cities.json'),
    JSON.stringify(redirects, null, 2) + '\n'
  )
}

const villages = redirects.filter((r) => r.kind === 'village->parent').length
console.log(`${DRY ? 'DRY RUN — ' : ''}cities kept: ${keep.size}  removed: ${remove.length}`)
console.log(`  data files deleted: ${deleted}`)
console.log(`  redirects: ${redirects.length}  (village->parent ${villages}, removed ${redirects.length - villages})`)
