#!/usr/bin/env node
/**
 * Compose /services/{service}/{town}-ma pages — 8 services x 109 towns.
 *
 * Every page is indexable (owner's decision, 2026-09-22) and is built so that
 * no two pages say the same thing: each one combines
 *
 *   1. facts about THIS town, all from sourced data —
 *        data/cities/{slug}.json   county, region, population (2020 Census),
 *                                  verified healthcare landscape, ZIP codes
 *        city.geo                  Census Gazetteer land/water area, municipal
 *                                  form and interior point (build-city-geo.mjs)
 *      plus values computed from them: density, straight-line distance and
 *      direction from our Marlborough base, nearest served towns;
 *   2. the facilities in or near the town that match THIS service (verified
 *      records only — never presented as clients);
 *   3. a deterministic selection from the service's working knowledge
 *      (data/services/_meta/{slug}.json: high-touch zones, protocol steps,
 *      frequency guide, documentation, vendor questions, survey findings,
 *      FAQs), so neighbouring pages show different, equally true material;
 *   4. local FAQs answered from the data above.
 *
 * Nothing here is invented: when a value is missing the sentence that needs it
 * is left out rather than filled with a guess.
 *
 *   node scripts/build-service-city-pages.mjs [--dry]
 *   npm run build:service-pages   (build -> relink -> sitemaps)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  company, SITE, PHONE, PHONE_DISP, FORM_ID, YEARS, HQ, cities,
  esc, titleCase, lc, cap, num, UNIVERSAL, SHORT, NOUN, HERO,
  hash, pick, subset, nearest, hqFacts, round1, relevantFacilities, townFacts, anchorFacility, healthAuthorityHtml, healthAuthorityFaq,
} from './lib/town-kit.mjs'

const DRY = process.argv.includes('--dry')
const ROOT = process.cwd()

const META_DIR = join(ROOT, 'data/services/_meta')
const services = readdirSync(META_DIR)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => JSON.parse(readFileSync(join(META_DIR, f), 'utf8')))

// --- page parts ---------------------------------------------------------------
function pageTitle(service, city) {
  for (const name of [service.name, SHORT[service.slug]]) {
    const t = `${name} in ${city.name}, MA | Dory's Cleaning`
    if (t.length <= 60) return t
  }
  const bare = `${SHORT[service.slug]} in ${city.name}, MA`
  return bare.length <= 51 ? `${bare} | Dory's` : bare
}

function pageDescription(service, city) {
  const where = city.county ? `${city.name}, MA (${city.county} County)` : `${city.name}, MA`
  const tails = [
    `${YEARS}+ yrs clinical experience, $2M insured. Free assessment: ${PHONE_DISP}.`,
    `Written scope, EPA-registered products, signed logs. ${PHONE_DISP}.`,
    `Founder with ${YEARS}+ yrs in clinical settings. $2M insured. ${PHONE_DISP}.`,
  ]
  const tail = pick(tails, `desc:${service.slug}:${city.slug}`)
  for (const name of [service.name, SHORT[service.slug]]) {
    for (const w of [where, `${city.name}, MA`]) {
      const d = `${name} for ${w}. ${tail}`
      if (d.length <= 155) return d
    }
  }
  return `${SHORT[service.slug]} in ${city.name}, MA. ${tail}`.slice(0, 155)
}

function hero(service, city) {
  const img = HERO[service.slug] || 'medical-office-new'
  const [one, many] = NOUN[service.slug]
  const hq = hqFacts(city)
  const key = `hero:${service.slug}:${city.slug}`
  const subtitles = [
    `Clinical-grade cleaning for ${many} in ${city.name}${city.county ? ` and across ${city.county} County` : ''}. Founded by a ${YEARS}-year clinical veteran. $2M insured.`,
    `${cap(one)} cleaning built on CDC and OSHA practice, documented visit by visit, for ${city.name} facilities. $2M insured.`,
    hq && hq.d
      ? `Serving ${city.name} from our ${HQ.name} base, about ${hq.d} miles ${hq.dir}. Written scope, EPA-registered products, signed logs.`
      : `Serving ${city.name} from our ${HQ.name} base. Written scope, EPA-registered products, signed logs.`,
  ]
  return (
    `<section class="hero hero--inner">` +
    `<div class="hero__background">` +
    `<img src="/assets/images/services/${img}.webp" width="1200" height="600" ` +
    `alt="${esc(service.name)} in ${esc(city.name)}, MA — Dory's Cleaning Services" ` +
    `loading="eager" fetchpriority="high"></div>` +
    `<div class="container"><div class="hero__content hero__content--center">` +
    `<h1 class="hero__title">${esc(service.name)} in ${esc(city.name)}, MA</h1>` +
    `<p class="hero__subtitle">${esc(pick(subtitles, key))}</p>` +
    `<div class="hero__ctas">` +
    `<a href="#quote" class="btn btn--primary btn--lg btn--pulse">Free Facility Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a>` +
    `</div></div></div></section>`
  )
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

function introWithForm(service, city) {
  const key = `intro:${service.slug}:${city.slug}`
  const [, many] = NOUN[service.slug]
  const included = subset(service.facilityTypes || [], 4, `${key}:types`)
  const h2 = pick(
    [
      `${service.name} for ${city.name} facilities`,
      `What ${lc(service.name)} covers in ${city.name}`,
      `${city.name} ${many}: how we clean`,
    ],
    `${key}:h2`
  )
  const lead = pick(
    [
      `For ${many} in ${city.name}, the risk we plan around is ${service.centralRisk}. The surfaces that decide the outcome: ${service.criticalZone}.`,
      `In a ${NOUN[service.slug][0]}, most cleaning failures happen at ${service.criticalZone}. That is where our ${city.name} crews start, because the underlying risk is ${service.centralRisk}.`,
      `Our ${city.name} program for ${many} is written around one risk — ${service.centralRisk} — and one set of surfaces: ${service.criticalZone}.`,
    ],
    `${key}:lead`
  )
  const url = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}?city=${encodeURIComponent(
    city.name
  )}&service=${encodeURIComponent(service.name)}`
  const left =
    `<div class="animate-on-scroll animate-fade-right">` +
    `<h2>${esc(h2)}</h2>` +
    `<p class="lead">${esc(lead)}</p>` +
    (included.length
      ? `<p>Facility types we clean under this service:</p><ul class="list list--check">${included
          .map((t) => `<li>${esc(titleCase(t))}</li>`)
          .join('')}</ul>`
      : '') +
    (service.buyer ? `<p>Usually arranged with the ${esc(lc(service.buyer))}.</p>` : '') +
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

function townSection(service, city) {
  const rows = townFacts(city)
  if (!rows.length) return ''
  const key = `town:${service.slug}:${city.slug}`
  const [one, many] = NOUN[service.slug]
  const rel = relevantFacilities(city, service)
  let fit
  if (rel.length) {
    const names = rel.slice(0, 3).map((f) => `<strong>${esc(f.name)}</strong> (${esc(f.type)})`).join('; ')
    fit = `<p>${esc(city.name)} settings that match this service include ${names}. They are listed as market context — the kind of ${esc(one)} our protocol is written for — not as clients.</p>`
  } else if (anchorFacility(city)) {
    const a = anchorFacility(city)
    fit =
      `<p>${esc(city.name)}'s verified healthcare anchor is <strong>${esc(a.name)}</strong> (${esc(a.type)}). ` +
      `We clean the ${esc(many)} that operate in and around it — not the hospital itself — and we have not yet verified an individual ${esc(one)} by name here.</p>`
  } else {
    // Nearest served towns that DO have a verified facility of this type.
    const near = nearest(city)
      .filter(({ c }) => relevantFacilities(c, service).length)
      .slice(0, 2)
    fit =
      `<p>We have not verified a ${esc(one)} inside ${esc(city.name)} itself` +
      (near.length
        ? `; the closest verified ones on our routes are in ${near
            .map(({ c, d }) => `<a href="/services/${service.slug}/${c.slug}-ma">${esc(c.name)}</a> (about ${round1(d)} mi)`)
            .join(' and ')}.`
        : '.') +
      ` If your ${esc(one)} is in ${esc(city.name)}, call ${esc(PHONE_DISP)} and we will confirm scheduling for your address before the assessment.</p>`
  }
  const corridors = city.healthcareLandscape?.medicalCorridors || []
  const corr = corridors.length
    ? `<p>Medical offices in ${esc(city.name)} cluster along ${corridors.map((c) => `<strong>${esc(c)}</strong>`).join(' and ')}.</p>`
    : ''
  const h2 = pick(
    [`${city.name} at a glance`, `About ${city.name}, MA`, `${city.name}: the local picture`],
    `${key}:h2`
  )
  return (
    `<section class="section section--alt"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(h2)}</h2>` +
    `<ul class="list list--check">${rows.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join('')}</ul>` +
    fit +
    corr +
    healthAuthorityHtml(city, esc) +
    `<p class="text-muted" style="font-size:0.9rem">Sources: U.S. Census Bureau (2020 Census; Gazetteer files), USPS ZIP codes, and our own verification of local facilities. Distances are straight-line.</p>` +
    `</div></section>`
  )
}

/** A rotating slice of the service's working knowledge. */
function knowledge(service, city) {
  const key = `know:${service.slug}:${city.slug}`
  const zones = subset(service.highTouchZones, 6, `${key}:z`)
  const steps = subset(service.protocolSteps, 5, `${key}:s`)
  const freq = subset(service.frequencyGuide, 3, `${key}:f`)
  const docs = subset(service.documentationDeliverables, 4, `${key}:d`)
  const sched = pick(service.scheduleNotes || [''], `${key}:n`)
  const parts = []
  if (zones.length)
    parts.push(
      `<h3>${esc(pick(['High-touch surfaces on every visit', `The surfaces we prioritise in ${city.name}`, 'Where contamination concentrates'], `${key}:hz`))}</h3>` +
        `<ul class="list list--check">${zones.map((z) => `<li>${esc(cap(z))}</li>`).join('')}</ul>`
    )
  if (steps.length)
    parts.push(
      `<h3>${esc(pick(['How a visit runs', 'Our sequence, step by step', 'What the crew does, in order'], `${key}:hs`))}</h3>` +
        `<ol class="list list--steps">${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`
    )
  if (freq.length)
    parts.push(
      `<h3>${esc(pick(['How often', 'Frequency, area by area', 'A starting schedule'], `${key}:hf`))}</h3>` +
        `<ul class="list list--check">${freq.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` +
        (sched ? `<p>${esc(sched)}</p>` : '')
    )
  if (docs.length)
    parts.push(
      `<h3>${esc(pick(['What you keep on file', 'Documentation you receive', 'Records for your surveyors'], `${key}:hd`))}</h3>` +
        `<ul class="list list--check">${docs.map((d) => `<li>${esc(cap(d))}</li>`).join('')}</ul>`
    )
  if (!parts.length) return ''
  const h2 = pick(
    [`${SHORT[service.slug]} in ${city.name}: the working detail`, `Inside a ${city.name} service visit`, `How we clean ${NOUN[service.slug][1]} in ${city.name}`],
    `${key}:h2`
  )
  return (
    `<section class="section"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(h2)}</h2>${parts.join('')}` +
    `</div></section>`
  )
}

function findings(service, city) {
  const all = service.commonSurveyFindings || []
  const items = subset(all, 3, `find:${service.slug}:${city.slug}`)
  if (!items.length) return ''
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
  const h2 = pick(
    [`Survey findings we help ${city.name} facilities prevent`, `Citations ${city.name} ${NOUN[service.slug][1]} can avoid`, `What inspectors cite — and how we prevent it`],
    `find:h2:${service.slug}:${city.slug}`
  )
  return (
    `<section class="section section--alt"><div class="container">` +
    `<h2 class="section__title text-center">${esc(h2)}</h2>` +
    `<p class="section__subtitle text-center mb-lg">Real, published regulatory findings — every citation links to its source.</p>` +
    `<div class="benefits-grid">${cards}</div>` +
    (all.length > items.length
      ? `<p class="text-center mt-xl"><a href="/services/${service.slug}" class="btn btn--secondary">See all ${all.length} findings</a></p>`
      : '') +
    `</div></section>`
  )
}

function vendorQuestions(service, city) {
  const qs = subset(service.vendorQuestions, 3, `vq:${service.slug}:${city.slug}`)
  if (!qs.length) return ''
  return (
    `<section class="section"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(pick([`Questions to ask any ${city.name} cleaning vendor`, 'Before you sign with a cleaning company', 'Questions worth asking at the walkthrough'], `vq:h2:${service.slug}:${city.slug}`))}</h2>` +
    `<ul class="list list--check">${qs.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>` +
    `<p>We answer each of these in writing after the free assessment.</p>` +
    `</div></section>`
  )
}

/** Local questions answered from the town data; service FAQs rotate. */
function faqs(service, city) {
  const key = `faq:${service.slug}:${city.slug}`
  const [one, many] = NOUN[service.slug]
  const local = []
  const hq = hqFacts(city)
  local.push({
    q: `Do you provide ${lc(service.name)} in ${city.name}, MA?`,
    a: `Yes. ${city.name}${city.county ? ` (${city.county} County)` : ''} is one of the ${company.citiesServed} Massachusetts cities and towns we serve.` +
      (hq && hq.d ? ` It is about ${hq.d} miles ${hq.dir} of our ${HQ.name} base in a straight line.` : '') +
      ` Every engagement starts with a free on-site assessment; call ${PHONE_DISP}.`,
  })
  if (city.zipCodes?.length)
    local.push({
      q: `Which ${city.name} ZIP codes do you cover?`,
      a: `All of them: ${city.zipCodes.join(', ')}. If your facility sits on a town line, tell us the street address and we will confirm.`,
    })
  const rel = relevantFacilities(city, service)
  local.push(
    rel.length
      ? {
          q: `Which ${many} are in ${city.name}?`,
          a: `Verified examples include ${rel.slice(0, 3).map((f) => `${f.name} (${f.type})`).join('; ')}. We list them as local market context; they are not presented as our clients.`,
        }
      : anchorFacility(city)
      ? {
          q: `Are there ${many} in ${city.name}?`,
          a: `${city.name}'s verified healthcare anchor is ${anchorFacility(city).name} (${anchorFacility(city).type}), and practices operate in and around it. We have not verified an individual ${one} by name yet; tell us your address and we will confirm scheduling.`,
        }
      : {
          q: `Are there ${many} in ${city.name}?`,
          a: `We have not verified one inside ${city.name}. ${city.healthcareLandscape?.dominantFacilityType ? `The typical healthcare setting here is ${city.healthcareLandscape.dominantFacilityType}. ` : ''}If you operate a ${one} in town, we can schedule it on the same route as neighbouring towns.`,
        }
  )
  const hf = healthAuthorityFaq(city)
  if (hf) local.push(hf)
  const near = nearest(city).slice(0, 3)
  if (near.length)
    local.push({
      q: `Which nearby towns do you also serve?`,
      a: `The closest served towns to ${city.name} are ${near.map(({ c, d }) => `${c.name} (about ${round1(d)} mi)`).join(', ')}. See the full list on our service areas page.`,
    })
  const svc = subset(service.faqs || [], 3, key)
  const all = [...subset(local, 3, `${key}:local`), ...svc]
  const items = all
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
    `<section class="section section--alt"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(pick([`${SHORT[service.slug]} in ${city.name} — common questions`, `${city.name} questions, answered`, `FAQ: ${lc(service.name)} in ${city.name}`], `${key}:h2`))}</h2>` +
    `<div class="accordion">${items}</div>` +
    `<p class="text-center mt-lg"><a href="/services/${service.slug}#faq">All ${(service.faqs || []).length} questions on ${esc(lc(service.name))}</a></p>` +
    `</div></section>`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: all.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return { html, schema }
}

function nearbySection(city, service) {
  const list = nearest(city).slice(0, 6)
  if (!list.length) return ''
  const links = list
    .map(
      ({ c, d }) =>
        `<a href="/services/${service.slug}/${c.slug}-ma" class="nearby-cities__link">${esc(SHORT[service.slug])} in ${esc(c.name)} <span class="nearby-cities__dist">${round1(d)} mi</span></a>`
    )
    .join('')
  return (
    `<section class="section"><div class="container">` +
    `<h2 class="section__title">${esc(pick([`Also serving near ${city.name}`, `Neighbouring towns we serve`, `Nearby ${NOUN[service.slug][1]} we clean`], `near:${service.slug}:${city.slug}`))}</h2>` +
    `<div class="nearby-cities"><div class="nearby-cities__list">${links}</div></div>` +
    `<div class="text-center mt-xl"><a href="/locations/${city.slug}-ma" class="btn btn--secondary">All services in ${esc(city.name)}</a> ` +
    `<a href="/locations" class="btn btn--primary">All ${company.citiesServed} cities &amp; towns</a></div>` +
    `</div></section>`
  )
}

function finalCta(service, city) {
  return (
    `<section class="section section--primary"><div class="container text-center">` +
    `<h2 class="text-white mb-lg">Free ${esc(lc(service.name))} assessment in ${esc(city.name)}</h2>` +
    `<p class="lead text-white mb-xl">${YEARS}+ years clinical experience. $2M insured. No obligation.</p>` +
    `<div class="btn-group btn-group--center">` +
    `<a href="#quote" class="btn btn--white btn--lg">Request Assessment</a>` +
    `<a href="tel:${PHONE}" class="btn btn--outline-light btn--lg">Call ${esc(PHONE_DISP)}</a>` +
    `</div></div></section>`
  )
}

// --- build --------------------------------------------------------------------
let written = 0
const perService = {}

for (const service of services) {
  if (!UNIVERSAL.has(service.slug)) continue
  const dir = join(ROOT, 'data/services', service.slug)
  mkdirSync(dir, { recursive: true })
  perService[service.slug] = 0

  for (const city of cities) {
    const file = join(dir, `${city.slug}-ma.json`)
    const url = `${SITE}/services/${service.slug}/${city.slug}-ma`
    const { html: faqHtml, schema: faqSchema } = faqs(service, city)
    // Section order varies a little between pages; content order within a
    // section never does.
    const middle = [knowledge(service, city), findings(service, city), vendorQuestions(service, city)]
    const rot = hash(`order:${service.slug}:${city.slug}`) % 2
    const mainHtml = [
      hero(service, city),
      breadcrumb(service, city),
      introWithForm(service, city),
      townSection(service, city),
      ...(rot ? [middle[1], middle[0], middle[2]] : middle),
      faqHtml,
      nearbySection(city, service),
      finalCta(service, city),
    ]
      .filter(Boolean)
      .join('\n')

    const existing = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
    const title = pageTitle(service, city)
    const description = pageDescription(service, city)
    const img = `${SITE}/assets/images/services/${HERO[service.slug] || 'medical-office-new'}.webp`
    const data = {
      ...existing,
      slug: `${city.slug}-ma`,
      city: city.name,
      category: service.slug,
      categoryLabel: service.name,
      title,
      description,
      keywords: `${service.name.toLowerCase()} ${city.name} MA, healthcare cleaning ${city.name}${city.county ? `, ${city.county} County` : ''}`,
      robots: 'index, follow',
      geoRegion: 'US-MA',
      geoPlacename: `${city.name}, Massachusetts`,
      canonical: url,
      ogType: 'website',
      ogUrl: url,
      ogTitle: `${service.name} in ${city.name}, MA`,
      ogDescription: description,
      ogImage: img,
      ogLocale: 'en_US',
      ogSiteName: company.shortName,
      twitterCard: 'summary_large_image',
      twitterTitle: `${service.name} in ${city.name}, MA`,
      twitterDescription: description,
      twitterImage: img,
      schemas: [
        faqSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `${service.name} in ${city.name}, MA`,
          serviceType: service.name,
          provider: { '@id': `${SITE}/#business` },
          areaServed: {
            '@type': 'City',
            name: `${city.name}, MA`,
            ...(city.geo ? { geo: { '@type': 'GeoCoordinates', latitude: city.geo.lat, longitude: city.geo.lng } } : {}),
          },
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
    delete data.aiSummary

    if (!DRY) writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
    written++
    perService[service.slug]++
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
    JSON.stringify(services.filter((s) => UNIVERSAL.has(s.slug)).map((s) => s.slug), null, 2) + '\n'
  )
}

console.log(`${DRY ? 'DRY RUN — ' : ''}pages: ${written} (all indexable)`)
for (const [slug, n] of Object.entries(perService)) console.log(`  ${slug.padEnd(26)} ${String(n).padStart(4)}`)
