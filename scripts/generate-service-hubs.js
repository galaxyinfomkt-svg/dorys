/**
 * Generate Service Hub Pages (index.html for each service)
 * These are landing pages for each service type with links to all city pages
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const today = new Date().toISOString().split('T')[0];

// Service configurations - Healthcare Environmental Services
const SERVICES = {
  'medical-office-cleaning': {
    name: 'Medical Office Cleaning',
    title: 'Medical Office Cleaning Services in Massachusetts',
    description: 'Specialized sanitation for medical offices, dental practices, and physician clinics across Massachusetts. Infection control protocols, EPA-registered disinfectants, and compliance documentation.',
    metaDescription: 'Professional medical office cleaning across 100+ Massachusetts cities. EPA-registered disinfectants, infection control protocols, compliance documentation. 22 years healthcare experience. (978) 307-8107',
    intro: `Dorys Healthcare Environmental Services provides specialized medical office cleaning throughout Massachusetts. With 22 years of hands-on healthcare experience, we understand that clinical environments demand more than standard cleaning — they require trained professionals who follow CDC and OSHA guidelines.

Our medical office cleaning team uses EPA-registered hospital-grade disinfectants with verified contact times, follows terminal cleaning protocols for exam rooms, and delivers documented results that support your facility's compliance requirements.

We offer flexible scheduling including after-hours and weekend service to ensure zero disruption to your patient flow. Every cleaning is documented with verification logs available for regulatory audits and internal quality reviews.`,
    services: [
      'EPA-Registered Hospital-Grade Disinfection',
      'Exam Room Terminal Cleaning',
      'Waiting Area & Reception Sanitization',
      'Restroom Medical-Grade Disinfection',
      'Biohazard-Aware Waste Handling',
      'HVAC Vent & Air Quality Maintenance',
      'Medical Equipment Surface Disinfection',
      'Floor Care with Healthcare-Grade Solutions'
    ],
    ideal: ['Physician Offices', 'Dental Practices', 'Dermatology Clinics', 'Podiatry Offices', 'Chiropractic Clinics', 'Optometry Practices']
  },
  'clinic-outpatient-sanitation': {
    name: 'Clinic & Outpatient Sanitation',
    title: 'Clinic & Outpatient Facility Sanitation in Massachusetts',
    description: 'Professional sanitation for urgent care centers, outpatient surgery centers, therapy clinics, and specialty healthcare facilities across Massachusetts.',
    metaDescription: 'Clinic and outpatient facility sanitation across 100+ Massachusetts cities. Terminal cleaning, between-patient protocols. 22 years healthcare experience, $2M insured. (978) 307-8107',
    intro: `High-traffic healthcare environments like urgent care centers and outpatient facilities require rigorous sanitation protocols that go beyond surface-level cleaning. Dorys Healthcare Environmental Services delivers terminal cleaning, between-patient room turnover, and comprehensive facility-wide disinfection.

Our team understands the pace and demands of outpatient healthcare. We coordinate with your staff to deliver rapid room turnovers during operating hours and comprehensive deep cleaning during off-hours, ensuring your facility maintains the highest standards of hygiene at all times.

With 22 years of healthcare experience and $2M in insurance coverage, we are a trusted partner for Massachusetts clinics seeking reliable, compliant sanitation services.`,
    services: [
      'Terminal Cleaning for Procedure Rooms',
      'Between-Patient Room Turnover',
      'High-Traffic Waiting Area Disinfection',
      'Surgical Suite Sanitation',
      'Biohazard Spill Response & Cleanup',
      'Restroom & Common Area Disinfection',
      'Staff Break Room & Locker Cleaning',
      'Entrance & Lobby Sanitation'
    ],
    ideal: ['Urgent Care Centers', 'Outpatient Surgery Centers', 'Physical Therapy Clinics', 'Dialysis Centers', 'Imaging Centers', 'Specialty Clinics']
  },
  'assisted-living-senior-care': {
    name: 'Assisted Living & Senior Care Cleaning',
    title: 'Assisted Living & Senior Care Cleaning in Massachusetts',
    description: 'Compassionate, thorough cleaning for nursing homes, assisted living communities, and memory care facilities across Massachusetts with resident-safe protocols.',
    metaDescription: 'Assisted living and senior care cleaning across 100+ Massachusetts cities. Fragrance-free options, resident-safe protocols, outbreak response. 22 years healthcare experience. (978) 307-8107',
    intro: `Senior care facilities require a specialized approach to environmental cleaning that prioritizes resident safety, comfort, and dignity. Dorys Healthcare Environmental Services uses fragrance-sensitive, low-toxicity products appropriate for elderly and immunocompromised residents.

We understand the unique challenges of common areas, dining halls, resident rooms, and memory care units. Our team delivers consistent sanitation that supports infection prevention and regulatory compliance while maintaining a warm, comfortable environment for residents.

With 22 years of healthcare experience, our staff is trained to work respectfully around residents' schedules and routines, providing thorough cleaning with minimal disruption to daily activities.`,
    services: [
      'Resident Room & Bathroom Deep Cleaning',
      'Common Area & Dining Hall Sanitation',
      'Memory Care Unit Specialized Protocols',
      'Fragrance-Free Product Options',
      'Handrail & Mobility Aid Disinfection',
      'Laundry Room & Utility Cleaning',
      'Activity Room & Therapy Space Sanitation',
      'Entrance & Reception Maintenance'
    ],
    ideal: ['Assisted Living Communities', 'Nursing Homes', 'Memory Care Facilities', 'Independent Living', 'Rehabilitation Centers', 'Adult Day Care Programs']
  },
  'infection-control-disinfection': {
    name: 'Infection Control & Disinfection',
    title: 'Infection Control & High-Touch Disinfection in Massachusetts',
    description: 'Targeted high-touch surface disinfection and infection prevention services for healthcare facilities seeking enhanced pathogen control across Massachusetts.',
    metaDescription: 'Infection control and high-touch disinfection across 100+ Massachusetts cities. EPA-registered products effective against MRSA, C. diff. 22 years healthcare experience. (978) 307-8107',
    intro: `Our infection control and high-touch surface disinfection services provide an additional layer of protection for healthcare facilities. Focusing on the surfaces most frequently touched by patients, staff, and visitors, we deliver systematic disinfection using EPA-registered products with proven efficacy against healthcare-associated pathogens.

We map high-touch surfaces specific to your facility layout — door handles, light switches, elevator buttons, handrails, check-in kiosks, and shared equipment — and deliver documented disinfection protocols with verified contact times.

Whether you need daily preventive disinfection or rapid outbreak response, our team delivers reliable infection control support backed by 22 years of healthcare experience.`,
    services: [
      'High-Touch Surface Mapping & Disinfection',
      'EPA-Registered Pathogen Kill Protocols',
      'Door Handle & Light Switch Treatment',
      'Elevator Button & Kiosk Sanitization',
      'Shared Equipment Surface Disinfection',
      'Contact Time Verification',
      'Outbreak Response Enhanced Disinfection',
      'Documentation & Verification Reporting'
    ],
    ideal: ['Medical Offices', 'Urgent Care Centers', 'Senior Care Facilities', 'Dental Practices', 'Therapy Clinics', 'Any Healthcare Environment']
  },
  'compliance-scheduled-sanitation': {
    name: 'Compliance & Scheduled Sanitation',
    title: 'Compliance Documentation & Scheduled Sanitation in Massachusetts',
    description: 'Structured sanitation programs with compliance documentation, quality control reporting, and scheduled cleaning verification for healthcare facilities across Massachusetts.',
    metaDescription: 'Compliance documentation and scheduled sanitation across 100+ Massachusetts cities. Quality control reports, inspection-ready documentation. 22 years healthcare experience. (978) 307-8107',
    intro: `Our compliance documentation and scheduled sanitation service provides healthcare facilities with a structured, contract-based cleaning program that includes detailed documentation for regulatory compliance.

We deliver scheduled sanitation with verified cleaning logs, quality control audits, and reporting that demonstrates your facility's commitment to environmental hygiene standards. Ideal for facilities preparing for inspections, accreditation, or seeking a higher standard of accountability from their cleaning provider.

With 22 years of healthcare experience, we understand what inspectors and regulators look for, and we build our documentation systems to support your facility's compliance goals from day one.`,
    services: [
      'Customized Sanitation Schedule Development',
      'Cleaning Verification Logs & Checklists',
      'Quality Control Audits & Inspections',
      'Monthly & Quarterly Compliance Reports',
      'Pre-Inspection Deep Cleaning',
      'Staff Training Documentation',
      'Corrective Action Tracking',
      'Contract-Based Service Agreements'
    ],
    ideal: ['Hospitals & Health Systems', 'Multi-Location Practices', 'Accreditation-Seeking Facilities', 'State-Regulated Facilities', 'Insurance-Required Programs', 'Quality-Focused Clinics']
  }
};

// Get cities from service directory
function getCities(serviceSlug) {
  const serviceDir = path.join(baseDir, 'services', serviceSlug);
  if (!fs.existsSync(serviceDir)) return [];

  return fs.readdirSync(serviceDir)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => {
      const slug = f.replace('.html', '');
      const name = slug.replace(/-ma$/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { slug, name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Generate service hub page
function generateServiceHub(serviceSlug, config) {
  const cities = getCities(serviceSlug);

  const citiesHtml = cities.map(city =>
    `            <a href="/services/${serviceSlug}/${city.slug}" class="city-link">
              <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              ${city.name}
            </a>`
  ).join('\n');

  const servicesHtml = config.services.map(s => `<li>${s}</li>`).join('\n              ');
  const idealHtml = config.ideal.map(i => `<span class="ideal-tag">${i}</span>`).join('\n              ');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title} | Dorys Healthcare Environmental Services</title>
  <meta name="description" content="${config.metaDescription}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://doryscleaningservices.com/services/${serviceSlug}">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://doryscleaningservices.com/services/${serviceSlug}">
  <meta property="og:title" content="${config.title}">
  <meta property="og:description" content="${config.metaDescription}">
  <meta property="og:image" content="https://doryscleaningservices.com/assets/images/services/${serviceSlug}.jpg">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/footer.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/assets/css/footer.css"></noscript>
  <link rel="stylesheet" href="/assets/css/hero.css">
  <link rel="stylesheet" href="/assets/css/animations.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/assets/css/animations.css"></noscript>
  <link rel="stylesheet" href="/assets/css/responsive.css">
  <link rel="stylesheet" href="/assets/css/premium.css">
  <link rel="stylesheet" href="/assets/css/premium-v2.css">
  <link rel="stylesheet" href="/assets/css/service-pages.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "${config.name}",
    "description": "${config.description}",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Dorys Healthcare Environmental Services Inc.",
      "telephone": "+1-978-307-8107",
      "address": {"@type": "PostalAddress", "addressRegion": "MA", "addressCountry": "US"}
    },
    "areaServed": {"@type": "State", "name": "Massachusetts"}
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://doryscleaningservices.com/"},
      {"@type": "ListItem", "position": 2, "name": "Services", "item": "https://doryscleaningservices.com/services"},
      {"@type": "ListItem", "position": 3, "name": "${config.name}", "item": "https://doryscleaningservices.com/services/${serviceSlug}"}
    ]
  }
  </script>

  <style>
    .service-hub-intro { max-width: 900px; margin: 0 auto 3rem; }
    .service-hub-intro p { font-size: 1.0625rem; color: #475569; line-height: 1.8; margin-bottom: 1.5rem; }
    .service-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin: 3rem 0; }
    @media (max-width: 767px) { .service-features { grid-template-columns: 1fr; } }
    .feature-box { background: #f8fafc; border-radius: 16px; padding: 2rem; }
    .feature-box h3 { font-size: 1.25rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1rem; }
    .feature-box ul { list-style: none; padding: 0; margin: 0; }
    .feature-box li { padding: 0.5rem 0; padding-left: 1.75rem; position: relative; color: #475569; }
    .feature-box li::before { content: ''; position: absolute; left: 0; top: 0.75rem; width: 8px; height: 8px; background: #2b70e4; border-radius: 50%; }
    .ideal-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
    .ideal-tag { background: linear-gradient(135deg, rgba(43, 112, 228, 0.1) 0%, rgba(43, 112, 228, 0.05) 100%); color: #2b70e4; padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.875rem; font-weight: 500; }
    .cities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 2rem; }
    .city-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; color: #475569; font-size: 0.9375rem; text-decoration: none; transition: all 0.2s; }
    .city-link:hover { border-color: #2b70e4; color: #2b70e4; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(43, 112, 228, 0.15); }
    .city-link svg { width: 16px; height: 16px; fill: currentColor; }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="container">
      <div class="top-bar__contact">
        <a href="tel:+19783078107" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span>(978) 307-8107</span>
        </a>
        <a href="mailto:contact@doryscleaningservices.com" class="top-bar__item hide-mobile">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>contact@doryscleaningservices.com</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <div class="container header__wrapper">
      <a href="/" class="header__logo">
        <img src="/assets/images/logo/logo-200.jpg" alt="Dorys Healthcare Environmental Services" width="180" height="60">
      </a>
      <nav class="header__nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
          <li class="nav-item"><a href="/services" class="nav-link nav-link--active">Services</a></li>
          <li class="nav-item"><a href="/locations" class="nav-link">Service Areas</a></li>
          <li class="nav-item"><a href="/about" class="nav-link">About</a></li>
          <li class="nav-item"><a href="/contact" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <a href="/contact" class="btn btn--primary header__cta hide-mobile">Healthcare Assessment</a>
      <button class="header__toggle" aria-label="Toggle menu">
        <span class="header__toggle-icon"><span></span><span></span><span></span></span>
      </button>
    </div>
  </header>

  <main id="main-content">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <div class="container">
        <ol class="breadcrumb__list">
          <li class="breadcrumb__item"><a href="/" class="breadcrumb__link">Home</a></li>
          <li class="breadcrumb__item"><a href="/services" class="breadcrumb__link">Services</a></li>
          <li class="breadcrumb__item breadcrumb__item--active"><span>${config.name}</span></li>
        </ol>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero hero--page">
      <div class="hero__background">
        <img src="/assets/images/services/${serviceSlug}.jpg" alt="${config.name}" loading="eager">
        <div class="hero__overlay"></div>
      </div>
      <div class="container">
        <div class="hero__content hero__content--center">
          <span class="hero__badge">Professional ${config.name}</span>
          <h1 class="hero__title">${config.title}</h1>
          <p class="hero__subtitle">${config.description}</p>
          <div class="hero__actions">
            <a href="tel:+19783078107" class="btn btn--accent btn--lg">Call (978) 307-8107</a>
            <a href="/contact" class="btn btn--white btn--lg">Schedule Assessment</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Introduction -->
    <section class="section">
      <div class="container">
        <div class="service-hub-intro">
          ${config.intro.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('\n          ')}
        </div>

        <div class="service-features">
          <div class="feature-box">
            <h3>What's Included</h3>
            <ul>
              ${servicesHtml}
            </ul>
          </div>
          <div class="feature-box">
            <h3>Ideal For</h3>
            <div class="ideal-tags">
              ${idealHtml}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cities -->
    <section class="section section--light">
      <div class="container">
        <div class="section__header section__header--center">
          <span class="section__badge">${cities.length}+ Locations</span>
          <h2 class="section__title">${config.name} in Your City</h2>
          <p class="section__description">Select your city below to see local availability and schedule a healthcare facility assessment for ${config.name.toLowerCase()} services.</p>
        </div>

        <div class="cities-grid">
${citiesHtml}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section--cta">
      <div class="container">
        <div class="cta-box--large">
          <span class="cta-box__badge">Healthcare Assessment</span>
          <h2 class="cta-box__title">Ready for Professional ${config.name}?</h2>
          <p class="cta-box__text">Schedule a healthcare facility walkthrough today. Compliance-driven protocols backed by 22 years of healthcare experience.</p>
          <div class="cta-box__actions">
            <a href="tel:+19783078107" class="btn btn--accent btn--xl">Call (978) 307-8107</a>
            <a href="/contact" class="btn btn--white btn--xl">Schedule Facility Assessment</a>
          </div>
          <div class="cta-box__trust">
            <span>Licensed (HIC #213341)</span>
            <span>-</span>
            <span>$2M Insured</span>
            <span>-</span>
            <span>22 Years Healthcare Experience</span>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__col footer__brand">
          <a href="/" class="footer__logo">
            <img src="/assets/images/logo/logo-200.jpg" alt="Dorys Healthcare Environmental Services" class="footer__logo-img" width="180" height="60">
          </a>
          <p class="footer__description">Healthcare-focused environmental services in Massachusetts since 2004. 22 years of healthcare experience.</p>
        </div>
        <div class="footer__col">
          <h3 class="footer__title">Services</h3>
          <ul class="footer__links">
            <li><a href="/services/medical-office-cleaning">Medical Office Cleaning</a></li>
            <li><a href="/services/clinic-outpatient-sanitation">Clinic & Outpatient Sanitation</a></li>
            <li><a href="/services/assisted-living-senior-care">Assisted Living & Senior Care</a></li>
            <li><a href="/services/infection-control-disinfection">Infection Control & Disinfection</a></li>
            <li><a href="/services/compliance-scheduled-sanitation">Compliance & Scheduled Sanitation</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h3 class="footer__title">Contact</h3>
          <ul class="footer__contact">
            <li class="footer__contact-item">
              <a href="tel:+19783078107">(978) 307-8107</a>
            </li>
            <li class="footer__contact-item">
              <a href="mailto:contact@doryscleaningservices.com">contact@doryscleaningservices.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copyright">&copy; ${new Date().getFullYear()} Dorys Healthcare Environmental Services Inc.</p>
        <nav class="footer__legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </div>
    </div>
  </footer>

  <script src="/assets/js/main.js" defer></script>
</body>
</html>`;

  const outputPath = path.join(baseDir, 'services', serviceSlug, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Generated: services/${serviceSlug}/index.html (${cities.length} cities)`);
}

// Main
function main() {
  console.log('='.repeat(60));
  console.log('Generating Service Hub Pages');
  console.log('='.repeat(60));
  console.log('');

  for (const [slug, config] of Object.entries(SERVICES)) {
    generateServiceHub(slug, config);
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
}

main();
