#!/usr/bin/env node
/**
 * Compose the /services/{slug} category HUB pages with the real design system.
 *
 * The hubs shipped with bare markup (<section class="intro">, ".survey-findings",
 * ".risk", plain <ul> city dumps) whose classes NO stylesheet defines, so all 8
 * hub pages rendered as unstyled text — the exact bug that build-service-city-
 * pages.mjs already fixed for the 872 city pages. This script gives the hubs the
 * same treatment: hero with image + scrim, two-col intro with the GHL form,
 * survey findings as benefit cards, an accordion FAQ, a styled grid of the
 * INDEXABLE city pages for that service, and a primary CTA.
 *
 * MERGE, don't overwrite: existing hub metadata (title, description, canonical,
 * og/twitter, keywords) is preserved; only mainHtml and the FAQ schema refresh.
 *
 *   node scripts/build-service-hubs.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const company = JSON.parse(readFileSync(join(ROOT, 'data/company.json'), 'utf8'))
const SITE = company.site.url
const PHONE = company.phone
const PHONE_DISP = company.phoneDisplay
const FORM_ID = company.ghl.formId

const categories = JSON.parse(readFileSync(join(ROOT, 'data/services-categories.json'), 'utf8'))
const cityNames = new Map(
  JSON.parse(readFileSync(join(ROOT, 'data/cities-list.json'), 'utf8')).map((r) => [
    r.s.replace(/-ma$/, ''),
    r.n,
  ])
)

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const titleCase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())

/** Same hero art the city pages use — the closest clinical match per service. */
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

/** Cities pushed to the front of the hub grid when they have an indexable page. */
const MAJORS = [
  'worcester', 'cambridge', 'quincy', 'lynn', 'newton', 'somerville', 'framingham',
  'waltham', 'marlborough', 'salem', 'peabody', 'fitchburg', 'brookline', 'medford',
  'malden', 'weymouth', 'revere', 'taunton', 'chicopee', 'everett', 'arlington', 'natick',
]

function hero(svc) {
  const img = HERO[svc.slug] || 'medical-office-new'
  return (
    `<section class="hero hero--inner">` +
    `<div class="hero__background">` +
    `<img src="/assets/images/services/${img}.webp" width="1200" height="600" ` +
    `alt="${esc(svc.name)} across Massachusetts — Dory's Cleaning Services" ` +
    `loading="eager" fetchpriority="high"></div>` +
    `<div class="container"><div class="hero__content hero__content--center">` +
    `<h1 class="hero__title">${esc(svc.name)} in Massachusetts</h1>` +
    `<p class="hero__subtitle">Clinical-grade environmental services for healthcare facilities in all ` +
    `${company.citiesServed} Massachusetts cities and towns. Founded by a ` +
    `${company.yearsClinicalExperience}-year clinical veteran. $2M insured.</p>` +
    `<div class="hero__ctas">` +
    `<a href="#quote" class="btn btn--primary btn--lg btn--pulse">Free Facility Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a>` +
    `</div></div></div></section>`
  )
}

function introWithForm(svc) {
  const included = (svc.facilityTypes || []).slice(0, 5)
  // Load the form eagerly — deferring the GHL iframe has broken lead capture
  // before (company.json ghl._loadingNote). No loading="lazy" here.
  const url = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}?service=${encodeURIComponent(svc.name)}`
  const left =
    `<div class="animate-on-scroll animate-fade-right">` +
    `<h2>${esc(svc.name)} for Massachusetts facilities</h2>` +
    `<p class="lead">Dory's Cleaning Services provides ${esc(svc.name.toLowerCase())} across Massachusetts. ` +
    `What we protect against: ${esc(svc.centralRisk)}. The zone that matters most: ${esc(svc.criticalZone)}.</p>` +
    (included.length
      ? `<ul class="list list--check">${included.map((t) => `<li>${esc(titleCase(t))}</li>`).join('')}</ul>`
      : '') +
    `<div class="btn-group mt-xl">` +
    `<a href="#quote" class="btn btn--primary">Request Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--secondary">Call ${esc(PHONE_DISP)}</a>` +
    `</div></div>`
  const right =
    `<div class="animate-on-scroll animate-fade-left animate-delay-200" id="quote">` +
    `<div class="form-bare" style="max-width:620px;margin:1.5rem auto;width:100%;">` +
    `<iframe src="${esc(url)}" ` +
    `style="width:100%;height:600px;border:none;border-radius:8px" ` +
    `title="Facility assessment request form"></iframe></div></div>`
  return `<section class="section"><div class="container"><div class="two-col">${left}${right}</div></div></section>`
}

function findings(svc) {
  const items = svc.commonSurveyFindings || []
  if (!items.length) return ''
  const cards = items
    .map(
      (f) =>
        `<div class="benefit-card">` +
        `<div class="benefit-card__icon" aria-hidden="true">` +
        `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/></svg>` +
        `</div>` +
        `<h3 class="benefit-card__title">` +
        (f.source
          ? `<a href="${esc(f.source)}" rel="noopener nofollow" target="_blank">${esc(f.citation)}</a>`
          : esc(f.citation)) +
        `</h3>` +
        `<p>${esc(f.finding)}</p>` +
        (f.frequency ? `<p class="benefit-card__meta">${esc(f.frequency)}</p>` : '') +
        `</div>`
    )
    .join('')
  return (
    `<section class="section"><div class="container">` +
    `<h2 class="section__title text-center">Survey findings we help facilities prevent</h2>` +
    `<p class="section__subtitle text-center mb-lg">Real, published regulatory findings — every citation links to its source.</p>` +
    `<div class="benefits-grid">${cards}</div></div></section>`
  )
}

function regulatory(svc) {
  const items = svc.regulatoryFramework || []
  if (!items.length) return ''
  return (
    `<section class="section section--alt"><div class="container container--narrow">` +
    `<h2 class="section__title">The standards that govern this work</h2>` +
    `<ul class="list list--check">${items.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div></section>`
  )
}

function faqAccordion(svc) {
  const faqs = svc.faqs || []
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
    `<h2 class="section__title">${esc(svc.name)} — common questions</h2>` +
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

/** Styled grid of the INDEXABLE city pages for this service (up to 36), majors
 *  first, then alphabetical — replaces the old bare vertical dump of 109 names. */
function citiesGrid(svc) {
  const dir = join(ROOT, 'data/services', svc.slug)
  const indexable = []
  for (const f of readdirSync(dir)) {
    if (f === 'index.json' || !f.endsWith('.json')) continue
    const d = JSON.parse(readFileSync(join(dir, f), 'utf8'))
    if (/noindex/i.test(d.robots || '')) continue
    indexable.push(f.replace(/\.json$/, '')) // e.g. worcester-ma
  }
  if (!indexable.length) return ''
  const rank = (slugMa) => {
    const base = slugMa.replace(/-ma$/, '')
    const i = MAJORS.indexOf(base)
    return i === -1 ? MAJORS.length + 1 : i
  }
  indexable.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
  const shown = indexable.slice(0, 36)
  const links = shown
    .map((slugMa) => {
      const name = cityNames.get(slugMa.replace(/-ma$/, '')) || titleCase(slugMa.replace(/-ma$/, ''))
      return `<a href="/services/${svc.slug}/${slugMa}" class="nearby-cities__link">${esc(name)}</a>`
    })
    .join('')
  return (
    `<section class="section section--alt"><div class="container">` +
    `<h2 class="section__title text-center">${esc(svc.name)} across Massachusetts</h2>` +
    `<p class="section__subtitle text-center mb-lg">Choose your city for local ${esc(
      svc.name.toLowerCase()
    )} details.</p>` +
    `<div class="nearby-cities"><div class="nearby-cities__list">${links}</div></div>` +
    `<div class="text-center mt-xl"><a href="/locations" class="btn btn--primary">View all ${company.citiesServed} cities &amp; towns</a></div>` +
    `</div></section>`
  )
}

function finalCta(svc) {
  return (
    `<section class="section section--primary"><div class="container text-center">` +
    `<h2 class="text-white mb-lg">Free ${esc(svc.name.toLowerCase())} assessment</h2>` +
    `<p class="lead text-white mb-xl" style="opacity:0.9">${company.yearsClinicalExperience}+ years clinical experience. $2M insured. No obligation.</p>` +
    `<div class="btn-group btn-group--center">` +
    `<a href="#quote" class="btn btn--white btn--lg">Request Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a>` +
    `</div></div></section>`
  )
}

let done = 0
for (const slug of categories) {
  const metaPath = join(ROOT, 'data/services/_meta', `${slug}.json`)
  const idxPath = join(ROOT, 'data/services', slug, 'index.json')
  if (!existsSync(metaPath) || !existsSync(idxPath)) {
    console.log(`  skip ${slug} (missing meta or index)`)
    continue
  }
  const svc = JSON.parse(readFileSync(metaPath, 'utf8'))
  const existing = JSON.parse(readFileSync(idxPath, 'utf8'))
  const { html: faqHtml, schema: faqSchema } = faqAccordion(svc)

  const mainHtml = [
    hero(svc),
    introWithForm(svc),
    findings(svc),
    regulatory(svc),
    faqHtml,
    citiesGrid(svc),
    finalCta(svc),
  ]
    .filter(Boolean)
    .join('\n')

  // Preserve existing schemas, drop any stale FAQPage, add the fresh one.
  const keptSchemas = (existing.schemas || []).filter(
    (s) => !(s && s['@type'] === 'FAQPage')
  )
  const schemas = faqSchema ? [...keptSchemas, faqSchema] : keptSchemas

  const data = { ...existing, mainHtml, schemas }
  if (!DRY) writeFileSync(idxPath, JSON.stringify(data, null, 2) + '\n')
  done++
  console.log(
    `  ${slug.padEnd(26)} findings ${(svc.commonSurveyFindings || []).length}  faqs ${
      (svc.faqs || []).length
    }  cities ${citiesGrid(svc) ? 'grid' : 'none'}`
  )
}
console.log(`${DRY ? 'DRY RUN — ' : ''}hubs composed: ${done}`)
