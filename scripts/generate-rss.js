/**
 * Generate RSS feed from blog posts
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const blogDir = path.join(rootDir, 'blog');

const blogFiles = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .sort();

const items = blogFiles.map(file => {
  const fp = path.join(blogDir, file);
  const c = fs.readFileSync(fp, 'utf8');
  const slug = file.replace('.html', '');
  const url = 'https://doryscleaningservices.com/blog/' + slug;

  // Extract title and description
  const titleMatch = c.match(/<title>([^<]+)<\/title>/);
  const descMatch = c.match(/name="description"\s+content="([^"]+)"/);
  const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : 'Untitled';
  const description = descMatch ? descMatch[1].replace(/&amp;/g, '&') : '';

  // Extract pubDate
  const pubDateMatch = c.match(/"datePublished":\s*"([^"]+)"/);
  const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toUTCString() : new Date().toUTCString();

  return `    <item>
      <title>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
}).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dory's Cleaning Services Blog</title>
    <link>https://doryscleaningservices.com/blog</link>
    <atom:link href="https://doryscleaningservices.com/feed.xml" rel="self" type="application/rss+xml" />
    <description>Healthcare facility cleaning insights, infection control guides, and compliance tips for Massachusetts medical facilities.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Dory's Cleaning Services</generator>
${items}
  </channel>
</rss>`;

fs.writeFileSync(path.join(rootDir, 'feed.xml'), rss);
console.log('Generated feed.xml with ' + blogFiles.length + ' blog posts');
