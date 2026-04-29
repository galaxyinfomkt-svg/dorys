/**
 * RANKING BOOSTER — Apply all SEO/local rankings improvements
 *
 * 1. Upgrade homepage LocalBusiness schema (full NAP, hours, services, reviews)
 * 2. Add ProfessionalService schema
 * 3. Expand areaServed to all 296 cities
 * 4. Add HowTo schema for service process
 * 5. Improve internal linking (related cities, related services)
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function findHtml(dir, results) {
  results = results || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', '.vercel', 'scripts', 'build', 'docs'].includes(e.name)) {
      findHtml(fp, results);
    } else if (e.name.endsWith('.html')) {
      results.push(fp);
    }
  });
  return results;
}

function slugToName(slug) {
  return slug.split('-').map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Get all city slugs from locations folder
const locDir = path.join(rootDir, 'locations');
const allCitySlugs = fs.readdirSync(locDir)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => f.replace('.html', ''));

console.log('Total cities for areaServed: ' + allCitySlugs.length);

// ============================================================
// 1. UPGRADE HOMEPAGE LOCALBUSINESS SCHEMA
// ============================================================

const indexFile = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexFile, 'utf8');

// Build comprehensive areaServed array
const areaServedFull = allCitySlugs.map(slug => {
  const cityName = slugToName(slug.replace(/-ma$/, ''));
  return `{"@type":"City","name":"${cityName}","containedInPlace":{"@type":"State","name":"Massachusetts","containedInPlace":{"@type":"Country","name":"United States"}}}`;
}).join(',');

// Build comprehensive Organization + LocalBusiness schema
const homepageSchema = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
        "@id": "https://doryscleaningservices.com/#business",
        "name": "Dory's Cleaning Services Inc.",
        "alternateName": ["Dory's Janitorial Cleaning Services", "Dory's Healthcare Cleaning"],
        "url": "https://doryscleaningservices.com/",
        "logo": "https://doryscleaningservices.com/assets/images/logo/logo-original.jpg",
        "image": "https://doryscleaningservices.com/assets/images/services/medical-office-new.webp",
        "description": "Healthcare facility cleaning and infection control services across 296 Massachusetts cities. 22+ years of clinical experience, MA HIC #213341 licensed, $2,000,000 insurance coverage. CDC, OSHA, and EPA compliant protocols.",
        "telephone": "+1-978-307-8107",
        "email": "contact@doryscleaningservices.com",
        "priceRange": "$$",
        "currenciesAccepted": "USD",
        "paymentAccepted": "Cash, Check, Credit Card, ACH",
        "foundingDate": "2003",
        "founder": {
          "@type": "Person",
          "name": "Jeneva Thomas",
          "jobTitle": "CEO &amp; Owner",
          "worksFor": {"@id": "https://doryscleaningservices.com/#business"}
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Marlborough",
          "addressRegion": "MA",
          "postalCode": "01752",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 42.3459,
          "longitude": -71.5523
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "05:00",
            "closes": "19:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Sunday"],
            "opens": "00:00",
            "closes": "00:00"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/cleanersservicesMA",
          "https://www.instagram.com/doryscleaningservices/",
          "https://www.linkedin.com/company/dorys-cleaning-services-inc/"
        ],
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "license",
            "name": "Massachusetts Home Improvement Contractor License",
            "identifier": "213341",
            "recognizedBy": {"@type": "Organization", "name": "Commonwealth of Massachusetts"}
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "certification",
            "name": "OSHA Bloodborne Pathogens Certification (29 CFR 1910.1030)"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "certification",
            "name": "Infection Control Safety Training Certified"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "certification",
            "name": "ATP Bioluminescence Verification Testing Certified"
          }
        ],
        "knowsAbout": [
          "Healthcare facility cleaning",
          "Medical office cleaning",
          "Infection control protocols",
          "CDC environmental cleaning guidelines",
          "OSHA bloodborne pathogen standards",
          "EPA-registered hospital-grade disinfectants",
          "ATP bioluminescence verification testing",
          "HIPAA-aware environmental services",
          "Joint Commission survey preparation",
          "Massachusetts DPH compliance"
        ],
        "slogan": "Hospital-Grade Cleaning. Massachusetts Standards.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "50",
          "bestRating": "5",
          "worstRating": "1"
        },
        "areaServed": [${areaServedFull}],
        "serviceArea": {
          "@type": "AdministrativeArea",
          "name": "Massachusetts",
          "containedInPlace": {"@type": "Country", "name": "United States"}
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Healthcare Cleaning Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Medical Office Cleaning",
                "description": "Specialized sanitation for medical offices, dental practices, and physician clinics with HIPAA-aware environmental services and CDC-compliant infection control protocols.",
                "url": "https://doryscleaningservices.com/services/medical-office-cleaning",
                "areaServed": {"@type": "State", "name": "Massachusetts"}
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Specialty Clinic Cleaning",
                "description": "Professional sanitation for cardiology, dermatology, urgent care, and specialty practices with terminal cleaning protocols.",
                "url": "https://doryscleaningservices.com/services/specialty-clinics",
                "areaServed": {"@type": "State", "name": "Massachusetts"}
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Ambulatory and Outpatient Facility Cleaning",
                "description": "Fast-turnaround sanitation for ambulatory surgery centers, dialysis clinics, and outpatient facilities.",
                "url": "https://doryscleaningservices.com/services/ambulatory-outpatient",
                "areaServed": {"@type": "State", "name": "Massachusetts"}
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Rehabilitation and Nursing Facility Cleaning",
                "description": "Patient-safe environmental services for rehab centers, nursing facilities, assisted living, and long-term care.",
                "url": "https://doryscleaningservices.com/services/rehab-nursing",
                "areaServed": {"@type": "State", "name": "Massachusetts"}
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Healthcare Administrative Office Cleaning",
                "description": "HIPAA-aware cleaning for medical billing offices, healthcare admin spaces, and hospital administrative buildings.",
                "url": "https://doryscleaningservices.com/services/healthcare-admin-offices",
                "areaServed": {"@type": "State", "name": "Massachusetts"}
              }
            }
          ]
        }
      }
    ]
  }
  </script>`;

// Replace existing LocalBusiness/Organization schema - find it and replace
// Strategy: find the first <script type="application/ld+json"> and replace it
const firstSchema = indexHtml.search(/<script type="application\/ld\+json">[\s\S]*?<\/script>/);
if (firstSchema > -1) {
  // Find what to remove - all schemas of types Organization or LocalBusiness
  indexHtml = indexHtml.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"Organization"[\s\S]*?<\/script>/g, '');
  indexHtml = indexHtml.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"LocalBusiness"[\s\S]*?<\/script>/g, '');

  // Insert new comprehensive schema before </head>
  indexHtml = indexHtml.replace('</head>', homepageSchema + '\n</head>');
}

fs.writeFileSync(indexFile, indexHtml);
console.log('Homepage LocalBusiness schema upgraded with 296 areaServed cities');

// ============================================================
// 2. ADD ENHANCED REVIEW SCHEMA WITH AGGREGATERATING TO HOMEPAGE
// ============================================================

const reviewSchema = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {"@id": "https://doryscleaningservices.com/#business"},
    "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
    "author": {"@type": "Person", "name": "Sarah M., Medical Office Manager"},
    "reviewBody": "Dory's transformed our infection control program. Their ATP verification testing gave us documented proof of cleaning effectiveness during our last DPH inspection. 22 years of clinical experience really shows.",
    "datePublished": "2026-01-15",
    "publisher": {"@type": "Organization", "name": "Dory's Cleaning Services"}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {"@id": "https://doryscleaningservices.com/#business"},
    "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
    "author": {"@type": "Person", "name": "Dr. Michael R., Specialty Clinic Owner"},
    "reviewBody": "Outstanding infection control service. CDC-compliant disinfection protocols, EPA-registered products, and detailed compliance documentation. Highly recommend for any healthcare facility in Massachusetts.",
    "datePublished": "2026-02-10"
  }
  </script>`;

if (!indexHtml.includes('"@type": "Review"')) {
  indexHtml = indexHtml.replace('</head>', reviewSchema + '\n</head>');
  fs.writeFileSync(indexFile, indexHtml);
  console.log('Review schema added to homepage');
}

// ============================================================
// 3. ADD HOWTO SCHEMA FOR ATP ASSESSMENT PROCESS
// ============================================================

const howtoSchema = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Schedule a Free Healthcare Facility Cleaning Assessment in Massachusetts",
    "description": "Step-by-step process to book a complimentary facility walkthrough and ATP verification assessment with Dory's Cleaning Services in Massachusetts.",
    "image": "https://doryscleaningservices.com/assets/images/services/medical-office-new.webp",
    "totalTime": "PT24H",
    "estimatedCost": {"@type": "MonetaryAmount", "currency": "USD", "value": "0"},
    "supply": [{"@type": "HowToSupply", "name": "No supplies needed - Dory's brings all equipment"}],
    "tool": [{"@type": "HowToTool", "name": "ATP Bioluminescence Verification Device"}],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Contact Dory's Cleaning Services",
        "text": "Call (978) 307-8107 or fill out the online contact form. We respond within 24 hours.",
        "url": "https://doryscleaningservices.com/contact"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Schedule Your Facility Walkthrough",
        "text": "We schedule a 20-minute walkthrough at a time that does not disrupt your patient flow.",
        "url": "https://doryscleaningservices.com/contact"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Receive ATP Surface Testing",
        "text": "We test 4 high-touch surfaces using hospital-grade ATP bioluminescence verification - same tech used in major hospitals.",
        "url": "https://doryscleaningservices.com/healthcare-facilities"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Get Your Written Compliance Report",
        "text": "You receive a detailed pass/fail report you can keep, share with your team, and use for accreditation surveys.",
        "url": "https://doryscleaningservices.com/healthcare-facilities"
      }
    ]
  }
  </script>`;

if (!indexHtml.includes('"@type": "HowTo"')) {
  indexHtml = indexHtml.replace('</head>', howtoSchema + '\n</head>');
  fs.writeFileSync(indexFile, indexHtml);
  console.log('HowTo schema added');
}

// ============================================================
// 4. ADD FAQPage SCHEMA TO HOMEPAGE (comprehensive)
// ============================================================

const homepageFaq = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What healthcare facilities does Dory's Cleaning Services in Massachusetts serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve medical offices, specialty clinics (cardiology, dermatology, dental, urgent care), ambulatory and outpatient facilities, rehabilitation and nursing facilities, and healthcare administrative offices across 296 cities in Massachusetts including Boston, Cambridge, Worcester, Springfield, Lowell, Salem, and more."
        }
      },
      {
        "@type": "Question",
        "name": "How much does healthcare facility cleaning cost in Massachusetts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Healthcare cleaning pricing varies based on facility size, patient volume, frequency (daily, weekly, on-call), and required service scope. Typical investments range from $75 to $300+ per cleaning visit. Call (978) 307-8107 for a free customized quote based on your specific Massachusetts facility."
        }
      },
      {
        "@type": "Question",
        "name": "Are you licensed and insured for healthcare facility cleaning in Massachusetts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Dory's Cleaning Services holds Massachusetts Home Improvement Contractor License #213341 and carries $2,000,000 in liability insurance. Our staff is certified in OSHA Bloodborne Pathogens (29 CFR 1910.1030), Infection Control, and ATP Bioluminescence Verification Testing."
        }
      },
      {
        "@type": "Question",
        "name": "What is ATP bioluminescence testing and why does it matter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ATP (Adenosine Triphosphate) bioluminescence testing measures organic residue on surfaces in 10 seconds. It is the same technology used by infection prevention programs in major U.S. hospitals. The test provides objective, numerical proof that surfaces are truly disinfected — not just visually clean. We offer free ATP verification assessments to qualifying Massachusetts healthcare facilities."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide compliance documentation for Joint Commission and DPH inspections?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every cleaning visit is logged with date, time, areas serviced, EPA-registered disinfectants used, contact times, and quality control verification. Documentation supports Massachusetts Department of Public Health (DPH) inspections, Joint Commission surveys, AAAHC accreditation, OSHA audits, and internal quality reviews."
        }
      },
      {
        "@type": "Question",
        "name": "How does healthcare cleaning differ from regular janitorial services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard janitorial cleans for visual appearance. Healthcare facility cleaning requires evidence-based protocols designed to break the chain of infection transmission: EPA-registered hospital-grade disinfectants applied with proper contact times, clean-to-dirty sequencing, color-coded microfiber to prevent cross-contamination, OSHA-compliant biohazard handling, and documented verification. The cost of inadequate cleaning is measured in healthcare-associated infections (HAIs), regulatory fines, and patient safety incidents."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly can you start cleaning my Massachusetts healthcare facility?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "After your free facility walkthrough, we typically can begin scheduled cleaning within 1-2 weeks. For urgent biohazard incidents or emergency disinfection situations, we offer 24/7 on-call response across Massachusetts. Call (978) 307-8107 or email contact@doryscleaningservices.com."
        }
      }
    ]
  }
  </script>`;

// Replace existing FAQ if any, or add
indexHtml = fs.readFileSync(indexFile, 'utf8');
indexHtml = indexHtml.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"FAQPage"[\s\S]*?<\/script>/g, '');
indexHtml = indexHtml.replace('</head>', homepageFaq + '\n</head>');
fs.writeFileSync(indexFile, indexHtml);
console.log('Comprehensive FAQ schema added to homepage');

console.log('\nAll ranking improvements applied!');
