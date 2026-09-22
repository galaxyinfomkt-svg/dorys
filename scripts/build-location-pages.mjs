#!/usr/bin/env node
/**
 * Compose the 109 town hubs at /locations/{town}-ma from sourced data.
 *
 * The previous pages were ~1,000 words of which most was shared: a "why choose
 * us" block identical on every town, a county paragraph identical across each
 * county, and service cards pointing at the same hubs. Pages of the same county
 * scored ~0.45-0.7 similarity. Each page is now built from THIS town's record:
 *
 *   - Census facts (population, land/water area, municipal form), ZIP codes,
 *     county/region, straight-line distance and direction from Marlborough;
 *   - the verified healthcare landscape (named facilities, corridors, typical
 *     setting) — market context, never presented as clients;
 *   - the eight services, each with what is verified in town for it, or the
 *     nearest served town where it is;
 *   - local FAQs answered from the same data, and the nearest served towns.
 *
 *   node scripts/build-location-pages.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  company, SITE, PHONE, PHONE_DISP, FORM_ID, YEARS, HQ, cities,
  esc, lc, num, UNIVERSAL, SHORT, NOUN,
  pick, subset, nearest, hqFacts, round1, relevantFacilities, townFacts,
} from './lib/town-kit.mjs'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()
const META_DIR = join(ROOT, 'data/services/_meta')
const services = readdirSync(META_DIR)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => JSON.parse(readFileSync(join(META_DIR, f), 'utf8')))
  .filter((s) => UNIVERSAL.has(s.slug))
// Display order: most common facility types first.
const ORDER = [
  'medical-office-cleaning', 'dental-office-cleaning', 'urgent-care-cleaning', 'specialty-clinics',
  'ambulatory-outpatient', 'rehabilitation-clinics', 'skilled-nursing', 'assisted-living-cleaning',
]
services.sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))

const countyPeers = (city) => cities.filter((c) => c.county && c.county === city.county && c.slug !== city.slug)

function hero(city) {
  const hq = hqFacts(city)
  const key = `loc:hero:${city.slug}`
  const subs = [
    `Clinical-grade cleaning for medical, dental, outpatient and long-term care facilities in ${city.name}${city.county ? `, ${city.county} County` : ''}. Founded by a ${YEARS}-year clinical veteran. $2M insured.`,
    hq && hq.d
      ? `${city.name} is about ${hq.d} miles ${hq.dir} of our ${HQ.name} base. Written scope, EPA-registered products and signed logs for every visit.`
      : `${city.name} is our home base. Written scope, EPA-registered products and signed logs for every visit.`,
    `Environmental cleaning for ${city.name} healthcare facilities, documented for your surveyors. $2M insured, free on-site assessment.`,
  ]
  const form = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}?city=${encodeURIComponent(city.name)}&locationId=${company.ghl.locationId}`
  return (
    `<section class="hero hero--inner"><div class="hero__background">` +
    `<img src="/assets/images/hero/healthcare-hero.webp" alt="Healthcare facility cleaning in ${esc(city.name)}, MA" loading="eager" fetchpriority="high" width="1200" height="600"></div>` +
    `<div class="container"><div class="location-hero__grid" style="display:flex;align-items:flex-start;gap:2.25rem;flex-wrap:wrap;justify-content:center;">` +
    `<div class="location-hero__content" style="flex:1 1 480px;min-width:300px;max-width:640px;text-align:left;">` +
    `<h1 class="hero__title">Healthcare Cleaning Services in ${esc(city.name)}, MA</h1>` +
    `<p class="hero__subtitle">${esc(pick(subs, key))}</p>` +
    `<div class="hero__ctas"><a href="#services" class="btn btn--primary btn--lg btn--pulse">Services in ${esc(city.name)}</a>` +
    `<a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a></div></div>` +
    `<div class="form-bare" style="max-width:620px;margin:1.5rem auto;width:100%;"><iframe src="${esc(form)}" width="100%" height="460" style="width:100%;height:460px;border:none;display:block;background:#fff;" id="loc-hero-form-${city.slug}-ma" title="Free ${esc(city.name)} healthcare facility cleaning assessment request" loading="lazy"></iframe></div>` +
    `</div></div></section>`
  )
}

function breadcrumb(city) {
  return (
    `<nav class="breadcrumb breadcrumb--page" aria-label="Breadcrumb"><div class="container"><ol class="breadcrumb__list">` +
    `<li class="breadcrumb__item"><a class="breadcrumb__link" href="/">Home</a></li>` +
    `<li class="breadcrumb__item"><a class="breadcrumb__link" href="/locations">Service Areas</a></li>` +
    `<li class="breadcrumb__item" aria-current="page">${esc(city.name)}, MA</li></ol></div></nav>`
  )
}

function glance(city) {
  const rows = townFacts(city)
  const peers = countyPeers(city)
  return (
    `<section class="section"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(pick([`${city.name} at a glance`, `About ${city.name}, Massachusetts`, `${city.name} in numbers`], `loc:gl:${city.slug}`))}</h2>` +
    `<ul class="list list--check">${rows.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join('')}</ul>` +
    (peers.length
      ? `<p>We also serve ${peers.length} other ${esc(city.county)} County ${peers.length === 1 ? 'town' : 'cities and towns'}, so ${esc(city.name)} facilities share routes with ${esc(
          nearest(city).filter(({ c }) => c.county === city.county).slice(0, 3).map(({ c }) => c.name).join(', ')
        )} and their neighbours.</p>`
      : '') +
    `<p class="text-muted" style="font-size:0.9rem">Sources: U.S. Census Bureau (2020 Census; Gazetteer files), USPS ZIP codes. Distances are straight-line.</p>` +
    `</div></section>`
  )
}

function landscape(city) {
  const hc = city.healthcareLandscape || {}
  const fac = (hc.majorFacilities || []).filter((f) => f && f.name)
  const corr = hc.medicalCorridors || []
  const parts = []
  if (fac.length)
    parts.push(
      `<p>Verified healthcare settings in ${esc(city.name)}:</p><ul class="list list--check">${fac
        .map((f) => `<li><strong>${esc(f.name)}</strong> — ${esc(f.type)}</li>`)
        .join('')}</ul>`
    )
  else parts.push(`<p>We have not verified a named healthcare facility inside ${esc(city.name)}; practices here are typically served on the same routes as neighbouring towns.</p>`)
  if (corr.length) parts.push(`<p>Practices cluster along ${corr.map((c) => `<strong>${esc(c)}</strong>`).join(' and ')}.</p>`)
  if (hc.dominantFacilityType) parts.push(`<p>Typical setting: ${esc(hc.dominantFacilityType)}.</p>`)
  parts.push(`<p class="text-muted" style="font-size:0.9rem">Listed as local market context — these facilities are not presented as our clients.</p>`)
  return (
    `<section class="section section--alt"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(pick([`Healthcare in ${city.name}`, `${city.name}'s healthcare landscape`, `Where care happens in ${city.name}`], `loc:ls:${city.slug}`))}</h2>` +
    parts.join('') +
    `</div></section>`
  )
}

function servicesGrid(city) {
  const cards = services
    .map((s) => {
      const rel = relevantFacilities(city, s)
      let note
      if (rel.length) note = `Verified here: ${rel.slice(0, 2).map((f) => f.name).join('; ')}.`
      else {
        const n = nearest(city).find(({ c }) => relevantFacilities(c, s).length)
        note = n
          ? `No verified ${NOUN[s.slug][0]} in town yet; nearest verified: ${n.c.name} (${round1(n.d)} mi).`
          : `Scheduled on request for ${city.name} addresses.`
      }
      return (
        `<a class="service-mini" href="/services/${s.slug}/${city.slug}-ma">` +
        `<strong class="service-mini__title">${esc(SHORT[s.slug])} in ${esc(city.name)}</strong>` +
        `<span class="service-mini__text">${esc(note)}</span></a>`
      )
    })
    .join('')
  return (
    `<section class="section" id="services"><div class="container">` +
    `<h2 class="section__title text-center">Healthcare cleaning services in ${esc(city.name)}</h2>` +
    `<p class="section__subtitle text-center mb-lg">Each service has its own protocol, surfaces and documentation. Choose the one that matches your facility.</p>` +
    `<div class="service-mini-grid">${cards}</div></div></section>`
  )
}

function howWeWork(city) {
  const steps = [
    `A walkthrough of your ${city.name} facility with our founder, who brings ${YEARS} years of clinical experience.`,
    'A written, room-by-room scope with frequencies, products and contact times.',
    'Trained crews on your schedule, with signed logs after every visit.',
    'Verification on request — ATP or fluorescent-marker checks of high-touch surfaces.',
  ]
  return (
    `<section class="section section--alt"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(pick([`How we start in ${city.name}`, 'Four steps to a documented program', `Working with ${city.name} facilities`], `loc:how:${city.slug}`))}</h2>` +
    `<ol class="list list--steps">${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` +
    `</div></section>`
  )
}

function faq(city) {
  const hq = hqFacts(city)
  const q = []
  q.push({
    q: `Do you clean healthcare facilities in ${city.name}, MA?`,
    a: `Yes. ${city.name}${city.county ? ` in ${city.county} County` : ''} is one of the ${company.citiesServed} Massachusetts cities and towns we serve${hq && hq.d ? `, about ${hq.d} miles ${hq.dir} of our ${HQ.name} base` : ''}. We clean licensed healthcare facilities only — not homes or general offices.`,
  })
  if (city.zipCodes?.length)
    q.push({ q: `Which ${city.name} ZIP codes are covered?`, a: `${city.zipCodes.join(', ')}. For addresses on a town line, give us the street address and we will confirm.` })
  const fac = (city.healthcareLandscape?.majorFacilities || []).filter((f) => f && f.name)
  q.push(
    fac.length
      ? { q: `What kinds of healthcare facilities are in ${city.name}?`, a: `Verified examples include ${fac.slice(0, 3).map((f) => `${f.name} (${f.type})`).join('; ')}. They are listed as market context, not as clients.` }
      : { q: `Are there healthcare facilities in ${city.name}?`, a: `We have not verified a named facility inside ${city.name}. ${city.healthcareLandscape?.dominantFacilityType ? `The typical setting here is ${city.healthcareLandscape.dominantFacilityType}. ` : ''}Practices in town are scheduled on the same routes as neighbouring towns.` }
  )
  const near = nearest(city).slice(0, 3)
  if (near.length)
    q.push({ q: `Which nearby towns do you serve?`, a: `The closest are ${near.map(({ c, d }) => `${c.name} (about ${round1(d)} mi)`).join(', ')}.` })
  q.push({
    q: `How does an assessment in ${city.name} work?`,
    a: `We visit the facility, review high-touch zones, clean/dirty separation, current products and the records your surveyors expect, then send a written scope. It is free and carries no obligation. Call ${PHONE_DISP}.`,
  })
  const html =
    `<section class="section"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(pick([`${city.name} questions, answered`, `FAQ: healthcare cleaning in ${city.name}`, `Common questions from ${city.name} facilities`], `loc:faq:${city.slug}`))}</h2>` +
    `<div class="accordion">${q
      .map(
        (f) =>
          `<div class="accordion__item"><button type="button" class="accordion__header" aria-expanded="false">${esc(f.q)}` +
          `<svg class="accordion__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg></button>` +
          `<div class="accordion__content"><div class="accordion__body"><p>${esc(f.a)}</p></div></div></div>`
      )
      .join('')}</div></div></section>`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: q.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return { html, schema }
}

function nearby(city) {
  const list = nearest(city).slice(0, 8)
  return (
    `<section class="section section--alt"><div class="container">` +
    `<h2 class="section__title text-center">${esc(pick([`Towns near ${city.name}`, 'Also serving nearby', `Neighbouring towns we serve`], `loc:nb:${city.slug}`))}</h2>` +
    `<div class="nearby-cities"><div class="nearby-cities__list">${list
      .map(({ c, d }) => `<a href="/locations/${c.slug}-ma" class="nearby-cities__link">${esc(c.name)} <span class="nearby-cities__dist">${round1(d)} mi</span></a>`)
      .join('')}</div></div>` +
    `<div class="text-center mt-xl"><a href="/locations" class="btn btn--primary">All ${company.citiesServed} cities &amp; towns</a></div>` +
    `</div></section>`
  )
}

function mapAndCta(city) {
  return (
    `<section class="section section--primary"><div class="container text-center">` +
    `<h2 class="text-white mb-lg">Free facility assessment in ${esc(city.name)}</h2>` +
    `<p class="lead text-white mb-xl" style="opacity:0.9">${YEARS}+ years clinical experience. $2M insured. No obligation.</p>` +
    `<div class="btn-group btn-group--center"><a href="/contact" class="btn btn--white btn--lg">Request a Free Facility Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a></div></div></section>` +
    `<section class="section" style="padding:3rem 0;"><div class="container">` +
    `<h2 class="section__title text-center mb-lg">Service area: ${esc(city.name)}, MA</h2>` +
    `<div style="position:relative;width:100%;max-width:960px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);aspect-ratio:16/9;">` +
    `<iframe loading="lazy" src="https://www.google.com/maps?q=${encodeURIComponent(`${city.name}, Massachusetts`)}&output=embed" style="border:0;width:100%;height:100%;" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="${esc(city.name)}, MA service area map"></iframe>` +
    `</div></div></section>`
  )
}

function description(city) {
  const hq = hqFacts(city)
  const opts = [
    `Healthcare facility cleaning in ${city.name}, MA${city.county ? ` (${city.county} County)` : ''}: medical, dental, urgent care, outpatient and long-term care. $2M insured. ${PHONE_DISP}`,
    `Clinical-grade cleaning for ${city.name}, MA healthcare facilities${hq && hq.d ? `, ${hq.d} mi from our ${HQ.name} base` : ''}. Written scope, signed logs. Free assessment: ${PHONE_DISP}`,
  ]
  let d = pick(opts, `loc:desc:${city.slug}`)
  if (d.length > 158) d = opts.find((o) => o.length <= 158) || d.slice(0, 155)
  return d
}

let n = 0
for (const city of cities) {
  const file = join(ROOT, 'data/locations', `${city.slug}-ma.json`)
  const existing = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  const url = `${SITE}/locations/${city.slug}-ma`
  const { html: faqHtml, schema: faqSchema } = faq(city)
  const mainHtml = [
    hero(city),
    breadcrumb(city),
    glance(city),
    servicesGrid(city),
    landscape(city),
    howWeWork(city),
    faqHtml,
    nearby(city),
    mapAndCta(city),
  ].join('\n')
  const title = [`Healthcare Facility Cleaning in ${city.name}, MA | Dory's`, `Healthcare Cleaning in ${city.name}, MA | Dory's`, `Healthcare Cleaning in ${city.name}, MA`].find((t) => t.length <= 60)
  const desc = description(city)
  const data = {
    ...existing,
    title,
    description: desc,
    keywords: `healthcare cleaning ${city.name} MA, medical office cleaning ${city.name}${city.county ? `, ${city.county} County healthcare cleaning` : ''}`,
    robots: 'index, follow',
    canonical: url,
    ogUrl: url,
    ogTitle: title,
    ogDescription: desc,
    twitterTitle: title,
    twitterDescription: desc,
    geoPlacename: `${city.name}, Massachusetts`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          ['Home', SITE],
          ['Service Areas', `${SITE}/locations`],
          [`${city.name}, MA`, url],
        ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `Healthcare facility cleaning in ${city.name}, MA`,
        serviceType: 'Healthcare facility environmental cleaning',
        provider: { '@id': `${SITE}/#business` },
        areaServed: {
          '@type': 'City',
          name: `${city.name}, MA`,
          ...(city.geo ? { geo: { '@type': 'GeoCoordinates', latitude: city.geo.lat, longitude: city.geo.lng } } : {}),
        },
        url,
      },
      faqSchema,
    ],
    mainHtml,
  }
  delete data.aiSummary
  if (!DRY) writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  n++
}
console.log(`${DRY ? 'DRY — ' : ''}location pages: ${n}`)
