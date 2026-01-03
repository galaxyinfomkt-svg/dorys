/**
 * Dorys Cleaning Services - Premium Service Pages Generator
 *
 * Generates high-quality, conversion-optimized landing pages
 * with rich content, images, animations, and CTAs
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// SERVICES CONFIGURATION
// ============================================================================

const SERVICES = {
  'deep-cleaning': {
    name: 'Deep Cleaning',
    slug: 'deep-cleaning',
    title: 'Deep Cleaning',
    heroTitle: 'Professional Deep Cleaning Services',
    description: 'Thorough top-to-bottom cleaning that reaches every corner of your home or business.',
    metaDescription: 'Expert deep cleaning services in {{city}}, MA. Complete sanitization for homes & businesses. 21+ years experience, licensed & insured. Free estimates!',
    keywords: 'deep cleaning {{city}} MA, house deep cleaning, move-in cleaning, move-out cleaning, professional cleaning {{city}}',
    intro: 'Transform your space with our comprehensive deep cleaning service. We go beyond surface cleaning to eliminate built-up grime, sanitize every corner, and restore your home or business to pristine condition.',
    benefits: [
      { title: 'Complete Sanitization', desc: 'Every surface thoroughly cleaned and disinfected', icon: 'shield' },
      { title: 'Hidden Areas Cleaned', desc: 'Behind appliances, inside cabinets, under furniture', icon: 'search' },
      { title: 'Allergen Removal', desc: 'Dust, mold, and allergens eliminated', icon: 'heart' },
      { title: 'Fresh Start', desc: 'Perfect for move-ins, move-outs, or seasonal refresh', icon: 'home' }
    ],
    services: [
      'Kitchen deep cleaning (inside oven, fridge, cabinets)',
      'Bathroom sanitization (grout, tile, fixtures)',
      'Baseboard and door frame detailing',
      'Light fixture and ceiling fan cleaning',
      'Window sills and track cleaning',
      'Behind and under furniture',
      'Closet organization and cleaning',
      'Air vent and exhaust cleaning'
    ],
    process: [
      { step: '1', title: 'Assessment', desc: 'We evaluate your space and identify priority areas' },
      { step: '2', title: 'Preparation', desc: 'Protect surfaces and prepare professional equipment' },
      { step: '3', title: 'Deep Clean', desc: 'Systematic top-to-bottom thorough cleaning' },
      { step: '4', title: 'Sanitize', desc: 'Disinfect all surfaces with eco-friendly products' },
      { step: '5', title: 'Inspection', desc: 'Final walkthrough to ensure perfection' }
    ],
    faqs: [
      { q: 'What is included in deep cleaning?', a: 'Our deep cleaning includes inside appliances, cabinet interiors, baseboards, light fixtures, ceiling fans, window tracks, grout scrubbing, behind furniture, and complete surface sanitization.' },
      { q: 'How long does deep cleaning take?', a: 'A typical home takes 4-8 hours depending on size and condition. Larger homes may require 6-10 hours.' },
      { q: 'How much does deep cleaning cost?', a: 'Prices range from $200-$500 for residential properties based on size and condition. Commercial quotes available.' },
      { q: 'How often should I schedule deep cleaning?', a: 'We recommend 2-4 times per year, plus before holidays, events, or when moving.' }
    ]
  },
  'carpet-cleaning': {
    name: 'Carpet Cleaning',
    slug: 'carpet-cleaning',
    title: 'Carpet Cleaning',
    heroTitle: 'Professional Carpet Cleaning Services',
    description: 'Advanced steam and dry cleaning methods for spotless, fresh carpets.',
    metaDescription: 'Professional carpet cleaning in {{city}}, MA. Hot water extraction, stain removal, pet odor treatment. 21+ years experience. Free quotes!',
    keywords: 'carpet cleaning {{city}} MA, steam cleaning, carpet stain removal, pet odor carpet cleaning',
    intro: 'Revitalize your carpets with our professional cleaning service. Using industry-leading equipment and techniques, we remove deep-seated dirt, stains, and allergens, extending the life of your carpets.',
    benefits: [
      { title: 'Deep Extraction', desc: 'Hot water extraction removes embedded dirt', icon: 'droplet' },
      { title: 'Stain Removal', desc: 'Tough stains treated and removed', icon: 'sparkle' },
      { title: 'Odor Elimination', desc: 'Pet and smoke odors neutralized', icon: 'wind' },
      { title: 'Longer Carpet Life', desc: 'Regular cleaning extends carpet lifespan', icon: 'clock' }
    ],
    services: [
      'Hot water extraction (steam cleaning)',
      'Low-moisture dry cleaning',
      'Stain treatment and removal',
      'Pet stain and odor treatment',
      'Carpet protection application',
      'High-traffic area restoration',
      'Deodorizing and sanitization',
      'Area rug cleaning'
    ],
    process: [
      { step: '1', title: 'Pre-Inspection', desc: 'Identify fiber type, stains, and problem areas' },
      { step: '2', title: 'Pre-Treatment', desc: 'Apply solutions to break down dirt and stains' },
      { step: '3', title: 'Deep Clean', desc: 'Hot water extraction or dry cleaning method' },
      { step: '4', title: 'Spot Treatment', desc: 'Special attention to stubborn stains' },
      { step: '5', title: 'Speed Dry', desc: 'Air movers to reduce drying time' }
    ],
    faqs: [
      { q: 'How long until carpets are dry?', a: 'Carpets typically dry within 6-12 hours. We use air movers to speed up drying.' },
      { q: 'Can you remove pet stains?', a: 'Yes! We specialize in pet stain and odor removal using enzyme-based treatments.' },
      { q: 'How often should carpets be cleaned?', a: 'We recommend every 12-18 months, or more often for high-traffic areas or homes with pets.' },
      { q: 'Is carpet cleaning safe for kids and pets?', a: 'Absolutely! We use eco-friendly, non-toxic cleaning solutions safe for your family.' }
    ]
  },
  'janitorial-service': {
    name: 'Janitorial Service',
    slug: 'janitorial-service',
    title: 'Janitorial Service',
    heroTitle: 'Professional Commercial Janitorial Services',
    description: 'Comprehensive commercial cleaning for offices, retail, and industrial facilities.',
    metaDescription: 'Professional janitorial services in {{city}}, MA. Office cleaning, commercial facilities, retail spaces. 21+ years experience. Free quotes!',
    keywords: 'janitorial service {{city}} MA, office cleaning, commercial cleaning, building maintenance',
    intro: 'Keep your business environment spotless and professional with our comprehensive janitorial services. We deliver reliable, consistent cleaning tailored to your facility needs.',
    benefits: [
      { title: 'Flexible Scheduling', desc: 'Daily, weekly, or monthly service options', icon: 'calendar' },
      { title: 'Trained Staff', desc: 'Background-checked, professional cleaners', icon: 'users' },
      { title: 'Custom Programs', desc: 'Services tailored to your facility', icon: 'settings' },
      { title: 'Quality Assured', desc: 'Regular inspections and feedback loops', icon: 'check' }
    ],
    services: [
      'Daily office cleaning and sanitization',
      'Floor care (vacuuming, mopping, buffing)',
      'Restroom cleaning and supplies',
      'Break room and kitchen cleaning',
      'Trash removal and recycling',
      'Window and glass cleaning',
      'Conference room preparation',
      'Common area maintenance'
    ],
    process: [
      { step: '1', title: 'Consultation', desc: 'Understand your facility needs and schedule' },
      { step: '2', title: 'Custom Plan', desc: 'Create tailored cleaning program' },
      { step: '3', title: 'Team Assignment', desc: 'Dedicated crew for your facility' },
      { step: '4', title: 'Execution', desc: 'Consistent, reliable service delivery' },
      { step: '5', title: 'Quality Check', desc: 'Regular inspections and feedback' }
    ],
    faqs: [
      { q: 'Do you offer after-hours cleaning?', a: 'Yes! We offer early morning, evening, and weekend cleaning to minimize business disruption.' },
      { q: 'What industries do you serve?', a: 'We serve offices, retail, medical facilities, schools, warehouses, and more.' },
      { q: 'Can we customize the cleaning schedule?', a: 'Absolutely! We create custom programs based on your needs - daily, weekly, or monthly.' },
      { q: 'Do you provide cleaning supplies?', a: 'Yes, we provide all cleaning supplies and equipment. We can also restock restroom supplies.' }
    ]
  },
  'general-housekeeping': {
    name: 'General Housekeeping',
    slug: 'general-housekeeping',
    title: 'General Housekeeping',
    heroTitle: 'Professional Housekeeping Services',
    description: 'Regular home cleaning to keep your living space fresh, clean, and comfortable.',
    metaDescription: 'Professional housekeeping in {{city}}, MA. Weekly, bi-weekly, monthly cleaning. 21+ years experience, trusted cleaners. Free quotes!',
    keywords: 'housekeeping {{city}} MA, house cleaning, maid service, regular cleaning service',
    intro: 'Enjoy a consistently clean home without lifting a finger. Our housekeeping service provides regular, thorough cleaning that keeps your home welcoming and comfortable.',
    benefits: [
      { title: 'Consistent Clean', desc: 'Regular schedule keeps your home spotless', icon: 'repeat' },
      { title: 'Time Freedom', desc: 'Spend weekends doing what you love', icon: 'clock' },
      { title: 'Trusted Cleaners', desc: 'Same team every visit, background-checked', icon: 'shield' },
      { title: 'Customized Service', desc: 'Focus on areas that matter most to you', icon: 'heart' }
    ],
    services: [
      'Dusting all surfaces and furniture',
      'Vacuuming and mopping floors',
      'Kitchen cleaning and sanitization',
      'Bathroom cleaning and disinfection',
      'Bed making and linen changing',
      'Trash removal',
      'General tidying and organizing',
      'Appliance exterior cleaning'
    ],
    process: [
      { step: '1', title: 'Consultation', desc: 'Discuss your needs and preferences' },
      { step: '2', title: 'Walkthrough', desc: 'Tour your home to create custom plan' },
      { step: '3', title: 'Schedule', desc: 'Set your preferred cleaning days' },
      { step: '4', title: 'Clean', desc: 'Same trusted team every visit' },
      { step: '5', title: 'Feedback', desc: 'Adjust service based on your input' }
    ],
    faqs: [
      { q: 'How often should I schedule housekeeping?', a: 'Most clients choose weekly or bi-weekly service. Monthly is also available for lighter maintenance.' },
      { q: 'Will I have the same cleaner each time?', a: 'Yes! We assign a dedicated team to your home for consistency and trust.' },
      { q: 'Do I need to be home during cleaning?', a: 'No! Many clients provide a key or code. We are fully insured and background-checked.' },
      { q: 'Can I customize what gets cleaned?', a: 'Absolutely! We tailor the service to your priorities and preferences.' }
    ]
  },
  'upholstery-cleaning': {
    name: 'Upholstery Cleaning',
    slug: 'upholstery-cleaning',
    title: 'Upholstery Cleaning',
    heroTitle: 'Professional Upholstery Cleaning Services',
    description: 'Expert cleaning for sofas, chairs, and all upholstered furniture.',
    metaDescription: 'Professional upholstery cleaning in {{city}}, MA. Sofa, chair, fabric cleaning. Stain removal, odor treatment. 21+ years experience!',
    keywords: 'upholstery cleaning {{city}} MA, sofa cleaning, furniture cleaning, fabric cleaning',
    intro: 'Restore your furniture to like-new condition with our professional upholstery cleaning. We safely clean all fabric types, removing stains, odors, and allergens.',
    benefits: [
      { title: 'Fabric Expertise', desc: 'Safe cleaning for all upholstery types', icon: 'fabric' },
      { title: 'Stain Removal', desc: 'Tough stains expertly treated', icon: 'sparkle' },
      { title: 'Odor Elimination', desc: 'Fresh, clean-smelling furniture', icon: 'wind' },
      { title: 'Extended Life', desc: 'Proper care extends furniture lifespan', icon: 'clock' }
    ],
    services: [
      'Sofa and loveseat cleaning',
      'Chair and ottoman cleaning',
      'Dining chair cleaning',
      'Mattress cleaning',
      'Stain treatment and removal',
      'Pet odor treatment',
      'Fabric protection application',
      'Leather conditioning'
    ],
    process: [
      { step: '1', title: 'Inspection', desc: 'Identify fabric type and condition' },
      { step: '2', title: 'Pre-Treatment', desc: 'Apply appropriate cleaning solutions' },
      { step: '3', title: 'Deep Clean', desc: 'Extract dirt and stains from fabric' },
      { step: '4', title: 'Spot Treat', desc: 'Focus on stubborn stains' },
      { step: '5', title: 'Protect', desc: 'Optional fabric protection application' }
    ],
    faqs: [
      { q: 'Can you clean all fabric types?', a: 'Yes! We clean cotton, linen, velvet, microfiber, leather, and more. We test each fabric first.' },
      { q: 'How long until furniture is dry?', a: 'Most upholstery dries within 4-6 hours depending on fabric type and humidity.' },
      { q: 'Can you remove pet stains?', a: 'Yes! We specialize in pet stain and odor removal using enzyme-based treatments.' },
      { q: 'Do you clean at my home?', a: 'Yes! We come to your home with all equipment. No need to move heavy furniture.' }
    ]
  }
};

// ============================================================================
// CITIES CONFIGURATION (101 cities)
// ============================================================================

const CITIES = {
  'worcester': { name: 'Worcester', slug: 'worcester-ma', county: 'Worcester County', lat: 42.2626, lng: -71.8023, zip: '01601' },
  'marlborough': { name: 'Marlborough', slug: 'marlborough-ma', county: 'Middlesex County', lat: 42.3459, lng: -71.5522, zip: '01752' },
  'framingham': { name: 'Framingham', slug: 'framingham-ma', county: 'Middlesex County', lat: 42.2793, lng: -71.4162, zip: '01701' },
  'natick': { name: 'Natick', slug: 'natick-ma', county: 'Middlesex County', lat: 42.2830, lng: -71.3468, zip: '01760' },
  'hudson': { name: 'Hudson', slug: 'hudson-ma', county: 'Middlesex County', lat: 42.3912, lng: -71.5662, zip: '01749' },
  'westborough': { name: 'Westborough', slug: 'westborough-ma', county: 'Worcester County', lat: 42.2695, lng: -71.6162, zip: '01581' },
  'shrewsbury': { name: 'Shrewsbury', slug: 'shrewsbury-ma', county: 'Worcester County', lat: 42.2959, lng: -71.7126, zip: '01545' },
  'northborough': { name: 'Northborough', slug: 'northborough-ma', county: 'Worcester County', lat: 42.3195, lng: -71.6412, zip: '01532' },
  'southborough': { name: 'Southborough', slug: 'southborough-ma', county: 'Worcester County', lat: 42.3059, lng: -71.5245, zip: '01772' },
  'grafton': { name: 'Grafton', slug: 'grafton-ma', county: 'Worcester County', lat: 42.2073, lng: -71.6859, zip: '01519' },
  'hopkinton': { name: 'Hopkinton', slug: 'hopkinton-ma', county: 'Middlesex County', lat: 42.2287, lng: -71.5226, zip: '01748' },
  'ashland': { name: 'Ashland', slug: 'ashland-ma', county: 'Middlesex County', lat: 42.2612, lng: -71.4634, zip: '01721' },
  'holliston': { name: 'Holliston', slug: 'holliston-ma', county: 'Middlesex County', lat: 42.2001, lng: -71.4245, zip: '01746' },
  'milford': { name: 'Milford', slug: 'milford-ma', county: 'Worcester County', lat: 42.1398, lng: -71.5162, zip: '01757' },
  'sudbury': { name: 'Sudbury', slug: 'sudbury-ma', county: 'Middlesex County', lat: 42.3834, lng: -71.4162, zip: '01776' },
  'wayland': { name: 'Wayland', slug: 'wayland-ma', county: 'Middlesex County', lat: 42.3626, lng: -71.3612, zip: '01778' },
  'wellesley': { name: 'Wellesley', slug: 'wellesley-ma', county: 'Norfolk County', lat: 42.2968, lng: -71.2926, zip: '02481' },
  'newton': { name: 'Newton', slug: 'newton-ma', county: 'Middlesex County', lat: 42.3370, lng: -71.2092, zip: '02458' },
  'waltham': { name: 'Waltham', slug: 'waltham-ma', county: 'Middlesex County', lat: 42.3765, lng: -71.2356, zip: '02451' },
  'lexington': { name: 'Lexington', slug: 'lexington-ma', county: 'Middlesex County', lat: 42.4473, lng: -71.2245, zip: '02420' },
  'concord': { name: 'Concord', slug: 'concord-ma', county: 'Middlesex County', lat: 42.4604, lng: -71.3489, zip: '01742' },
  'acton': { name: 'Acton', slug: 'acton-ma', county: 'Middlesex County', lat: 42.4851, lng: -71.4328, zip: '01720' },
  'maynard': { name: 'Maynard', slug: 'maynard-ma', county: 'Middlesex County', lat: 42.4334, lng: -71.4495, zip: '01754' },
  'stow': { name: 'Stow', slug: 'stow-ma', county: 'Middlesex County', lat: 42.4373, lng: -71.5051, zip: '01775' },
  'bolton': { name: 'Bolton', slug: 'bolton-ma', county: 'Worcester County', lat: 42.4334, lng: -71.6070, zip: '01740' },
  'berlin': { name: 'Berlin', slug: 'berlin-ma', county: 'Worcester County', lat: 42.3809, lng: -71.6373, zip: '01503' },
  'boylston': { name: 'Boylston', slug: 'boylston-ma', county: 'Worcester County', lat: 42.3526, lng: -71.7245, zip: '01505' },
  'holden': { name: 'Holden', slug: 'holden-ma', county: 'Worcester County', lat: 42.3526, lng: -71.8634, zip: '01520' },
  'auburn': { name: 'Auburn', slug: 'auburn-ma', county: 'Worcester County', lat: 42.1973, lng: -71.8356, zip: '01501' },
  'millbury': { name: 'Millbury', slug: 'millbury-ma', county: 'Worcester County', lat: 42.1937, lng: -71.7612, zip: '01527' },
  'oxford': { name: 'Oxford', slug: 'oxford-ma', county: 'Worcester County', lat: 42.1162, lng: -71.8695, zip: '01540' },
  'webster': { name: 'Webster', slug: 'webster-ma', county: 'Worcester County', lat: 42.0512, lng: -71.8801, zip: '01570' },
  'dudley': { name: 'Dudley', slug: 'dudley-ma', county: 'Worcester County', lat: 42.0462, lng: -71.9373, zip: '01571' },
  'sturbridge': { name: 'Sturbridge', slug: 'sturbridge-ma', county: 'Worcester County', lat: 42.1084, lng: -72.0787, zip: '01566' },
  'spencer': { name: 'Spencer', slug: 'spencer-ma', county: 'Worcester County', lat: 42.2437, lng: -71.9912, zip: '01562' },
  'leicester': { name: 'Leicester', slug: 'leicester-ma', county: 'Worcester County', lat: 42.2395, lng: -71.9084, zip: '01524' },
  'paxton': { name: 'Paxton', slug: 'paxton-ma', county: 'Worcester County', lat: 42.3109, lng: -71.9284, zip: '01612' },
  'rutland': { name: 'Rutland', slug: 'rutland-ma', county: 'Worcester County', lat: 42.3737, lng: -71.9451, zip: '01543' },
  'princeton': { name: 'Princeton', slug: 'princeton-ma', county: 'Worcester County', lat: 42.4484, lng: -71.8773, zip: '01541' },
  'sterling': { name: 'Sterling', slug: 'sterling-ma', county: 'Worcester County', lat: 42.4376, lng: -71.7612, zip: '01564' },
  'clinton': { name: 'Clinton', slug: 'clinton-ma', county: 'Worcester County', lat: 42.4168, lng: -71.6828, zip: '01510' },
  'lancaster': { name: 'Lancaster', slug: 'lancaster-ma', county: 'Worcester County', lat: 42.4551, lng: -71.6834, zip: '01523' },
  'leominster': { name: 'Leominster', slug: 'leominster-ma', county: 'Worcester County', lat: 42.5251, lng: -71.7595, zip: '01453' },
  'fitchburg': { name: 'Fitchburg', slug: 'fitchburg-ma', county: 'Worcester County', lat: 42.5834, lng: -71.8023, zip: '01420' },
  'lunenburg': { name: 'Lunenburg', slug: 'lunenburg-ma', county: 'Worcester County', lat: 42.5937, lng: -71.7262, zip: '01462' },
  'townsend': { name: 'Townsend', slug: 'townsend-ma', county: 'Middlesex County', lat: 42.6668, lng: -71.7073, zip: '01469' },
  'pepperell': { name: 'Pepperell', slug: 'pepperell-ma', county: 'Middlesex County', lat: 42.6662, lng: -71.5884, zip: '01463' },
  'groton': { name: 'Groton', slug: 'groton-ma', county: 'Middlesex County', lat: 42.6112, lng: -71.5745, zip: '01450' },
  'ayer': { name: 'Ayer', slug: 'ayer-ma', county: 'Middlesex County', lat: 42.5612, lng: -71.5912, zip: '01432' },
  'shirley': { name: 'Shirley', slug: 'shirley-ma', county: 'Middlesex County', lat: 42.5437, lng: -71.6495, zip: '01464' },
  'harvard': { name: 'Harvard', slug: 'harvard-ma', county: 'Worcester County', lat: 42.5001, lng: -71.5828, zip: '01451' },
  'littleton': { name: 'Littleton', slug: 'littleton-ma', county: 'Middlesex County', lat: 42.5459, lng: -71.4773, zip: '01460' },
  'boxborough': { name: 'Boxborough', slug: 'boxborough-ma', county: 'Middlesex County', lat: 42.4912, lng: -71.5212, zip: '01719' },
  'westford': { name: 'Westford', slug: 'westford-ma', county: 'Middlesex County', lat: 42.5790, lng: -71.4373, zip: '01886' },
  'chelmsford': { name: 'Chelmsford', slug: 'chelmsford-ma', county: 'Middlesex County', lat: 42.5998, lng: -71.3673, zip: '01824' },
  'lowell': { name: 'Lowell', slug: 'lowell-ma', county: 'Middlesex County', lat: 42.6334, lng: -71.3162, zip: '01850' },
  'tewksbury': { name: 'Tewksbury', slug: 'tewksbury-ma', county: 'Middlesex County', lat: 42.6101, lng: -71.2345, zip: '01876' },
  'billerica': { name: 'Billerica', slug: 'billerica-ma', county: 'Middlesex County', lat: 42.5584, lng: -71.2689, zip: '01821' },
  'bedford': { name: 'Bedford', slug: 'bedford-ma', county: 'Middlesex County', lat: 42.4901, lng: -71.2762, zip: '01730' },
  'burlington': { name: 'Burlington', slug: 'burlington-ma', county: 'Middlesex County', lat: 42.5048, lng: -71.1956, zip: '01803' },
  'woburn': { name: 'Woburn', slug: 'woburn-ma', county: 'Middlesex County', lat: 42.4793, lng: -71.1523, zip: '01801' },
  'winchester': { name: 'Winchester', slug: 'winchester-ma', county: 'Middlesex County', lat: 42.4526, lng: -71.1373, zip: '01890' },
  'arlington': { name: 'Arlington', slug: 'arlington-ma', county: 'Middlesex County', lat: 42.4154, lng: -71.1562, zip: '02474' },
  'belmont': { name: 'Belmont', slug: 'belmont-ma', county: 'Middlesex County', lat: 42.3959, lng: -71.1773, zip: '02478' },
  'watertown': { name: 'Watertown', slug: 'watertown-ma', county: 'Middlesex County', lat: 42.3701, lng: -71.1828, zip: '02472' },
  'cambridge': { name: 'Cambridge', slug: 'cambridge-ma', county: 'Middlesex County', lat: 42.3736, lng: -71.1097, zip: '02139' },
  'somerville': { name: 'Somerville', slug: 'somerville-ma', county: 'Middlesex County', lat: 42.3876, lng: -71.0995, zip: '02143' },
  'medford': { name: 'Medford', slug: 'medford-ma', county: 'Middlesex County', lat: 42.4184, lng: -71.1062, zip: '02155' },
  'malden': { name: 'Malden', slug: 'malden-ma', county: 'Middlesex County', lat: 42.4251, lng: -71.0662, zip: '02148' },
  'melrose': { name: 'Melrose', slug: 'melrose-ma', county: 'Middlesex County', lat: 42.4584, lng: -71.0662, zip: '02176' },
  'stoneham': { name: 'Stoneham', slug: 'stoneham-ma', county: 'Middlesex County', lat: 42.4801, lng: -71.0973, zip: '02180' },
  'reading': { name: 'Reading', slug: 'reading-ma', county: 'Middlesex County', lat: 42.5259, lng: -71.0951, zip: '01867' },
  'wakefield': { name: 'Wakefield', slug: 'wakefield-ma', county: 'Middlesex County', lat: 42.5034, lng: -71.0734, zip: '01880' },
  'wilmington': { name: 'Wilmington', slug: 'wilmington-ma', county: 'Middlesex County', lat: 42.5462, lng: -71.1734, zip: '01887' },
  'north-reading': { name: 'North Reading', slug: 'north-reading-ma', county: 'Middlesex County', lat: 42.5751, lng: -71.0784, zip: '01864' },
  'andover': { name: 'Andover', slug: 'andover-ma', county: 'Essex County', lat: 42.6584, lng: -71.1373, zip: '01810' },
  'needham': { name: 'Needham', slug: 'needham-ma', county: 'Norfolk County', lat: 42.2793, lng: -71.2373, zip: '02492' },
  'dover': { name: 'Dover', slug: 'dover-ma', county: 'Norfolk County', lat: 42.2459, lng: -71.2834, zip: '02030' },
  'sherborn': { name: 'Sherborn', slug: 'sherborn-ma', county: 'Middlesex County', lat: 42.2390, lng: -71.3695, zip: '01770' },
  'medfield': { name: 'Medfield', slug: 'medfield-ma', county: 'Norfolk County', lat: 42.1873, lng: -71.3062, zip: '02052' },
  'millis': { name: 'Millis', slug: 'millis-ma', county: 'Norfolk County', lat: 42.1673, lng: -71.3573, zip: '02054' },
  'medway': { name: 'Medway', slug: 'medway-ma', county: 'Norfolk County', lat: 42.1418, lng: -71.3962, zip: '02053' },
  'franklin': { name: 'Franklin', slug: 'franklin-ma', county: 'Norfolk County', lat: 42.0834, lng: -71.3962, zip: '02038' },
  'bellingham': { name: 'Bellingham', slug: 'bellingham-ma', county: 'Norfolk County', lat: 42.0868, lng: -71.4773, zip: '02019' },
  'mendon': { name: 'Mendon', slug: 'mendon-ma', county: 'Worcester County', lat: 42.1051, lng: -71.5523, zip: '01756' },
  'uxbridge': { name: 'Uxbridge', slug: 'uxbridge-ma', county: 'Worcester County', lat: 42.0773, lng: -71.6295, zip: '01569' },
  'northbridge': { name: 'Northbridge', slug: 'northbridge-ma', county: 'Worcester County', lat: 42.1312, lng: -71.6495, zip: '01534' },
  'upton': { name: 'Upton', slug: 'upton-ma', county: 'Worcester County', lat: 42.1740, lng: -71.6023, zip: '01568' },
  'hopedale': { name: 'Hopedale', slug: 'hopedale-ma', county: 'Worcester County', lat: 42.1290, lng: -71.5412, zip: '01747' },
  'norfolk': { name: 'Norfolk', slug: 'norfolk-ma', county: 'Norfolk County', lat: 42.1195, lng: -71.3284, zip: '02056' },
  'wrentham': { name: 'Wrentham', slug: 'wrentham-ma', county: 'Norfolk County', lat: 42.0668, lng: -71.3284, zip: '02093' },
  'foxborough': { name: 'Foxborough', slug: 'foxborough-ma', county: 'Norfolk County', lat: 42.0651, lng: -71.2478, zip: '02035' },
  'mansfield': { name: 'Mansfield', slug: 'mansfield-ma', county: 'Bristol County', lat: 42.0334, lng: -71.2195, zip: '02048' },
  'norton': { name: 'Norton', slug: 'norton-ma', county: 'Bristol County', lat: 41.9668, lng: -71.1862, zip: '02766' },
  'chestnut-hill': { name: 'Chestnut Hill', slug: 'chestnut-hill-ma', county: 'Middlesex County', lat: 42.3223, lng: -71.1662, zip: '02467' },
  'brookline': { name: 'Brookline', slug: 'brookline-ma', county: 'Norfolk County', lat: 42.3318, lng: -71.1212, zip: '02445' },
  'boston': { name: 'Boston', slug: 'boston-ma', county: 'Suffolk County', lat: 42.3601, lng: -71.0589, zip: '02108' },
  'quincy': { name: 'Quincy', slug: 'quincy-ma', county: 'Norfolk County', lat: 42.2529, lng: -71.0023, zip: '02169' },
  'braintree': { name: 'Braintree', slug: 'braintree-ma', county: 'Norfolk County', lat: 42.2037, lng: -71.0012, zip: '02184' },
  'weymouth': { name: 'Weymouth', slug: 'weymouth-ma', county: 'Norfolk County', lat: 42.2212, lng: -70.9395, zip: '02188' }
};

// Get nearby cities for a given city
function getNearbyCities(currentCityKey) {
  const allCityKeys = Object.keys(CITIES);
  const currentIndex = allCityKeys.indexOf(currentCityKey);
  const nearby = [];

  // Get 4 nearby cities
  for (let i = 1; i <= 4; i++) {
    const nextIndex = (currentIndex + i) % allCityKeys.length;
    nearby.push(allCityKeys[nextIndex]);
  }

  return nearby;
}

// Generate icons SVG
function getIcon(type) {
  const icons = {
    shield: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
    droplet: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
    wind: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 2C9.64 2 7.25 4.11 6.83 6.87 4.61 7.41 3 9.36 3 11.67 3 14.58 5.39 17 8.25 17h8.5c2.07 0 3.75-1.68 3.75-3.75 0-1.89-1.41-3.46-3.24-3.7C16.83 6.36 14.93 4 12.5 4V2z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>',
    fabric: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>'
  };
  return icons[type] || icons.check;
}

// ============================================================================
// PAGE GENERATOR
// ============================================================================

function generatePage(serviceKey, cityKey) {
  const service = SERVICES[serviceKey];
  const city = CITIES[cityKey];
  const nearbyCities = getNearbyCities(cityKey);

  // Generate benefits HTML
  const benefitsHTML = service.benefits.map((b, i) => `
          <div class="benefit-card animate-on-scroll animate-fade-up${i > 0 ? ' animate-delay-' + (i * 100) : ''}">
            <div class="benefit-card__icon">
              ${getIcon(b.icon)}
            </div>
            <h3 class="benefit-card__title">${b.title}</h3>
            <p class="benefit-card__text">${b.desc}</p>
          </div>`).join('');

  // Generate services list HTML
  const servicesHTML = service.services.map(s => `
                <li>${s}</li>`).join('');

  // Generate process HTML
  const processHTML = service.process.map((p, i) => `
          <div class="process-step animate-on-scroll animate-fade-up${i > 0 ? ' animate-delay-' + (i * 100) : ''}">
            <div class="process-step__number">${p.step}</div>
            <h3 class="process-step__title">${p.title}</h3>
            <p class="process-step__text">${p.desc}</p>
          </div>`).join('');

  // Generate FAQ HTML
  const faqsHTML = service.faqs.map(f => `
          <div class="accordion__item">
            <button class="accordion__header" aria-expanded="false">
              ${f.q.replace(/\{\{city\}\}/g, city.name)}
              <svg class="accordion__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            <div class="accordion__content">
              <div class="accordion__body">
                <p>${f.a.replace(/\{\{city\}\}/g, city.name)}</p>
              </div>
            </div>
          </div>`).join('');

  // Generate FAQ Schema
  const faqSchema = service.faqs.map(f => ({
    "@type": "Question",
    "name": f.q.replace(/\{\{city\}\}/g, city.name),
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a.replace(/\{\{city\}\}/g, city.name)
    }
  }));

  // Generate nearby cities HTML
  const nearbyCitiesHTML = nearbyCities.map(key => {
    const c = CITIES[key];
    return `              <a href="/services/${service.slug}/${c.slug}" class="nearby-cities__link">${c.name}</a>`;
  }).join('\n');

  const metaDescription = service.metaDescription.replace(/\{\{city\}\}/g, city.name);
  const keywords = service.keywords.replace(/\{\{city\}\}/g, city.name);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${service.title} in ${city.name}, MA | Professional Cleaning | Dorys Cleaning</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://doryscleaningservices.com/services/${service.slug}/${city.slug}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://doryscleaningservices.com/services/${service.slug}/${city.slug}">
  <meta property="og:title" content="${service.heroTitle} in ${city.name}, MA | Dorys Cleaning">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:image" content="https://doryscleaningservices.com/assets/images/services/${service.slug}.jpg">
  <meta property="og:site_name" content="Dorys Janitorial Cleaning Services">
  <meta property="og:locale" content="en_US">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${service.title} in ${city.name}, MA | Dorys Cleaning">
  <meta name="twitter:description" content="${metaDescription}">
  <meta name="twitter:image" content="https://doryscleaningservices.com/assets/images/services/${service.slug}.jpg">

  <!-- Geo Tags -->
  <meta name="geo.region" content="US-MA">
  <meta name="geo.placename" content="${city.name}, Massachusetts">
  <meta name="geo.position" content="${city.lat};${city.lng}">
  <meta name="ICBM" content="${city.lat}, ${city.lng}">
  <meta name="author" content="Dorys Janitorial Cleaning Services Inc.">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/footer.css">
  <link rel="stylesheet" href="/assets/css/hero.css">
  <link rel="stylesheet" href="/assets/css/animations.css">
  <link rel="stylesheet" href="/assets/css/lightbox.css">
  <link rel="stylesheet" href="/assets/css/responsive.css">
  <link rel="stylesheet" href="/assets/css/premium.css">
  <link rel="stylesheet" href="/assets/css/premium-v2.css">

  <!-- Schema.org LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Dorys Janitorial - ${service.title} ${city.name}",
    "image": "https://doryscleaningservices.com/assets/images/services/${service.slug}.jpg",
    "url": "https://doryscleaningservices.com/services/${service.slug}/${city.slug}",
    "telephone": "+1-978-307-8107",
    "email": "contact@doryscleaningservices.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "${city.name}",
      "addressRegion": "MA",
      "postalCode": "${city.zip}",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${city.lat},
      "longitude": ${city.lng}
    },
    "areaServed": {
      "@type": "City",
      "name": "${city.name}",
      "containedInPlace": {"@type": "State", "name": "Massachusetts"}
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "05:00",
      "closes": "19:00"
    }],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "150"
    }
  }
  </script>

  <!-- Schema.org FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ${JSON.stringify(faqSchema)}
  }
  </script>

  <!-- Schema.org BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://doryscleaningservices.com/"},
      {"@type": "ListItem", "position": 2, "name": "Services", "item": "https://doryscleaningservices.com/services/"},
      {"@type": "ListItem", "position": 3, "name": "${service.title}", "item": "https://doryscleaningservices.com/services/${service.slug}/"},
      {"@type": "ListItem", "position": 4, "name": "${city.name}", "item": "https://doryscleaningservices.com/services/${service.slug}/${city.slug}"}
    ]
  }
  </script>
</head>
<body>
  <!-- Skip Link -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="container">
      <div class="top-bar__contact">
        <a href="tel:+19783078107" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span>(978) 307-8107</span>
        </a>
        <a href="mailto:contact@doryscleaningservices.com" class="top-bar__item hide-mobile">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>contact@doryscleaningservices.com</span>
        </a>
        <span class="top-bar__item hide-mobile">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          <span>Mon-Sat: 5AM - 7PM</span>
        </span>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <div class="container header__wrapper">
      <a href="/" class="header__logo">
        <img src="/assets/images/logo/logo-original.jpg" alt="Dorys Janitorial Cleaning Services" width="180" height="60">
      </a>
      <nav class="header__nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
          <li class="nav-item has-dropdown">
            <a href="/services/" class="nav-link nav-link--active">Services <svg class="nav-link__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg></a>
            <div class="nav-dropdown">
              <a href="/services/janitorial-service/" class="nav-dropdown__link${serviceKey === 'janitorial-service' ? ' nav-dropdown__link--active' : ''}">Janitorial Service</a>
              <a href="/services/deep-cleaning/" class="nav-dropdown__link${serviceKey === 'deep-cleaning' ? ' nav-dropdown__link--active' : ''}">Deep Cleaning</a>
              <a href="/services/upholstery-cleaning/" class="nav-dropdown__link${serviceKey === 'upholstery-cleaning' ? ' nav-dropdown__link--active' : ''}">Upholstery Cleaning</a>
              <a href="/services/carpet-cleaning/" class="nav-dropdown__link${serviceKey === 'carpet-cleaning' ? ' nav-dropdown__link--active' : ''}">Carpet Cleaning</a>
              <a href="/services/general-housekeeping/" class="nav-dropdown__link${serviceKey === 'general-housekeeping' ? ' nav-dropdown__link--active' : ''}">General Housekeeping</a>
            </div>
          </li>
          <li class="nav-item has-dropdown">
            <a href="/locations/" class="nav-link">Service Areas <svg class="nav-link__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg></a>
            <div class="nav-dropdown">
              <a href="/locations/worcester-ma" class="nav-dropdown__link">Worcester</a>
              <a href="/locations/framingham-ma" class="nav-dropdown__link">Framingham</a>
              <a href="/locations/marlborough-ma" class="nav-dropdown__link">Marlborough</a>
              <a href="/locations/natick-ma" class="nav-dropdown__link">Natick</a>
              <a href="/locations/" class="nav-dropdown__link text-primary font-semibold">View All Cities</a>
            </div>
          </li>
          <li class="nav-item"><a href="/#about" class="nav-link">About Us</a></li>
          <li class="nav-item"><a href="/#reviews" class="nav-link">Reviews</a></li>
          <li class="nav-item"><a href="/#contact" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <a href="tel:+19783078107" class="btn btn--primary header__cta hide-mobile">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        Call Now
      </a>
      <button class="header__toggle" aria-label="Toggle menu">
        <span class="header__toggle-icon"><span></span><span></span><span></span></span>
      </button>
    </div>
  </header>

  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol class="breadcrumb__list">
        <li class="breadcrumb__item"><a href="/" class="breadcrumb__link">Home</a></li>
        <li class="breadcrumb__item"><a href="/services/" class="breadcrumb__link">Services</a></li>
        <li class="breadcrumb__item"><a href="/services/${service.slug}/" class="breadcrumb__link">${service.title}</a></li>
        <li class="breadcrumb__item" aria-current="page">${city.name}, MA</li>
      </ol>
    </div>
  </nav>

  <main id="main-content">
    <!-- Hero Section -->
    <section class="hero hero--service-city">
      <div class="hero__background">
        <img src="/assets/images/services/${service.slug}-hero.jpg" alt="${service.heroTitle} in ${city.name}, MA" loading="eager" onerror="this.src='/assets/images/services/${service.slug}.jpg'">
        <div class="hero__overlay hero__overlay--gradient"></div>
      </div>
      <div class="container">
        <div class="hero__content hero__content--left animate-on-scroll animate-fade-up">
          <span class="hero__badge">Serving ${city.name} & ${city.county}</span>
          <h1 class="hero__title">${service.heroTitle} in ${city.name}, MA</h1>
          <p class="hero__subtitle">${service.intro}</p>

          <div class="hero__trust-row">
            <div class="hero__trust-item">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>21+ Years Experience</span>
            </div>
            <div class="hero__trust-item">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              <span>Licensed & Insured</span>
            </div>
            <div class="hero__trust-item">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <span>5-Star Rated</span>
            </div>
          </div>

          <div class="hero__ctas">
            <a href="tel:+19783078107" class="btn btn--accent btn--xl btn--pulse">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              Call Now: (978) 307-8107
            </a>
            <a href="/#contact" class="btn btn--white btn--xl">
              Get Free Estimate
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="section section--light">
      <div class="container">
        <div class="section__header section__header--center">
          <span class="section__badge">Why Choose Us</span>
          <h2 class="section__title">Benefits of Our ${service.title} Service</h2>
          <p class="section__description">Professional results that make a difference in your ${city.name} home or business.</p>
        </div>

        <div class="benefits-grid">
${benefitsHTML}
        </div>
      </div>
    </section>

    <!-- Service Image Divider -->
    <section class="image-divider">
      <img src="/assets/images/services/${service.slug}-work.jpg" alt="Professional ${service.name.toLowerCase()} service in progress" loading="lazy" onerror="this.src='/assets/images/services/${service.slug}.jpg'">
      <div class="image-divider__overlay">
        <div class="container">
          <div class="image-divider__content animate-on-scroll animate-fade-up">
            <h2 class="image-divider__title">Trusted by ${city.name} Families & Businesses</h2>
            <p class="image-divider__text">Over 21 years of professional cleaning experience in Massachusetts</p>
            <a href="tel:+19783078107" class="btn btn--white btn--lg">Get Your Free Quote</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Included -->
    <section class="section">
      <div class="container">
        <div class="grid grid--2" style="gap: 3rem; align-items: center;">
          <div class="animate-on-scroll animate-fade-right">
            <span class="section__badge">Complete Service</span>
            <h2 class="section__title--left">What's Included in Our ${city.name} ${service.title}</h2>
            <p class="mb-lg">${service.description} Here's what you can expect from our professional team:</p>

            <ul class="list list--check mb-xl">
${servicesHTML}
            </ul>

            <div class="btn-group">
              <a href="tel:+19783078107" class="btn btn--primary btn--lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Call (978) 307-8107
              </a>
              <a href="/#contact" class="btn btn--secondary btn--lg">Request Quote</a>
            </div>
          </div>

          <div class="animate-on-scroll animate-fade-left animate-delay-200">
            <div class="image-card">
              <img src="/assets/images/services/${service.slug}-detail.jpg" alt="${service.title} service details in ${city.name}" loading="lazy" class="image-card__img" onerror="this.src='/assets/images/services/${service.slug}.jpg'">
              <div class="image-card__badge">
                <span>21+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="section section--gradient">
      <div class="container">
        <div class="section__header section__header--center">
          <span class="section__badge">Our Process</span>
          <h2 class="section__title">How Our ${service.title} Works</h2>
          <p class="section__description">A systematic approach that delivers consistent, exceptional results.</p>
        </div>

        <div class="process-grid">
${processHTML}
        </div>
      </div>
    </section>

    <!-- Trust Section -->
    <section class="section">
      <div class="container">
        <div class="grid grid--2" style="gap: 3rem; align-items: center;">
          <div class="animate-on-scroll animate-fade-right">
            <div class="image-gallery">
              <img src="/assets/images/services/${service.slug}-gallery-1.jpg" alt="${service.name} before and after" loading="lazy" class="image-gallery__main" onerror="this.src='/assets/images/services/${service.slug}.jpg'">
            </div>
          </div>

          <div class="animate-on-scroll animate-fade-left animate-delay-200">
            <span class="section__badge">Why ${city.name} Trusts Us</span>
            <h2 class="section__title--left">The Dorys Difference</h2>
            <p class="mb-lg">When you choose Dorys for ${service.name.toLowerCase()} in ${city.name}, you're choosing a company with a proven track record of excellence.</p>

            <div class="trust-facts">
              <div class="trust-fact">
                <div class="trust-fact__icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                </div>
                <div class="trust-fact__content">
                  <strong>21+ Years Experience</strong>
                  <p>Serving Massachusetts since 2004</p>
                </div>
              </div>
              <div class="trust-fact">
                <div class="trust-fact__icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                </div>
                <div class="trust-fact__content">
                  <strong>$2M Insurance Coverage</strong>
                  <p>MA License HIC #213341</p>
                </div>
              </div>
              <div class="trust-fact">
                <div class="trust-fact__icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </div>
                <div class="trust-fact__content">
                  <strong>5-Star Rated</strong>
                  <p>150+ verified reviews</p>
                </div>
              </div>
              <div class="trust-fact">
                <div class="trust-fact__icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <div class="trust-fact__content">
                  <strong>Eco-Friendly Products</strong>
                  <p>Safe for family & pets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section section--alt">
      <div class="container container--narrow">
        <div class="section__header section__header--center">
          <span class="section__badge">Common Questions</span>
          <h2 class="section__title">${service.title} FAQ for ${city.name}</h2>
          <p class="section__description">Answers to frequently asked questions about our services.</p>
        </div>

        <div class="accordion">
${faqsHTML}
        </div>
      </div>
    </section>

    <!-- Service Areas Section -->
    <section class="section">
      <div class="container">
        <div class="section__header section__header--center">
          <span class="section__badge">Service Coverage</span>
          <h2 class="section__title">${service.title} Throughout ${city.county}</h2>
          <p class="section__description">We proudly serve ${city.name} and all surrounding communities.</p>
        </div>

        <div class="nearby-cities">
          <div class="nearby-cities__featured">
            <div class="nearby-city-card nearby-city-card--active">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>${city.name}</span>
            </div>
          </div>
          <div class="nearby-cities__list">
${nearbyCitiesHTML}
          </div>
        </div>

        <div class="text-center mt-xl">
          <a href="/locations/" class="btn btn--secondary btn--lg">View All 100+ Service Areas</a>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="section--cta">
      <div class="container">
        <div class="cta-box--large animate-on-scroll animate-fade-up">
          <span class="cta-box__badge">Free Estimate</span>
          <h2 class="cta-box__title">Ready for Professional ${service.title} in ${city.name}?</h2>
          <p class="cta-box__text">Get your free, no-obligation quote today. Our ${city.name} team is ready to transform your space!</p>
          <div class="cta-box__actions">
            <a href="tel:+19783078107" class="btn btn--accent btn--xl btn--pulse">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              Call Now: (978) 307-8107
            </a>
            <a href="/#contact" class="btn btn--white btn--xl">Request Free Quote Online</a>
          </div>
          <div class="cta-box__trust">
            <span>Licensed (HIC #213341)</span>
            <span>-</span>
            <span>$2M Insured</span>
            <span>-</span>
            <span>21+ Years Experience</span>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <!-- Footer CTA -->
      <div class="footer__cta">
        <h2 class="footer__cta-title">Get Your Free Quote Today!</h2>
        <p class="footer__cta-text">Professional cleaning services with 21+ years of experience. Licensed, insured, and ready to make your space shine.</p>
        <div class="footer__cta-buttons">
          <a href="/#contact" class="btn btn--white btn--lg">Request Free Quote</a>
          <a href="tel:+19783078107" class="btn btn--outline-light btn--lg">Call (978) 307-8107</a>
        </div>
      </div>

      <!-- Footer Grid -->
      <div class="footer__grid">
        <!-- Brand Column -->
        <div class="footer__col footer__brand">
          <a href="/" class="footer__logo">
            <img src="/assets/images/logo/logo-original.jpg" alt="Dorys Janitorial Cleaning Services" class="footer__logo-img" width="180" height="60">
          </a>
          <p class="footer__description">Professional janitorial and cleaning services in Massachusetts since 2004. We deliver exceptional results with attention to detail and clear communication.</p>

          <div class="footer__trust">
            <div class="footer__trust-item">
              <svg class="footer__trust-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>Licensed & Insured</span>
            </div>
            <div class="footer__trust-item">
              <svg class="footer__trust-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <span>5-Star Rated</span>
            </div>
          </div>

          <div class="footer__social">
            <a href="https://www.facebook.com/cleanersservicesMA" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/dorysjanitorialcleaning/" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@user8303581710815" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href="https://www.youtube.com/@DorysJanitorial" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer__col">
          <h4 class="footer__title">Quick Links</h4>
          <ul class="footer__links">
            <li><a href="/">Home</a></li>
            <li><a href="/#about">About Us</a></li>
            <li><a href="/services/">Services</a></li>
            <li><a href="/locations/">Service Areas</a></li>
            <li><a href="/#reviews">Reviews</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="footer__col">
          <h4 class="footer__title">Our Services</h4>
          <ul class="footer__links">
            <li><a href="/services/janitorial-service/">Janitorial Service</a></li>
            <li><a href="/services/deep-cleaning/">Deep Cleaning</a></li>
            <li><a href="/services/carpet-cleaning/">Carpet Cleaning</a></li>
            <li><a href="/services/upholstery-cleaning/">Upholstery Cleaning</a></li>
            <li><a href="/services/general-housekeeping/">General Housekeeping</a></li>
          </ul>
        </div>

        <!-- Service Areas -->
        <div class="footer__col">
          <h4 class="footer__title">Service Areas</h4>
          <div class="footer__cities">
            <a href="/locations/worcester-ma">Worcester</a>
            <a href="/locations/marlborough-ma">Marlborough</a>
            <a href="/locations/framingham-ma">Framingham</a>
            <a href="/locations/hudson-ma">Hudson</a>
            <a href="/locations/westborough-ma">Westborough</a>
            <a href="/locations/natick-ma">Natick</a>
            <a href="/locations/wellesley-ma">Wellesley</a>
            <a href="/locations/newton-ma">Newton</a>
          </div>
          <div class="footer__cities-more">
            <a href="/locations/">View All 100+ Cities</a>
          </div>
        </div>

        <!-- Contact -->
        <div class="footer__col">
          <h4 class="footer__title">Contact Us</h4>
          <ul class="footer__contact">
            <li class="footer__contact-item">
              <svg class="footer__contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <a href="tel:+19783078107" class="footer__contact-value">(978) 307-8107</a>
            </li>
            <li class="footer__contact-item">
              <svg class="footer__contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <a href="mailto:contact@doryscleaningservices.com" class="footer__contact-value">contact@doryscleaningservices.com</a>
            </li>
            <li class="footer__contact-item">
              <svg class="footer__contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              <div class="footer__hours">
                <div class="footer__hours-row">
                  <span class="footer__hours-day">Mon - Sat</span>
                  <span class="footer__hours-time">5:00 AM - 7:00 PM</span>
                </div>
                <div class="footer__hours-row">
                  <span class="footer__hours-day">Sunday</span>
                  <span class="footer__hours-time">Closed</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Credentials -->
      <div class="footer__credentials">
        <div class="footer__credential">
          <svg class="footer__credential-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
          <div class="footer__credential-text">
            <span class="footer__credential-label">Insurance:</span>
            <span class="footer__credential-value">$2,000,000 Coverage</span>
          </div>
        </div>
        <div class="footer__credential">
          <svg class="footer__credential-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <div class="footer__credential-text">
            <span class="footer__credential-label">License:</span>
            <span class="footer__credential-value">MA HIC #213341</span>
          </div>
        </div>
        <div class="footer__credential">
          <svg class="footer__credential-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          <div class="footer__credential-text">
            <span class="footer__credential-label">Founded:</span>
            <span class="footer__credential-value">2004 (21+ Years)</span>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2025 Dorys Janitorial Cleaning Services Inc. All rights reserved.</p>
        <nav class="footer__legal">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms of Service</a>
          <a href="/sitemap.html">Sitemap</a>
        </nav>
      </div>
    </div>
  </footer>

  <!-- Back to Top -->
  <button class="back-to-top" aria-label="Back to top">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
  </button>

  <!-- Scripts -->
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/header.js"></script>
  <script src="/assets/js/animations.js"></script>
  <script src="/assets/js/navigation.js"></script>
</body>
</html>`;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  const baseDir = path.join(__dirname, '..');
  let total = 0;
  let errors = 0;

  console.log('='.repeat(60));
  console.log('Dorys Cleaning - Premium Pages Generator');
  console.log('='.repeat(60));
  console.log('\nServices: ' + Object.keys(SERVICES).length);
  console.log('Cities: ' + Object.keys(CITIES).length);
  console.log('Total pages: ' + (Object.keys(SERVICES).length * Object.keys(CITIES).length));
  console.log('');

  for (const serviceKey of Object.keys(SERVICES)) {
    const service = SERVICES[serviceKey];
    const serviceDir = path.join(baseDir, 'services', serviceKey);

    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }

    console.log('\nGenerating ' + service.name + ' pages...');
    let count = 0;

    for (const cityKey of Object.keys(CITIES)) {
      try {
        const html = generatePage(serviceKey, cityKey);
        const city = CITIES[cityKey];
        const filePath = path.join(serviceDir, city.slug + '.html');

        fs.writeFileSync(filePath, html, 'utf8');
        count++;
        total++;

        if (count % 20 === 0) {
          console.log('  Generated ' + count + ' pages...');
        }
      } catch (e) {
        console.error('Error: ' + cityKey + ' - ' + e.message);
        errors++;
      }
    }

    console.log('  Completed: ' + count + ' pages for ' + service.name);
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log('Total generated: ' + total);
  console.log('Errors: ' + errors);
}

main();
