#!/usr/bin/env node
/**
 * Link every blog guide to the service hubs it is actually about.
 *
 * Only 3 of 20 posts linked to any service hub, so the site's most detailed
 * content passed almost no authority to the pages that sell. Each post gets a
 * short "Where this applies" block (between BLOG-SERVICES markers, so re-runs
 * replace it) placed before the author bio.
 *
 *   node scripts/link-blog-to-services.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const LABEL = {
  'medical-office-cleaning': 'Medical office cleaning',
  'dental-office-cleaning': 'Dental office cleaning',
  'urgent-care-cleaning': 'Urgent care cleaning',
  'specialty-clinics': 'Specialty clinic cleaning',
  'ambulatory-outpatient': 'Outpatient & ambulatory surgery center cleaning',
  'rehabilitation-clinics': 'Rehabilitation clinic cleaning',
  'skilled-nursing': 'Skilled nursing & long-term care cleaning',
  'assisted-living-cleaning': 'Assisted living cleaning',
}
/** Topic -> the services whose buyers the post is written for. */
const MAP = {
  'bloodborne-pathogen-cleanup-protocols-clinical-environments': ['medical-office-cleaning', 'urgent-care-cleaning', 'dental-office-cleaning'],
  'cdc-compliance-environmental-sanitation-clinics': ['medical-office-cleaning', 'specialty-clinics', 'urgent-care-cleaning'],
  'choosing-healthcare-cleaning-service-massachusetts': ['medical-office-cleaning', 'specialty-clinics', 'ambulatory-outpatient'],
  'clinical-cleaning-vs-janitorial-cleaning-differences': ['medical-office-cleaning', 'specialty-clinics', 'rehabilitation-clinics'],
  'covid-cleaning-legacy-permanent-changes-healthcare': ['medical-office-cleaning', 'skilled-nursing', 'assisted-living-cleaning'],
  'dental-office-sterilization-environmental-services': ['dental-office-cleaning'],
  'environmental-services-quality-control-healthcare': ['ambulatory-outpatient', 'skilled-nursing', 'medical-office-cleaning'],
  'epa-registered-disinfectants-healthcare-guide': ['medical-office-cleaning', 'skilled-nursing', 'urgent-care-cleaning'],
  'healthcare-cleaning-staff-training-certification': ['medical-office-cleaning', 'skilled-nursing', 'ambulatory-outpatient'],
  'healthcare-cleaning-vendor-evaluation-rfp-checklist': ['ambulatory-outpatient', 'skilled-nursing', 'medical-office-cleaning'],
  'healthcare-inspection-preparation-guide-massachusetts': ['skilled-nursing', 'assisted-living-cleaning', 'medical-office-cleaning'],
  'high-touch-surface-disinfection-frequency-healthcare': ['medical-office-cleaning', 'urgent-care-cleaning', 'skilled-nursing'],
  'hipaa-compliant-cleaning-medical-offices': ['medical-office-cleaning', 'specialty-clinics', 'dental-office-cleaning'],
  'infection-control-best-practices-medical-offices': ['medical-office-cleaning', 'specialty-clinics'],
  'infection-prevention-assisted-living-facilities': ['assisted-living-cleaning', 'skilled-nursing'],
  'massachusetts-healthcare-facility-sanitation-regulations': ['medical-office-cleaning', 'skilled-nursing', 'assisted-living-cleaning'],
  'operating-room-terminal-cleaning-protocols': ['ambulatory-outpatient'],
  'osha-cleaning-requirements-medical-offices-2026': ['medical-office-cleaning', 'dental-office-cleaning'],
  'scheduled-sanitation-program-healthcare-facilities': ['medical-office-cleaning', 'rehabilitation-clinics', 'specialty-clinics'],
  'terminal-cleaning-vs-concurrent-cleaning-healthcare': ['ambulatory-outpatient', 'urgent-care-cleaning', 'skilled-nursing'],
}
const START = '<!-- BLOG-SERVICES:START -->'
const END = '<!-- BLOG-SERVICES:END -->'
let n = 0
const dir = join(ROOT, 'data/blog')
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'index.json')) {
  const slug = f.replace(/\.json$/, '')
  const svcs = MAP[slug]
  if (!svcs) { console.warn(`no mapping for ${slug}`); continue }
  const p = join(dir, f)
  const raw = readFileSync(p, 'utf8')
  const d = JSON.parse(raw)
  const block =
    `${START}<div class="article-services" style="margin:2.5rem 0;padding:1.5rem;border:1px solid #e2e8f0;border-left:4px solid #2b70e4;border-radius:10px;background:#f8fafc;">` +
    `<h2 style="font-size:1.25rem;margin:0 0 0.75rem;">Where this applies</h2>` +
    `<p style="margin:0 0 0.75rem;">We put this guide into practice in these services across 109 Massachusetts cities and towns:</p>` +
    `<ul style="margin:0;padding-left:1.25rem;">${svcs.map((s) => `<li><a href="/services/${s}">${LABEL[s]}</a></li>`).join('')}</ul>` +
    `</div>${END}`
  let h = d.mainHtml
  if (h.includes(START)) h = h.slice(0, h.indexOf(START)) + block + h.slice(h.indexOf(END) + END.length)
  else {
    const at = h.indexOf('<!-- Author Bio Section -->')
    if (at < 0) { console.warn(`no author anchor in ${slug}`); continue }
    h = h.slice(0, at) + block + '\n ' + h.slice(at)
  }
  d.mainHtml = h
  writeFileSync(p, JSON.stringify(d, null, raw.startsWith('{\n') ? 2 : undefined) + (raw.endsWith('\n') ? '\n' : ''))
  n++
}
console.log(`blog posts linked: ${n}`)
