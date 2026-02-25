const fs = require('fs');
const path = require('path');

function findAllHtml(dir, list = []) {
  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      if (['.git','node_modules','.vercel','.claude','scripts'].includes(entry)) return;
      findAllHtml(full, list);
    } else if (entry.endsWith('.html')) {
      list.push(full);
    }
  });
  return list;
}

const ROOT = path.resolve(__dirname, '..');
const files = findAllHtml(ROOT);
let fixed = 0;

files.forEach(fp => {
  let c = fs.readFileSync(fp, 'utf-8');
  const orig = c;

  // Fix old meta description patterns
  c = c.replace(/Residential & commercial services\. 5-star rated, background-checked staff\. Free quotes!/gi,
    'Medical office cleaning, infection control, compliance documentation. 22 years healthcare experience. $2M insured.');
  c = c.replace(/Residential &amp; commercial services/gi, 'Healthcare environmental services');
  c = c.replace(/Free quotes!?/gi, 'Schedule a facility assessment today.');
  c = c.replace(/free estimate/gi, 'healthcare assessment');
  c = c.replace(/residential\s*(&amp;|&)\s*commercial/gi, 'healthcare environmental');
  c = c.replace(/house cleaning/gi, 'healthcare sanitation');
  c = c.replace(/home cleaning/gi, 'healthcare sanitation');

  if (c !== orig) {
    fs.writeFileSync(fp, c, 'utf-8');
    fixed++;
    console.log('  Fixed: ' + path.relative(ROOT, fp));
  }
});

console.log('\nTotal fixed: ' + fixed);
