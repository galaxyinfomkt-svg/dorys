#!/usr/bin/env node
/**
 * /services hub: keep the count, the ItemList and the rehab + senior care
 * emphasis in step with the real hubs. The page said "5 Healthcare Cleaning
 * Services" (there are 9) and "5 rated" (the rating is 4.7, and a rating is
 * not ours to put in a description). Idempotent.
 *
 *   node scripts/enrich-services-index.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { SITE } from './lib/town-kit.mjs'

const FILE = 'data/services/index.json'
const d = JSON.parse(readFileSync(FILE, 'utf8'))
// Display order mirrors the header menu: medical, then rehab + senior care.
const HUBS = [
  'medical-office-cleaning', 'rehabilitation-clinics', 'skilled-nursing', 'assisted-living-cleaning',
  'specialty-clinics', 'ambulatory-outpatient', 'dental-office-cleaning', 'urgent-care-cleaning', 'healthcare-admin-offices',
]
const hub = (slug) => JSON.parse(readFileSync(`data/services/${slug}/index.json`, 'utf8'))
const NAME = {
  'medical-office-cleaning': 'Medical Office Cleaning',
  'rehabilitation-clinics': 'Rehabilitation Clinic Cleaning',
  'skilled-nursing': 'Nursing Home & Long-Term Care Cleaning',
  'assisted-living-cleaning': 'Assisted Living & Memory Care Cleaning',
  'specialty-clinics': 'Specialty Clinic Cleaning',
  'ambulatory-outpatient': 'Ambulatory & Outpatient Facility Cleaning',
  'dental-office-cleaning': 'Dental Office Cleaning',
  'urgent-care-cleaning': 'Urgent Care Cleaning',
  'healthcare-admin-offices': 'Healthcare Admin Office Cleaning',
}

const title = `Healthcare Facility Cleaning Services in MA | Dory's`
const description =
  'Cleaning for MA medical offices, rehab clinics, nursing homes, assisted living, dental, urgent care & outpatient. 22+ yrs, $2M insured. (978) 307-8107'
Object.assign(d, { title, ogTitle: title, description, ogDescription: description })

const block = `<!-- SERVICES-SENIOR:START -->
 <section class="section home-senior" id="rehab-senior-care" aria-labelledby="svc-senior-title">
 <div class="container container--narrow">
 <span class="section__badge">Core specialty</span>
 <h2 class="section__title" id="svc-senior-title">Rehabilitation clinics and senior care facilities</h2>
 <p>Two facility groups get special emphasis in our work: <strong>rehabilitation clinics</strong> (physical, occupational and speech therapy, sports medicine) and <strong>senior care</strong> (nursing homes, skilled nursing and long-term care, rest homes, assisted living and memory care). Shared therapy equipment and older, more vulnerable residents change the protocol, the products and the schedule.</p>
 <div class="home-senior__cards">
 <a href="/services/rehabilitation-clinics" class="home-senior__card"><strong>Rehabilitation Clinics</strong><span>Tables, mats, weights, parallel bars, gym floors</span></a>
 <a href="/services/skilled-nursing" class="home-senior__card"><strong>Nursing Homes &amp; Long-Term Care</strong><span>Resident rooms, discharge and outbreak cleaning</span></a>
 <a href="/services/assisted-living-cleaning" class="home-senior__card"><strong>Assisted Living &amp; Memory Care</strong><span>Resident-first crews, routines kept</span></a>
 </div>
 <a href="/senior-care-rehab-cleaning" class="btn btn--primary">Rehab &amp; Senior Care Cleaning</a>
 </div>
 </section>
<!-- SERVICES-SENIOR:END -->
`
let h = d.mainHtml.replace(/<!-- SERVICES-SENIOR:START -->[\s\S]*?<!-- SERVICES-SENIOR:END -->\n?/, '')
const at = h.indexOf('<!-- Why Choose Us Section -->')
if (at < 0) throw new Error('anchor not found')
d.mainHtml = h.slice(0, at) + block + ' ' + h.slice(at)

for (const s of d.schemas) {
  if (s['@type'] === 'ItemList') {
    s.name = "Healthcare cleaning services by Dory's Cleaning"
    s.numberOfItems = HUBS.length
    s.itemListElement = HUBS.map((slug, i) => {
      const x = hub(slug)
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Service', name: NAME[slug], description: x.description, url: `${SITE}/services/${slug}` },
      }
    })
  }
}
let json = JSON.stringify(d.schemas).replaceAll('5 Healthcare Cleaning Services in MA', 'Healthcare Facility Cleaning Services in MA')
d.schemas = JSON.parse(json)
writeFileSync(FILE, JSON.stringify(d))
console.log('services index:', title.length, 'char title,', description.length, 'char description')
