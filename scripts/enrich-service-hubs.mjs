#!/usr/bin/env node
/**
 * Put each service's full working knowledge on its hub page.
 *
 * Town pages show a rotating slice of data/services/_meta/{slug}.json; the hub
 * (/services/{slug}) is where the complete set lives: every high-touch zone,
 * the full protocol in order, the frequency guide, documentation and the
 * questions to ask a vendor. Inserted before the FAQ between KNOWLEDGE
 * markers, so re-running replaces the block instead of duplicating it.
 *
 *   node scripts/enrich-service-hubs.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { esc, cap, UNIVERSAL, NOUN } from './lib/town-kit.mjs'

const ROOT = process.cwd()
const META = join(ROOT, 'data/services/_meta')
const SENIOR_REHAB = new Set(['rehabilitation-clinics', 'skilled-nursing', 'assisted-living-cleaning'])
const START = '<!-- KNOWLEDGE:START -->'
const END = '<!-- KNOWLEDGE:END -->'
let n = 0
for (const f of readdirSync(META).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  const s = JSON.parse(readFileSync(join(META, f), 'utf8'))
  if (!UNIVERSAL.has(s.slug)) continue
  const hubPath = join(ROOT, 'data/services', s.slug, 'index.json')
  if (!existsSync(hubPath)) continue
  const raw = readFileSync(hubPath, 'utf8')
  const hub = JSON.parse(raw)
  const list = (items) => `<ul class="list list--check">${items.map((i) => `<li>${esc(cap(i))}</li>`).join('')}</ul>`
  const block =
    `${START}<section class="section section--alt"><div class="container container--narrow">` +
    `<h2 class="section__title">${esc(s.name)}: the complete protocol</h2>` +
    `<p>Everything below applies to every ${esc(NOUN[s.slug][0])} we clean; each town page shows the part most relevant to that visit.</p>` +
    (s.highTouchZones?.length ? `<h3>High-touch surfaces</h3>${list(s.highTouchZones)}` : '') +
    (s.protocolSteps?.length ? `<h3>How a visit runs</h3><ol class="list list--steps">${s.protocolSteps.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>` : '') +
    (s.frequencyGuide?.length ? `<h3>Frequency guide</h3>${list(s.frequencyGuide)}` : '') +
    (s.scheduleNotes?.length ? s.scheduleNotes.map((t) => `<p>${esc(t)}</p>`).join('') : '') +
    (s.documentationDeliverables?.length ? `<h3>Documentation you receive</h3>${list(s.documentationDeliverables)}` : '') +
    (s.vendorQuestions?.length ? `<h3>Questions to ask any cleaning vendor</h3>${list(s.vendorQuestions)}` : '') +
    (SENIOR_REHAB.has(s.slug)
      ? `<p><strong>Rehabilitation clinics and senior care are core specialties.</strong> How rehab clinics, nursing homes, assisted living and memory care differ, and where they are in the towns we serve: <a href="/senior-care-rehab-cleaning">Rehab &amp; Senior Care Facility Cleaning</a>.</p>`
      : '') +
    `</div></section>${END}`
  let h = hub.mainHtml
  if (h.includes(START)) h = h.slice(0, h.indexOf(START)) + block + h.slice(h.indexOf(END) + END.length)
  else {
    const at = h.indexOf('<section class="section" id="faq"')
    if (at < 0) { console.warn(`no FAQ anchor in ${s.slug}`); continue }
    h = h.slice(0, at) + block + '\n' + h.slice(at)
  }
  hub.mainHtml = h
  writeFileSync(hubPath, JSON.stringify(hub, null, raw.startsWith('{\n') ? 2 : undefined) + (raw.endsWith('\n') ? '\n' : ''))
  n++
}
console.log(`hubs enriched: ${n}`)
