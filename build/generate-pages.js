/**
 * ==========================================================================
 * PAGE GENERATOR - Dorys Janitorial Cleaning Services
 * Generates 500+ service+city pages and city landing pages
 *
 * Usage: node build/generate-pages.js
 * ==========================================================================
 */

const fs = require('fs');
const path = require('path');

// Load data
const citiesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cities.json'), 'utf-8'));
const servicesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/services.json'), 'utf-8'));

const cities = citiesData.cities;
const services = servicesData.services;

// Business info
const business = {
  name: 'Dorys Janitorial Cleaning Services Inc.',
  phone: '(978) 307-8107',
  phoneLink: '+19783078107',
  email: 'contact@doryscleaningservices.com',
  website: 'https://doryscleaningservices.com',
  hours: 'Mon-Sat: 5:00 AM - 7:00 PM',
  license: 'HIC #213341',
  insurance: '$2,000,000',
  founded: '2004',
  years: '21+'
};

// Helper function to generate slug
const slugify = (text) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Generate service + city page
function generateServiceCityPage(service, city) {
  const pageTitle = `${service.name} in ${city.name}, MA | Dorys Cleaning`;
  const metaDescription = `Professional ${service.name.toLowerCase()} services in ${city.name}, Massachusetts. ${business.years} years experience. Licensed & insured. Call ${business.phone} for a free quote!`;
  const canonicalUrl = `${business.website}/services/${service.slug}/${city.slug}.html`;

  const nearbyCities = city.nearby || [];
  const nearbyLinks = nearbyCities.map(n => {
    const nearbyCity = cities.find(c => c.name === n);
    if (nearbyCity) {
      return `<a href="/services/${service.slug}/${nearbyCity.slug}.html" class="nearby-cities__link">${n}</a>`;
    }
    return '';
  }).filter(Boolean).join('\n              ');

  const faqItems = service.faqs.map((faq, index) => {
    const cityFaq = faq.question.replace(/your|the/gi, city.name);
    return `
          <div class="accordion__item">
            <button class="accordion__header" aria-expanded="false">
              ${faq.question.includes(city.name) ? faq.question : faq.question.replace('?', ` in ${city.name}?`)}
              <svg class="accordion__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            <div class="accordion__content">
              <div class="accordion__body">
                <p>${faq.answer}</p>
              </div>
            </div>
          </div>`;
  }).join('');

  const featuresList = service.features.map(f => `<li>${f}</li>`).join('\n                ');

  const faqSchema = service.faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question.includes(city.name) ? faq.question : faq.question.replace('?', ` in ${city.name}?`),
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${service.name.toLowerCase()}, ${city.name}, MA, cleaning services, ${service.slug}, Massachusetts">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:image" content="${business.website}/assets/images/services/${service.image}">

  <!-- Geo Tags -->
  <meta name="geo.region" content="US-MA">
  <meta name="geo.placename" content="${city.name}, Massachusetts">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="/assets/css/critical.min.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/footer.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/assets/css/footer.css"></noscript>
  <link rel="stylesheet" href="/assets/css/hero.css">
  <link rel="stylesheet" href="/assets/css/animations.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/assets/css/animations.css"></noscript>
  <link rel="stylesheet" href="/assets/css/lightbox.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/assets/css/lightbox.css"></noscript>
  <link rel="stylesheet" href="/assets/css/responsive.css">

  <!-- Schema.org LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "${business.name} - ${service.name} in ${city.name}",
    "image": "${business.website}/assets/images/services/${service.image}",
    "url": "${canonicalUrl}",
    "telephone": "${business.phoneLink}",
    "email": "${business.email}",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "${city.name}",
      "addressRegion": "MA",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "City",
      "name": "${city.name}",
      "containedInPlace": {"@type": "State", "name": "Massachusetts"}
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "05:00",
      "closes": "19:00"
    }],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cleaning Services",
      "itemListElement": [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "${service.name}",
          "description": "${service.shortDescription}",
          "areaServed": {"@type": "City", "name": "${city.name}"}
        }
      }]
    }
  }
  </script>

  <!-- Schema.org FAQ -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ${JSON.stringify(faqSchema)}
  }
  </script>

  <!-- Schema.org BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "${business.website}/"},
      {"@type": "ListItem", "position": 2, "name": "Services", "item": "${business.website}/services/"},
      {"@type": "ListItem", "position": 3, "name": "${service.name}", "item": "${business.website}/services/${service.slug}/"},
      {"@type": "ListItem", "position": 4, "name": "${city.name}", "item": "${canonicalUrl}"}
    ]
  }
  </script>
</head>
<body>
  <!-- Skip Link -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="container">
      <div class="top-bar__contact">
        <a href="tel:${business.phoneLink}" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span>${business.phone}</span>
        </a>
        <a href="mailto:${business.email}" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>${business.email}</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <div class="container header__wrapper">
      <a href="/" class="header__logo">
        <img src="/assets/images/logo/logo-80.jpg" alt="Dorys Janitorial Cleaning Services" width="180" height="60">
      </a>
      <nav class="header__nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
          <li class="nav-item has-dropdown">
            <a href="/services/" class="nav-link nav-link--active">Services <svg class="nav-link__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg></a>
            <div class="nav-dropdown">
              <a href="/services/janitorial-service/" class="nav-dropdown__link">Janitorial Service</a>
              <a href="/services/deep-cleaning/" class="nav-dropdown__link">Deep Cleaning</a>
              <a href="/services/upholstery-cleaning/" class="nav-dropdown__link">Upholstery Cleaning</a>
              <a href="/services/carpet-cleaning/" class="nav-dropdown__link">Carpet Cleaning</a>
              <a href="/services/general-housekeeping/" class="nav-dropdown__link">General Housekeeping</a>
            </div>
          </li>
          <li class="nav-item"><a href="/locations/" class="nav-link">Service Areas</a></li>
          <li class="nav-item"><a href="/about.html" class="nav-link">About Us</a></li>
          <li class="nav-item"><a href="/reviews.html" class="nav-link">Reviews</a></li>
          <li class="nav-item"><a href="/contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <a href="/contact.html" class="btn btn--primary header__cta hide-mobile">Get Free Quote</a>
      <button class="header__toggle" aria-label="Toggle menu">
        <span class="header__toggle-icon"><span></span><span></span><span></span></span>
      </button>
    </div>
  </header>

  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol class="breadcrumb__list">
        <li class="breadcrumb__item"><a href="/" class="breadcrumb__link">Home</a></li>
        <li class="breadcrumb__item"><a href="/services/" class="breadcrumb__link">Services</a></li>
        <li class="breadcrumb__item"><a href="/services/${service.slug}/" class="breadcrumb__link">${service.name}</a></li>
        <li class="breadcrumb__item" aria-current="page">${city.name}</li>
      </ol>
    </div>
  </nav>

  <main id="main-content">
    <!-- Hero -->
    <section class="hero hero--inner">
      <div class="hero__background">
        <img src="/assets/images/services/${service.image}" alt="${service.name} in ${city.name}, MA - Professional cleaning services" loading="eager">
        <div class="hero__overlay hero__overlay--gradient"></div>
      </div>
      <div class="container">
        <div class="hero__content hero__content--center">
          <h1 class="hero__title">${service.name} in ${city.name}, MA</h1>
          <p class="hero__subtitle">${service.shortDescription} Serving ${city.name} and ${city.county} County with ${business.years} years of professional experience.</p>
          <div class="hero__ctas">
            <a href="/contact.html" class="btn btn--primary btn--lg btn--pulse">Get a Free Quote</a>
            <a href="tel:${business.phoneLink}" class="btn btn--outline-light btn--lg">Call ${business.phone}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Details -->
    <section class="section">
      <div class="container">
        <div class="two-col">
          <div class="animate-on-scroll animate-fade-right">
            <h2>${service.name} Services in ${city.name}, Massachusetts</h2>
            <p class="lead">${service.fullDescription}</p>

            <h3>What We Offer in ${city.name}</h3>
            <ul class="list list--check">
                ${featuresList}
            </ul>

            <h3>Why Choose Dorys for ${service.name} in ${city.name}?</h3>
            <p>When you need professional ${service.name.toLowerCase()} in ${city.name}, MA, Dorys Janitorial Cleaning Services delivers exceptional results. With over ${business.years} years serving ${city.county} County and throughout Massachusetts, we understand the unique needs of ${city.name} residents and businesses.</p>
            <p>Our team is fully licensed (${business.license}) and carries ${business.insurance} in insurance coverage. We use professional-grade equipment and eco-friendly cleaning solutions to ensure the best results while protecting your property and the environment.</p>

            <div class="btn-group mt-xl">
              <a href="/contact.html" class="btn btn--primary">Request Free Quote</a>
              <a href="tel:${business.phoneLink}" class="btn btn--secondary">Call ${business.phone}</a>
            </div>
          </div>

          <div class="animate-on-scroll animate-fade-left animate-delay-200">
            <div class="form-embed" style="background: var(--bg-light); border-radius: var(--radius-lg); padding: var(--space-lg);">
              <h3 class="text-center mb-lg">Get Your Free Quote</h3>
              <iframe src="https://api.leadconnectorhq.com/widget/form/oaN0aNeRAK8fPG4AnIzl" style="width:100%;height:600px;border:none;border-radius:8px" title="Contact Form"></iframe>
              <script src="https://link.msgsndr.com/js/form_embed.js" defer></script>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nearby Cities -->
    <section class="section section--alt">
      <div class="container">
        <h2 class="section__title">Also Serving Nearby ${city.name} Areas</h2>
        <p class="section__subtitle">We provide ${service.name.toLowerCase()} throughout ${city.county} County and surrounding communities.</p>
        <div class="nearby-cities">
          <div class="nearby-cities__list">
              ${nearbyLinks}
          </div>
        </div>
        <div class="text-center mt-xl">
          <a href="/locations/" class="btn btn--primary">View All Service Areas</a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <div class="container container--narrow">
        <h2 class="section__title">${service.name} FAQ for ${city.name}</h2>
        <div class="accordion">
          ${faqItems}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section section--primary">
      <div class="container text-center">
        <h2 class="text-white mb-lg">Ready for Professional ${service.name} in ${city.name}?</h2>
        <p class="lead text-white mb-xl" style="opacity:0.9">Contact us today for a free, no-obligation quote.</p>
        <div class="btn-group btn-group--center">
          <a href="/contact.html" class="btn btn--white btn--lg">Get Free Quote</a>
          <a href="tel:${business.phoneLink}" class="btn btn--outline-light btn--lg">Call ${business.phone}</a>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__col footer__brand">
          <span class="footer__logo-text">Dorys Janitorial</span>
          <p class="footer__description">Professional cleaning services in Massachusetts since 2004.</p>
        </div>
        <div class="footer__col">
          <h3 class="footer__title">Services</h3>
          <ul class="footer__links">
            <li><a href="/services/janitorial-service/">Janitorial Service</a></li>
            <li><a href="/services/deep-cleaning/">Deep Cleaning</a></li>
            <li><a href="/services/carpet-cleaning/">Carpet Cleaning</a></li>
            <li><a href="/services/upholstery-cleaning/">Upholstery Cleaning</a></li>
            <li><a href="/services/general-housekeeping/">General Housekeeping</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h3 class="footer__title">Contact</h3>
          <ul class="footer__contact">
            <li class="footer__contact-item"><a href="tel:${business.phoneLink}">${business.phone}</a></li>
            <li class="footer__contact-item"><a href="mailto:${business.email}">${business.email}</a></li>
            <li class="footer__contact-item">${business.hours}</li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2025 ${business.name}. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <button class="back-to-top" aria-label="Back to top">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
  </button>

  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/header.js"></script>
  <script src="/assets/js/animations.js"></script>
  <script src="/assets/js/navigation.js"></script>
</body>
</html>`;
}

// Generate city landing page
function generateCityLandingPage(city) {
  const pageTitle = `Cleaning Services in ${city.name}, MA | Dorys Janitorial`;
  const metaDescription = `Professional cleaning services in ${city.name}, Massachusetts. Janitorial, deep cleaning, carpet cleaning & more. ${business.years} years experience. Call ${business.phone}!`;
  const canonicalUrl = `${business.website}/locations/${city.slug}.html`;

  const serviceLinks = services.map(s =>
    `<a href="/services/${s.slug}/${city.slug}.html" class="btn btn--secondary">${s.name}</a>`
  ).join('\n            ');

  const serviceCards = services.map(s => `
          <article class="card service-card">
            <div class="card__image-wrapper">
              <img src="/assets/images/services/${s.image}" alt="${s.name} in ${city.name}, MA" class="card__image" loading="lazy">
            </div>
            <div class="card__body">
              <h3 class="card__title">${s.name}</h3>
              <p class="card__text">${s.shortDescription}</p>
              <a href="/services/${s.slug}/${city.slug}.html" class="btn btn--primary">Learn More</a>
            </div>
          </article>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">

  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDescription}">

  <meta name="geo.region" content="US-MA">
  <meta name="geo.placename" content="${city.name}, Massachusetts">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/assets/css/critical.min.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/footer.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/assets/css/footer.css"></noscript>
  <link rel="stylesheet" href="/assets/css/hero.css">
  <link rel="stylesheet" href="/assets/css/animations.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/assets/css/animations.css"></noscript>
  <link rel="stylesheet" href="/assets/css/responsive.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "${business.name}",
    "url": "${canonicalUrl}",
    "telephone": "${business.phoneLink}",
    "address": {"@type": "PostalAddress", "addressLocality": "${city.name}", "addressRegion": "MA", "addressCountry": "US"},
    "areaServed": {"@type": "City", "name": "${city.name}"}
  }
  </script>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <div class="top-bar">
    <div class="container">
      <div class="top-bar__contact">
        <a href="tel:${business.phoneLink}" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span>${business.phone}</span>
        </a>
        <a href="mailto:${business.email}" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>${business.email}</span>
        </a>
      </div>
    </div>
  </div>

  <header class="header">
    <div class="container header__wrapper">
      <a href="/" class="header__logo">
        <img src="/assets/images/logo/logo-80.jpg" alt="Dorys Janitorial" width="180" height="60">
      </a>
      <nav class="header__nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
          <li class="nav-item"><a href="/services/" class="nav-link">Services</a></li>
          <li class="nav-item"><a href="/locations/" class="nav-link nav-link--active">Service Areas</a></li>
          <li class="nav-item"><a href="/about.html" class="nav-link">About</a></li>
          <li class="nav-item"><a href="/contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <a href="/contact.html" class="btn btn--primary header__cta hide-mobile">Get Free Quote</a>
      <button class="header__toggle" aria-label="Toggle menu">
        <span class="header__toggle-icon"><span></span><span></span><span></span></span>
      </button>
    </div>
  </header>

  <nav class="breadcrumb">
    <div class="container">
      <ol class="breadcrumb__list">
        <li class="breadcrumb__item"><a href="/" class="breadcrumb__link">Home</a></li>
        <li class="breadcrumb__item"><a href="/locations/" class="breadcrumb__link">Service Areas</a></li>
        <li class="breadcrumb__item" aria-current="page">${city.name}</li>
      </ol>
    </div>
  </nav>

  <main id="main-content">
    <section class="hero hero--inner">
      <div class="hero__background">
        <img src="/assets/images/services/janitorial-service.jpg" alt="Cleaning services in ${city.name}, MA" loading="eager">
        <div class="hero__overlay hero__overlay--gradient"></div>
      </div>
      <div class="container">
        <div class="hero__content hero__content--center">
          <h1 class="hero__title">Professional Cleaning Services in ${city.name}, MA</h1>
          <p class="hero__subtitle">Serving ${city.name} and ${city.county} County with ${business.years} years of experience. Licensed, insured, and ready to make your space shine.</p>
          <div class="hero__ctas">
            <a href="/contact.html" class="btn btn--primary btn--lg btn--pulse">Get a Free Quote</a>
            <a href="tel:${business.phoneLink}" class="btn btn--outline-light btn--lg">Call ${business.phone}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section__title">Our Services in ${city.name}</h2>
        <p class="section__subtitle">Choose from our comprehensive range of professional cleaning services available in ${city.name}, Massachusetts.</p>
        <div class="services-grid">
          ${serviceCards}
        </div>
      </div>
    </section>

    <section class="section section--primary">
      <div class="container text-center">
        <h2 class="text-white mb-lg">Need Cleaning Services in ${city.name}?</h2>
        <p class="lead text-white mb-xl" style="opacity:0.9">Contact us today for a free quote!</p>
        <div class="btn-group btn-group--center">
          <a href="/contact.html" class="btn btn--white btn--lg">Get Free Quote</a>
          <a href="tel:${business.phoneLink}" class="btn btn--outline-light btn--lg">Call ${business.phone}</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2025 ${business.name}. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/header.js"></script>
  <script src="/assets/js/animations.js"></script>
  <script src="/assets/js/navigation.js"></script>
</body>
</html>`;
}

// Main generation function
function generateAllPages() {
  console.log('Starting page generation...\n');

  let servicePages = 0;
  let cityPages = 0;

  // Generate service + city pages
  services.forEach(service => {
    const serviceDir = path.join(__dirname, `../services/${service.slug}`);

    // Create service directory
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }

    cities.forEach(city => {
      const html = generateServiceCityPage(service, city);
      const filePath = path.join(serviceDir, `${city.slug}.html`);
      fs.writeFileSync(filePath, html);
      servicePages++;
    });

    console.log(`Generated ${cities.length} pages for ${service.name}`);
  });

  // Generate city landing pages
  const locationsDir = path.join(__dirname, '../locations');
  if (!fs.existsSync(locationsDir)) {
    fs.mkdirSync(locationsDir, { recursive: true });
  }

  cities.forEach(city => {
    const html = generateCityLandingPage(city);
    const filePath = path.join(locationsDir, `${city.slug}.html`);
    fs.writeFileSync(filePath, html);
    cityPages++;
  });

  console.log(`\nGenerated ${cityPages} city landing pages`);
  console.log(`\n========================================`);
  console.log(`Total pages generated: ${servicePages + cityPages}`);
  console.log(`  - Service + City pages: ${servicePages}`);
  console.log(`  - City landing pages: ${cityPages}`);
  console.log(`========================================\n`);
}

// Run generation
generateAllPages();
