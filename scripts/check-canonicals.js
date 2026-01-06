const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DOMAIN = 'https://doryscleaningservices.com';

// Get all HTML files in a directory recursively
function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'scripts' && item !== 'data' && item !== 'build') {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function getExpectedCanonical(filePath) {
  let relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  if (relativePath === 'index.html') return DOMAIN + '/';
  if (relativePath.endsWith('/index.html')) return DOMAIN + '/' + relativePath.replace('/index.html', '');
  return DOMAIN + '/' + relativePath.replace('.html', '');
}

const files = getAllHtmlFiles(ROOT_DIR);
let issues = 0;

console.log('Checking canonical tags...\n');

for (const file of files) {
  if (file.includes('404.html') || file.includes('500.html')) continue;

  const content = fs.readFileSync(file, 'utf-8');
  const expected = getExpectedCanonical(file);

  // Check canonical
  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  if (!canonicalMatch) {
    console.log(`MISSING CANONICAL: ${file}`);
    issues++;
  } else {
    const actual = canonicalMatch[1];
    // Normalize (remove trailing slash except for homepage)
    const normalizedActual = actual === DOMAIN + '/' ? actual : actual.replace(/\/$/, '');
    const normalizedExpected = expected === DOMAIN + '/' ? expected : expected.replace(/\/$/, '');

    if (normalizedActual !== normalizedExpected) {
      console.log(`WRONG CANONICAL: ${path.relative(ROOT_DIR, file)}`);
      console.log(`  Expected: ${normalizedExpected}`);
      console.log(`  Got:      ${normalizedActual}`);
      issues++;
    }
  }
}

console.log(`\nTotal issues: ${issues}`);
console.log(`Files checked: ${files.length}`);
