const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const locDir = path.join(root, 'locations');

// Find ALL location pages with non-standard titles
const files = fs.readdirSync(locDir).filter(f => f.endsWith('.html') && f !== 'index.html');

let fixed = 0;

files.forEach(file => {
 const filePath = path.join(locDir, file);
 let content = fs.readFileSync(filePath, 'utf8');
 const original = content;

 // Extract city name from geo.placename
 const geoMatch = content.match(/geo\.placename" content="([^,]+)/);
 const cityName = geoMatch ? geoMatch[1].trim() : file.replace(/-ma\.html$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

 // Fix generic "5★ Local Pros" titles
 if (content.includes('5★ Local Pros')) {
 const newTitle = `Healthcare Facility Sanitation ${cityName}, MA | Dorys Cleaning`;
 const newDesc = `Healthcare facility sanitation in ${cityName}, MA. Medical offices, clinics, surgery centers. CDC/OSHA protocols, 22 years clinical experience, $2M insured. (978) 307-8107.`;

 content = content.replace(/<title>[^<]*5★ Local Pros<\/title>/, `<title>${newTitle}</title>`);
 content = content.replace(/og:title" content="[^"]*5★ Local Pros"/, `og:title" content="${newTitle}"`);
 content = content.replace(
 /name="description" content="[^"]*trusted healthcare facility cleaning services company[^"]*"/,
 `name="description" content="${newDesc}"`
 );
 content = content.replace(
 /og:description" content="[^"]*trusted healthcare facility cleaning services company[^"]*"/,
 `og:description" content="${newDesc}"`
 );
 }

 // Fix "House & Office Cleaning" titles
 if (content.includes('House &amp; Office Cleaning') || content.includes('House & Office Cleaning')) {
 const newTitle = `Healthcare Facility Sanitation ${cityName}, MA | Dorys Cleaning`;
 content = content.replace(/<title>House &(?:amp;)? Office Cleaning[^<]*<\/title>/, `<title>${newTitle}</title>`);
 content = content.replace(/og:title" content="House &(?:amp;)? Office Cleaning[^"]*"/, `og:title" content="${newTitle}"`);
 }

 // Fix "MA Cleaners | Same Day Quotes" titles
 if (content.includes('Same Day Quotes')) {
 const newTitle = `Healthcare Facility Sanitation ${cityName}, MA | Dorys Cleaning`;
 content = content.replace(/<title>[^<]*Same Day Quotes<\/title>/, `<title>${newTitle}</title>`);
 content = content.replace(/og:title" content="[^"]*Same Day Quotes"/, `og:title" content="${newTitle}"`);
 }

 // Fix "Looking for cleaners" meta descriptions
 if (content.includes('Looking for cleaners')) {
 const newDesc = `Healthcare facility sanitation in ${cityName}, MA. Medical offices, clinics, surgery centers. CDC/OSHA protocols, 22 years clinical experience, $2M insured. (978) 307-8107.`;
 content = content.replace(/name="description" content="Looking for cleaners[^"]*"/, `name="description" content="${newDesc}"`);
 content = content.replace(/og:description" content="Looking for cleaners[^"]*"/, `og:description" content="${newDesc}"`);
 }

 // Fix "Top-rated cleaning pros" meta descriptions
 if (content.includes('Top-rated cleaning pros')) {
 const newDesc = `Healthcare facility sanitation in ${cityName}, MA. Medical offices, clinics, surgery centers. CDC/OSHA protocols, 22 years clinical experience, $2M insured. (978) 307-8107.`;
 content = content.replace(/name="description" content="Top-rated cleaning pros[^"]*"/, `name="description" content="${newDesc}"`);
 content = content.replace(/og:description" content="Top-rated cleaning pros[^"]*"/, `og:description" content="${newDesc}"`);
 }

 // Fix /contact.html -> /contact
 content = content.replace(/href="\/contact\.html"/g, 'href="/contact"');

 if (content !== original) {
 fs.writeFileSync(filePath, content, 'utf8');
 fixed++;
 console.log(`Fixed: ${file} -> ${cityName}`);
 }
});

console.log(`\nTotal location pages fixed: ${fixed}`);
