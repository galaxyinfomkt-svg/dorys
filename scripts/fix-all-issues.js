const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let totalFixed = 0;

// ============================================
// 1. FIX AMBULATORY-OUTPATIENT CITY PAGES
// ============================================
console.log('=== Fixing Ambulatory & Outpatient city pages ===');

const ambDir = path.join(root, 'services', 'ambulatory-outpatient');
const ambFiles = fs.readdirSync(ambDir).filter(f => f.endsWith('.html') && f !== 'index.html');

ambFiles.forEach(file => {
 const filePath = path.join(ambDir, file);
 let content = fs.readFileSync(filePath, 'utf8');
 const original = content;

 // Extract city name from filename for dynamic replacement
 const citySlug = file.replace('.html', '');
 // Get city display name from the title tag
 const titleMatch = content.match(/<title>.*?in ([^,]+),/);
 const cityName = titleMatch ? titleMatch[1] : citySlug.replace(/-ma$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

 // Fix meta description
 content = content.replace(
 /content="Assisted living and senior care cleaning in [^"]+"/,
 `content="Ambulatory &amp; outpatient facility sanitation in ${cityName}, MA. Fast-turnaround procedure room disinfection, recovery area cleaning. 22 years clinical experience, $2M insured. (978) 307-8107."`
 );

 // Fix keywords
 content = content.replace(
 /name="keywords" content="assisted living cleaning [^"]+"/,
 `name="keywords" content="ambulatory surgery center cleaning ${cityName} MA, outpatient clinic sanitation ${cityName}, procedure room disinfection ${cityName}, same-day surgery cleaning ${cityName} Massachusetts, urgent care sanitation ${cityName}"`
 );

 // Fix OG description
 content = content.replace(
 /og:description" content="Assisted living and senior care cleaning in [^"]+"/,
 `og:description" content="Ambulatory &amp; outpatient facility sanitation in ${cityName}, MA. Fast-turnaround procedure room disinfection, recovery area cleaning. 22 years clinical experience, $2M insured. (978) 307-8107."`
 );

 // Fix hero subtitle
 content = content.replace(
 /Compassionate, thorough cleaning for nursing homes, assisted living communities, and memory care facilities\./,
 'Fast-turnaround sanitation for ambulatory surgery centers, outpatient clinics, and same-day procedure facilities.'
 );

 // Fix lead paragraph
 content = content.replace(
 /Senior care facilities in [^ ]+ require a specialized approach to environmental cleaning that prioritizes resident safety, comfort, and dignity\. Our assisted living healthcare facility cleaning services use fragrance-sensitive, low-toxicity products appropriate for elderly and immunocompromised residents, delivering consistent sanitation that supports infection prevention and regulatory compliance\./,
 `Ambulatory and outpatient facilities in ${cityName} require fast-turnaround sanitation between patients while maintaining the highest infection control standards. Our healthcare facility cleaning services use EPA-registered disinfectants appropriate for high-traffic clinical environments, delivering efficient sanitation that supports infection prevention and keeps your facility running on schedule.`
 );

 // Fix service list items
 content = content.replace(
 /<li>Resident room and bathroom Specialty Clinics Sanitation<\/li>/,
 '<li>Procedure room and recovery area sanitation</li>'
 );
 content = content.replace(
 /<li>Common area and dining hall sanitation<\/li>/,
 '<li>Waiting room and reception cleaning</li>'
 );
 content = content.replace(
 /<li>Memory care unit specialized protocols<\/li>/,
 '<li>Exam room turnaround disinfection</li>'
 );
 content = content.replace(
 /<li>Fragrance-free and low-toxicity product options<\/li>/,
 '<li>EPA-registered disinfectant protocols</li>'
 );
 content = content.replace(
 /<li>Handrail, elevator, and mobility aid disinfection<\/li>/,
 '<li>High-touch surface treatment</li>'
 );
 content = content.replace(
 /<li>Laundry room and utility area cleaning<\/li>/,
 '<li>Restroom and staff area sanitation</li>'
 );
 content = content.replace(
 /<li>Activity room and therapy space sanitation<\/li>/,
 '<li>Equipment surface disinfection</li>'
 );
 content = content.replace(
 /<li>Entrance and reception area maintenance<\/li>/,
 '<li>Compliance documentation and reporting</li>'
 );

 // Fix FAQ question 1
 content = content.replace(
 /Do you use products safe for elderly residents in [^?]+\?/,
 `Do you use EPA-registered disinfectants in ${cityName} outpatient facilities?`
 );
 content = content.replace(
 /Yes\. For senior care facilities in [^,]+, we offer fragrance-free and low-toxicity cleaning product options specifically chosen for elderly and immunocompromised residents\. All products are EPA-registered and effective against common healthcare pathogens while being safe for residents with respiratory sensitivities\./,
 `Yes. For outpatient facilities in ${cityName}, we use EPA-registered hospital-grade disinfectants effective against common healthcare pathogens including MRSA, C. diff, and norovirus. All products meet CDC and OSHA guidelines for healthcare environments and are applied with proper contact times for maximum efficacy.`
 );

 // Fix FAQ question 2
 content = content.replace(
 /How do you handle infection outbreaks in [^ ]+ senior care facilities\?/,
 `How do you handle turnaround cleaning between patients in ${cityName}?`
 );
 content = content.replace(
 /We have outbreak response protocols for [^ ]+ facilities that include enhanced disinfection frequency, targeted high-touch surface treatment, and coordination with facility management\. We can rapidly escalate our cleaning protocols during flu season, COVID outbreaks, or other infectious disease events\./,
 `Our team is trained in rapid turnaround protocols for ${cityName} facilities. We efficiently disinfect procedure rooms, exam spaces, and recovery areas between patients using EPA-registered disinfectants with verified contact times, ensuring your facility maintains its patient schedule without compromising infection control standards.`
 );

 // Fix FAQ question 3
 content = content.replace(
 /Can you clean around residents' schedules in [^?]+\?/,
 `Can you work around patient schedules in ${cityName}?`
 );
 content = content.replace(
 /Absolutely\. We understand that senior care facilities in [^ ]+ operate 24\/7 and residents have established routines\. Our team works quietly and respectfully around meal times, activity schedules, and rest periods to minimize disruption\./,
 `Absolutely. We understand that outpatient facilities in ${cityName} operate on tight schedules with multiple patients daily. Our team works efficiently between procedures and during off-peak hours to provide thorough sanitation without disrupting your clinical workflow.`
 );

 // Fix /contact.html -> /contact (all occurrences)
 content = content.replace(/href="\/contact\.html"/g, 'href="/contact"');

 if (content !== original) {
 fs.writeFileSync(filePath, content, 'utf8');
 totalFixed++;
 }
});
console.log(`Fixed ${totalFixed} ambulatory-outpatient city pages`);

// ============================================
// 2. FIX /contact.html -> /contact IN ALL OTHER SERVICE CITY PAGES
// ============================================
console.log('\n=== Fixing /contact.html links in other service city pages ===');
let contactFixed = 0;

const otherServices = ['medical-office-cleaning', 'specialty-clinics', 'rehab-nursing', 'healthcare-admin-offices'];
otherServices.forEach(service => {
 const dir = path.join(root, 'services', service);
 if (!fs.existsSync(dir)) return;
 const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
 files.forEach(file => {
 const filePath = path.join(dir, file);
 let content = fs.readFileSync(filePath, 'utf8');
 if (content.includes('href="/contact.html"')) {
 content = content.replace(/href="\/contact\.html"/g, 'href="/contact"');
 fs.writeFileSync(filePath, content, 'utf8');
 contactFixed++;
 }
 });
});
console.log(`Fixed /contact.html links in ${contactFixed} other city pages`);

// ============================================
// 3. FIX HOMEPAGE FOOTER CTA
// ============================================
console.log('\n=== Fixing homepage footer CTA ===');
const indexPath = path.join(root, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Fix footer CTA href="#contact" -> href="/contact"
indexContent = indexContent.replace(
 /(<div class="footer__cta-buttons">\s*<a href=")#contact(")/,
 '$1/contact$2'
);
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Fixed homepage footer CTA: #contact -> /contact');

// ============================================
// 4. FIX HEALTHCARE-FACILITIES.HTML META TAGS
// ============================================
console.log('\n=== Fixing healthcare-facilities.html ===');
const hfPath = path.join(root, 'healthcare-facilities.html');
let hfContent = fs.readFileSync(hfPath, 'utf8');

// Fix "Dory's" -> "Dorys" in meta tags
hfContent = hfContent.replace(/Dory's Cleaning Services/g, 'Dorys Cleaning Services');

// Fix meta description (too short, make it 150-160 chars with better CTR)
hfContent = hfContent.replace(
 /content="Healthcare facilities require sanitation practices that go beyond cosmetic cleaning\. [^"]+"/,
 'content="Healthcare facility sanitation by a clinical professional with 22+ years experience. CDC/OSHA protocols, EPA-registered disinfectants, $2M insured. Serving MA clinics &amp; hospitals. (978) 307-8107."'
);

fs.writeFileSync(hfPath, hfContent, 'utf8');
console.log('Fixed healthcare-facilities.html meta tags');

// ============================================
// 5. FIX ABOUT.HTML CEO QUOTE
// ============================================
console.log('\n=== Fixing about.html CEO quote ===');
const aboutPath = path.join(root, 'about.html');
let aboutContent = fs.readFileSync(aboutPath, 'utf8');
aboutContent = aboutContent.replace(
 /every assisted living facility/,
 'every healthcare facility'
);
fs.writeFileSync(aboutPath, aboutContent, 'utf8');
console.log('Fixed about.html CEO quote');

// ============================================
// 6. FIX FAVICON ON REVIEWS.HTML
// ============================================
console.log('\n=== Fixing favicon on reviews.html ===');
const reviewsPath = path.join(root, 'reviews.html');
let reviewsContent = fs.readFileSync(reviewsPath, 'utf8');

// Fix favicon reference (relative path + wrong format)
reviewsContent = reviewsContent.replace(
 /<link rel="icon" type="image\/jpeg" href="assets\/images\/logo\/favicon\.ico">/,
 '<link rel="icon" type="image/svg+xml" href="/assets/images/logo/favicon.svg">'
);
reviewsContent = reviewsContent.replace(
 /<link rel="apple-touch-icon" sizes="180x180" href="assets\/images\/logo\/apple-touch-icon\.png">/,
 '<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/apple-touch-icon.png">'
);
fs.writeFileSync(reviewsPath, reviewsContent, 'utf8');
console.log('Fixed reviews.html favicon');

// ============================================
// 7. FIX FAVICON ON LOCATIONS/INDEX.HTML
// ============================================
console.log('\n=== Fixing favicon on locations/index.html ===');
const locIndexPath = path.join(root, 'locations', 'index.html');
let locIndexContent = fs.readFileSync(locIndexPath, 'utf8');
locIndexContent = locIndexContent.replace(
 /<link rel="icon" type="image\/jpeg" href="\/assets\/images\/logo\/favicon\.ico">/,
 '<link rel="icon" type="image/svg+xml" href="/assets/images/logo/favicon.svg">'
);
fs.writeFileSync(locIndexPath, locIndexContent, 'utf8');
console.log('Fixed locations/index.html favicon');

// ============================================
// 8. FIX INDEX.HTML META DESCRIPTION (TOO LONG)
// ============================================
console.log('\n=== Fixing index.html meta description ===');
indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent.replace(
 /name="description" content="Professional cleaning services for healthcare facilities in Massachusetts\. Led by a healthcare professional with 22 years of clinical experience\. Medical offices, clinics, infection prevention\. \$2M insured\. \(978\) 307-8107"/,
 'name="description" content="Healthcare facility sanitation in Massachusetts by a 22-year clinical professional. Medical offices, clinics, surgery centers. CDC/OSHA protocols, $2M insured. (978) 307-8107"'
);
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Fixed index.html meta description length');

console.log('\n=== ALL FIXES COMPLETE ===');
console.log(`Total ambulatory-outpatient pages fixed: ${totalFixed}`);
console.log(`Total other city pages contact links fixed: ${contactFixed}`);
console.log('Individual page fixes: homepage, healthcare-facilities, about, reviews, locations/index');
