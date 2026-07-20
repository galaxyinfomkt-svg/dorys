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
 * The publish gate is unchanged and applied per page: index, follow only when a
 * town carries a verified facility or a real medical corridor AND the service
 * has >=10 FAQs and >=6 survey findings. Everything else ships noindex, follow.
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

/** Real assets in public/assets/images/services — the closest clinical match. */
const HERO = {
  'medical-office-cleaning': 'medical-office-new',
  'dental-office-cleaning': 'healthcare-cleaning-office',
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
  const items = service.commonSurveyFindings || []
  if (!items.length) return ''
  const list = items
    .map(
      (f) =>
        `<li><strong>${esc(f.finding)}</strong><br>` +
        `<a href="${esc(f.source)}" rel="noopener nofollow" target="_blank">${esc(f.citation)}</a>` +
        (f.frequency ? ` — ${esc(f.frequency)}` : '') +
        `</li>`
    )
    .join('')
  return (
    `<section class="section"><div class="container container--narrow">` +
    `<h2 class="section__title">Survey findings we help ${esc(city.name)} facilities prevent</h2>` +
    `<p class="section__subtitle">Real, published regulatory findings — each links to its source.</p>` +
    `<ul class="list">${list}</ul></div></section>`
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
  const faqs = service.faqs || []
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
    `<div class="accordion">${items}</div></div></section>`
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
  const list = (city.nearbyCities || []).slice(0, 6)
  if (!list.length) return ''
  const links = list
    .map(
      (n) =>
        `<a href="/services/${service.slug}/${n}-ma" class="nearby-cities__link">${esc(
          service.name
        )} in ${esc(titleCase(n))}</a>`
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
    const { html: faqHtml, schema: faqSchema } = faqAccordion(service, city)

    const mainHtml = [
      hero(service, city),
      introWithForm(service, city),
      localContext(city),
      findings(service, city),
      regulatory(service),
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
