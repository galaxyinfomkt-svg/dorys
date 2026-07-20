#!/usr/bin/env node
/**
 * Compose /services/{service}/{city}-ma pages from the verified data layers.
 *
 * Two inputs, both of which had to be researched rather than invented:
 *   data/services/_meta/{slug}.json  — regulatory framework, survey findings, FAQs
 *   data/cities/{slug}.json          — county, population, healthcare landscape
 *
 * The publish gate is applied here, per page, and it is the whole point. A page
 * gets `index, follow` only when it carries something a competitor's name-swapped
 * template cannot: a sourced local fact. Everything else ships `noindex, follow`
 * — reachable, crawlable, not competing. Publishing 872 near-identical pages is
 * what triggered the algorithmic suppression on the sibling RS project, so the
 * gate is not a formality.
 *
 * Blocks render only when their data exists. A city with no verified hospital
 * simply has no local-context section; it does not get a generic paragraph
 * standing in for one.
 *
 *   node scripts/build-service-city-pages.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const company = JSON.parse(readFileSync(join(ROOT, 'data/company.json'), 'utf8'))
const SITE = company.site.url

const META_DIR = join(ROOT, 'data/services/_meta')
const services = readdirSync(META_DIR)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => JSON.parse(readFileSync(join(META_DIR, f), 'utf8')))

const cities = JSON.parse(readFileSync(join(ROOT, 'data/cities-list.json'), 'utf8')).map((r) => {
  const slug = r.s.replace(/-ma$/, '')
  const p = join(ROOT, `data/cities/${slug}.json`)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : { slug, name: r.n }
})

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Only the trades where the ground-level facility type plausibly exists everywhere. */
const UNIVERSAL = new Set([
  'medical-office-cleaning',
  'dental-office-cleaning',
  'specialty-clinics',
  'rehabilitation-clinics',
  'skilled-nursing',
  'assisted-living-cleaning',
  'ambulatory-outpatient',
  'urgent-care-cleaning',
])

function localContext(city, service) {
  const hc = city.healthcareLandscape
  if (!hc) return ''
  const facilities = (hc.majorFacilities || []).filter((f) => f && f.name)
  const corridors = hc.medicalCorridors || []
  if (!facilities.length && !corridors.length) return ''

  const parts = []
  if (facilities.length) {
    const names = facilities.slice(0, 3).map((f) => esc(f.name))
    // Deliberate phrasing: these are market context, never clients. Naming a
    // hospital as a customer when it is not is a false statement about a third
    // party, and in healthcare procurement buyers call to check.
    parts.push(
      `<p>${esc(city.name)} is anchored by ${names.length > 1 ? 'facilities including ' : ''}${names
        .map((n) => `<strong>${n}</strong>`)
        .join(', ')}. We serve the medical offices, clinics and practices in and around that corridor — not the hospitals themselves.</p>`
    )
  }
  if (corridors.length) {
    parts.push(
      `<p>The local concentration of practices sits along ${corridors
        .map((c) => `<strong>${esc(c)}</strong>`)
        .join(' and ')}.</p>`
    )
  }
  if (hc.dominantFacilityType) {
    parts.push(`<p>The dominant healthcare presence here is ${esc(hc.dominantFacilityType)}.</p>`)
  }
  return `<section class="local-context"><h2>Healthcare in ${esc(city.name)}</h2>${parts.join('\n')}</section>`
}

function surveyFindings(service, city) {
  const items = service.commonSurveyFindings || []
  if (!items.length) return ''
  const rows = items
    .map(
      (f) =>
        `<li><p class="finding">${esc(f.finding)}</p>` +
        `<p class="citation"><a href="${esc(f.source)}" rel="noopener nofollow" target="_blank">${esc(f.citation)}</a>` +
        (f.frequency ? ` — ${esc(f.frequency)}` : '') +
        `</p></li>`
    )
    .join('\n')
  return (
    `<section class="survey-findings"><h2>Survey findings we help ${esc(city.name)} facilities prevent</h2>` +
    `<p>These are real, published regulatory findings — each one links to its source.</p>` +
    `<ul>${rows}</ul></section>`
  )
}

function regulatory(service) {
  const items = service.regulatoryFramework || []
  if (!items.length) return ''
  return (
    `<section class="regulatory"><h2>The standards that govern this work</h2><ul>` +
    items.map((r) => `<li>${esc(r)}</li>`).join('') +
    `</ul></section>`
  )
}

function faqSection(service, city) {
  const faqs = service.faqs || []
  if (!faqs.length) return { html: '', schema: null }
  const html =
    `<section class="faq"><h2>${esc(service.name)} in ${esc(city.name)} — common questions</h2>` +
    faqs
      .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
      .join('\n') +
    `</section>`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return { html, schema }
}

function nearby(city, service) {
  const list = (city.nearbyCities || []).slice(0, 6)
  if (!list.length) return ''
  return (
    `<section class="nearby"><h2>Also serving nearby</h2><ul>` +
    list
      .map(
        (n) =>
          `<li><a href="/services/${service.slug}/${n}-ma">${esc(service.name)} in ${esc(
            n.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
          )}</a></li>`
      )
      .join('') +
    `</ul></section>`
  )
}

/**
 * The gate. A page is indexable only with a sourced local fact — a verified
 * facility or a real named medical corridor. Without one it is the same document
 * as its 108 siblings with the city name swapped, which is precisely the pattern
 * that gets a site demoted rather than ranked.
 */
function isIndexable(city, service) {
  if (!city.verified) return false
  const hc = city.healthcareLandscape || {}
  const hasLocal = (hc.majorFacilities || []).length > 0 || (hc.medicalCorridors || []).length > 0
  const hasDepth = (service.faqs || []).length >= 10 && (service.commonSurveyFindings || []).length >= 6
  return hasLocal && hasDepth
}

let written = 0
let indexable = 0
const perService = {}

for (const service of services) {
  if (!UNIVERSAL.has(service.slug)) continue
  const dir = join(ROOT, 'data/services', service.slug)
  mkdirSync(dir, { recursive: true })
  perService[service.slug] = { total: 0, indexable: 0 }

  for (const city of cities) {
    const file = join(dir, `${city.slug}-ma.json`)
    const url = `${SITE}/services/${service.slug}/${city.slug}-ma`
    const ok = isIndexable(city, service)
    const { html: faqHtml, schema: faqSchema } = faqSection(service, city)

    const intro =
      `<section class="intro"><h1>${esc(service.name)} in ${esc(city.name)}, MA</h1>` +
      `<p>Dory's Cleaning Services provides clinical-grade environmental services to ${esc(
        service.facilityTypes?.slice(0, 3).join(', ') || 'healthcare facilities'
      )} in ${esc(city.name)}${city.county ? `, ${esc(city.county)} County` : ''}. ` +
      `Founded by a ${company.yearsClinicalExperience}-year clinical veteran, ${
        company.liabilityInsuranceUSD
          ? `$${(company.liabilityInsuranceUSD / 1e6).toFixed(0)}M general liability insured`
          : 'fully insured'
      }.</p>` +
      `<p class="risk"><strong>What we are protecting against:</strong> ${esc(service.centralRisk)}. ` +
      `The zone that matters most: ${esc(service.criticalZone)}.</p></section>`

    const mainHtml = [
      intro,
      localContext(city, service),
      surveyFindings(service, city),
      regulatory(service),
      faqHtml,
      nearby(city, service),
    ]
      .filter(Boolean)
      .join('\n')

    const existing = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
    const data = {
      ...existing,
      slug: `${city.slug}-ma`,
      city: city.name,
      category: service.slug,
      categoryLabel: service.name,
      title: `${service.name} in ${city.name}, MA | Dory's Cleaning Services`,
      description:
        `${service.name} for ${city.name}, MA healthcare facilities. ` +
        `${company.yearsClinicalExperience}+ years clinical experience, $2M insured. ` +
        `Free facility assessment: ${company.phoneDisplay}.`,
      keywords: `${service.name.toLowerCase()} ${city.name} MA, healthcare cleaning ${city.name}`,
      robots: ok ? 'index, follow' : 'noindex, follow',
      geoRegion: 'US-MA',
      geoPlacename: `${city.name}, Massachusetts`,
      canonical: url,
      ogType: 'website',
      ogUrl: url,
      ogTitle: `${service.name} in ${city.name}, MA`,
      ogDescription: `Clinical-grade environmental services for ${city.name} healthcare facilities.`,
      ogLocale: 'en_US',
      ogSiteName: company.shortName,
      twitterCard: 'summary_large_image',
      schemas: [
        ...(faqSchema ? [faqSchema] : []),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `${service.name} in ${city.name}, MA`,
          serviceType: service.name,
          provider: { '@type': 'LocalBusiness', name: company.legalName, telephone: company.phone },
          areaServed: { '@type': 'City', name: `${city.name}, MA` },
        },
      ],
      mainHtml,
    }

    if (!DRY) writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
    written++
    perService[service.slug].total++
    if (ok) {
      indexable++
      perService[service.slug].indexable++
    }
  }
}

// Refresh the route index so generateStaticParams picks up the new services.
if (!DRY) {
  const idx = {}
  for (const service of services) {
    if (!UNIVERSAL.has(service.slug)) continue
    idx[service.slug] = cities.map((c) => `${c.slug}-ma`)
  }
  writeFileSync(join(ROOT, 'data/services-cities.json'), JSON.stringify(idx, null, 2) + '\n')
  writeFileSync(
    join(ROOT, 'data/services-categories.json'),
    JSON.stringify(
      services.filter((s) => UNIVERSAL.has(s.slug)).map((s) => s.slug),
      null,
      2
    ) + '\n'
  )
}

console.log(`${DRY ? 'DRY RUN — ' : ''}pages: ${written}  indexable: ${indexable}  noindex: ${written - indexable}`)
for (const [slug, s] of Object.entries(perService)) {
  console.log(`  ${slug.padEnd(26)} ${String(s.total).padStart(4)}  indexable ${s.indexable}`)
}
