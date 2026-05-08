/**
 * B03 — Adiciona "Massachusetts" ou "MA" nos títulos dos blog posts
 * que ainda não têm geo-modifier.
 */
const fs = require('fs');
const path = require('path');

const blogDir = path.resolve(__dirname, '../blog');

// Mapping: slug → novo título (com geo-modifier inserido)
const newTitles = {
  'bloodborne-pathogen-cleanup-protocols-clinical-environments.html': {
    title: 'Bloodborne Pathogen Cleanup MA | Clinical Guide [2026]',
    desc: 'OSHA-compliant bloodborne pathogen cleanup for Massachusetts healthcare facilities. Step-by-step protocols, PPE, EPA disinfectants. Free assessment: (978) 307-8107',
  },
  'cdc-compliance-environmental-sanitation-clinics.html': {
    title: 'CDC Compliance for MA Clinic Sanitation | 2026 Guide',
    desc: 'CDC-aligned environmental sanitation for Massachusetts clinics. Compliance documentation, terminal cleaning, surface disinfection. Call (978) 307-8107',
  },
  'clinical-cleaning-vs-janitorial-cleaning-differences.html': {
    title: 'Clinical vs Janitorial Cleaning in MA | Key Differences',
    desc: 'How clinical healthcare cleaning differs from janitorial services in Massachusetts. Protocols, training, compliance. Free guide for MA facilities.',
  },
  'covid-cleaning-legacy-permanent-changes-healthcare.html': {
    title: 'COVID Cleaning Changes for MA Healthcare | 5 Updates',
    desc: '5 permanent COVID-era cleaning changes for Massachusetts healthcare facilities. EPA List N protocols, frequency standards, documentation.',
  },
  'dental-office-sterilization-environmental-services.html': {
    title: 'Dental Office Sterilization MA | OSHA Guide [2026]',
    desc: 'Complete dental office sterilization guide for Massachusetts. OSHA, infection control, environmental services. (978) 307-8107',
  },
  'environmental-services-quality-control-healthcare.html': {
    title: 'Quality Control for MA Healthcare Cleaning [Guide]',
    desc: 'Environmental services quality control framework for Massachusetts healthcare facilities. ATP testing, audits, documentation.',
  },
  'epa-registered-disinfectants-healthcare-guide.html': {
    title: 'EPA Disinfectants for MA Healthcare | 2026 Guide',
    desc: 'EPA-registered disinfectants for Massachusetts healthcare facilities. List N, dwell times, OSHA compatibility. Free consult: (978) 307-8107',
  },
  'healthcare-cleaning-staff-training-certification.html': {
    title: 'Healthcare Cleaning Training MA | Certification Guide',
    desc: 'Healthcare cleaning staff training and certification for Massachusetts. CDC, OSHA, infection control protocols. (978) 307-8107',
  },
  'healthcare-cleaning-vendor-evaluation-rfp-checklist.html': {
    title: 'Healthcare Cleaning RFP Checklist MA | Vendor Evaluation',
    desc: 'Complete RFP checklist for evaluating healthcare cleaning vendors in Massachusetts. Compliance, insurance, references.',
  },
  'high-touch-surface-disinfection-frequency-healthcare.html': {
    title: 'High-Touch Disinfection Frequency MA | Healthcare Guide',
    desc: 'Optimal high-touch surface disinfection frequency for Massachusetts healthcare facilities. CDC-aligned schedules and protocols.',
  },
  'infection-control-best-practices-medical-offices.html': {
    title: 'Infection Control for MA Medical Offices | Best Practices',
    desc: 'Infection control best practices for Massachusetts medical offices. CDC protocols, PPE, terminal cleaning. (978) 307-8107',
  },
  'infection-prevention-assisted-living-facilities.html': {
    title: 'Infection Prevention for MA Assisted Living | Guide',
    desc: 'Infection prevention guide for Massachusetts assisted living facilities. Resident-safe protocols, CDC compliance.',
  },
  'operating-room-terminal-cleaning-protocols.html': {
    title: 'OR Terminal Cleaning MA | Surgery Center Protocols',
    desc: 'Operating room terminal cleaning protocols for Massachusetts surgery centers. AORN, CDC, infection prevention.',
  },
  'osha-cleaning-requirements-medical-offices-2026.html': {
    title: 'OSHA Cleaning Rules for MA Medical Offices [2026]',
    desc: 'Updated 2026 OSHA cleaning requirements for Massachusetts medical offices. Bloodborne pathogen, hazcom, PPE compliance.',
  },
  'scheduled-sanitation-program-healthcare-facilities.html': {
    title: 'Scheduled Sanitation for MA Healthcare | Plan & Cadence',
    desc: 'How to plan a scheduled sanitation program for Massachusetts healthcare facilities. Frequency, documentation, compliance.',
  },
  'terminal-cleaning-vs-concurrent-cleaning-healthcare.html': {
    title: 'Terminal vs Concurrent Cleaning MA | Healthcare Guide',
    desc: 'Difference between terminal and concurrent cleaning in Massachusetts healthcare facilities. When to use each protocol.',
  },
  'hipaa-compliant-cleaning-medical-offices.html': {
    title: 'HIPAA Compliant Cleaning MA | Medical Office Guide',
    desc: 'HIPAA-aware cleaning protocols for Massachusetts medical offices. Privacy, BAA, documentation. (978) 307-8107',
  },
};

let updated = 0;

Object.entries(newTitles).forEach(([file, info]) => {
  const fp = path.join(blogDir, file);
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  // Title tag
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + info.title + '</title>');
  // og:title
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/g, '$1' + info.title + '$2');
  // twitter:title
  html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/g, '$1' + info.title + '$2');
  // description
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/g, '$1' + info.desc + '$2');
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/g, '$1' + info.desc + '$2');

  if (html !== before) {
    fs.writeFileSync(fp, html);
    updated++;
  }
});

console.log('Geo-modifier MA adicionado em ' + updated + ' blog posts');
