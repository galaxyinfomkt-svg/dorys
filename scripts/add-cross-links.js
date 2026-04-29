const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function slugToName(slug) {
  return slug.split('-').map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const locDir = path.join(rootDir, 'locations');
const allCities = fs.readdirSync(locDir)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => f.replace('.html', ''));

let updated = 0;

allCities.forEach(citySlug => {
  const filePath = path.join(locDir, citySlug + '.html');
  let c = fs.readFileSync(filePath, 'utf8');
  const orig = c;
  if (c.includes('cross-services-section')) return;

  const cityName = slugToName(citySlug.replace(/-ma$/, ''));

  const crossLinkSection = `
        <section class="section cross-services-section">
          <div class="container container--narrow">
            <h2 class="section__title" style="text-align:center;margin-bottom:2rem;">All ${cityName} Healthcare Cleaning Services</h2>
            <p style="text-align:center;color:#475569;margin-bottom:2rem;font-size:1.0625rem;">Specialized cleaning for every type of healthcare facility in ${cityName}, MA:</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
              <a href="/services/medical-office-cleaning/${citySlug}" style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">\u{1F3E5}</div>
                <h3 style="font-size:1rem;color:#1e293b;margin-bottom:0.25rem;">Medical Office Cleaning</h3>
                <p style="font-size:0.875rem;color:#64748b;margin:0;">Physician practices, dental, urgent care in ${cityName}</p>
              </a>
              <a href="/services/specialty-clinics/${citySlug}" style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">\u{1F52C}</div>
                <h3 style="font-size:1rem;color:#1e293b;margin-bottom:0.25rem;">Specialty Clinic Cleaning</h3>
                <p style="font-size:0.875rem;color:#64748b;margin:0;">Cardiology, dermatology, ortho clinics in ${cityName}</p>
              </a>
              <a href="/services/ambulatory-outpatient/${citySlug}" style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">\u{1F3C3}</div>
                <h3 style="font-size:1rem;color:#1e293b;margin-bottom:0.25rem;">Outpatient Cleaning</h3>
                <p style="font-size:0.875rem;color:#64748b;margin:0;">Ambulatory surgery, dialysis in ${cityName}</p>
              </a>
              <a href="/services/rehab-nursing/${citySlug}" style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">\u{1F48A}</div>
                <h3 style="font-size:1rem;color:#1e293b;margin-bottom:0.25rem;">Rehab &amp; Nursing</h3>
                <p style="font-size:0.875rem;color:#64748b;margin:0;">Long-term care, skilled nursing in ${cityName}</p>
              </a>
              <a href="/services/healthcare-admin-offices/${citySlug}" style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;">
                <div style="font-size:1.5rem;margin-bottom:0.5rem;">\u{1F4CB}</div>
                <h3 style="font-size:1rem;color:#1e293b;margin-bottom:0.25rem;">Admin Offices</h3>
                <p style="font-size:0.875rem;color:#64748b;margin:0;">Healthcare admin, billing in ${cityName}</p>
              </a>
            </div>
          </div>
        </section>
`;

  const insertAt = c.indexOf('<section class="section section--primary">');
  if (insertAt > 0) {
    c = c.substring(0, insertAt) + crossLinkSection + '\n        ' + c.substring(insertAt);
    fs.writeFileSync(filePath, c);
    updated++;
  }
});

console.log('Added cross-service links to ' + updated + ' location pages');

const services = ['medical-office-cleaning', 'specialty-clinics', 'ambulatory-outpatient', 'rehab-nursing', 'healthcare-admin-offices'];
let svcUpdated = 0;

services.forEach(svc => {
  const svcDir = path.join(rootDir, 'services', svc);
  if (!fs.existsSync(svcDir)) return;

  const cityFiles = fs.readdirSync(svcDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  cityFiles.forEach(file => {
    const filePath = path.join(svcDir, file);
    let c = fs.readFileSync(filePath, 'utf8');
    if (c.includes('related-services-section')) return;

    const citySlug = file.replace('.html', '');
    const cityName = slugToName(citySlug.replace(/-ma$/, ''));

    const svcLabels = {
      'medical-office-cleaning': { icon: '\u{1F3E5}', name: 'Medical Office Cleaning', desc: 'Physician practices' },
      'specialty-clinics': { icon: '\u{1F52C}', name: 'Specialty Clinic Cleaning', desc: 'Cardiology, dental, urgent care' },
      'ambulatory-outpatient': { icon: '\u{1F3C3}', name: 'Outpatient Cleaning', desc: 'Ambulatory & surgery centers' },
      'rehab-nursing': { icon: '\u{1F48A}', name: 'Rehab &amp; Nursing', desc: 'Long-term care facilities' },
      'healthcare-admin-offices': { icon: '\u{1F4CB}', name: 'Admin Offices', desc: 'Healthcare admin spaces' }
    };

    const otherServices = services
      .filter(s => s !== svc)
      .map(s => {
        const lbl = svcLabels[s];
        return '<a href="/services/' + s + '/' + citySlug + '" style="display:block;padding:1rem;background:#fff;border:1px solid #e2e8f0;border-radius:8px;text-decoration:none;">' +
          '<div style="font-size:1.25rem;margin-bottom:0.25rem;">' + lbl.icon + '</div>' +
          '<h4 style="font-size:0.95rem;color:#1e293b;margin-bottom:0.125rem;">' + lbl.name + '</h4>' +
          '<p style="font-size:0.8125rem;color:#64748b;margin:0;">' + lbl.desc + ' in ' + cityName + '</p>' +
          '</a>';
      }).join('\n              ');

    const relatedSection = `
        <section class="section related-services-section" style="background:#f8fafc;">
          <div class="container container--narrow">
            <h2 class="section__title" style="text-align:center;margin-bottom:2rem;">Other Healthcare Cleaning Services in ${cityName}</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem;">
              ${otherServices}
            </div>
            <p style="text-align:center;color:#475569;font-size:0.9375rem;margin:0;">
              <a href="/locations/${citySlug}" style="color:#2b70e4;text-decoration:none;font-weight:600;">View all healthcare cleaning services in ${cityName} →</a>
            </p>
          </div>
        </section>
`;

    const insertAt = c.indexOf('<section class="section section--primary">');
    if (insertAt > 0) {
      c = c.substring(0, insertAt) + relatedSection + '\n        ' + c.substring(insertAt);
      fs.writeFileSync(filePath, c);
      svcUpdated++;
    }
  });
});

console.log('Added related services links to ' + svcUpdated + ' service+city pages');
