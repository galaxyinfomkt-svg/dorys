/**
 * Adiciona Service schema com AggregateRating nas 4 páginas verticais.
 * O Service schema + AggregateRating é o que traz estrelas no SERP.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const pages = {
  'cardiology-clinic-cleaning.html': {
    name: 'Cardiology Clinic Cleaning',
    description: 'Specialized cardiology clinic cleaning in Massachusetts. ECG room sanitation, infection control, $2M insured.',
    serviceType: 'Cardiology Clinic Environmental Cleaning',
  },
  'urgent-care-cleaning.html': {
    name: 'Urgent Care Cleaning',
    description: 'Urgent care center cleaning in Massachusetts. Same-day turnaround, OSHA compliant, infection control.',
    serviceType: 'Urgent Care Environmental Cleaning',
  },
  'dialysis-clinic-cleaning.html': {
    name: 'Dialysis Clinic Cleaning',
    description: 'Dialysis center cleaning across Massachusetts. CDC protocols, terminal cleaning, $2M insured.',
    serviceType: 'Dialysis Center Environmental Cleaning',
  },
  'surgery-center-cleaning.html': {
    name: 'Surgery Center Cleaning',
    description: 'Ambulatory surgery center cleaning in MA. OR terminal cleaning, sterile field protocols.',
    serviceType: 'Surgery Center Environmental Cleaning',
  },
};

let updated = 0;

Object.entries(pages).forEach(([file, info]) => {
  const fp = path.join(rootDir, file);
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');

  if (html.includes('"@type":"Service"')) return; // já existe

  const slug = file.replace('.html', '');
  const url = 'https://doryscleaningservices.com/' + slug;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: info.name,
    serviceType: info.serviceType,
    description: info.description,
    url: url,
    provider: {
      '@type': 'ProfessionalService',
      name: "Dory's Cleaning Services Inc.",
      telephone: '+1-978-307-8107',
      url: 'https://doryscleaningservices.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '7 Boundary Ave',
        addressLocality: 'Marlborough',
        addressRegion: 'MA',
        postalCode: '01752',
        addressCountry: 'US',
      },
      areaServed: {
        '@type': 'State',
        name: 'Massachusetts',
      },
      priceRange: '$$',
    },
    areaServed: {
      '@type': 'State',
      name: 'Massachusetts',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '10',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      url: url,
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        description: 'Custom quote based on facility size and frequency',
      },
    },
  };

  const tag = '<script type="application/ld+json">' + JSON.stringify(serviceSchema) + '</script>';

  // Inserir logo antes de </head>
  html = html.replace('</head>', '  ' + tag + '\n</head>');

  fs.writeFileSync(fp, html);
  updated++;
});

console.log('Service+AggregateRating schema adicionado em ' + updated + ' páginas verticais');
