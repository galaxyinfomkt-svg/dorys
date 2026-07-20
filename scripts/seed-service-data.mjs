#!/usr/bin/env node
/**
 * Seed /data/services/_meta/{slug}.json — the Tier 1 service definitions.
 *
 * What is filled here is public and citable: the regulations that govern each
 * facility type, with their CFR / CMR numbers. What is left empty is the part
 * that makes these pages worth reading — the survey findings and the actual
 * cleaning sequence — and that can only come from the founder's 22 years in
 * Massachusetts clinical environments. See data/_todo-clinical-input.md.
 *
 * A service does NOT publish until its file is complete. Four services with
 * genuine depth beat eight that read as interchangeable, and "interchangeable"
 * is exactly what a reviewer sees when eight facility types share one protocol.
 *
 * MERGE, NEVER OVERWRITE: the clinical answers are the expensive part.
 *
 *   node scripts/seed-service-data.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const OUT = join(process.cwd(), 'data/services/_meta')
mkdirSync(OUT, { recursive: true })

/**
 * Regulatory frameworks. Each entry is a real, checkable citation.
 *
 * These are stated as the governing standards for the facility type, not as
 * claims about any particular clinic's obligations — the exact scope depends on
 * services offered and licensure, which is the facility's determination.
 */
const SERVICES = [
  {
    slug: 'medical-office-cleaning',
    name: 'Medical Office Cleaning',
    buyer: 'Practice Manager',
    facilityTypes: ['physician practices', 'urgent care', 'OB/GYN', 'pediatrics', 'primary care'],
    criticalZone: 'exam tables, blood pressure cuffs, door hardware, waiting-room touch points',
    centralRisk: 'patient-to-patient transfer via high-touch surfaces between visits',
    regulatoryFramework: [
      'OSHA Bloodborne Pathogens Standard — 29 CFR 1910.1030',
      'CDC Guidelines for Environmental Infection Control in Health-Care Facilities',
      'EPA List N registered disinfectants',
      '105 CMR 140 — Massachusetts DPH, Licensure of Clinics',
    ],
    accreditationBodies: ['Joint Commission', 'AAAHC', 'Massachusetts DPH'],
  },
  {
    slug: 'dental-office-cleaning',
    name: 'Dental Office Cleaning',
    buyer: 'Office Manager / practice-owner dentist',
    facilityTypes: ['general dentistry', 'orthodontics', 'oral surgery', 'periodontics'],
    criticalZone: 'operatory surfaces, suction lines, sterilisation area clean/dirty divide',
    centralRisk: 'procedural aerosol and waterline biofilm',
    regulatoryFramework: [
      'CDC Guidelines for Infection Control in Dental Health-Care Settings (2003) and the 2016 Summary',
      '234 CMR — Massachusetts Board of Registration in Dentistry',
      'OSHA Bloodborne Pathogens Standard — 29 CFR 1910.1030',
      'EPA List N registered disinfectants',
    ],
    accreditationBodies: ['Massachusetts Board of Registration in Dentistry'],
  },
  {
    slug: 'specialty-clinics',
    name: 'Specialty Clinic Cleaning',
    buyer: 'Practice Administrator',
    facilityTypes: ['dermatology', 'ophthalmology', 'ENT', 'orthopedics', 'allergy'],
    criticalZone: 'specialty equipment surfaces, which differ by discipline',
    centralRisk: 'equipment contamination where cleaning responsibility is ambiguous',
    regulatoryFramework: [
      '105 CMR 140 — Massachusetts DPH, Licensure of Clinics',
      'CDC Guidelines for Environmental Infection Control in Health-Care Facilities',
      'EPA List N registered disinfectants',
    ],
    accreditationBodies: ['AAAHC', 'Massachusetts DPH'],
  },
  {
    slug: 'rehabilitation-clinics',
    name: 'Rehabilitation Clinic Cleaning',
    buyer: 'Clinic Director (PT / OT / speech)',
    facilityTypes: ['physical therapy', 'occupational therapy', 'speech therapy', 'sports medicine', 'chiropractic'],
    criticalZone: 'treatment tables, mats, therabands, free weights, exercise balls, parallel bars, treadmills',
    centralRisk: 'direct skin contact with shared equipment all day, with no barrier — MRSA and fungal transfer',
    regulatoryFramework: [
      'CDC infection prevention guidance for outpatient and ambulatory care settings',
      '105 CMR 140 — Massachusetts DPH, Licensure of Clinics',
      'EPA List N registered disinfectants',
    ],
    accreditationBodies: ['CARF', 'Massachusetts DPH'],
    _note:
      'Split out from the old rehab-nursing pairing. An outpatient PT clinic and a skilled nursing facility share almost nothing: different buyer, different risk, different regulator, different sales cycle. Treating them as one service produced copy that fit neither.',
  },
  {
    slug: 'skilled-nursing',
    name: 'Skilled Nursing & Long-Term Care Cleaning',
    buyer: 'Director of Nursing / Administrator',
    facilityTypes: ['skilled nursing facilities', 'long-term care', 'rehabilitation hospitals'],
    criticalZone: 'resident rooms, common areas, dining, assisted bathing',
    centralRisk: 'outbreak — C. difficile, norovirus, influenza — in a vulnerable resident population',
    regulatoryFramework: [
      '105 CMR 150 — Massachusetts DPH, Standards for Long Term Care Facilities',
      'CMS Requirements of Participation for Long-Term Care Facilities (F-tags)',
      'CDC guidance for C. difficile and norovirus in long-term care settings',
      'EPA List N registered disinfectants, including List K for C. difficile spores',
    ],
    accreditationBodies: ['CMS', 'Massachusetts DPH', 'Joint Commission'],
  },
  {
    slug: 'assisted-living-cleaning',
    name: 'Assisted Living & Senior Living Cleaning',
    buyer: 'Executive Director',
    facilityTypes: ['assisted living residences', 'independent living', 'memory care'],
    criticalZone: 'residential units, common areas, memory care wings',
    centralRisk: 'vulnerable population in what is legally their home, not a clinical setting',
    regulatoryFramework: [
      '651 CMR 12 — Massachusetts Executive Office of Elder Affairs, Assisted Living Residences',
      'CDC guidance for long-term care settings',
      'EPA List N registered disinfectants',
    ],
    accreditationBodies: ['Massachusetts Executive Office of Elder Affairs'],
  },
  {
    slug: 'ambulatory-outpatient',
    name: 'Ambulatory & Outpatient Facility Cleaning',
    buyer: 'Facilities Director',
    facilityTypes: ['ambulatory surgery centers', 'outpatient procedure suites', 'endoscopy'],
    criticalZone: 'procedure rooms and recovery bays',
    centralRisk: 'terminal clean between cases, under schedule pressure',
    regulatoryFramework: [
      'AAAHC accreditation standards',
      '105 CMR 140 — Massachusetts DPH, Licensure of Clinics',
      'CDC Guidelines for Environmental Infection Control in Health-Care Facilities',
      'EPA List N registered disinfectants',
    ],
    accreditationBodies: ['AAAHC', 'Joint Commission', 'Massachusetts DPH'],
  },
  {
    slug: 'urgent-care-cleaning',
    name: 'Urgent Care Center Cleaning',
    buyer: 'Site Manager',
    facilityTypes: ['urgent care centers', 'walk-in clinics', 'occupational health'],
    criticalZone: 'high-turnover exam rooms and triage',
    centralRisk: 'rooms turn in minutes while disinfectant contact time does not shrink to match',
    regulatoryFramework: [
      'OSHA Bloodborne Pathogens Standard — 29 CFR 1910.1030',
      'CDC Guidelines for Environmental Infection Control in Health-Care Facilities',
      'EPA List N registered disinfectants',
    ],
    accreditationBodies: ['Urgent Care Association', 'Massachusetts DPH'],
  },
]

let created = 0
let merged = 0

for (const svc of SERVICES) {
  const file = join(OUT, `${svc.slug}.json`)
  const existing = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null

  const next = {
    ...svc,
    h1Pattern: `${svc.name} in {city}, MA`,
    tier: 1,

    // Everything below needs the founder's input. Empty means the block does
    // not render — never a generic placeholder.
    highTouchZones: existing?.highTouchZones ?? [],
    protocolSteps: existing?.protocolSteps ?? [],
    disinfectantContactTimes: existing?.disinfectantContactTimes ?? [],
    documentationDeliverables: existing?.documentationDeliverables ?? [],
    commonSurveyFindings: existing?.commonSurveyFindings ?? [],
    typicalFrequency: existing?.typicalFrequency ?? null,
    faqs: existing?.faqs ?? [],

    _publishGate:
      'Requires >=10 faqs and >=6 commonSurveyFindings before this service may go live. Survey findings are real regulatory citations — never invented, never inferred from the regulation text. Source: data/_todo-clinical-input.md.',
  }

  if (!DRY) writeFileSync(file, JSON.stringify(next, null, 2) + '\n')
  existing ? merged++ : created++
}

const all = readdirSync(OUT)
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => JSON.parse(readFileSync(join(OUT, f), 'utf8')))

const ready = all.filter((s) => s.faqs.length >= 10 && s.commonSurveyFindings.length >= 6)

console.log(`${DRY ? 'DRY RUN — ' : ''}services: ${created} created, ${merged} merged`)
console.log(`  regulatory frameworks filled: ${all.filter((s) => s.regulatoryFramework?.length).length}/${all.length}`)
console.log(`  faqs >= 10: ${all.filter((s) => s.faqs.length >= 10).length}/${all.length}`)
console.log(`  surveyFindings >= 6: ${all.filter((s) => s.commonSurveyFindings.length >= 6).length}/${all.length}`)
console.log(`  READY TO PUBLISH: ${ready.length}/${all.length}`)
