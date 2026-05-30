/* Generate the runnable workflow script with the 229-city input inlined,
   so it needs no args and no filesystem access at run time. */
const fs = require("fs");
const INPUT = fs.readFileSync("scripts/location-workflow-input.json", "utf8");

const script = `export const meta = {
  name: 'location-uniqueness',
  description: 'Generate unique local-context prose for 229 duplicate MA location pages',
  phases: [{ title: 'Write', detail: 'one agent per city, unique 3-paragraph local context' }],
}

const INPUT = ${INPUT}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    paras: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: { type: 'string', minLength: 60 },
      description: 'Exactly 3 paragraphs of plain text (no HTML, no emoji), ~65-85 words each',
    },
  },
  required: ['paras'],
}

function prompt(c) {
  const nearby = (c.nearby || []).join(', ') || 'neighboring Massachusetts towns'
  return [
    'You are writing the "Local Context" section for a healthcare facility cleaning company\\'s',
    'city landing page. Company: Dory\\'s Cleaning Services Inc. — 22+ years clinical experience,',
    'CDC/OSHA compliant, \\$2M insured, provides written documentation of every clean.',
    '',
    'CITY: ' + c.name + ', Massachusetts  (' + c.county + ' County)',
    'NEARBY TOWNS (real): ' + nearby,
    'OPENING ANGLE for THIS page: ' + c.angle,
    '',
    'Write EXACTLY 3 short paragraphs (~65-85 words each) of unique, professional, clinical-tone',
    'prose for this specific city. Requirements:',
    '- Open with the assigned angle so this page reads differently from other cities.',
    '- Weave in the real county (' + c.county + ' County) and at least TWO of the nearby towns.',
    '- Reference relevant facility types (medical offices, specialty clinics, ambulatory/outpatient',
    '  centers, rehab & nursing facilities, healthcare admin offices) as fits the angle.',
    '- You MAY cite the company facts above. You MAY speak about the county/region healthcare',
    '  landscape in GENERAL terms.',
    '- DO NOT invent or name specific hospitals, clinics, addresses, statistics, or population',
    '  numbers. Never claim a named institution is located in this town. No fabricated facts.',
    '- Vary sentence structure and rhythm. Do not start every sentence with the city name.',
    '- No emojis, no markdown, no headings, no lists. Plain sentences only.',
    'Return ONLY the 3 paragraphs.',
  ].join('\\n')
}

const results = await pipeline(
  INPUT,
  (c) => agent(prompt(c), { label: 'write:' + c.slug, phase: 'Write', schema: SCHEMA })
           .then(r => ({ slug: c.slug, paras: r.paras }))
)

return results.filter(Boolean)
`;

fs.writeFileSync("scripts/location-uniqueness.workflow.js", script);
console.log("wrote scripts/location-uniqueness.workflow.js (" + script.length + " bytes, " + JSON.parse(INPUT).length + " cities)");
