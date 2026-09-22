#!/usr/bin/env node
/**
 * Merge scripts/data/service-knowledge.json into data/services/_meta/{slug}.json.
 * The meta files carried empty highTouchZones / protocolSteps /
 * documentationDeliverables / typicalFrequency fields; this fills them (plus
 * frequencyGuide, vendorQuestions, scheduleNotes) from one reviewed source.
 *
 *   node scripts/merge-service-knowledge.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const K = JSON.parse(readFileSync(join(ROOT, 'scripts/data/service-knowledge.json'), 'utf8'))
for (const [slug, fields] of Object.entries(K)) {
  if (slug.startsWith('_')) continue
  const p = join(ROOT, 'data/services/_meta', `${slug}.json`)
  const meta = JSON.parse(readFileSync(p, 'utf8'))
  Object.assign(meta, fields)
  writeFileSync(p, JSON.stringify(meta, null, 2) + '\n')
  console.log(`merged ${slug}: ${Object.keys(fields).join(', ')}`)
}
