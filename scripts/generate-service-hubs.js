/**
 * Generate Service Hub Pages (index.html for each service)
 * These are landing pages for each service type with links to all city pages
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const today = new Date().toISOString().split('T')[0];

// Service configurations
const SERVICES = {
  'janitorial-service': {
    name: 'Janitorial Service',
    title: 'Professional Janitorial Services in Massachusetts',
    description: 'Commercial janitorial and office cleaning services across Massachusetts. Daily, weekly, and monthly cleaning for offices, warehouses, medical facilities, and corporate buildings.',
    metaDescription: 'Professional janitorial services across 100+ Massachusetts cities. Commercial office cleaning, warehouse maintenance, medical facility cleaning. Licensed & insured. Call (978) 307-8107!',
    intro: `Dorys Janitorial Cleaning Services provides comprehensive commercial cleaning solutions throughout Massachusetts. With over 21 years of experience, we've built a reputation for reliability, thoroughness, and exceptional customer service.

Our janitorial services are designed for businesses of all sizes, from small offices to large corporate campuses. We understand that a clean workspace improves employee productivity, impresses clients, and creates a healthier environment for everyone.

We offer flexible scheduling options including daily, weekly, bi-weekly, and monthly service plans. Our trained professionals use commercial-grade equipment and eco-friendly cleaning products to deliver consistent, high-quality results.`,
    services: [
      'Daily Office Cleaning',
      'Restroom Sanitization',
      'Floor Care & Maintenance',
      'Trash Removal & Recycling',
      'Break Room Cleaning',
      'Window & Glass Cleaning',
      'Carpet Vacuuming & Spot Treatment',
      'Dusting & Surface Sanitization'
    ],
    ideal: ['Office Buildings', 'Medical Facilities', 'Warehouses', 'Retail Stores', 'Schools & Universities', 'Corporate Campuses']
  },
  'deep-cleaning': {
    name: 'Deep Cleaning',
    title: 'Professional Deep Cleaning Services in Massachusetts',
    description: 'Thorough deep cleaning services for homes and businesses across Massachusetts. Move-in/move-out cleaning, spring cleaning, post-construction cleanup, and one-time intensive cleaning.',
    metaDescription: 'Professional deep cleaning services in 100+ Massachusetts cities. Move-in/out cleaning, spring cleaning, post-construction cleanup. 21+ years experience. Call (978) 307-8107!',
    intro: `When regular cleaning isn't enough, our deep cleaning services restore your space to like-new condition. Dorys Deep Cleaning goes beyond surface cleaning to tackle built-up dirt, grime, and allergens in every corner of your home or business.

Our deep cleaning service is perfect for move-ins, move-outs, seasonal refreshes, post-construction cleanup, or whenever your space needs extra attention. We systematically clean from top to bottom, reaching areas often overlooked during routine maintenance.

With over 21 years of experience serving Massachusetts families and businesses, we've perfected our deep cleaning process to deliver consistent, thorough results that exceed expectations.`,
    services: [
      'Inside Appliance Cleaning',
      'Cabinet Interior Cleaning',
      'Baseboard Deep Cleaning',
      'Light Fixture Cleaning',
      'Ceiling Fan Cleaning',
      'Window Track Cleaning',
      'Grout Scrubbing',
      'Behind Furniture Cleaning'
    ],
    ideal: ['Move-In Preparation', 'Move-Out Cleaning', 'Spring Cleaning', 'Post-Construction', 'Pre-Event Cleaning', 'Seasonal Deep Clean']
  },
  'carpet-cleaning': {
    name: 'Carpet Cleaning',
    title: 'Professional Carpet Cleaning Services in Massachusetts',
    description: 'Expert carpet cleaning and stain removal services across Massachusetts. Steam cleaning, pet odor treatment, high-traffic area restoration, and commercial carpet maintenance.',
    metaDescription: 'Professional carpet cleaning services in 100+ Massachusetts cities. Steam cleaning, stain removal, pet odor treatment. Licensed & insured. Call (978) 307-8107!',
    intro: `Professional carpet cleaning extends the life of your carpets while creating a healthier indoor environment. Dorys Carpet Cleaning uses advanced hot water extraction and steam cleaning methods to remove deep-seated dirt, allergens, and stains that regular vacuuming can't reach.

Our carpet cleaning technicians are trained to handle all carpet types, from delicate wool to durable commercial-grade fibers. We pre-treat stains, apply professional-grade cleaning solutions, and use powerful extraction equipment to leave your carpets fresh, clean, and fast-drying.

Whether you need residential carpet cleaning or commercial carpet maintenance, our team delivers exceptional results throughout Massachusetts.`,
    services: [
      'Hot Water Extraction',
      'Steam Cleaning',
      'Stain Removal Treatment',
      'Pet Odor Elimination',
      'High-Traffic Area Restoration',
      'Carpet Protection Application',
      'Area Rug Cleaning',
      'Commercial Carpet Maintenance'
    ],
    ideal: ['Homes with Pets', 'High-Traffic Areas', 'Rental Properties', 'Office Buildings', 'Retail Spaces', 'Restaurants & Hotels']
  },
  'general-housekeeping': {
    name: 'General Housekeeping',
    title: 'Professional Housekeeping Services in Massachusetts',
    description: 'Reliable recurring housekeeping and maid services across Massachusetts. Weekly, bi-weekly, and monthly cleaning to keep your home consistently clean and organized.',
    metaDescription: 'Professional housekeeping services in 100+ Massachusetts cities. Weekly, bi-weekly, monthly maid service. Trusted since 2004. Call (978) 307-8107!',
    intro: `Maintain a consistently clean and welcoming home with Dorys General Housekeeping services. Our professional housekeepers provide reliable, recurring cleaning that fits your schedule and lifestyle.

We offer flexible service frequencies including weekly, bi-weekly, and monthly visits. Each cleaning follows our comprehensive checklist to ensure nothing is overlooked, while we also accommodate your specific preferences and priorities.

Our housekeeping team is background-checked, trained, and committed to providing dependable service you can count on. We've been helping Massachusetts families enjoy cleaner homes since 2004.`,
    services: [
      'Dusting & Surface Cleaning',
      'Vacuuming & Mopping',
      'Bathroom Cleaning & Sanitization',
      'Kitchen Cleaning',
      'Bed Making & Linen Changing',
      'Trash Removal',
      'General Tidying',
      'Customized Cleaning Tasks'
    ],
    ideal: ['Busy Professionals', 'Families with Children', 'Seniors', 'Vacation Homes', 'Rental Properties', 'Anyone Who Values Their Time']
  },
  'upholstery-cleaning': {
    name: 'Upholstery Cleaning',
    title: 'Professional Upholstery Cleaning Services in Massachusetts',
    description: 'Expert furniture and upholstery cleaning services across Massachusetts. Sofa cleaning, chair cleaning, fabric protection, and stain removal for all upholstery types.',
    metaDescription: 'Professional upholstery cleaning in 100+ Massachusetts cities. Sofa, chair, fabric cleaning & stain removal. Safe for all fabrics. Call (978) 307-8107!',
    intro: `Revitalize your furniture with Dorys Upholstery Cleaning services. Over time, sofas, chairs, and other upholstered furniture collect dust, allergens, body oils, and stains that affect both appearance and indoor air quality.

Our upholstery cleaning process is safe for all fabric types, including delicate materials. We assess each piece to determine the appropriate cleaning method, pre-treat stains, and use professional equipment to extract dirt while protecting your furniture's integrity.

Whether you have a single sofa that needs attention or an entire office full of upholstered furniture, our team delivers exceptional results throughout Massachusetts.`,
    services: [
      'Sofa & Couch Cleaning',
      'Chair & Loveseat Cleaning',
      'Sectional Cleaning',
      'Dining Chair Cleaning',
      'Office Furniture Cleaning',
      'Stain & Spot Removal',
      'Fabric Protection Application',
      'Leather Conditioning'
    ],
    ideal: ['Homes with Pets', 'Families with Children', 'Allergy Sufferers', 'Office Reception Areas', 'Restaurants', 'Hotels & Hospitality']
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
  <title>${config.title} | Dorys Cleaning</title>
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
  <link rel="stylesheet" href="/assets/css/footer.css">
  <link rel="stylesheet" href="/assets/css/hero.css">
  <link rel="stylesheet" href="/assets/css/animations.css">
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
      "name": "Dorys Janitorial Cleaning Services Inc.",
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
        <img src="/assets/images/logo/logo-original.jpg" alt="Dorys Janitorial Cleaning Services" width="180" height="60">
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
      <a href="/contact" class="btn btn--primary header__cta hide-mobile">Get Free Quote</a>
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
            <a href="/contact" class="btn btn--white btn--lg">Get Free Quote</a>
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
          <p class="section__description">Select your city below to see local availability and get a free quote for ${config.name.toLowerCase()} services.</p>
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
          <span class="cta-box__badge">Free Estimate</span>
          <h2 class="cta-box__title">Ready for Professional ${config.name}?</h2>
          <p class="cta-box__text">Get your free, no-obligation quote today. Our team is ready to serve you!</p>
          <div class="cta-box__actions">
            <a href="tel:+19783078107" class="btn btn--accent btn--xl">Call (978) 307-8107</a>
            <a href="/contact" class="btn btn--white btn--xl">Request Quote Online</a>
          </div>
          <div class="cta-box__trust">
            <span>Licensed (HIC #213341)</span>
            <span>-</span>
            <span>$2M Insured</span>
            <span>-</span>
            <span>21+ Years Experience</span>
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
            <img src="/assets/images/logo/logo-original.jpg" alt="Dorys Cleaning" class="footer__logo-img" width="180" height="60">
          </a>
          <p class="footer__description">Professional cleaning services in Massachusetts since 2004.</p>
        </div>
        <div class="footer__col">
          <h4 class="footer__title">Services</h4>
          <ul class="footer__links">
            <li><a href="/services/janitorial-service">Janitorial Service</a></li>
            <li><a href="/services/deep-cleaning">Deep Cleaning</a></li>
            <li><a href="/services/carpet-cleaning">Carpet Cleaning</a></li>
            <li><a href="/services/upholstery-cleaning">Upholstery Cleaning</a></li>
            <li><a href="/services/general-housekeeping">General Housekeeping</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4 class="footer__title">Contact</h4>
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
        <p class="footer__copyright">&copy; ${new Date().getFullYear()} Dorys Janitorial Cleaning Services Inc.</p>
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
