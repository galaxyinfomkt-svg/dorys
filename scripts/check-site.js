/**
 * Comprehensive site checker for Dorys Cleaning Services
 * Checks all internal links, SEO tags (title, meta description, h1) across all 1,804 HTML pages.
 * Respects Vercel cleanUrls routing.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE = ['.git', 'node_modules', '.vercel', 'build', 'docs', 'data', 'html'];

// ── Collect all HTML files ──────────────────────────────────────────────────

function collectHtmlFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE.includes(entry.name) && dir === ROOT) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(collectHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

// ── Build a set of files that exist (relative to ROOT, forward slashes) ─────

function buildFileSet(files) {
  const set = new Set();
  for (const f of files) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    set.add(rel); // e.g. "about.html", "locations/boston-ma.html"
  }
  // Also add non-html assets that might be linked
  // We only care about html resolution for link checking
  return set;
}

// ── Resolve a href to expected file path(s) ─────────────────────────────────

function resolveHref(href, fileSet) {
  // Strip query string and hash
  let clean = href.split('?')[0].split('#')[0];
  if (!clean || clean === '') clean = '/';

  // Remove leading slash
  let rel = clean.startsWith('/') ? clean.slice(1) : clean;

  // Case: / -> index.html
  if (rel === '') {
    return fileSet.has('index.html');
  }

  // Case: ends with .html -> check directly
  if (rel.endsWith('.html')) {
    return fileSet.has(rel);
  }

  // Case: ends with / -> directory index
  if (rel.endsWith('/')) {
    return fileSet.has(rel + 'index.html');
  }

  // Case: Vercel cleanUrls — /about -> about.html
  if (fileSet.has(rel + '.html')) return true;

  // Also check if it's a directory with index.html
  if (fileSet.has(rel + '/index.html')) return true;

  return false;
}

// ── Extract internal hrefs from HTML content ────────────────────────────────

function extractInternalHrefs(html) {
  const hrefs = [];
  // Match href="..." or href='...'
  const regex = /href\s*=\s*["'](\/?[^"']*?)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    // Only internal links starting with /
    if (href.startsWith('/') && !href.startsWith('//')) {
      hrefs.push(href);
    }
  }
  return hrefs;
}

// ── SEO checks ──────────────────────────────────────────────────────────────

function checkSeo(html) {
  const issues = [];

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    issues.push('MISSING <title> tag');
  } else if (titleMatch[1].trim() === '') {
    issues.push('EMPTY <title> tag');
  }

  // Meta description
  const metaDescMatch = html.match(/<meta\s+[^>]*name\s*=\s*["']description["'][^>]*>/i);
  if (!metaDescMatch) {
    issues.push('MISSING meta description');
  } else {
    const contentMatch = metaDescMatch[0].match(/content\s*=\s*["']([\s\S]*?)["']/i);
    if (!contentMatch || contentMatch[1].trim() === '') {
      issues.push('EMPTY meta description');
    }
  }

  // H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match) {
    issues.push('MISSING <h1> tag');
  } else {
    // Strip HTML tags from h1 content
    const h1Text = h1Match[1].replace(/<[^>]*>/g, '').trim();
    if (h1Text === '') {
      issues.push('EMPTY <h1> tag');
    }
  }

  return issues;
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('Scanning HTML files...');
  const files = collectHtmlFiles(ROOT);
  console.log(`Found ${files.length} HTML files.\n`);

  const fileSet = buildFileSet(files);

  let totalLinks = 0;
  let brokenCount = 0;
  const brokenLinks = []; // { source, href }
  const seoIssues = [];   // { file, issues[] }

  for (const filePath of files) {
    const relSource = path.relative(ROOT, filePath).replace(/\\/g, '/');
    const html = fs.readFileSync(filePath, 'utf-8');

    // Link checking
    const hrefs = extractInternalHrefs(html);
    for (const href of hrefs) {
      totalLinks++;
      if (!resolveHref(href, fileSet)) {
        brokenCount++;
        brokenLinks.push({ source: relSource, href });
      }
    }

    // SEO checking
    const issues = checkSeo(html);
    if (issues.length > 0) {
      seoIssues.push({ file: relSource, issues });
    }
  }

  // ── Report: Broken Links ───────────────────────────────────────────────

  console.log('='.repeat(80));
  console.log('  INTERNAL LINK CHECK RESULTS');
  console.log('='.repeat(80));
  console.log(`Total internal links checked: ${totalLinks}`);
  console.log(`Total broken links: ${brokenCount}`);
  console.log();

  if (brokenLinks.length > 0) {
    // Group by href
    const byHref = {};
    for (const b of brokenLinks) {
      if (!byHref[b.href]) byHref[b.href] = [];
      byHref[b.href].push(b.source);
    }

    // Sort by number of occurrences descending
    const sorted = Object.entries(byHref).sort((a, b) => b[1].length - a[1].length);

    console.log(`Unique broken targets: ${sorted.length}`);
    console.log('-'.repeat(80));

    for (const [href, sources] of sorted) {
      console.log(`\n  BROKEN: ${href}  (${sources.length} page(s))`);
      // Show up to 5 source files
      const show = sources.slice(0, 5);
      for (const s of show) {
        console.log(`    <- ${s}`);
      }
      if (sources.length > 5) {
        console.log(`    ... and ${sources.length - 5} more`);
      }
    }

    // Group by pattern
    console.log('\n' + '='.repeat(80));
    console.log('  BROKEN LINKS GROUPED BY PATTERN');
    console.log('='.repeat(80));

    const patterns = {};
    for (const [href] of sorted) {
      // Extract pattern: first two path segments
      const parts = href.split('/').filter(Boolean);
      let pattern;
      if (parts.length === 0) pattern = '/';
      else if (parts.length === 1) pattern = '/' + parts[0];
      else pattern = '/' + parts[0] + '/' + parts[1] + '/...';
      if (!patterns[pattern]) patterns[pattern] = [];
      patterns[pattern].push(href);
    }

    const patternSorted = Object.entries(patterns).sort((a, b) => b[1].length - a[1].length);
    for (const [pattern, hrefs] of patternSorted) {
      console.log(`\n  Pattern: ${pattern}  (${hrefs.length} unique broken targets)`);
      for (const h of hrefs.slice(0, 10)) {
        console.log(`    ${h}`);
      }
      if (hrefs.length > 10) {
        console.log(`    ... and ${hrefs.length - 10} more`);
      }
    }
  } else {
    console.log('No broken internal links found!');
  }

  // ── Report: SEO Issues ─────────────────────────────────────────────────

  console.log('\n' + '='.repeat(80));
  console.log('  SEO TAG CHECK RESULTS');
  console.log('='.repeat(80));

  const missingTitle = seoIssues.filter(s => s.issues.some(i => i.includes('MISSING <title>')));
  const emptyTitle = seoIssues.filter(s => s.issues.some(i => i.includes('EMPTY <title>')));
  const missingDesc = seoIssues.filter(s => s.issues.some(i => i.includes('MISSING meta description')));
  const emptyDesc = seoIssues.filter(s => s.issues.some(i => i.includes('EMPTY meta description')));
  const missingH1 = seoIssues.filter(s => s.issues.some(i => i.includes('MISSING <h1>')));
  const emptyH1 = seoIssues.filter(s => s.issues.some(i => i.includes('EMPTY <h1>')));

  console.log(`\nPages with MISSING <title>: ${missingTitle.length}`);
  for (const s of missingTitle.slice(0, 20)) console.log(`  ${s.file}`);
  if (missingTitle.length > 20) console.log(`  ... and ${missingTitle.length - 20} more`);

  console.log(`\nPages with EMPTY <title>: ${emptyTitle.length}`);
  for (const s of emptyTitle.slice(0, 20)) console.log(`  ${s.file}`);
  if (emptyTitle.length > 20) console.log(`  ... and ${emptyTitle.length - 20} more`);

  console.log(`\nPages with MISSING meta description: ${missingDesc.length}`);
  for (const s of missingDesc.slice(0, 20)) console.log(`  ${s.file}`);
  if (missingDesc.length > 20) console.log(`  ... and ${missingDesc.length - 20} more`);

  console.log(`\nPages with EMPTY meta description: ${emptyDesc.length}`);
  for (const s of emptyDesc.slice(0, 20)) console.log(`  ${s.file}`);
  if (emptyDesc.length > 20) console.log(`  ... and ${emptyDesc.length - 20} more`);

  console.log(`\nPages with MISSING <h1>: ${missingH1.length}`);
  for (const s of missingH1.slice(0, 20)) console.log(`  ${s.file}`);
  if (missingH1.length > 20) console.log(`  ... and ${missingH1.length - 20} more`);

  console.log(`\nPages with EMPTY <h1>: ${emptyH1.length}`);
  for (const s of emptyH1.slice(0, 20)) console.log(`  ${s.file}`);
  if (emptyH1.length > 20) console.log(`  ... and ${emptyH1.length - 20} more`);

  // Summary
  const totalSeoPages = seoIssues.length;
  console.log('\n' + '='.repeat(80));
  console.log('  SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total HTML files scanned:     ${files.length}`);
  console.log(`Total internal links checked: ${totalLinks}`);
  console.log(`Broken links:                 ${brokenCount} (${Object.keys(brokenLinks.reduce((a, b) => { a[b.href] = 1; return a; }, {})).length} unique targets)`);
  console.log(`Pages with SEO issues:        ${totalSeoPages}`);
  console.log(`  - Missing title:            ${missingTitle.length}`);
  console.log(`  - Empty title:              ${emptyTitle.length}`);
  console.log(`  - Missing meta description: ${missingDesc.length}`);
  console.log(`  - Empty meta description:   ${emptyDesc.length}`);
  console.log(`  - Missing h1:               ${missingH1.length}`);
  console.log(`  - Empty h1:                 ${emptyH1.length}`);
  console.log('='.repeat(80));
}

main();
