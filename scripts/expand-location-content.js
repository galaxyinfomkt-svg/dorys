/**
 * Expand thin location pages with rich, unique content
 * Goal: 600+ words per page with city-specific information
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Load city data for context
let cityData = [];
try {
  cityData = require(path.join(rootDir, 'new-cities-data.js'));
} catch (e) {}

// Build city -> county/zip map from city data
const cityMap = {};
cityData.forEach(c => {
  cityMap[c.slug + '-ma'] = c;
});

// Default county for original cities (Middlesex/Worcester area)
const defaultCity = { county: 'Middlesex', name: '', slug: '' };

function slugToName(slug) {
  return slug.split('-').map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const locDir = path.join(rootDir, 'locations');
const locFiles = fs.readdirSync(locDir).filter(f => f.endsWith('.html') && f !== 'index.html');

let updated = 0;

locFiles.forEach(file => {
  const filePath = path.join(locDir, file);
  let c = fs.readFileSync(filePath, 'utf8');
  const orig = c;

  const slug = file.replace('.html', '');
  const cityName = slugToName(slug.replace(/-ma$/, ''));
  const cityInfo = cityMap[slug] || { county: 'Massachusetts', name: cityName };
  const county = cityInfo.county || 'Massachusetts';

  // Skip if already has expanded content
  if (c.includes('why-choose-section')) return;

  // Build unique rich content section for this city
  const richContent = `
        <!-- Why Choose Us in [City] -->
        <section class="section why-choose-section" style="background:#f8fafc;">
          <div class="container container--narrow">
            <h2 class="section__title" style="margin-bottom:1.5rem;">Why ${cityName} Healthcare Facilities Trust Dory's Cleaning</h2>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.5rem;">Healthcare facilities in ${cityName}, ${county} County, face stringent infection control standards required by the Massachusetts Department of Public Health, OSHA, CDC, and EPA. Dory's Cleaning Services brings 22+ years of clinical healthcare experience to every ${cityName} medical office, clinic, nursing facility, and healthcare administrative space we serve.</p>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.5rem;">Unlike standard janitorial companies, our team is specifically trained in bloodborne pathogen handling, EPA-registered hospital-grade disinfectant application, terminal cleaning protocols, and HIPAA-aware environmental services. We understand the difference between visual cleanliness and verifiable disinfection — and we deliver written documentation to support your facility's compliance program.</p>

            <h3 style="font-size:1.4rem;margin:2rem 0 1rem;color:#1e293b;">Healthcare Facilities We Clean in ${cityName}</h3>
            <ul style="list-style:none;padding:0;margin-bottom:2rem;">
              <li style="padding:0.625rem 0;border-bottom:1px solid #e2e8f0;color:#475569;">🏥 <strong>Medical offices &amp; physician practices</strong> — internal medicine, family medicine, OB/GYN, pediatrics</li>
              <li style="padding:0.625rem 0;border-bottom:1px solid #e2e8f0;color:#475569;">🔬 <strong>Specialty clinics</strong> — cardiology, dermatology, dental, urgent care, orthopedics</li>
              <li style="padding:0.625rem 0;border-bottom:1px solid #e2e8f0;color:#475569;">🏃 <strong>Ambulatory &amp; outpatient centers</strong> — same-day surgery, infusion centers, dialysis</li>
              <li style="padding:0.625rem 0;border-bottom:1px solid #e2e8f0;color:#475569;">💊 <strong>Rehab &amp; nursing facilities</strong> — long-term care, skilled nursing, memory care</li>
              <li style="padding:0.625rem 0;color:#475569;">📋 <strong>Healthcare admin offices</strong> — billing centers, medical records, hospital headquarters</li>
            </ul>

            <h3 style="font-size:1.4rem;margin:2rem 0 1rem;color:#1e293b;">What's Included in ${cityName} Healthcare Cleaning</h3>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1rem;">Every cleaning visit to your ${cityName} facility includes:</p>
            <ul style="list-style:none;padding:0;margin-bottom:2rem;">
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> EPA-registered hospital-grade disinfectant application with proper contact times</li>
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> Exam room terminal cleaning between patients</li>
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> High-touch surface disinfection (door handles, counters, chair arms, keyboards)</li>
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> Restroom medical-grade sanitization with biohazard awareness</li>
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> Waiting area, reception, and lobby cleaning</li>
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> Floor care with environmentally-appropriate solutions</li>
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> Medical waste handling per OSHA bloodborne pathogen standards</li>
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> Detailed cleaning verification logs for your compliance records</li>
              <li style="padding:0.5rem 0;color:#475569;"><strong>✓</strong> Optional ATP bioluminescence verification testing</li>
            </ul>

            <h3 style="font-size:1.4rem;margin:2rem 0 1rem;color:#1e293b;">How We Service ${cityName} Medical Facilities</h3>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1rem;"><strong>Step 1 — Free Facility Walkthrough:</strong> A clinical cleaning specialist visits your ${cityName} facility, identifies high-risk areas, reviews your current sanitation protocols, and documents specific compliance requirements.</p>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1rem;"><strong>Step 2 — Customized Cleaning Plan:</strong> We design a frequency, scope, and product plan matched to your facility type, patient volume, and ${county} County regulatory environment. No generic templates.</p>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1rem;"><strong>Step 3 — Trained Team Deployment:</strong> Our environmental services technicians are certified in bloodborne pathogens (OSHA 29 CFR 1910.1030), infection prevention, and HIPAA awareness before they enter your ${cityName} facility.</p>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:2rem;"><strong>Step 4 — Documentation &amp; Quality Control:</strong> Every visit is logged with date, time, areas serviced, disinfectants used, and verification scores. Reports are available for DPH, OSHA, Joint Commission, AAAHC, and internal accreditation reviews.</p>

            <h3 style="font-size:1.4rem;margin:2rem 0 1rem;color:#1e293b;">Why Clinical Cleaning Differs From Standard Janitorial</h3>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.5rem;">A standard office cleaning company in ${cityName} cleans for appearance. Healthcare facility cleaning requires evidence-based protocols designed to break the chain of infection transmission. Our team applies disinfectants with proper dwell times, follows clean-to-dirty sequencing, uses color-coded microfiber to prevent cross-contamination, and documents every step. The cost of an inadequate cleaning program is measured in healthcare-associated infections, regulatory fines, and patient safety incidents — not in dollars saved.</p>

            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:0;">Dory's Cleaning Services serves ${cityName} alongside <a href="/locations" style="color:#2b70e4;text-decoration:none;font-weight:600;">295 other Massachusetts cities</a>, with full licensing (MA HIC #213341), $2,000,000 in liability insurance coverage, and 22+ years of clinical environmental services leadership under founder Jeneva Thomas. Schedule your complimentary ${cityName} facility walkthrough today.</p>
          </div>
        </section>
`;

  // Insert before the section--primary CTA
  const insertAt = c.indexOf('<section class="section section--primary">');
  if (insertAt > 0) {
    c = c.substring(0, insertAt) + richContent + '\n        ' + c.substring(insertAt);
    fs.writeFileSync(filePath, c);
    updated++;
  }
});

console.log('Expanded ' + updated + ' location pages with rich content');
