const fs = require('fs');
const path = require('path');

function findHtml(dir, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name).split(path.sep).join('/');
    if (e.isDirectory() && !['node_modules','.git','.vercel','scripts','build','docs'].includes(e.name)) findHtml(path.join(dir, e.name), results);
    else if (e.name.endsWith('.html')) results.push(fp);
  }
  return results;
}

const files = findHtml('.');
console.log('Scanning ' + files.length + ' HTML files...');

// Build a set of all valid paths
const validPaths = new Set();
for (const f of files) {
  // ./about.html -> /about, /about.html
  const rel = f.replace(/^\./, '');
  validPaths.add(rel);                         // /about.html
  validPaths.add(rel.replace('.html', ''));     // /about
  if (rel.endsWith('/index.html')) {
    validPaths.add(rel.replace('/index.html', '')); // /services
    validPaths.add(rel.replace('/index.html', '/')); // /services/
  }
}

let total = 0, broken = 0;
const brokenLinks = {};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Extract all href="/..." but not assets
  const re = /href="(\/(?!assets\/)[^"#?]*)"/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const href = match[1];
    if (href === '/') continue; // homepage always valid
    total++;

    // Normalize: remove trailing slash
    let check = href.endsWith('/') ? href.slice(0, -1) : href;

    if (!validPaths.has(check) && !validPaths.has(check + '.html') && !validPaths.has(href)) {
      broken++;
      if (!brokenLinks[href]) brokenLinks[href] = [];
      if (brokenLinks[href].length < 3) brokenLinks[href].push(file);
    }
  }
}

console.log('\n=== PAGE LINK CHECK ===');
console.log('Total page links checked: ' + total);
console.log('Broken page links (404): ' + broken);

const keys = Object.keys(brokenLinks).sort();
if (keys.length === 0) {
  console.log('\nALL PAGE LINKS ARE VALID! Zero 404s.');
} else {
  console.log('\nBroken links (' + keys.length + ' unique):');
  for (const k of keys) {
    console.log('  404: ' + k);
    for (const src of brokenLinks[k]) {
      console.log('       <- ' + src);
    }
  }
}

// SEO check
let missingTitle = 0, missingDesc = 0, missingH1 = 0;
for (const file of files) {
  const c = fs.readFileSync(file, 'utf8');
  if (!/<title>[^<]+<\/title>/.test(c)) missingTitle++;
  if (!/name="description"/.test(c)) missingDesc++;
  if (!/<h1[\s>]/.test(c)) missingH1++;
}
console.log('\n=== SEO CHECK ===');
console.log('Missing <title>: ' + missingTitle);
console.log('Missing meta description: ' + missingDesc);
console.log('Missing <h1>: ' + missingH1);
console.log('\nTotal: ' + files.length + ' pages');
