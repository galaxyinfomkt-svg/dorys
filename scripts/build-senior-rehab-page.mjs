#!/usr/bin/env node
/**
 * Build /senior-care-rehab-cleaning — the pillar page for rehabilitation
 * clinics and senior care (skilled nursing, long-term care, assisted living,
 * memory care). Owner's priority (2026-09-22): these two facility groups must
 * be unmistakable across the site.
 *
 * Content is fixed, factual copy plus a data section generated from
 * data/cities/*.json: how many served towns have a verified facility of each
 * kind, and links to those towns' service pages. Re-run whenever facility data
 * changes (it is part of npm run build:service-pages).
 *
 *   node scripts/build-senior-rehab-page.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { company, SITE, PHONE, PHONE_DISP, YEARS, cities, esc, relevantFacilities } from './lib/town-kit.mjs'

const ROOT = process.cwd()
const SLUG = 'senior-care-rehab-cleaning'
const URL_ = `${SITE}/${SLUG}`
const svc = (slug) => ({ slug })
const GROUPS = [
  { slug: 'rehabilitation-clinics', label: 'Rehabilitation clinics', noun: 'rehabilitation clinic' },
  { slug: 'skilled-nursing', label: 'Skilled nursing & long-term care', noun: 'skilled nursing or long-term care facility' },
  { slug: 'assisted-living-cleaning', label: 'Assisted living & memory care', noun: 'assisted living or memory care residence' },
]

const ul = (items) => `<ul class="list list--check">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`

function dataSection() {
  const blocks = GROUPS.map((g) => {
    const towns = cities.filter((c) => relevantFacilities(c, svc(g.slug)).length).sort((a, b) => a.name.localeCompare(b.name))
    const links = towns
      .map((c) => `<a href="/services/${g.slug}/${c.slug}-ma" class="nearby-cities__link">${esc(c.name)}</a>`)
      .join('')
    return (
      `<h3>${esc(g.label)}: verified in ${towns.length} of ${cities.length} towns we serve</h3>` +
      (towns.length ? `<div class="nearby-cities"><div class="nearby-cities__list">${links}</div></div>` : '') +
      `<p class="mt-lg mb-xl"><a href="/services/${g.slug}" class="text-primary font-semibold">${esc(g.label)}: full cleaning protocol →</a></p>`
    )
  }).join('')
  return (
    `<section class="section section--alt"><div class="container">` +
    `<h2 class="section__title text-center">Where these facilities are, town by town</h2>` +
    `<p class="section__subtitle text-center mb-lg">Towns where we have verified at least one facility of each kind — each link opens that town's page, with the facilities named as local market context (not as clients). We serve every one of our ${cities.length} cities and towns for all three.</p>` +
    blocks +
    `</div></section>`
  )
}

const FAQ = [
  {
    q: 'Do you clean rehabilitation clinics?',
    a: 'Yes. We clean outpatient physical, occupational and speech therapy clinics and sports-medicine rehabilitation clinics: treatment tables and plinths, mats, free weights, resistance equipment, parallel bars, cardio equipment handles and consoles, plus waiting rooms and restrooms. Staff usually wipe shared equipment between patients; we do the full clean after the last appointment.',
  },
  {
    q: 'Do you clean nursing homes and senior care facilities?',
    a: 'Yes. We clean skilled nursing and long-term care facilities, rest homes, assisted living residences and memory care: resident rooms daily and on discharge, dining and activity rooms, corridors and handrails, shared bathrooms, and nursing stations. Visits are scheduled around meals, therapy sessions and resident routines.',
  },
  {
    q: 'What changes during a norovirus, influenza or C. difficile outbreak?',
    a: 'Frequency goes up and products change under the direction of your infection preventionist — for example a sporicidal EPA-registered disinfectant (EPA List K) for C. difficile rooms. Handrails, elevator buttons and shared bathrooms are cleaned more often, and every change is logged.',
  },
  {
    q: 'Which rules apply to cleaning in senior care?',
    a: 'Nursing homes that participate in Medicare or Medicaid follow 42 CFR 483.80 (infection prevention and control) and 42 CFR 483.10(i) (a safe, clean, comfortable and homelike environment); Massachusetts long-term care facilities also follow 105 CMR 150.000. Assisted living residences are certified under 651 CMR 12.00. Staff who may contact blood or body fluids are covered by OSHA 29 CFR 1910.1030.',
  },
  {
    q: 'How do your crews work around residents?',
    a: 'They knock, ask before entering a resident’s room or apartment, work at times agreed with nursing or the residence, keep wet floors signed to reduce fall risk, and follow memory-care routines set by your staff.',
  },
]

const main = `
<section class="hero hero--inner"><div class="hero__background"><img src="/assets/images/services/rehab-nursing.webp" alt="Rehabilitation and senior care facility cleaning in Massachusetts" loading="eager" fetchpriority="high" width="800" height="533"></div>
<div class="container"><div class="hero__content hero__content--center">
<h1 class="hero__title">Rehabilitation Clinic &amp; Senior Care Facility Cleaning in Massachusetts</h1>
<p class="hero__subtitle">Outpatient rehab clinics, skilled nursing and long-term care, assisted living and memory care — cleaned by a team led by a founder with ${YEARS} years inside clinical settings. $2M insured.</p>
<div class="hero__ctas"><a href="/contact" class="btn btn--primary btn--lg btn--pulse">Free Facility Assessment</a><a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a></div>
</div></div></section>
<nav class="breadcrumb breadcrumb--page" aria-label="Breadcrumb"><div class="container"><ol class="breadcrumb__list"><li class="breadcrumb__item"><a class="breadcrumb__link" href="/">Home</a></li><li class="breadcrumb__item"><a class="breadcrumb__link" href="/services">Services</a></li><li class="breadcrumb__item" aria-current="page">Rehab &amp; Senior Care</li></ol></div></nav>

<section class="section"><div class="container container--narrow">
<h2 class="section__title">Two of our core specialties</h2>
<p>Rehabilitation clinics and senior care facilities are where cleaning touches people most directly: patients lie on shared treatment tables and grip shared equipment, and residents live in the rooms we clean. Both groups are among the most vulnerable people a cleaning crew serves, and both are a central part of what Dory&rsquo;s does across ${cities.length} Massachusetts cities and towns.</p>
<div class="service-mini-grid" style="margin-top:1.5rem">
<a class="service-mini" href="/services/rehabilitation-clinics"><strong class="service-mini__title">Rehabilitation clinics</strong><span class="service-mini__text">Physical, occupational and speech therapy; sports-medicine rehab. Treatment tables, mats, weights and gym equipment with direct skin contact.</span></a>
<a class="service-mini" href="/services/skilled-nursing"><strong class="service-mini__title">Skilled nursing &amp; long-term care</strong><span class="service-mini__text">Nursing and rehabilitation centers, long-term care and rest homes. Daily resident rooms, discharge cleaning, outbreak response.</span></a>
<a class="service-mini" href="/services/assisted-living-cleaning"><strong class="service-mini__title">Assisted living &amp; memory care</strong><span class="service-mini__text">Common areas, dining, handrails and apartments per service plan — in residents&rsquo; homes, with their dignity and routines first.</span></a>
</div>
</div></section>

<section class="section section--alt"><div class="container container--narrow">
<h2 class="section__title">What is different in senior care</h2>
${ul([
  '<strong>It is the residents&rsquo; home.</strong> Crews knock, ask before entering, and clean at times agreed with nursing or the residence.',
  '<strong>Outbreaks move fast.</strong> Norovirus, influenza, COVID-19 and <em>C. difficile</em> spread in shared spaces; frequency and products escalate under your infection preventionist&rsquo;s direction.',
  '<strong>Falls are a cleaning risk.</strong> Wet floors are signed and sequenced around resident traffic, especially in corridors and bathrooms.',
  '<strong>Discharge cleaning has a clock.</strong> Rooms are turned to fit admissions, with every furniture surface and fixture covered.',
  '<strong>Memory care needs routine.</strong> Schedules follow your staff&rsquo;s routines so residents are not disrupted.',
  '<strong>Saturday coverage.</strong> Our regular hours run Monday to Saturday, so weekend turnover does not wait until Monday.',
])}
</div></section>

<section class="section"><div class="container container--narrow">
<h2 class="section__title">What is different in rehabilitation clinics</h2>
${ul([
  '<strong>Direct skin contact with shared equipment</strong> — treatment tables, plinths, mats, bands, weights, parallel bars and balance equipment.',
  '<strong>Products that suit the surfaces</strong> — disinfectants compatible with table upholstery and mat vinyl, used at their full label contact time.',
  '<strong>A clear split with your therapists</strong> — staff wipe equipment between patients; we do the full clean after the last appointment and report any torn upholstery that can no longer be disinfected.',
  '<strong>The gym and the restrooms stay separate</strong> — color-coded cloths so restroom equipment never reaches treatment areas.',
])}
</div></section>

<section class="section section--alt"><div class="container container--narrow">
<h2 class="section__title">The standards behind the work</h2>
${ul([
  '42 CFR 483.80 — infection prevention and control in long-term care facilities (CMS F880)',
  '42 CFR 483.10(i) — a safe, clean, comfortable and homelike environment (CMS F584)',
  '105 CMR 150.000 — Massachusetts standards for long-term care facilities',
  '651 CMR 12.00 — certification of assisted living residences in Massachusetts',
  'OSHA 29 CFR 1910.1030 — bloodborne pathogens, for every worker with potential exposure',
  'EPA-registered disinfectants used at label contact times, including List K sporicidal products for <em>C. difficile</em>',
])}
</div></section>

${dataSection()}

<section class="section"><div class="container container--narrow">
<h2 class="section__title">Questions from rehab and senior care administrators</h2>
<div class="accordion">${FAQ.map(
  (f) =>
    `<div class="accordion__item"><button type="button" class="accordion__header" aria-expanded="false">${esc(f.q)}<svg class="accordion__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg></button><div class="accordion__content"><div class="accordion__body"><p>${esc(f.a)}</p></div></div></div>`
).join('')}</div>
</div></section>

<section class="section section--primary"><div class="container text-center">
<h2 class="text-white mb-lg">Free assessment for your clinic or residence</h2>
<p class="lead text-white mb-xl">${YEARS}+ years clinical experience. $2M insured. Written scope and signed logs. No obligation.</p>
<div class="btn-group btn-group--center"><a href="/contact" class="btn btn--white btn--lg">Request a Free Facility Assessment</a><a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a></div>
</div></section>`

const title = "Rehab Clinic & Senior Care Cleaning MA | Dory's"
const description = `Cleaning for rehabilitation clinics, nursing homes, assisted living and memory care in ${cities.length} MA towns. Outbreak-ready, resident-first. ${PHONE_DISP}`
const file = join(ROOT, 'data/pages', `${SLUG}.json`)
const existing = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
const img = `${SITE}/assets/images/services/rehab-nursing.webp`
const data = {
  ...existing,
  slug: SLUG,
  title,
  description,
  keywords: 'rehabilitation clinic cleaning Massachusetts, nursing home cleaning MA, assisted living cleaning, senior care facility cleaning, long-term care cleaning, memory care cleaning',
  robots: 'index, follow',
  geoRegion: 'US-MA',
  geoPlacename: 'Massachusetts',
  canonical: URL_,
  ogType: 'website',
  ogUrl: URL_,
  ogTitle: title,
  ogDescription: description,
  ogImage: img,
  ogLocale: 'en_US',
  ogSiteName: company.shortName,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: img,
  aiSummary: `Dory's Cleaning Services Inc. cleans rehabilitation clinics (physical, occupational and speech therapy) and senior care facilities (skilled nursing, long-term care, rest homes, assisted living and memory care) in ${cities.length} Massachusetts cities and towns, with outbreak escalation, resident-first scheduling and documented compliance.`,
  schemas: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        ['Home', SITE],
        ['Services', `${SITE}/services`],
        ['Rehab & Senior Care', URL_],
      ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Rehabilitation clinic and senior care facility cleaning',
      serviceType: 'Healthcare facility environmental cleaning',
      provider: { '@id': `${SITE}/#business` },
      areaServed: { '@type': 'State', name: 'Massachusetts' },
      url: URL_,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Rehab and senior care cleaning',
        itemListElement: GROUPS.map((g) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: g.label, url: `${SITE}/services/${g.slug}` },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
  mainHtml: main,
}
writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
console.log(`${SLUG}: ${title.length}-char title, ${description.length}-char description`)
