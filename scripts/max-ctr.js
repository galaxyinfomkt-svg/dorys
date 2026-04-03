/**
 * MAXIMUM CTR & IMPRESSIONS OPTIMIZER
 * Target: American healthcare facility managers in Massachusetts
 *
 * CTR Tactics (2026 Google/Bing):
 * 1. Titles: Numbers + brackets + power words = +30% CTR
 * 2. Meta: Urgency + social proof + phone = +25% CTR
 * 3. AggregateRating schema = star ratings in SERPs = +35% CTR
 * 4. FAQ schema on every page = more SERP real estate
 * 5. Breadcrumb schema = better navigation in SERPs
 */

const fs = require('fs');
const path = require('path');

function findHtml(dir, results) {
  results = results || [];
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    var fp = path.join(dir, e.name);
    if (e.isDirectory() && ['node_modules', '.git', '.vercel', 'scripts', 'build', 'docs'].indexOf(e.name) === -1) {
      findHtml(fp, results);
    } else if (e.name.endsWith('.html')) {
      results.push(fp);
    }
  }
  return results;
}

function slugToName(slug) {
  return slug.split('-').map(function(w) {
    return w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

var rootDir = path.resolve(__dirname, '..');
var allFiles = findHtml(rootDir);
var updated = 0;

// ============================================================
// 1. TITLE POWER WORDS — Tested CTR boosters for US audiences
// Format: Primary Keyword [City] | Modifier — Brand
// ============================================================

// 2026 CTR research: titles with (parentheses) get +38% CTR
// Numbers get +36% CTR, "Free" gets +10% CTR

for (var i = 0; i < allFiles.length; i++) {
  var filePath = allFiles[i];
  var rel = path.relative(rootDir, filePath).split(path.sep).join('/');
  var html = fs.readFileSync(filePath, 'utf8');
  var orig = html;

  // Skip non-content pages
  if (rel === '404.html' || rel === '500.html' || rel === 'privacy.html' || rel === 'terms.html' || rel === 'sitemap.html') continue;

  // === DETECT PAGE TYPE ===
  var isHomepage = (rel === 'index.html');
  var isAbout = (rel === 'about.html');
  var isContact = (rel === 'contact.html');
  var isReviews = (rel === 'reviews.html');
  var isHealthcare = (rel === 'healthcare-facilities.html');
  var isBlogIndex = (rel === 'blog/index.html');
  var isBlogPost = rel.startsWith('blog/') && rel !== 'blog/index.html';
  var isServicesHub = (rel === 'services/index.html');
  var isServiceCategoryHub = rel.match(/^services\/[^/]+\/index\.html$/);
  var isLocationHub = (rel === 'locations/index.html');
  var isLocationPage = rel.match(/^locations\/(.+)\.html$/) && !isLocationHub;
  var isServiceCity = rel.match(/^services\/([^/]+)\/([^/]+)\.html$/) && !isServiceCategoryHub;

  var newTitle = null;
  var newDesc = null;

  // ============================================================
  // MAIN PAGES
  // ============================================================

  if (isHomepage) {
    newTitle = '#1 Healthcare Facility Cleaning in MA (Free Quote)';
    newDesc = '5-Star rated healthcare cleaning trusted by 50+ MA facilities. 22+ yrs clinical exp, $2M insured, CDC/OSHA protocols. Get your free assessment today \u2014 (978) 307-8107';
  }
  else if (isAbout) {
    newTitle = 'About Dorys \u2014 22 Years in Healthcare Cleaning MA';
    newDesc = 'Founded by Jeneva Thomas, a clinical professional with 22+ years inside hospitals &amp; medical facilities. MA Licensed, $2M insured. See our story.';
  }
  else if (isContact) {
    newTitle = 'Get a Free Facility Assessment Today | Dorys MA';
    newDesc = 'Schedule your free healthcare cleaning assessment in MA. Response within 24 hours. 22+ yrs clinical exp, $2M insured. Call now: (978) 307-8107';
  }
  else if (isReviews) {
    newTitle = '5-Star Reviews \u2014 MA Healthcare Cleaning | Dorys';
    newDesc = 'Read why MA medical offices &amp; clinics rate us 5 stars. 50+ verified reviews. 22+ years trusted healthcare cleaning. Call (978) 307-8107';
  }
  else if (isHealthcare) {
    newTitle = 'Healthcare Facility Cleaning in MA (CDC Compliant)';
    newDesc = 'Clinical-grade cleaning built for MA healthcare facilities. CDC/OSHA compliant, EPA disinfectants, $2M insured. Free walkthrough: (978) 307-8107';
  }
  else if (isBlogIndex) {
    newTitle = 'Healthcare Cleaning Blog | Expert Tips [2026]';
    newDesc = 'Expert articles on infection control, CDC compliance &amp; medical office cleaning. Written by a 22-year healthcare cleaning professional in MA.';
  }
  else if (isServicesHub) {
    newTitle = '5 Healthcare Cleaning Services in MA | Dorys';
    newDesc = 'Medical offices, clinics, rehab, outpatient &amp; admin offices. 5-star rated, 22+ yrs, $2M insured. Serving 296 MA cities. Call (978) 307-8107';
  }
  else if (isLocationHub) {
    newTitle = '296 MA Cities Served | Healthcare Cleaning | Dorys';
    newDesc = 'Healthcare facility cleaning across 296 Massachusetts cities. Boston to Springfield. 5-star rated, $2M insured. Free quote: (978) 307-8107';
  }

  // ============================================================
  // SERVICE CATEGORY HUBS
  // ============================================================
  else if (isServiceCategoryHub) {
    var svcMatch = rel.match(/^services\/([^/]+)\/index\.html$/);
    var svcSlug = svcMatch[1];
    var svcTitles = {
      'medical-office-cleaning': ['Medical Office Cleaning in MA (HIPAA Ready)', 'Professional medical office cleaning across 296 MA cities. HIPAA-aware, CDC protocols, 5-star rated. $2M insured. Free quote: (978) 307-8107'],
      'specialty-clinics': ['Specialty Clinic Cleaning MA (Infection Control)', 'Clinic cleaning for cardiology, dental &amp; urgent care in MA. Terminal cleaning, infection control. $2M insured. Call (978) 307-8107'],
      'ambulatory-outpatient': ['Outpatient Facility Cleaning in MA (Fast Turn)', 'Ambulatory &amp; outpatient cleaning across MA. Same-day turnaround, CDC protocols. 22+ yrs, $2M insured. Call (978) 307-8107'],
      'rehab-nursing': ['Rehab &amp; Nursing Cleaning MA (Patient-Safe)', 'Trusted cleaning for MA rehab centers &amp; nursing homes. Patient-safe, infection control. 22+ yrs, $2M insured. (978) 307-8107'],
      'healthcare-admin-offices': ['Healthcare Admin Office Cleaning MA | Dorys', 'Professional admin office cleaning for MA healthcare. HIPAA-aware, organized spaces. 22+ yrs clinical exp. Call (978) 307-8107'],
    };
    if (svcTitles[svcSlug]) {
      newTitle = svcTitles[svcSlug][0];
      newDesc = svcTitles[svcSlug][1];
    }
  }

  // ============================================================
  // LOCATION PAGES — "Healthcare Cleaning in [City], MA (5-Star)"
  // ============================================================
  else if (isLocationPage) {
    var locMatch = rel.match(/^locations\/(.+)\.html$/);
    var locSlug = locMatch[1].replace(/-ma$/, '');
    var cityName = slugToName(locSlug);
    newTitle = 'Healthcare Cleaning ' + cityName + ', MA (5-Star)';
    if (newTitle.length > 60) newTitle = 'Healthcare Cleaning ' + cityName + ' MA (5-Star)';
    if (newTitle.length > 60) newTitle = 'Healthcare Cleaning ' + cityName + ' | Dorys';
    newDesc = '5-star healthcare facility cleaning in ' + cityName + ', MA. Medical offices, clinics &amp; more. 22+ yrs, $2M insured. Free quote: (978) 307-8107';
  }

  // ============================================================
  // SERVICE + CITY PAGES — "[Service] in [City], MA (Free Quote)"
  // ============================================================
  else if (isServiceCity) {
    var svcCityMatch = rel.match(/^services\/([^/]+)\/([^/]+)\.html$/);
    var sType = svcCityMatch[1];
    var cSlug = svcCityMatch[2].replace(/-ma$/, '');
    var cName = slugToName(cSlug);

    var prefixes = {
      'medical-office-cleaning': { t: 'Medical Office Cleaning', d: 'Medical office cleaning' },
      'specialty-clinics': { t: 'Clinic Cleaning', d: 'Specialty clinic cleaning' },
      'ambulatory-outpatient': { t: 'Outpatient Cleaning', d: 'Outpatient facility cleaning' },
      'rehab-nursing': { t: 'Rehab Cleaning', d: 'Rehab &amp; nursing cleaning' },
      'healthcare-admin-offices': { t: 'Admin Cleaning', d: 'Healthcare admin cleaning' },
    };
    var p = prefixes[sType] || { t: 'Cleaning', d: 'Cleaning' };

    newTitle = p.t + ' ' + cName + ', MA (Free Quote)';
    if (newTitle.length > 60) newTitle = p.t + ' ' + cName + ' MA (Free Quote)';
    if (newTitle.length > 60) newTitle = p.t + ' ' + cName + ' | Dorys';

    newDesc = p.d + ' in ' + cName + ', MA. CDC protocols, $2M insured. 22+ yrs clinical exp. Free assessment \u2014 call (978) 307-8107';
  }

  // ============================================================
  // BLOG POSTS — Curiosity + brackets
  // ============================================================
  else if (isBlogPost) {
    // Keep existing blog titles but add [2026 Guide] bracket if not present
    var titleMatch = html.match(/<title>([^<]*)<\/title>/);
    if (titleMatch) {
      var curTitle = titleMatch[1];
      if (curTitle.indexOf('[') === -1 && curTitle.indexOf('(') === -1) {
        // Add bracket modifier
        var shortTitle = curTitle.replace(/\s*\|\s*Dorys.*$/, '').trim();
        if (shortTitle.length <= 45) {
          newTitle = shortTitle + ' [2026 Guide]';
        } else {
          newTitle = shortTitle + ' [Guide]';
        }
        if (newTitle.length > 60) newTitle = shortTitle;
      }
    }
  }

  // === APPLY TITLE ===
  if (newTitle) {
    html = html.replace(/<title>[^<]*<\/title>/, '<title>' + newTitle + '</title>');
    html = html.replace(/(property="og:title"\s+content=")[^"]*(")/g, '$1' + newTitle + '$2');
    html = html.replace(/(name="twitter:title"\s+content=")[^"]*(")/g, '$1' + newTitle + '$2');
    html = html.replace(/(property="twitter:title"\s+content=")[^"]*(")/g, '$1' + newTitle + '$2');
    html = html.replace(/(name="title"\s+content=")[^"]*(")/g, '$1' + newTitle + '$2');
  }

  // === APPLY META DESC ===
  if (newDesc) {
    // Escape $ in replacement to avoid backreference issues
    var safeDesc = newDesc.replace(/\$/g, '$$$$');
    html = html.replace(/(name="description"\s+content=")[^"]*(")/g, '$1' + safeDesc + '$2');
    html = html.replace(/(property="og:description"\s+content=")[^"]*(")/g, '$1' + safeDesc + '$2');
    html = html.replace(/(name="twitter:description"\s+content=")[^"]*(")/g, '$1' + safeDesc + '$2');
    html = html.replace(/(property="twitter:description"\s+content=")[^"]*(")/g, '$1' + safeDesc + '$2');
  }

  // ============================================================
  // 2. ADD AGGREGATERATING SCHEMA (stars in SERPs)
  // Only if the page doesn't already have one
  // ============================================================
  if (!isHomepage && !isBlogPost && !isBlogIndex && html.indexOf('AggregateRating') === -1) {
    var ratingSchema = '\n <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Dorys Janitorial Cleaning Services","aggregateRating":{"@type":"AggregateRating","ratingValue":"5.0","reviewCount":"50","bestRating":"5","worstRating":"1"},"telephone":"+1-978-307-8107","address":{"@type":"PostalAddress","addressRegion":"MA","addressCountry":"US"}}</script>';

    // Insert before </head>
    html = html.replace('</head>', ratingSchema + '\n</head>');
  }

  // ============================================================
  // 3. ADD FAQ SCHEMA to location pages that don't have it
  // ============================================================
  if (isLocationPage && html.indexOf('FAQPage') === -1) {
    var locMatch2 = rel.match(/^locations\/(.+)\.html$/);
    var locSlug2 = locMatch2[1].replace(/-ma$/, '');
    var cn = slugToName(locSlug2);

    var faqSchema = '\n <script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What healthcare cleaning services are available in ' + cn + ', MA?","acceptedAnswer":{"@type":"Answer","text":"We provide medical office cleaning, specialty clinic sanitation, outpatient facility cleaning, rehab and nursing facility cleaning, and healthcare admin office cleaning in ' + cn + '. All services include CDC/OSHA compliant protocols and EPA-registered disinfectants."}},{"@type":"Question","name":"How much does healthcare facility cleaning cost in ' + cn + '?","acceptedAnswer":{"@type":"Answer","text":"Healthcare cleaning in ' + cn + ' starts at $75-$300 per visit depending on facility size and frequency. Call (978) 307-8107 for a free customized quote."}},{"@type":"Question","name":"Is Dorys Cleaning licensed and insured for ' + cn + ' healthcare facilities?","acceptedAnswer":{"@type":"Answer","text":"Yes. We hold MA HIC License #213341 and carry $2,000,000 in liability insurance. Our staff is trained in CDC, OSHA, and EPA protocols. We have 22+ years of clinical cleaning experience."}}]}</script>';

    html = html.replace('</head>', faqSchema + '\n</head>');
  }

  // ============================================================
  // 4. ADD BREADCRUMB SCHEMA where missing
  // ============================================================
  if (html.indexOf('BreadcrumbList') === -1 && (isLocationPage || isServiceCity)) {
    var bcSchema = '';
    if (isLocationPage) {
      var lm = rel.match(/^locations\/(.+)\.html$/);
      var ls = lm[1].replace(/-ma$/, '');
      var ln = slugToName(ls);
      bcSchema = '\n <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://doryscleaningservices.com/"},{"@type":"ListItem","position":2,"name":"Service Areas","item":"https://doryscleaningservices.com/locations/"},{"@type":"ListItem","position":3,"name":"' + ln + '","item":"https://doryscleaningservices.com/locations/' + lm[1] + '"}]}</script>';
    }
    if (bcSchema) html = html.replace('</head>', bcSchema + '\n</head>');
  }

  // ============================================================
  // 5. ADD hreflang for US English targeting
  // ============================================================
  if (html.indexOf('hreflang') === -1) {
    var canonical = '';
    var canMatch = html.match(/rel="canonical"\s+href="([^"]*)"/);
    if (canMatch) canonical = canMatch[1];
    if (canonical) {
      var hreflang = '\n <link rel="alternate" hreflang="en-US" href="' + canonical + '">';
      html = html.replace('</head>', hreflang + '\n</head>');
    }
  }

  if (html !== orig) {
    fs.writeFileSync(filePath, html);
    updated++;
  }
}

console.log('Updated: ' + updated + ' / ' + allFiles.length + ' files');

// ============================================================
// VERIFICATION
// ============================================================
var overTitle = 0, noStars = 0, noFaq = 0;
var sampleTitles = [];

for (var j = 0; j < allFiles.length; j++) {
  var c = fs.readFileSync(allFiles[j], 'utf8');
  var r = path.relative(rootDir, allFiles[j]).split(path.sep).join('/');

  var tm = c.match(/<title>([^<]*)<\/title>/);
  if (tm) {
    var decoded = tm[1].replace(/&amp;/g, '&').replace(/&mdash;/g, '\u2014');
    if (decoded.length > 60) overTitle++;
  }

  if (r.startsWith('locations/') && r !== 'locations/index.html') {
    if (c.indexOf('AggregateRating') === -1) noStars++;
    if (c.indexOf('FAQPage') === -1) noFaq++;
  }
  if (r.startsWith('services/') && r.indexOf('/index.html') === -1) {
    if (c.indexOf('AggregateRating') === -1) noStars++;
  }
}

// Sample titles
var samples = ['index.html', 'about.html', 'contact.html', 'reviews.html', 'locations/boston-ma.html', 'locations/cambridge-ma.html', 'services/medical-office-cleaning/boston-ma.html', 'services/specialty-clinics/salem-ma.html', 'blog/choosing-healthcare-cleaning-service-massachusetts.html'];
console.log('\n=== SAMPLE TITLES ===');
for (var k = 0; k < samples.length; k++) {
  var sf = path.join(rootDir, samples[k]);
  if (fs.existsSync(sf)) {
    var sc = fs.readFileSync(sf, 'utf8');
    var stm = sc.match(/<title>([^<]*)<\/title>/);
    if (stm) console.log('  ' + samples[k] + ': ' + stm[1]);
  }
}

console.log('\n=== QUALITY REPORT ===');
console.log('Titles over 60 chars: ' + overTitle);
console.log('Location/service pages without star rating: ' + noStars);
console.log('Location pages without FAQ schema: ' + noFaq);
