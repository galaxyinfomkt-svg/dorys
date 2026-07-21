#!/usr/bin/env node
/**
 * Remove every claim that Dory's itself is "licensed". Massachusetts does not
 * license cleaning/janitorial companies, so "we are licensed" is false (see
 * company.json _licensingNote). Insurance is the honest, equally strong signal.
 *
 * Ordered, specific replacements so grammar stays intact ("We are licensed and
 * carry" -> "We carry", not "We are carry"). Client-side uses of the word —
 * "licensed clinic", "licensed under 105 CMR", "serves licensed commercial
 * healthcare facilities" — are TRUE and deliberately left untouched: none of
 * them contain the self-claim phrases below.
 *
 *   node scripts/fix-licensed-claims.mjs [--dry]
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const ROOT = join(process.cwd(), 'data')

// Longest / most grammar-sensitive first.
const REPS = [
  ['We are fully licensed and insured', 'We are fully insured'],
  ['We are licensed and carry', 'We carry'],
  ['We are licensed and insured', 'We are insured'],
  ['Cleaning Services is licensed and carries', 'Cleaning Services carries'],
  ['is licensed and carries', 'carries'],
  ['licensed and carries $2,000,000', 'carries $2,000,000'],
  ['licensed and carry $2,000,000', 'carry $2,000,000'],
  ['Fully licensed and insured', 'Fully insured'],
  ['fully licensed and insured', 'fully insured'],
  ['Licensed and insured', 'Insured'],
  ['licensed and insured', 'insured'],
  ['licensed and $2,000,000', '$2,000,000'],
  ['Licensed, insured, and trusted', 'Insured and trusted'],
  ['Licensed &amp; Insured', 'Fully Insured'],
  ['Licensed & Insured', 'Fully Insured'],
  ['clinical experience, licensedd, ', 'clinical experience, '],
  ['licensedd,', ''],
  ['holds licensed in Massachusetts', 'is insured in Massachusetts'],
  ['>licensed</div>', '>insured</div>'],
]

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (e.endsWith('.json')) out.push(p)
  }
  return out
}

let filesChanged = 0
const counts = {}
for (const file of walk(ROOT)) {
  // never rewrite the note that explains WHY we don't claim a licence
  if (file.endsWith('company.json')) continue
  let s = readFileSync(file, 'utf8')
  const before = s
  for (const [o, n] of REPS) {
    if (s.includes(o)) {
      const c = s.split(o).length - 1
      s = s.split(o).join(n)
      counts[o] = (counts[o] || 0) + c
    }
  }
  if (s !== before) {
    JSON.parse(s) // validate before writing
    if (!DRY) writeFileSync(file, s)
    filesChanged++
  }
}

console.log(`${DRY ? 'DRY RUN — ' : ''}files changed: ${filesChanged}`)
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(4)}  ${k.slice(0, 46)}`)
}
