#!/usr/bin/env node
/**
 * Bundle the five render-blocking stylesheets into one file.
 *
 * app/layout.tsx used to load critical.min.css, premium.css, service-pages.css,
 * elevate.css and mobile-fixes.css as five separate blocking requests
 * (~250 KB unminified). They are concatenated here IN THE SAME ORDER — the
 * cascade depends on it: mobile-fixes.css must stay last — minified with
 * lightningcss, and written to public/assets/css/site.min.css. The layout
 * references it with a content hash (?v=...), rewritten by this script, so the
 * immutable /assets cache can never serve a stale bundle.
 *
 * Edit the source files, then run:  npm run build:css
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { transform } from 'lightningcss'

const ROOT = process.cwd()
const DIR = join(ROOT, 'public/assets/css')
const ORDER = ['critical.min.css', 'premium.css', 'service-pages.css', 'elevate.css', 'mobile-fixes.css']

const source = ORDER.map((f) => `/* ${f} */\n${readFileSync(join(DIR, f), 'utf8')}`).join('\n')
const { code, warnings } = transform({
  filename: 'site.css',
  code: Buffer.from(source),
  minify: true,
  errorRecovery: true,
})
for (const w of warnings) console.warn(`  warn: ${w.message}`)
writeFileSync(join(DIR, 'site.min.css'), code)

const v = createHash('sha256').update(code).digest('hex').slice(0, 10)
const layoutPath = join(ROOT, 'app/layout.tsx')
const layout = readFileSync(layoutPath, 'utf8')
const next = layout.replace(/\/assets\/css\/site\.min\.css\?v=[a-z0-9]+/, `/assets/css/site.min.css?v=${v}`)
if (next === layout && !layout.includes(`site.min.css?v=${v}`)) {
  console.error('✖ app/layout.tsx has no site.min.css link to update')
  process.exit(1)
}
writeFileSync(layoutPath, next)
console.log(`site.min.css: ${Buffer.byteLength(source)} -> ${code.length} bytes, v=${v}`)
