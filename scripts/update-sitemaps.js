const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const today = '2026-03-11';

// Mapping: old service slug → new service slug
const renames = {
 'clinic-outpatient-sanitation': 'specialty-clinics',
 'assisted-living-senior-care': 'ambulatory-outpatient',
 'infection-control-disinfection': 'rehab-nursing',
 'compliance-scheduled-sanitation': 'healthcare-admin-offices'
};

// 1. Rename sitemap files and update URLs inside them
for (const [oldSlug, newSlug] of Object.entries(renames)) {
 const oldFile = path.join(root, `sitemap-services-${oldSlug}.xml`);
 const newFile = path.join(root, `sitemap-services-${newSlug}.xml`);

 if (fs.existsSync(oldFile)) {
 let content = fs.readFileSync(oldFile, 'utf8');
 // Replace old slug in URLs
 content = content.replace(new RegExp(oldSlug, 'g'), newSlug);
 // Update dates
 content = content.replace(/2026-02-23/g, today);
 // Write to new filename
 fs.writeFileSync(newFile, content, 'utf8');
 // Remove old file
 fs.unlinkSync(oldFile);
 console.log(`Renamed: sitemap-services-${oldSlug}.xml → sitemap-services-${newSlug}.xml`);
 }
}

// 2. Update medical-office-cleaning sitemap date (no rename needed)
const mocFile = path.join(root, 'sitemap-services-medical-office-cleaning.xml');
if (fs.existsSync(mocFile)) {
 let content = fs.readFileSync(mocFile, 'utf8');
 content = content.replace(/2026-02-23/g, today);
 fs.writeFileSync(mocFile, content, 'utf8');
 console.log('Updated dates in sitemap-services-medical-office-cleaning.xml');
}

// 3. Update other sitemaps dates
for (const name of ['sitemap-pages.xml', 'sitemap-locations.xml', 'sitemap-blog.xml']) {
 const f = path.join(root, name);
 if (fs.existsSync(f)) {
 let content = fs.readFileSync(f, 'utf8');
 content = content.replace(/2026-02-23/g, today);
 fs.writeFileSync(f, content, 'utf8');
 console.log(`Updated dates in ${name}`);
 }
}

// 4. Update sitemap.xml index
const indexFile = path.join(root, 'sitemap.xml');
let indexContent = fs.readFileSync(indexFile, 'utf8');
// Replace old sitemap filenames
for (const [oldSlug, newSlug] of Object.entries(renames)) {
 indexContent = indexContent.replace(
 `sitemap-services-${oldSlug}.xml`,
 `sitemap-services-${newSlug}.xml`
 );
}
// Update dates
indexContent = indexContent.replace(/2026-02-23/g, today);
fs.writeFileSync(indexFile, indexContent, 'utf8');
console.log('Updated sitemap.xml index');

console.log('\nAll sitemaps updated successfully!');
