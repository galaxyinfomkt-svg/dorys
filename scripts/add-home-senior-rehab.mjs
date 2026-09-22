#!/usr/bin/env node
/**
 * Home page: rehab clinic + senior care emphasis (owner's priority,
 * 2026-09-22). Idempotent — replaces the block between the HOME-SENIOR
 * markers, inserted right after the #services section. Also keeps the home
 * meta description and Organization knowsAbout in step.
 *
 *   node scripts/add-home-senior-rehab.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { cities, relevantFacilities } from './lib/town-kit.mjs'

const FILE = 'data/home.json'
const d = JSON.parse(readFileSync(FILE, 'utf8'))
const count = (slug) => cities.filter((c) => relevantFacilities(c, { slug }).length).length

const card = (href, title, text, track) =>
  `<a href="${href}" class="home-senior__card" data-track="${track}"><strong>${title}</strong><span>${text}</span></a>`

const block = `<!-- HOME-SENIOR:START -->
<section class="section home-senior" id="rehab-senior-care" aria-labelledby="rehab-senior-care-title">
  <div class="container">
    <div class="home-senior__grid">
      <div class="home-senior__media">
        <img src="/assets/images/services/rehab-nursing.webp" width="800" height="533" alt="Resident room and therapy area cleaned in a Massachusetts rehabilitation and nursing facility" loading="lazy" decoding="async">
      </div>
      <div class="home-senior__body">
        <span class="section__badge">Core specialty</span>
        <h2 class="section__title" id="rehab-senior-care-title">We Clean Rehabilitation Clinics and Senior Care Facilities</h2>
        <p>Rehab clinics, nursing homes, assisted living and memory care are a core specialty for us. They need something a standard janitorial crew does not bring: shared therapy equipment that is touched by every patient, residents who are older and more vulnerable to infection, and rooms that are someone's home.</p>
        <ul class="list list--check">
          <li><strong>Rehabilitation clinics:</strong> treatment tables and plinths, mats, parallel bars, weights and cardio consoles, gym floors, hydrotherapy areas, waiting rooms.</li>
          <li><strong>Nursing homes &amp; long-term care:</strong> resident rooms daily and on discharge, shared bathrooms, dining and activity rooms, handrails, nursing stations. Outbreak response for norovirus, flu and C. diff.</li>
          <li><strong>Assisted living &amp; memory care:</strong> quiet, consistent crews residents recognize, cleaning around daily routines, low-odor products, and care for residents' personal belongings.</li>
        </ul>
        <div class="home-senior__cards">
          ${card('/services/rehabilitation-clinics', 'Rehabilitation Clinics', `PT, OT and sports-medicine clinics · ${count('rehabilitation-clinics')} towns with verified clinics`, 'home-senior-rehab')}
          ${card('/services/skilled-nursing', 'Nursing Homes &amp; Long-Term Care', `Skilled nursing, rest homes, post-acute · discharge &amp; outbreak cleaning`, 'home-senior-snf')}
          ${card('/services/assisted-living-cleaning', 'Assisted Living &amp; Memory Care', `Resident-first cleaning · ${count('assisted-living-cleaning')} towns with verified residences`, 'home-senior-al')}
        </div>
        <a href="/senior-care-rehab-cleaning" class="btn btn--primary" data-track="home-senior-pillar">Rehab &amp; Senior Care Cleaning</a>
      </div>
    </div>
  </div>
</section>
<!-- HOME-SENIOR:END -->`

let h = d.mainHtml.replace(/<!-- HOME-SENIOR:START -->[\s\S]*?<!-- HOME-SENIOR:END -->\n?/, '')
const at = h.indexOf('<section class="section section--light" id="specialized-cleaning"')
if (at < 0) throw new Error('anchor #specialized-cleaning not found')
h = h.slice(0, at) + block + '\n     ' + h.slice(at)

// Hero subtitle: name the facility types up front.
h = h.replace(
  'We bring infection prevention accountability to your facility,',
  'We clean medical offices, rehabilitation clinics, nursing homes and assisted living with infection prevention accountability,'
)
d.mainHtml = h

d.description =
  'Cleaning for MA medical offices, rehab clinics, nursing homes & assisted living. 22+ yrs clinical experience, $2M insured. Free assessment: (978) 307-8107'
d.ogDescription = d.twitterDescription = d.description
if (d.aiSummary && !d.aiSummary.includes('Rehabilitation clinics and senior care')) {
  d.aiSummary +=
    ' Rehabilitation clinics and senior care facilities (skilled nursing, long-term care, rest homes, assisted living and memory care) are a core specialty: https://doryscleaningservices.com/senior-care-rehab-cleaning'
}

// Organization node: knowsAbout lists the specialties explicitly.
const EXTRA = ['Rehabilitation clinic cleaning', 'Nursing home cleaning', 'Skilled nursing facility cleaning', 'Assisted living cleaning', 'Memory care cleaning', 'Senior care facility cleaning']
for (const s of d.schemas) {
  for (const n of s['@graph'] || [s]) {
    const t = [].concat(n['@type'] || [])
    if (t.includes('Organization')) {
      n.knowsAbout = [...new Set([...(n.knowsAbout || []), ...EXTRA])]
    }
  }
}
writeFileSync(FILE, JSON.stringify(d))  // one line, as the file has always been
console.log('home: rehab/senior section in place; description', d.description.length, 'chars')
