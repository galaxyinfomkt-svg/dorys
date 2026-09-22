#!/usr/bin/env node
/**
 * Compose /services/{service}/{city}-ma pages from the verified data layers,
 * using the site's existing design system.
 *
 * Two inputs, both researched rather than invented:
 *   data/services/_meta/{slug}.json  — regulatory framework, survey findings, FAQs
 *   data/cities/{slug}.json          — county, population, healthcare landscape
 *
 * The markup here mirrors what the old hand-built pages used, so the styles in
 * public/assets/css/service-pages.css actually apply: hero with image, two-col
 * intro with the GHL lead form, section / section--alt bands, an accordion FAQ,
 * nearby-cities, and a primary CTA. An earlier version of this script emitted
 * bare <section class="survey-findings"> markup whose classes no CSS styled, so
 * 872 pages shipped as unstyled text dumps. This version emits only classes the
 * design system defines.
 *
 * Publish gate (tightened 2026-09-22): index, follow only when the town has a
 * verified facility OF THE TYPE THIS SERVICE CLEANS (FACILITY_MATCH below) AND
 * the service has >=10 FAQs and >=6 survey findings. Everything else ships
 * noindex, follow.
 *
 * Why: under the old gate any verified facility unlocked all eight services for
 * a town, so 752 pages were indexable while pages of one service differed by
 * ~7% (5-word-shingle Jaccard 0.90-0.95 between towns): the town name, one
 * sentence of landscape, nothing else. That is the doorway pattern Google's
 * spam policies name. "Skilled nursing cleaning in Acton" is not a page Acton
 * can support when Acton's only verified facility is a primary-care group.
 *
 * Every page — indexed or not — now also carries a town profile built from the
 * verified city record (population with source, county, region, the dominant
 * facility type, the facilities relevant to THIS service), a visible
 * breadcrumb with matching BreadcrumbList schema, and nearby towns from the
 * same county/region (nearbyCities was empty for all 109 towns, so the
 * "Also serving nearby" block never rendered).
 *
 *   node scripts/build-service-city-pages.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const company = JSON.parse(readFileSync(join(ROOT, 'data/company.json'), 'utf8'))
const SITE = company.site.url
const PHONE = company.phone
const PHONE_DISP = company.phoneDisplay
const FORM_ID = company.ghl.formId

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

/** How much shared, service-wide content a town page repeats (hub has all). */
const TOWN_FINDINGS = 3
const TOWN_FAQS = 5

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

/** Which verified facilities make a town relevant to a service. Matched
 * against each majorFacility's `type` + `name` in data/cities. */
const FACILITY_MATCH = {
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
const SHORT = {
  'assisted-living-cleaning': 'Assisted Living Cleaning',
  'ambulatory-outpatient': 'Outpatient Facility Cleaning',
  'skilled-nursing': 'Nursing Home Cleaning',
  'rehabilitation-clinics': 'Rehab Clinic Cleaning',
  'urgent-care-cleaning': 'Urgent Care Cleaning',
  'specialty-clinics': 'Specialty Clinic Cleaning',
  'medical-office-cleaning': 'Medical Office Cleaning',
  'dental-office-cleaning': 'Dental Office Cleaning',
}

const relevantFacilities = (city, service) =>
  ((city.healthcareLandscape || {}).majorFacilities || []).filter(
    (f) => f && f.name && FACILITY_MATCH[service.slug]?.test(`${f.type || ''} ${f.name}`)
  )

function pageTitle(service, city) {
  for (const name of [service.name, SHORT[service.slug]]) {
    const t = `${name} in ${city.name}, MA | Dory's Cleaning`
    if (t.length <= 60) return t
  }
  const bare = `${SHORT[service.slug]} in ${city.name}, MA`
  return bare.length <= 51 ? `${bare} | Dory's` : bare
}

function pageDescription(service, city) {
  const tail = `${company.yearsClinicalExperience}+ yrs clinical experience, $2M insured. Free assessment: ${company.phoneDisplay}.`
  for (const name of [service.name, SHORT[service.slug]]) {
    const d = `${name} for ${city.name}, MA facilities. ${tail}`
    if (d.length <= 155) return d
  }
  return `${SHORT[service.slug]} in ${city.name}, MA. ${tail}`
}

/** Towns in the same county (then region), largest first, for internal links. */
function nearbyFor(city) {
  const pop = (c) => c.population?.value || 0
  const others = cities.filter((c) => c.slug !== city.slug && c.name)
  const same = others.filter((c) => city.county && c.county === city.county).sort((a, b) => pop(b) - pop(a))
  const region = others
    .filter((c) => city.region && c.region === city.region && !same.includes(c))
    .sort((a, b) => pop(b) - pop(a))
  return [...same, ...region].slice(0, 6)
}

/** Real assets in public/assets/images/services — the closest clinical match. */
const HERO = {
  'medical-office-cleaning': 'medical-office-new',
  // healthcare-cleaning-office shows a hospital ward, not a dental operatory.
  'dental-office-cleaning': 'dental-operatory',
  'specialty-clinics': 'specialty-clinic',
  'rehabilitation-clinics': 'rehab-nursing',
  'skilled-nursing': 'infection-control-disinfection',
  'assisted-living-cleaning': 'assisted-living-senior-care',
  'ambulatory-outpatient': 'ambulatory-facility',
  'urgent-care-cleaning': 'clinic-outpatient-sanitation',
}

const titleCase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())

function hero(service, city) {
  const img = HERO[service.slug] || 'medical-office-new'
  return (
    `<section class="hero hero--inner">` +
    `<div class="hero__background">` +
    `<img src="/assets/images/services/${img}.webp" width="1200" height="600" ` +
    `alt="${esc(service.name)} in ${esc(city.name)}, MA — Dory's Cleaning Services" ` +
    `loading="eager" fetchpriority="high"></div>` +
    `<div class="container"><div class="hero__content hero__content--center">` +
    `<h1 class="hero__title">${esc(service.name)} in ${esc(city.name)}, MA</h1>` +
    `<p class="hero__subtitle">Clinical-grade environmental services for ${esc(city.name)} healthcare facilities. ` +
    `Founded by a ${company.yearsClinicalExperience}-year clinical veteran. $2M insured.</p>` +
    `<div class="hero__ctas">` +
    `<a href="#quote" class="btn btn--primary btn--lg btn--pulse">Free Facility Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a>` +
    `</div></div></div></section>`
  )
}

function introWithForm(service, city) {
  const included = (service.facilityTypes || []).slice(0, 5)
  const url = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}?city=${encodeURIComponent(
    city.name
  )}&service=${encodeURIComponent(service.name)}`
  const left =
    `<div class="animate-on-scroll animate-fade-right">` +
    `<h2>${esc(service.name)} for ${esc(city.name)} facilities</h2>` +
    `<p class="lead">Dory's Cleaning Services provides ${esc(service.name.toLowerCase())} to ${esc(
      city.county ? `${city.name}, ${city.county} County` : city.name
    )}. What we protect against: ${esc(service.centralRisk)}. The zone that matters most: ${esc(
      service.criticalZone
    )}.</p>` +
    (included.length
      ? `<ul class="list list--check">${included
          .map((t) => `<li>${esc(titleCase(t))}</li>`)
          .join('')}</ul>`
      : '') +
    `<div class="btn-group mt-xl">` +
    `<a href="#quote" class="btn btn--primary">Request Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--secondary">Call ${esc(PHONE_DISP)}</a>` +
    `</div></div>`
  const right =
    `<div class="animate-on-scroll animate-fade-left animate-delay-200" id="quote">` +
    `<div class="form-bare" style="max-width:620px;margin:1.5rem auto;width:100%;">` +
    `<iframe loading="lazy" src="${esc(url)}" ` +
    `style="width:100%;height:600px;border:none;border-radius:8px" ` +
    `title="Facility assessment request form for ${esc(city.name)}"></iframe></div></div>`
  return `<section class="section"><div class="container"><div class="two-col">${left}${right}</div></div></section>`
}

function breadcrumb(service, city) {
  return (
    `<nav class="breadcrumb breadcrumb--page" aria-label="Breadcrumb"><div class="container">` +
    `<ol class="breadcrumb__list">` +
    `<li class="breadcrumb__item"><a class="breadcrumb__link" href="/">Home</a></li>` +
    `<li class="breadcrumb__item"><a class="breadcrumb__link" href="/services">Services</a></li>` +
    `<li class="breadcrumb__item"><a class="breadcrumb__link" href="/services/${service.slug}">${esc(service.name)}</a></li>` +
    `<li class="breadcrumb__item" aria-current="page">${esc(city.name)}, MA</li>` +
    `</ol></div></nav>`
  )
}

/** The town profile: every value comes from the verified city record, so each
 * page states something true about THIS town and THIS service. */
function townProfile(service, city) {
  const hc = city.healthcareLandscape || {}
  const rel = relevantFacilities(city, service)
  const facts = []
  if (city.county) facts.push(['County', `${city.county} County`])
  if (city.region) facts.push(['Region', city.region])
  if (city.population?.value)
    facts.push(['Population', `${city.population.value.toLocaleString('en-US')} (2020 US Census)`])
  if (hc.dominantFacilityType) facts.push(['Typical healthcare setting', hc.dominantFacilityType])
  if (!facts.length) return ''
  const dl = facts.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join('')
  let fit
  if (rel.length) {
    const names = rel
      .slice(0, 3)
      .map((f) => `<strong>${esc(f.name)}</strong> (${esc(f.type)})`)
      .join('; ')
    fit =
      `<p>The ${esc(city.name)} facilities closest to what ${esc(service.name.toLowerCase())} covers: ${names}. ` +
      `They are named as market context — the kind of setting our protocols are written for — not as clients.</p>`
  } else {
    fit =
      `<p>We have not verified a ${esc(SHORT[service.slug].replace(/ Cleaning$/, '').toLowerCase())} facility inside ${esc(
        city.name
      )} itself. Practices here are typically served from the same route as neighbouring towns; ` +
      `call ${esc(PHONE_DISP)} and we will confirm scheduling for your address before any assessment.</p>`
  }
  return (
    `<section class="section"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(city.name)} at a glance</h2>` +
    `<ul class="list list--check">${dl}</ul>${fit}</div></section>`
  )
}

/** Market context — verified facilities, never presented as clients. */
function localContext(city) {
  const hc = city.healthcareLandscape
  if (!hc) return ''
  const facilities = (hc.majorFacilities || []).filter((f) => f && f.name)
  const corridors = hc.medicalCorridors || []
  if (!facilities.length && !corridors.length) return ''
  const parts = []
  if (facilities.length) {
    const names = facilities.slice(0, 3).map((f) => `<strong>${esc(f.name)}</strong>`)
    parts.push(
      `<p class="lead">${esc(city.name)} is anchored by ${names.join(
        ', '
      )}. We serve the medical offices, clinics and practices in and around that corridor — not the hospitals themselves.</p>`
    )
  }
  if (corridors.length) {
    parts.push(
      `<p>The local concentration of practices sits along ${corridors
        .map((c) => `<strong>${esc(c)}</strong>`)
        .join(' and ')}.</p>`
    )
  }
  return (
    `<section class="section section--alt"><div class="container container--narrow">` +
    `<h2 class="section__title">Healthcare in ${esc(city.name)}</h2>${parts.join('')}</div></section>`
  )
}

function findings(service, city) {
  // The town page carries the three findings a buyer should see first; the hub
  // holds the full list. Repeating every finding on 109 town pages made the
  // shared block ~80% of each page — boilerplate, not local content.
  const all = service.commonSurveyFindings || []
  const items = all.slice(0, TOWN_FINDINGS)
  if (!items.length) return ''
  // Cards, not a wall of paragraphs. This is the most valuable content on the
  // page and was the least scannable — a facilities buyer skims for the citation
  // that applies to them. Each card leads with the citation badge, then the
  // finding, then the frequency where one is published.
  const cards = items
    .map(
      (f) =>
        `<div class="benefit-card">` +
        `<div class="benefit-card__icon" aria-hidden="true">` +
        `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/></svg>` +
        `</div>` +
        `<h3 class="benefit-card__title">` +
        `<a href="${esc(f.source)}" rel="noopener nofollow" target="_blank">${esc(f.citation)}</a></h3>` +
        `<p>${esc(f.finding)}</p>` +
        (f.frequency ? `<p class="benefit-card__meta">${esc(f.frequency)}</p>` : '') +
        `</div>`
    )
    .join('')
  return (
    `<section class="section"><div class="container">` +
    `<h2 class="section__title text-center">Survey findings we help ${esc(city.name)} facilities prevent</h2>` +
    `<p class="section__subtitle text-center mb-lg">Real, published regulatory findings — every citation links to its source.</p>` +
    `<div class="benefits-grid">${cards}</div>` +
    (all.length > items.length
      ? `<p class="text-center mt-xl"><a href="/services/${service.slug}" class="btn btn--secondary">See all ${all.length} findings</a></p>`
      : '') +
    `</div></section>`
  )
}

function regulatory(service) {
  const items = service.regulatoryFramework || []
  if (!items.length) return ''
  return (
    `<section class="section section--alt"><div class="container container--narrow">` +
    `<h2 class="section__title">The standards that govern this work</h2>` +
    `<ul class="list list--check">${items.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div></section>`
  )
}

function faqAccordion(service, city) {
  const allFaqs = service.faqs || []
  const faqs = allFaqs.slice(0, TOWN_FAQS)
  if (!faqs.length) return { html: '', schema: null }
  const items = faqs
    .map(
      (f) =>
        `<div class="accordion__item">` +
        `<button type="button" class="accordion__header" aria-expanded="false">${esc(f.q)}` +
        `<svg class="accordion__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>` +
        `</button>` +
        `<div class="accordion__content"><div class="accordion__body"><p>${esc(f.a)}</p></div></div></div>`
    )
    .join('')
  const html =
    `<section class="section"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(service.name)} in ${esc(city.name)} — common questions</h2>` +
    `<div class="accordion">${items}</div>` +
    (allFaqs.length > faqs.length
      ? `<p class="text-center mt-lg"><a href="/services/${service.slug}#faq">See all ${allFaqs.length} questions on ${esc(
          service.name.toLowerCase()
        )}</a></p>`
      : '') +
    `</div></section>`
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

function nearbySection(city, service) {
  const list = nearbyFor(city)
  if (!list.length) return ''
  // Link the service page where it is indexable; otherwise the town hub, so we
  // never pour internal links into a noindex page.
  const links = list
    .map((n) =>
      isIndexable(n, service)
        ? `<a href="/services/${service.slug}/${n.slug}-ma" class="nearby-cities__link">${esc(
            SHORT[service.slug]
          )} in ${esc(n.name)}</a>`
        : `<a href="/locations/${n.slug}-ma" class="nearby-cities__link">Healthcare cleaning in ${esc(n.name)}</a>`
    )
    .join('')
  return (
    `<section class="section section--alt"><div class="container">` +
    `<h2 class="section__title">Also serving nearby</h2>` +
    `<div class="nearby-cities"><div class="nearby-cities__list">${links}</div></div>` +
    `<div class="text-center mt-xl"><a href="/locations" class="btn btn--primary">All ${company.citiesServed} cities &amp; towns</a></div>` +
    `</div></section>`
  )
}

function finalCta(service, city) {
  return (
    `<section class="section section--primary"><div class="container text-center">` +
    `<h2 class="text-white mb-lg">Free ${esc(service.name.toLowerCase())} assessment in ${esc(city.name)}</h2>` +
    `<p class="lead text-white mb-xl" style="opacity:0.9">${company.yearsClinicalExperience}+ years clinical experience. $2M insured. No obligation.</p>` +
    `<div class="btn-group btn-group--center">` +
    `<a href="#quote" class="btn btn--white btn--lg">Request Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a>` +
    `</div></div></section>`
  )
}

function isIndexable(city, service) {
  if (!city.verified) return false
  const hasLocal = relevantFacilities(city, service).length > 0
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
    const { html: faqHtml, schema: faqSchema } = faqAccordion(service, city)

    const mainHtml = [
      hero(service, city),
      breadcrumb(service, city),
      introWithForm(service, city),
      townProfile(service, city),
      localContext(city),
      findings(service, city),
      // The full regulatory list lives on the hub; repeating it on every town
      // page was pure boilerplate. The findings block links to the hub.
      faqHtml,
      nearbySection(city, service),
      finalCta(service, city),
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
      title: pageTitle(service, city),
      description: pageDescription(service, city),
      keywords: `${service.name.toLowerCase()} ${city.name} MA, healthcare cleaning ${city.name}`,
      robots: ok ? 'index, follow' : 'noindex, follow',
      geoRegion: 'US-MA',
      geoPlacename: `${city.name}, Massachusetts`,
      canonical: url,
      ogType: 'website',
      ogUrl: url,
      ogTitle: `${service.name} in ${city.name}, MA`,
      ogDescription: `Clinical-grade environmental services for ${city.name} healthcare facilities.`,
      ogImage: `${SITE}/assets/images/services/${HERO[service.slug] || 'medical-office-new'}.webp`,
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
          provider: { '@id': `${SITE}/#business` },
          areaServed: { '@type': 'City', name: `${city.name}, MA` },
          url,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            ['Home', SITE],
            ['Services', `${SITE}/services`],
            [service.name, `${SITE}/services/${service.slug}`],
            [`${city.name}, MA`, url],
          ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
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
