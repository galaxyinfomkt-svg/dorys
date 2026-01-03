/**
 * Add service-pages.css to all service pages
 */

const fs = require('fs');
const path = require('path');

const SERVICE_DIRS = [
  'services/deep-cleaning',
  'services/carpet-cleaning',
  'services/janitorial-service',
  'services/general-housekeeping',
  'services/upholstery-cleaning'
];

function main() {
  const baseDir = path.join(__dirname, '..');
  let updated = 0;

  console.log('Adding service-pages.css to all service pages...\n');

  SERVICE_DIRS.forEach(dir => {
    const fullDir = path.join(baseDir, dir);
    if (fs.existsSync(fullDir)) {
      const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.html'));

      files.forEach(file => {
        const filePath = path.join(fullDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if service-pages.css is already included
        if (!content.includes('service-pages.css')) {
          // Add after premium-v2.css
          content = content.replace(
            '<link rel="stylesheet" href="/assets/css/premium-v2.css">',
            '<link rel="stylesheet" href="/assets/css/premium-v2.css">\n  <link rel="stylesheet" href="/assets/css/service-pages.css">'
          );

          fs.writeFileSync(filePath, content, 'utf8');
          updated++;
        }
      });

      console.log(`  ${dir}: ${files.length} files processed`);
    }
  });

  console.log(`\nTotal updated: ${updated} files`);
}

main();
