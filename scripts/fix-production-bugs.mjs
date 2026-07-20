#!/usr/bin/env node
/**
 * Fix the template-level bugs running at scale across the extracted page data.
 *
 * Every page under data/ was extracted from the old static HTML, so a single
 * bad token became ~300 or ~1,500 identical defects. These are corrected here,
 * in the data, rather than patched at render time — the data is what the Next
 * routes read, and leaving the defect in the source guarantees it comes back.
 *
 * Run with --dry to preview counts without writing.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const company = JSON.parse(readFileSync(join(ROOT, 'data/company.json'), 'utf8'))

const files = []
function walk(dir) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p)
    else if (entry.endsWith('.json')) files.push(p)
  }
}
;['data/locations', 'data/services', 'data/blog', 'data/pages'].forEach((d) => walk(join(ROOT, d)))
for (const f of ['data/home.json']) {
  const p = join(ROOT, f)
  if (existsSync(p)) files.push(p)
}

const count = {
  licensing: 0,
  fiveStar: 0,
  doubleEscape: 0,
  geo: 0,
  hashOne: 0,
  htmlLinks: 0,
  cityCount: 0,
  aggregateRating: 0,
}

/** Marlborough's coordinates, correct ONLY on pages about the business itself. */
const BASE_GEO = `${company.geo.lat};${company.geo.lng}`

for (const file of files) {
  const before = readFileSync(file, 'utf8')
  let s = before
  const isLocationOrService = /[\\/]data[\\/](locations|services)[\\/]/.test(file)

  // 1.1 — the licensing claim. Massachusetts does not license cleaning
  // companies, so this sentence was false even before the token broke. The
  // insurance credential is true and, for a facilities buyer, stronger.
  s = s.replace(
    /with full licensing \(licensed\), \$2,000,000 in liability insurance coverage/g,
    () => {
      count.licensing++
      return 'with $2,000,000 in general liability insurance and workers’ compensation coverage'
    }
  )
  s = s.replace(/with full licensing \(MA HIC #\d+\), /g, () => {
    count.licensing++
    return 'with '
  })
  s = s.replace(/MA Licensed/g, () => {
    count.licensing++
    return 'Fully Insured'
  })

  // 1.2 — "5-Star" in titles, with no sourced rating behind it.
  s = s.replace(/ \| 5-Star/g, () => {
    count.fiveStar++
    return ''
  })

  // 1.2 — self-declared AggregateRating. Google ignores self-serving aggregate
  // ratings for LocalBusiness, and these numbers have no source at all.
  s = s.replace(
    /,?\s*"aggregateRating"\s*:\s*\{[^{}]*\}/g,
    () => {
      count.aggregateRating++
      return ''
    }
  )

  // 1.3 — descriptions were extracted already HTML-escaped, then Next escapes
  // them again on render, so "&amp;" reaches the SERP as "&amp;amp;".
  // Metadata values must be plain text; Next handles escaping.
  const unescapeMeta = (v) =>
    v
      .replace(/&amp;/g, '&')
      .replace(/&#38;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  try {
    const d = JSON.parse(s)
    let touched = false
    for (const key of ['description', 'ogDescription', 'twitterDescription', 'title', 'ogTitle', 'twitterTitle']) {
      if (typeof d[key] === 'string' && /&(amp|#38|quot|#39);/.test(d[key])) {
        d[key] = unescapeMeta(d[key])
        touched = true
      }
    }

    // 1.5 — every page carried the head-office coordinates, so 295 city pages
    // asserted they were located in Marlborough. Wrong coordinates are a worse
    // signal than none, and geo meta is weak, so drop it unless the page really
    // is about the Marlborough base.
    if (isLocationOrService && d.geoPosition === BASE_GEO) {
      delete d.geoPosition
      count.geo++
      touched = true
    }

    if (touched) {
      count.doubleEscape++
      s = JSON.stringify(d, null, 2)
    }
  } catch {
    // Malformed JSON must be loud, not silently skipped.
    console.error(`  ! could not parse ${file}`)
  }

  // 1.5 (raw) — geo meta embedded in the page HTML rather than the fields.
  s = s.replace(
    new RegExp(`<meta name=\\\\?"geo\\.position\\\\?" content=\\\\?"${BASE_GEO}\\\\?"\\s*/?>`, 'g'),
    () => {
      count.geo++
      return ''
    }
  )

  // 1.6 — an unprovable superiority claim.
  s = s.replace(/#1 healthcare facility cleaning in Massachusetts\./g, () => {
    count.hashOne++
    return 'Clinical-grade environmental services for Massachusetts healthcare facilities.'
  })
  s = s.replace(/#1 healthcare facility cleaning in Massachusetts/g, () => {
    count.hashOne++
    return 'Clinical-grade environmental services for Massachusetts healthcare facilities'
  })

  // 1.7 — internal links to the .html form, each one a 301 hop. ~4 per page
  // across 1,480 pages is roughly 5,900 internal redirects.
  s = s.replace(/(href=\\?"\/(?:services|locations)\/[^"\\]+?)\.html(\\?")/g, (_m, a, b) => {
    count.htmlLinks++
    return a + b
  })

  // 3.6 — the service area is 109 municipalities, not 296 postal place names.
  s = s.replace(/\b295 other Massachusetts cities\b/g, () => {
    count.cityCount++
    return `${company.citiesServed - 1} other Massachusetts cities`
  })
  s = s.replace(/\b296 (cities|communities|Massachusetts cities|MA cities)\b/g, (_m, w) => {
    count.cityCount++
    return `${company.citiesServed} ${w}`
  })

  if (s !== before && !DRY) writeFileSync(file, s)
}

console.log(`${DRY ? 'DRY RUN — ' : ''}files scanned: ${files.length}`)
console.log(`  1.1  licensing claims rewritten .......... ${count.licensing}`)
console.log(`  1.2  "5-Star" removed from titles ........ ${count.fiveStar}`)
console.log(`  1.2  self-declared AggregateRating dropped ${count.aggregateRating}`)
console.log(`  1.3  double-escaped metadata fixed ....... ${count.doubleEscape}`)
console.log(`  1.5  wrong geo.position removed .......... ${count.geo}`)
console.log(`  1.6  "#1" claims replaced ................ ${count.hashOne}`)
console.log(`  1.7  .html internal links fixed .......... ${count.htmlLinks}`)
console.log(`  3.6  city-count references corrected ..... ${count.cityCount}`)
