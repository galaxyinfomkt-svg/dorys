/**
 * Diversify location page content to avoid duplicate content penalty
 * Add unique elements per city: county/region facts, neighborhood mentions, varied phrasing
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function slugToName(slug) {
  return slug.split('-').map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Load city data with county info
let cityData = [];
try { cityData = require(path.join(rootDir, 'new-cities-data.js')); } catch(e) {}
const cityMap = {};
cityData.forEach(c => { cityMap[c.slug + '-ma'] = c; });

// Original 101 cities county map (best estimates)
const originalCityCounties = {
  'acton-ma': 'Middlesex', 'arlington-heights-ma': 'Middlesex', 'ashland-ma': 'Middlesex',
  'auburn-ma': 'Worcester', 'auburndale-ma': 'Middlesex', 'ayer-ma': 'Middlesex',
  'babson-park-ma': 'Norfolk', 'bedford-ma': 'Middlesex', 'bellingham-ma': 'Norfolk',
  'belmont-ma': 'Middlesex', 'berlin-ma': 'Worcester', 'bolton-ma': 'Worcester',
  'boxborough-ma': 'Middlesex', 'boylston-ma': 'Worcester', 'carlisle-ma': 'Middlesex',
  'chelmsford-ma': 'Middlesex', 'cherry-valley-ma': 'Worcester', 'chestnut-hill-ma': 'Middlesex',
  'clinton-ma': 'Worcester', 'concord-ma': 'Middlesex', 'devens-ma': 'Worcester',
  'dover-ma': 'Norfolk', 'east-princeton-ma': 'Worcester', 'fayville-ma': 'Worcester',
  'framingham-ma': 'Middlesex', 'franklin-ma': 'Norfolk', 'grafton-ma': 'Worcester',
  'groton-ma': 'Middlesex', 'hanscom-afb-ma': 'Middlesex', 'harvard-ma': 'Worcester',
  'holden-ma': 'Worcester', 'holliston-ma': 'Middlesex', 'hopedale-ma': 'Worcester',
  'hopkinton-ma': 'Middlesex', 'hudson-ma': 'Middlesex', 'jefferson-ma': 'Worcester',
  'lancaster-ma': 'Worcester', 'leominster-ma': 'Worcester', 'lexington-ma': 'Middlesex',
  'lincoln-ma': 'Middlesex', 'linwood-ma': 'Worcester', 'littleton-ma': 'Middlesex',
  'lunenburg-ma': 'Worcester', 'marlborough-ma': 'Middlesex', 'maynard-ma': 'Middlesex',
  'medfield-ma': 'Norfolk', 'medway-ma': 'Norfolk', 'mendon-ma': 'Worcester',
  'milford-ma': 'Worcester', 'millbury-ma': 'Worcester', 'millis-ma': 'Norfolk',
  'natick-ma': 'Middlesex', 'needham-heights-ma': 'Norfolk', 'needham-ma': 'Norfolk',
  'newton-center-ma': 'Middlesex', 'newton-highlands-ma': 'Middlesex',
  'newton-lower-falls-ma': 'Middlesex', 'newton-ma': 'Middlesex',
  'newton-upper-falls-ma': 'Middlesex', 'newtonville-ma': 'Middlesex',
  'nonantum-ma': 'Middlesex', 'norfolk-ma': 'Norfolk', 'north-grafton-ma': 'Worcester',
  'north-uxbridge-ma': 'Worcester', 'north-waltham-ma': 'Middlesex',
  'northborough-ma': 'Worcester', 'northbridge-ma': 'Worcester', 'nutting-lake-ma': 'Middlesex',
  'paxton-ma': 'Worcester', 'princeton-ma': 'Worcester', 'readville-ma': 'Suffolk',
  'sherborn-ma': 'Middlesex', 'shirley-ma': 'Middlesex', 'shrewsbury-ma': 'Worcester',
  'south-grafton-ma': 'Worcester', 'south-lancaster-ma': 'Worcester', 'southborough-ma': 'Worcester',
  'sterling-ma': 'Worcester', 'still-river-ma': 'Worcester', 'stow-ma': 'Middlesex',
  'sudbury-ma': 'Middlesex', 'sutton-ma': 'Worcester', 'upton-ma': 'Worcester',
  'village-of-nagog-woods-ma': 'Middlesex', 'waban-ma': 'Middlesex', 'waltham-ma': 'Middlesex',
  'waverley-ma': 'Middlesex', 'wayland-ma': 'Middlesex', 'wellesley-hills-ma': 'Norfolk',
  'wellesley-ma': 'Norfolk', 'west-boylston-ma': 'Worcester', 'west-groton-ma': 'Middlesex',
  'west-millbury-ma': 'Worcester', 'west-newton-ma': 'Middlesex', 'westborough-ma': 'Worcester',
  'westford-ma': 'Middlesex', 'weston-ma': 'Middlesex', 'westwood-ma': 'Norfolk',
  'whitinsville-ma': 'Worcester', 'woodville-ma': 'Worcester', 'worcester-ma': 'Worcester'
};

// County-specific unique facts to vary content
const countyFacts = {
  'Suffolk': {
    hospitals: 'Massachusetts General Hospital, Brigham and Women\'s Hospital, Boston Medical Center, Tufts Medical Center, and Beth Israel Deaconess Medical Center',
    region: 'Greater Boston metro area',
    note: 'home to one of the densest concentrations of healthcare facilities in the United States, including world-class teaching hospitals affiliated with Harvard Medical School and Tufts University School of Medicine'
  },
  'Middlesex': {
    hospitals: 'Mount Auburn Hospital, Cambridge Health Alliance, Lahey Hospital & Medical Center, Newton-Wellesley Hospital, and Emerson Hospital',
    region: 'Middlesex County corridor',
    note: 'the most populous county in Massachusetts and a major hub for biotech, life sciences, and clinical research facilities'
  },
  'Worcester': {
    hospitals: 'UMass Memorial Medical Center, Saint Vincent Hospital, Heywood Hospital, Milford Regional Medical Center, and HealthAlliance-Clinton Hospital',
    region: 'Central Massachusetts region',
    note: 'a major medical hub with UMass Chan Medical School and one of the largest hospital networks in New England'
  },
  'Norfolk': {
    hospitals: 'Beth Israel Deaconess Hospital-Milton, South Shore Hospital, Norwood Hospital, and Brigham and Women\'s Faulkner Hospital',
    region: 'south of Boston metro',
    note: 'home to multiple healthcare campuses serving the Boston-South Shore corridor'
  },
  'Essex': {
    hospitals: 'Beverly Hospital, Lawrence General Hospital, Holy Family Hospital, Anna Jaques Hospital, and Salem Hospital (Mass General Brigham)',
    region: 'North Shore region',
    note: 'a major North Shore healthcare network serving coastal communities from Boston to the New Hampshire border'
  },
  'Bristol': {
    hospitals: 'Saint Anne\'s Hospital, Charlton Memorial Hospital (Southcoast Health), Morton Hospital, and St. Luke\'s Hospital',
    region: 'Southcoast Massachusetts',
    note: 'served by the Southcoast Health network and Steward Health Care facilities'
  },
  'Plymouth': {
    hospitals: 'South Shore Hospital, Beth Israel Deaconess Hospital-Plymouth, Brockton Hospital, and Tobey Hospital',
    region: 'South Shore region',
    note: 'a growing healthcare market with major facilities serving coastal and inland communities'
  },
  'Hampden': {
    hospitals: 'Baystate Medical Center, Mercy Medical Center, Holyoke Medical Center, and Wing Hospital',
    region: 'Pioneer Valley',
    note: 'home to Baystate Health, one of the largest healthcare networks in Western Massachusetts'
  },
  'Hampshire': {
    hospitals: 'Cooley Dickinson Hospital, Holyoke Medical Center, and Baystate Mary Lane Outpatient Center',
    region: 'Pioneer Valley',
    note: 'home to UMass Amherst and Five Colleges health services networks'
  },
  'Franklin': {
    hospitals: 'Baystate Franklin Medical Center and Athol Hospital',
    region: 'Western Massachusetts',
    note: 'serving rural communities across Franklin County with regional medical centers'
  },
  'Massachusetts': {
    hospitals: 'major Boston-area teaching hospitals and regional medical centers',
    region: 'Massachusetts',
    note: 'served by the state\'s extensive network of healthcare facilities'
  }
};

const locDir = path.join(rootDir, 'locations');
const locFiles = fs.readdirSync(locDir).filter(f => f.endsWith('.html') && f !== 'index.html');

let updated = 0;

locFiles.forEach(file => {
  const filePath = path.join(locDir, file);
  let c = fs.readFileSync(filePath, 'utf8');

  // Skip if already diversified
  if (c.includes('local-context-section')) return;

  const slug = file.replace('.html', '');
  const cityName = slugToName(slug.replace(/-ma$/, ''));

  // Get county
  const cityInfo = cityMap[slug];
  const county = (cityInfo && cityInfo.county) || originalCityCounties[slug] || 'Massachusetts';
  const facts = countyFacts[county] || countyFacts['Massachusetts'];
  const zip = (cityInfo && cityInfo.zip) || '';

  // Build unique local context section
  const localContext = `
        <!-- Local Context Unique to City -->
        <section class="section local-context-section">
          <div class="container container--narrow">
            <h2 class="section__title" style="margin-bottom:1.5rem;">${cityName} Healthcare Cleaning Context</h2>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.5rem;">${cityName} is part of ${county} County, ${facts.note}. Healthcare facilities in ${cityName} operate alongside major institutions including ${facts.hospitals}, creating a competitive environment where infection control standards and operational excellence directly impact patient referrals and accreditation outcomes.</p>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.5rem;">Whether you operate a small private practice, a multi-physician group, an outpatient surgery center, or a long-term care facility in ${cityName}${zip ? ' (zip ' + zip + ')' : ''}, the same regulatory expectations apply: Massachusetts Department of Public Health licensure, OSHA workplace standards, CDC environmental cleaning guidelines, and accreditation body requirements (Joint Commission, AAAHC, CARF). Cleaning protocols must scale to your facility's risk profile while remaining cost-effective and disruption-free.</p>
            <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:0;">Dory's Cleaning Services has spent 22+ years inside the ${facts.region} healthcare environment, learning the operational rhythms that distinguish a successful clinical cleaning program from a failed one. Our team understands that environmental services in ${cityName} is not about chemicals and equipment — it is about reliability, documentation, and the quiet accountability that lets administrators sleep at night.</p>
          </div>
        </section>
`;

  // Insert after the why-choose-section
  const insertMarker = '<!-- Cross-link to all services for this city -->';
  const insertAt = c.indexOf(insertMarker);
  if (insertAt > 0) {
    c = c.substring(0, insertAt) + localContext + '\n        ' + c.substring(insertAt);
    fs.writeFileSync(filePath, c);
    updated++;
  } else {
    // Fallback: insert before primary CTA
    const altMarker = '<section class="section section--primary">';
    const altAt = c.indexOf(altMarker);
    if (altAt > 0) {
      c = c.substring(0, altAt) + localContext + '\n        ' + c.substring(altAt);
      fs.writeFileSync(filePath, c);
      updated++;
    }
  }
});

console.log('Diversified content on ' + updated + ' location pages');
