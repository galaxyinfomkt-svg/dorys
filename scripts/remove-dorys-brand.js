const fs = require('fs');
const path = require('path');

function findFiles(dir, exts, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', '.vercel'].includes(entry.name)) {
      findFiles(fullPath, exts, results);
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const rootDir = path.resolve(__dirname, '..');
const allFiles = findFiles(rootDir, ['.html', '.xml', '.css', '.js', '.md', '.txt']);

let totalChanges = 0;

for (const filePath of allFiles) {
  // Skip our own script
  if (filePath.includes('remove-dorys-brand')) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // === Titles ===
  content = content.replace(/\| Dorys\s*—\s*Since 2004/g, '| 22+ Years of Healthcare Excellence');
  content = content.replace(/\s*\|\s*Dorys Cleaning/g, '');
  content = content.replace(/\s*\| Dorys$/gm, '');

  // === About ===
  content = content.replace(/About Dorys Janitorial Cleaning Services/g, 'About Our Healthcare Cleaning Services');
  content = content.replace(/About Dorys\s*—/g, 'About Us —');

  // === "Why Choose / Trust" patterns ===
  content = content.replace(/Why Choose Dorys for/g, 'Why Choose Us for');
  content = content.replace(/the Dorys difference/g, 'the difference');
  content = content.replace(/trust Dorys for/g, 'trust us for');
  content = content.replace(/Trust Dorys/g, 'Trust Us');
  content = content.replace(/Chooses Dorys/g, 'Chooses Us');
  content = content.replace(/choose Dorys for/g, 'choose us for');
  content = content.replace(/Why Dorys/g, 'Why Choose Us');
  content = content.replace(/The Dorys Difference/g, 'Our Difference');

  // === Schema/JSON-LD ===
  content = content.replace(/"name":\s*"Dorys Janitorial Cleaning Services Inc\."/g, '"name": "Janitorial Cleaning Services Inc."');
  content = content.replace(/"name":\s*"Dorys Janitorial Cleaning Services"/g, '"name": "Janitorial Cleaning Services"');
  content = content.replace(/"legalName":\s*"Dorys Janitorial Cleaning Services Inc\."/g, '"legalName": "Janitorial Cleaning Services Inc."');
  content = content.replace(/"name":\s*"About Dorys Janitorial Cleaning Services"/g, '"name": "About Our Healthcare Cleaning Services"');
  content = content.replace(/"name":\s*"Dorys Janitorial[^"]*"/g, '"name": "Janitorial Cleaning Services"');

  // === Reviews ===
  content = content.replace(/from Dorys/g, 'from Us');
  content = content.replace(/Dorys Cleaning transformed/g, 'They transformed');
  content = content.replace(/We've used Dorys for/g, "We've used them for");
  content = content.replace(/We hired Dorys for/g, 'We hired them for');
  content = content.replace(/but Dorys is by far/g, 'but this team is by far');
  content = content.replace(/Dorys has been my go-to/g, 'They have been my go-to');

  // === FAQ ===
  content = content.replace(/does Dorys offer/g, 'do you offer');
  content = content.replace(/does Dorys serve/g, 'do you serve');
  content = content.replace(/does Dorys Cleaning serve/g, 'do you serve');
  content = content.replace(/Is Dorys Cleaning licensed/g, 'Are you licensed');
  content = content.replace(/Is Dorys licensed/g, 'Are you licensed');
  content = content.replace(/does Dorys/g, 'do you');

  // === Full brand name replacements ===
  content = content.replace(/Dorys Janitorial Cleaning Services Inc\./g, 'Janitorial Cleaning Services Inc.');
  content = content.replace(/Dorys Janitorial Cleaning Services/g, 'Janitorial Cleaning Services');

  // === Alt text and aria-labels ===
  content = content.replace(/alt="Dorys Janitorial"/g, 'alt="Janitorial Cleaning Services"');
  content = content.replace(/alt="Dorys /g, 'alt="');
  content = content.replace(/aria-label="Dorys /g, 'aria-label="');

  // === Footer/logo text ===
  content = content.replace(/>Dorys Cleaning</g, '>Cleaning Services<');
  content = content.replace(/>Dorys Janitorial</g, '>Janitorial Cleaning Services');
  content = content.replace(/"Dorys Janitorial"/g, '"Janitorial Cleaning Services"');

  // === Remaining visible "Dorys Cleaning" ===
  content = content.replace(/Dorys Cleaning/g, 'Our Cleaning');

  // === Remaining "Dorys" in visible content (not URLs) ===
  content = content.replace(/founded Dorys/g, 'founded the company');
  content = content.replace(/, Dorys delivers/g, ', we deliver');
  content = content.replace(/working with Dorys have/g, 'working with us have');
  content = content.replace(/has made Dorys one/g, 'has made us one');
  content = content.replace(/Dorys offers comprehensive/g, 'We offer comprehensive');

  // === Meta content ===
  content = content.replace(/content="Dorys Janitorial Cleaning Services Inc\."/g, 'content="Janitorial Cleaning Services Inc."');
  content = content.replace(/"Dorys Janitorial Cleaning Services"/g, '"Janitorial Cleaning Services"');

  // === Iframe titles (not URLs) ===
  content = content.replace(/title="Dorys Janitorial Cleaning Services[^"]*"/g, 'title="Janitorial Cleaning Services"');
  content = content.replace(/title="Customer reviews for Dorys[^"]*"/g, 'title="Customer reviews"');

  // === "Since 2004" ===
  content = content.replace(/Since 2004/g, 'Over 22 Years');
  content = content.replace(/since 2004/g, 'for over 22 years');
  content = content.replace(/"foundingDate":\s*"2004",?\s*\n?/g, '');
  content = content.replace(/2004 \(22 Years Healthcare\)/g, '22+ Years Healthcare Experience');
  content = content.replace(/2004 \(21\+ Years\)/g, '22+ Years Healthcare Experience');

  // === Build script patterns ===
  content = content.replace(/founded:\s*'2004'/g, "yearsExperience: '22+'");
  content = content.replace(/'&copy; 2025 Dorys'/g, "'&copy; 2025'");
  content = content.replace(/'&copy; 2024 Dorys'/g, "'&copy; 2024'");
  content = content.replace(/'\| Dorys Janitorial'/g, "'| Cleaning Services'");

  // === JS variable ===
  content = content.replace(/window\.DorysUtils/g, 'window.SiteUtils');
  content = content.replace(/Dorys Analytics/g, 'Analytics');

  // === CSS comments ===
  // Replace "Dorys" in CSS comments only
  if (filePath.endsWith('.css')) {
    content = content.replace(/Dorys/g, function(match, offset, str) {
      const before = str.substring(Math.max(0, offset - 30), offset);
      if (before.includes('dorys') || before.includes('http')) return match;
      return '';
    });
  }

  // === Remaining standalone Dorys in text (not in URLs) ===
  // "owner of Dorys Janitorial" already handled
  // "by Dorys in" in alt texts
  content = content.replace(/by Dorys in/g, 'in');

  // Fix "Fix \"Dory's\" -> \"Dorys\"" comment in scripts
  content = content.replace(/Fix "Dory's" -> "Dorys"/g, 'Fix brand name in meta tags');

  // robots.txt
  content = content.replace(/# Robots\.txt for Dorys Janitorial Cleaning Services/g, '# Robots.txt for Janitorial Cleaning Services');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalChanges++;
  }
}

console.log(`Total files updated: ${totalChanges}`);
