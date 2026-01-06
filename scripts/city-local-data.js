/**
 * Dorys Cleaning Services - City Local Data
 *
 * This file contains localized information for Massachusetts cities
 * to create unique, SEO-optimized content for each service+city page.
 *
 * Data includes: neighborhoods, landmarks, property types, local facts, and custom FAQs
 */

const CITY_LOCAL_DATA = {
  // Major Cities
  'boston': {
    name: 'Boston',
    neighborhoods: ['Back Bay', 'Beacon Hill', 'South End', 'North End', 'Charlestown', 'Jamaica Plain'],
    landmarks: ['Fenway Park', 'Boston Common', 'Freedom Trail', 'Seaport District'],
    propertyTypes: ['high-rise condos', 'brownstones', 'historic townhouses', 'luxury apartments'],
    population: '675,000+',
    localFact: 'As the capital of Massachusetts and a major business hub, Boston properties require specialized cleaning approaches for historic buildings and modern high-rises alike.',
    satisfiedClients: '150+',
    nearbyAreas: ['Cambridge', 'Brookline', 'Somerville', 'Quincy'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you offer deep cleaning for Boston brownstones and historic homes?', a: 'Yes! We specialize in deep cleaning historic Boston properties including brownstones in Back Bay, Beacon Hill townhouses, and South End row houses. Our team understands the unique care these properties require.' },
        { q: 'Can you clean high-rise condos in the Seaport District?', a: 'Absolutely. We service many high-rise buildings in Boston\'s Seaport District, Financial District, and Back Bay. We coordinate with building management for access and scheduling.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services for Boston office buildings?', a: 'Yes, we provide comprehensive janitorial services for office buildings throughout Boston, including the Financial District, Back Bay, and Seaport. We offer flexible scheduling including after-hours cleaning.' },
        { q: 'Can you service medical facilities in the Longwood Medical Area?', a: 'Yes, we provide specialized cleaning for medical facilities following healthcare-grade sanitization protocols. We serve clinics and offices in the Longwood Medical Area and throughout Boston.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Boston apartment buildings?', a: 'Yes, we provide carpet cleaning for individual units and common areas in Boston apartment buildings. We can coordinate with property managers for building-wide service.' },
        { q: 'Can you remove salt stains from carpets after Boston winters?', a: 'Absolutely! Salt stain removal is one of our specialties. Boston winters are tough on carpets, and we have effective treatments to remove salt residue and restore your carpets.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer weekly housekeeping in Boston neighborhoods?', a: 'Yes, we provide weekly and bi-weekly housekeeping throughout Boston including Back Bay, South End, Beacon Hill, Jamaica Plain, and all other neighborhoods.' },
        { q: 'Can you clean Boston rental properties between tenants?', a: 'Yes, turnover cleaning is one of our most requested services in Boston. We help landlords prepare units for new tenants with thorough cleaning that helps secure security deposits.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean antique furniture in Boston historic homes?', a: 'Yes, we have experience cleaning antique and delicate furniture common in Boston\'s historic homes. We assess each piece and use appropriate methods for the fabric and age.' },
        { q: 'Can you clean furniture in Boston condos with limited access?', a: 'Yes, we\'re experienced working in Boston condos with elevator requirements and limited parking. We coordinate logistics to ensure smooth service delivery.' }
      ]
    }
  },

  'worcester': {
    name: 'Worcester',
    neighborhoods: ['Main South', 'Shrewsbury Street', 'Grafton Hill', 'Tatnuck', 'Greendale'],
    landmarks: ['DCU Center', 'Worcester Art Museum', 'Polar Park', 'Clark University'],
    propertyTypes: ['triple-deckers', 'Victorian homes', 'student housing', 'commercial buildings'],
    population: '206,000+',
    localFact: 'As the second-largest city in New England, Worcester combines historic architecture with growing biotech and education sectors, creating diverse cleaning needs.',
    satisfiedClients: '120+',
    nearbyAreas: ['Shrewsbury', 'Auburn', 'Holden', 'Millbury'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you deep clean triple-deckers in Worcester?', a: 'Yes! Triple-deckers are a Worcester specialty. We offer unit-by-unit deep cleaning or whole-building services for landlords and property managers.' },
        { q: 'Can you provide move-out cleaning for Worcester student housing?', a: 'Absolutely. With multiple colleges in Worcester, we handle many move-out cleanings each semester. We know what landlords expect and help students get their deposits back.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services for Worcester businesses downtown?', a: 'Yes, we serve many businesses in downtown Worcester, including offices near City Square, the DCU Center area, and Shrewsbury Street commercial district.' },
        { q: 'Can you clean biotech facilities in Worcester?', a: 'Yes, we provide specialized cleaning for biotech and life sciences facilities in Worcester\'s growing innovation district. We follow strict protocols for laboratory and research environments.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Worcester rental properties?', a: 'Yes, we provide carpet cleaning for Worcester landlords and property managers. We offer discounts for multiple units and can coordinate cleaning between tenants.' },
        { q: 'Can you remove pet stains from carpets in Worcester homes?', a: 'Absolutely! Pet stain and odor removal is a specialty. We use enzymatic treatments that eliminate odors at the source, not just mask them.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping in Worcester\'s Tatnuck neighborhood?', a: 'Yes, we provide regular housekeeping throughout Worcester including Tatnuck, Greendale, Grafton Hill, and all other neighborhoods. We have many happy clients in these areas.' },
        { q: 'Can you clean large Victorian homes in Worcester?', a: 'Yes, Worcester\'s beautiful Victorian homes are one of our specialties. We understand the unique features and care requirements of these historic properties.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean furniture for Worcester landlords between tenants?', a: 'Yes, we provide upholstery cleaning as part of turnover services for Worcester rental properties. Fresh, clean furniture helps attract quality tenants.' },
        { q: 'Can you clean office furniture in Worcester business parks?', a: 'Absolutely. We clean office furniture including chairs, sofas, and cubicle panels for businesses throughout Worcester.' }
      ]
    }
  },

  'cambridge': {
    name: 'Cambridge',
    neighborhoods: ['Harvard Square', 'Kendall Square', 'Central Square', 'Porter Square', 'Inman Square'],
    landmarks: ['Harvard University', 'MIT', 'Cambridge Common', 'Charles River'],
    propertyTypes: ['Victorian homes', 'faculty housing', 'tech offices', 'student apartments'],
    population: '118,000+',
    localFact: 'Home to Harvard and MIT, Cambridge combines historic academic buildings with cutting-edge biotech facilities, requiring cleaning services that understand both worlds.',
    satisfiedClients: '85+',
    nearbyAreas: ['Boston', 'Somerville', 'Arlington', 'Watertown'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you provide deep cleaning near Harvard Square?', a: 'Yes, we serve the entire Harvard Square area including residential homes, apartment buildings, and commercial spaces. We\'re familiar with the unique character of this historic neighborhood.' },
        { q: 'Can you deep clean Kendall Square biotech offices?', a: 'Absolutely. We provide specialized cleaning for biotech and life sciences companies in Kendall Square, following appropriate protocols for laboratory and research environments.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services for Cambridge tech companies?', a: 'Yes, we serve many tech companies in Kendall Square and Cambridge\'s innovation district. We offer flexible scheduling and understand the unique needs of tech workspaces.' },
        { q: 'Can you clean academic buildings in Cambridge?', a: 'Yes, we provide cleaning services for academic institutions, research facilities, and university-affiliated buildings throughout Cambridge.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Cambridge apartment buildings?', a: 'Yes, we provide carpet cleaning for apartments and condos throughout Cambridge. We can coordinate with building management for common area cleaning.' },
        { q: 'Can you clean rugs in Cambridge historic homes?', a: 'Absolutely! We have experience with Oriental rugs, antique carpets, and specialty flooring common in Cambridge\'s historic homes. We assess each piece for appropriate cleaning methods.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping for Cambridge faculty housing?', a: 'Yes, we provide regular housekeeping for many faculty and professionals in Cambridge. We understand the busy schedules of academics and offer flexible scheduling.' },
        { q: 'Can you clean during Cambridge construction projects?', a: 'Yes, we offer post-construction cleaning for Cambridge renovations. With so many historic homes being updated, this is one of our frequently requested services.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean furniture in Cambridge offices?', a: 'Yes, we provide upholstery cleaning for offices throughout Cambridge, from startup spaces in Kendall Square to professional offices in Harvard Square.' },
        { q: 'Can you clean antique furniture in Cambridge homes?', a: 'Absolutely. Cambridge has many homes with valuable antique furniture. We assess each piece carefully and use appropriate cleaning methods.' }
      ]
    }
  },

  'framingham': {
    name: 'Framingham',
    neighborhoods: ['Downtown', 'Nobscot', 'Saxonville', 'Framingham Centre', 'Salem End'],
    landmarks: ['Shoppers World', 'Framingham State University', 'Garden in the Woods', 'Natick Mall area'],
    propertyTypes: ['single-family homes', 'retail spaces', 'corporate offices', 'apartment complexes'],
    population: '72,000+',
    localFact: 'Located at the intersection of major highways, Framingham is a commercial hub with diverse residential neighborhoods ranging from historic village centers to modern developments.',
    satisfiedClients: '95+',
    nearbyAreas: ['Natick', 'Ashland', 'Sudbury', 'Marlborough'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you provide deep cleaning in Framingham residential neighborhoods?', a: 'Yes, we serve all Framingham neighborhoods including Nobscot, Saxonville, Framingham Centre, and downtown. We have many long-term clients throughout the city.' },
        { q: 'Can you deep clean homes near Framingham State University?', a: 'Absolutely! We clean many homes and rental properties in the university area. We\'re experienced with student housing requirements.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services for Route 9 businesses?', a: 'Yes, we serve many businesses along Route 9 in Framingham, from retail stores to corporate offices. We offer after-hours cleaning to avoid disrupting business operations.' },
        { q: 'Can you clean Framingham office parks?', a: 'Yes, we provide comprehensive janitorial services for office parks throughout Framingham. We can customize cleaning schedules to meet your specific needs.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets for Framingham businesses?', a: 'Yes, we provide commercial carpet cleaning for Framingham businesses including retail stores, offices, and restaurants.' },
        { q: 'Can you clean large area rugs in Framingham homes?', a: 'Absolutely! We clean area rugs of all sizes. For very large or antique rugs, we can arrange pickup and delivery service.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer weekly housekeeping in Framingham?', a: 'Yes, we provide weekly, bi-weekly, and monthly housekeeping throughout Framingham. Many families appreciate our consistent, reliable service.' },
        { q: 'Can you clean vacation homes in the Framingham area?', a: 'Yes, we offer cleaning services for vacation properties and second homes. We can prepare your property before arrivals and clean after departures.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean furniture in Framingham homes?', a: 'Yes, we provide in-home upholstery cleaning throughout Framingham. We clean sofas, chairs, ottomans, and more.' },
        { q: 'Can you clean outdoor furniture in Framingham?', a: 'Yes, we can clean outdoor furniture including patio cushions and fabrics. We recommend scheduling this service in spring or early summer.' }
      ]
    }
  },

  'newton': {
    name: 'Newton',
    neighborhoods: ['Newton Centre', 'West Newton', 'Newtonville', 'Auburndale', 'Waban', 'Chestnut Hill'],
    landmarks: ['Boston College', 'Newton Marriott', 'Crystal Lake', 'Hammond Pond'],
    propertyTypes: ['luxury homes', 'historic estates', 'modern condos', 'executive residences'],
    population: '88,000+',
    localFact: 'Known as the "Garden City" for its beautiful neighborhoods, Newton features some of Greater Boston\'s most prestigious homes requiring meticulous cleaning attention.',
    satisfiedClients: '110+',
    nearbyAreas: ['Brookline', 'Wellesley', 'Waltham', 'Needham'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you deep clean large Newton estates?', a: 'Yes, we specialize in cleaning Newton\'s larger homes and estates. Our team is experienced with multi-story homes, finished basements, and properties with extensive square footage.' },
        { q: 'Can you provide pre-party deep cleaning in Newton?', a: 'Absolutely! Many Newton residents use our deep cleaning services before hosting events. We can work with your timeline to ensure your home is pristine for guests.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services near Boston College?', a: 'Yes, we serve businesses in the Boston College area and throughout Newton. We offer flexible scheduling including early morning and evening hours.' },
        { q: 'Can you clean Newton medical offices?', a: 'Yes, we provide specialized cleaning for medical and dental offices in Newton. We follow healthcare cleaning protocols and can work around your practice hours.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean high-end carpets in Newton homes?', a: 'Yes, we have extensive experience with luxury carpets and Oriental rugs common in Newton homes. We assess each piece and use appropriate cleaning methods.' },
        { q: 'Can you clean wall-to-wall carpet in Newton multi-level homes?', a: 'Absolutely! We bring professional equipment to handle multi-level homes. We protect floors and furniture while moving between levels.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping for busy Newton professionals?', a: 'Yes, many Newton professionals trust us for regular housekeeping. We offer flexible scheduling and can provide service while you\'re at work.' },
        { q: 'Can you clean Newton homes with au pair quarters?', a: 'Yes, we clean many Newton homes with in-law suites, au pair quarters, and guest houses. We can include these spaces in regular service or clean them separately.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean designer furniture in Newton homes?', a: 'Yes, we have experience with high-end and designer furniture. We carefully assess fabrics and use appropriate cleaning methods to protect your investment.' },
        { q: 'Can you clean outdoor furniture at Newton properties?', a: 'Yes, we can clean patio furniture, cushions, and outdoor fabrics. This is especially popular in spring when Newton residents are preparing outdoor spaces.' }
      ]
    }
  },

  'marlborough': {
    name: 'Marlborough',
    neighborhoods: ['Downtown', 'East Side', 'West Side', 'Lincoln Street area'],
    landmarks: ['Solomon Pond Mall', 'Ghiloni Park', 'Lake Williams', 'I-495 corridor'],
    propertyTypes: ['single-family homes', 'tech offices', 'industrial buildings', 'apartment complexes'],
    population: '41,000+',
    localFact: 'A hub along the I-495 tech corridor, Marlborough blends suburban neighborhoods with major corporate campuses requiring both residential and commercial cleaning expertise.',
    satisfiedClients: '75+',
    nearbyAreas: ['Hudson', 'Sudbury', 'Southborough', 'Northborough'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you provide deep cleaning in Marlborough neighborhoods?', a: 'Yes, we serve all Marlborough neighborhoods. Our team is based nearby and can quickly respond to your cleaning needs.' },
        { q: 'Can you deep clean after Marlborough home renovations?', a: 'Absolutely! Post-construction cleaning is one of our specialties. We remove dust, debris, and construction residue to reveal your beautiful new space.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services for I-495 corridor businesses?', a: 'Yes, we serve many businesses along the I-495 corridor in Marlborough. We understand the needs of tech companies and corporate offices in this area.' },
        { q: 'Can you clean Marlborough industrial facilities?', a: 'Yes, we provide industrial cleaning services for warehouses and manufacturing facilities in Marlborough. We have the equipment and expertise for large-scale cleaning.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Marlborough offices?', a: 'Yes, we provide commercial carpet cleaning for Marlborough offices. We can work after hours to minimize disruption to your business.' },
        { q: 'Can you clean carpets in Marlborough apartment complexes?', a: 'Yes, we work with property managers to provide carpet cleaning for common areas and individual units.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping in Marlborough?', a: 'Yes, we provide regular housekeeping throughout Marlborough. Many families appreciate our reliable, consistent service.' },
        { q: 'Can you clean Marlborough homes for sale?', a: 'Yes, we offer cleaning services to help prepare Marlborough homes for the market. A clean home shows better and can help with faster sales.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean office furniture in Marlborough?', a: 'Yes, we clean office furniture including task chairs, reception seating, and conference room furniture.' },
        { q: 'Can you clean RV and boat upholstery in Marlborough?', a: 'Yes, we can clean RV and boat interiors. Many Marlborough residents store recreational vehicles and appreciate this service.' }
      ]
    }
  },

  'natick': {
    name: 'Natick',
    neighborhoods: ['Downtown', 'South Natick', 'East Natick', 'Walnut Hill'],
    landmarks: ['Natick Mall', 'Natick Common', 'Lake Cochituate', 'MathWorks Campus'],
    propertyTypes: ['colonial homes', 'modern developments', 'retail spaces', 'tech offices'],
    population: '36,000+',
    localFact: 'Home to the Natick Mall and major tech employers like MathWorks, Natick combines upscale residential neighborhoods with significant commercial activity.',
    satisfiedClients: '80+',
    nearbyAreas: ['Framingham', 'Wellesley', 'Wayland', 'Sherborn'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you provide deep cleaning in South Natick?', a: 'Yes, we serve all Natick neighborhoods including the beautiful South Natick area. We have many satisfied clients throughout the town.' },
        { q: 'Can you deep clean Lake Cochituate area homes?', a: 'Absolutely! We clean many homes near Lake Cochituate. We understand the care needed for properties in this lovely area.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services near Natick Mall?', a: 'Yes, we serve businesses in the Natick Mall area and throughout Route 9. We offer flexible scheduling for retail and office clients.' },
        { q: 'Can you clean tech offices in Natick?', a: 'Yes, we serve tech companies including offices near MathWorks and throughout Natick\'s business districts.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets for Natick retailers?', a: 'Yes, we provide carpet cleaning for Natick retail stores. We understand the importance of maintaining a clean, professional appearance for customers.' },
        { q: 'Can you clean area rugs in Natick homes?', a: 'Yes, we clean area rugs of all sizes and types. We can pick up large rugs for off-site cleaning if needed.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping in Natick?', a: 'Yes, we provide weekly, bi-weekly, and monthly housekeeping throughout Natick. Our reliable service helps busy Natick families maintain clean homes.' },
        { q: 'Can you clean Natick homes before holidays?', a: 'Yes! Many Natick families schedule deep cleaning or extra housekeeping before holidays and special occasions.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean furniture in Natick homes?', a: 'Yes, we provide upholstery cleaning throughout Natick. We clean sofas, chairs, and all types of upholstered furniture.' },
        { q: 'Can you clean dining chairs in Natick homes?', a: 'Absolutely! Dining chairs often need cleaning, especially fabric seats. We can clean individual pieces or complete dining sets.' }
      ]
    }
  },

  'wellesley': {
    name: 'Wellesley',
    neighborhoods: ['Wellesley Hills', 'Wellesley Farms', 'Wellesley Square', 'Wellesley Fells'],
    landmarks: ['Wellesley College', 'Babson College', 'Elm Bank', 'Wellesley Country Club'],
    propertyTypes: ['luxury estates', 'historic colonials', 'modern mansions', 'faculty housing'],
    population: '29,000+',
    localFact: 'One of the most affluent communities in Massachusetts, Wellesley features prestigious homes requiring exceptional attention to detail and white-glove service.',
    satisfiedClients: '90+',
    nearbyAreas: ['Newton', 'Needham', 'Natick', 'Weston'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you deep clean Wellesley luxury homes?', a: 'Yes, we specialize in cleaning Wellesley\'s luxury homes and estates. Our team is trained in caring for high-end finishes, delicate surfaces, and valuable furnishings.' },
        { q: 'Can you provide seasonal deep cleaning in Wellesley?', a: 'Absolutely! Many Wellesley families schedule quarterly deep cleaning to maintain their homes year-round.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services near Wellesley College?', a: 'Yes, we serve businesses throughout Wellesley including the college area. We understand the needs of professional offices and educational-adjacent businesses.' },
        { q: 'Can you clean Wellesley retail stores?', a: 'Yes, we provide cleaning for Wellesley Square shops and retail businesses. We can work after hours to avoid disrupting customer experiences.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean Persian rugs in Wellesley homes?', a: 'Yes, we have extensive experience with Persian, Oriental, and antique rugs. We carefully assess each piece and use appropriate cleaning methods.' },
        { q: 'Can you clean stair runners in Wellesley homes?', a: 'Absolutely! Stair runners are a specialty. We clean them in place or can arrange removal for deep cleaning.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer white-glove housekeeping in Wellesley?', a: 'Yes, we provide premium housekeeping services for Wellesley homes. Our detailed cleaning meets the high standards expected in this community.' },
        { q: 'Can you clean Wellesley homes before real estate showings?', a: 'Yes, we offer showing-preparation cleaning for Wellesley real estate. A professionally cleaned home shows better and can help maximize sale price.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean fine furniture in Wellesley estates?', a: 'Yes, we specialize in cleaning fine furniture including antiques, silk upholstery, and designer pieces. We assess each item and use appropriate methods.' },
        { q: 'Can you clean boat cushions for Wellesley residents?', a: 'Yes, we can clean marine upholstery. Many Wellesley residents with boats at nearby marinas use this service.' }
      ]
    }
  },

  'brookline': {
    name: 'Brookline',
    neighborhoods: ['Coolidge Corner', 'Brookline Village', 'Washington Square', 'Chestnut Hill', 'Cleveland Circle'],
    landmarks: ['Fenway area', 'Longwood Medical Area', 'JFK Birthplace', 'Larz Anderson Park'],
    propertyTypes: ['condominiums', 'historic homes', 'luxury apartments', 'multi-family buildings'],
    population: '63,000+',
    localFact: 'Known for excellent schools and proximity to Boston\'s cultural attractions, Brookline features a mix of urban density and charming residential neighborhoods.',
    satisfiedClients: '105+',
    nearbyAreas: ['Boston', 'Newton', 'Brighton', 'Jamaica Plain'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you deep clean Brookline condos?', a: 'Yes, we clean many condos in Brookline from Coolidge Corner to Cleveland Circle. We\'re experienced with building access requirements and coordinate with management.' },
        { q: 'Can you deep clean historic Brookline homes?', a: 'Absolutely! Brookline has beautiful historic properties. We understand the care required for older homes with original details and finishes.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services near Longwood Medical Area?', a: 'Yes, we serve medical offices and businesses near Longwood. We follow healthcare cleaning protocols and can work around medical practice schedules.' },
        { q: 'Can you clean Coolidge Corner businesses?', a: 'Yes, we provide cleaning for retail stores, restaurants, and offices in Coolidge Corner and throughout Brookline\'s commercial areas.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Brookline apartment buildings?', a: 'Yes, we provide carpet cleaning for Brookline apartments and condos. We can coordinate with building management for lobby and common area cleaning.' },
        { q: 'Can you clean high-traffic carpeted areas in Brookline homes?', a: 'Absolutely! High-traffic areas need more frequent cleaning. We offer maintenance cleaning programs to keep these areas looking their best.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping for Brookline working professionals?', a: 'Yes, many Brookline professionals use our housekeeping services. We offer flexible scheduling to accommodate busy work schedules.' },
        { q: 'Can you clean Brookline homes with young children?', a: 'Yes, we use child-safe, eco-friendly cleaning products. Many Brookline families with young children trust us for regular housekeeping.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean furniture in Brookline condos?', a: 'Yes, we provide upholstery cleaning for Brookline condos. We can navigate building access and elevator requirements.' },
        { q: 'Can you clean outdoor furniture for Brookline homes?', a: 'Yes, we clean patio and deck furniture. Brookline homes often have outdoor living spaces that benefit from professional cleaning.' }
      ]
    }
  },

  'lexington': {
    name: 'Lexington',
    neighborhoods: ['Lexington Center', 'East Lexington', 'Follen Hill', 'Woodhaven'],
    landmarks: ['Battle Green', 'Minuteman National Park', 'Lexington Common', 'Cary Memorial Library'],
    propertyTypes: ['historic colonials', 'split-level homes', 'new construction', 'executive homes'],
    population: '34,000+',
    localFact: 'Birthplace of American Liberty, Lexington combines Revolutionary War heritage with top-rated schools and beautiful residential neighborhoods.',
    satisfiedClients: '70+',
    nearbyAreas: ['Arlington', 'Bedford', 'Lincoln', 'Burlington'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you deep clean historic homes in Lexington?', a: 'Yes, we have experience cleaning Lexington\'s historic properties. We understand the care needed for older homes with original features.' },
        { q: 'Can you provide spring cleaning for Lexington homes?', a: 'Absolutely! Spring cleaning is very popular in Lexington. We help families refresh their homes after long New England winters.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services for Lexington businesses?', a: 'Yes, we serve businesses in Lexington Center and throughout town. We offer flexible scheduling including early morning and evening hours.' },
        { q: 'Can you clean Lexington professional offices?', a: 'Yes, we provide cleaning for medical offices, law firms, and professional services throughout Lexington.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Lexington schools?', a: 'Yes, we provide carpet cleaning for institutional clients including schools and community centers.' },
        { q: 'Can you clean Oriental rugs in Lexington homes?', a: 'Yes, we have experience with Oriental rugs and antique carpets. We assess each piece to determine the best cleaning method.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping in Lexington?', a: 'Yes, we provide regular housekeeping throughout Lexington. Many families trust us for weekly or bi-weekly service.' },
        { q: 'Can you clean Lexington homes during vacations?', a: 'Yes, we can clean while you\'re away. Many Lexington families schedule deep cleaning during vacation time.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean antique furniture in Lexington homes?', a: 'Yes, Lexington has many homes with antique furniture. We carefully assess each piece and use appropriate cleaning methods.' },
        { q: 'Can you clean patio furniture in Lexington?', a: 'Yes, we clean outdoor furniture including cushions and fabric. This is a popular service in spring.' }
      ]
    }
  },

  'hudson': {
    name: 'Hudson',
    neighborhoods: ['Downtown', 'Gleasondale', 'Cherry Brook', 'Lakeside area'],
    landmarks: ['Assabet River Rail Trail', 'Wood Park', 'Fireman\'s Beach', 'Main Street'],
    propertyTypes: ['single-family homes', 'historic mills converted to apartments', 'new developments'],
    population: '20,000+',
    localFact: 'A charming small town with a revitalized downtown and strong community spirit, Hudson offers a mix of historic charm and modern amenities.',
    satisfiedClients: '50+',
    nearbyAreas: ['Marlborough', 'Stow', 'Bolton', 'Berlin'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you provide deep cleaning in Hudson?', a: 'Yes, we serve all of Hudson including downtown and surrounding neighborhoods. We\'re conveniently located and can respond quickly to Hudson cleaning needs.' },
        { q: 'Can you deep clean historic Hudson homes?', a: 'Yes, Hudson has beautiful historic properties. We understand the special care needed for older homes.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services for Hudson Main Street businesses?', a: 'Yes, we serve downtown Hudson businesses. We help maintain the welcoming appearance of Hudson\'s revitalized Main Street.' },
        { q: 'Can you clean Hudson office spaces?', a: 'Yes, we provide janitorial services for Hudson offices. We offer flexible scheduling to meet your business needs.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Hudson homes?', a: 'Yes, we provide residential carpet cleaning throughout Hudson. We have equipment for all home sizes.' },
        { q: 'Can you clean apartment carpets in Hudson?', a: 'Yes, we work with landlords and tenants to provide carpet cleaning for Hudson apartments.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping in Hudson?', a: 'Yes, we provide regular housekeeping services throughout Hudson. Many families appreciate our consistent, reliable service.' },
        { q: 'Can you clean Hudson homes for sale?', a: 'Yes, we offer cleaning to help prepare Hudson homes for the real estate market.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean furniture in Hudson homes?', a: 'Yes, we provide upholstery cleaning throughout Hudson. We can clean sofas, chairs, and all types of upholstered furniture.' },
        { q: 'Can you clean boat cushions for Hudson residents?', a: 'Yes, with Hudson near several lakes, we often clean boat upholstery and cushions.' }
      ]
    }
  },

  'waltham': {
    name: 'Waltham',
    neighborhoods: ['Waltham Center', 'South Side', 'Warrendale', 'Cedarwood', 'Lakeview'],
    landmarks: ['Brandeis University', 'Bentley University', 'Moody Street', 'Prospect Hill'],
    propertyTypes: ['Victorian homes', 'student housing', 'corporate offices', 'apartment complexes'],
    population: '65,000+',
    localFact: 'Known as "Watch City" for its industrial heritage, Waltham now hosts major universities and corporate headquarters alongside diverse residential neighborhoods.',
    satisfiedClients: '85+',
    nearbyAreas: ['Newton', 'Lexington', 'Belmont', 'Watertown'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you deep clean near Brandeis University?', a: 'Yes, we serve the Brandeis area and all Waltham neighborhoods. We understand the needs of student housing and faculty residences.' },
        { q: 'Can you provide move-out cleaning in Waltham?', a: 'Yes, with two major universities, we handle many move-out cleanings. We know what landlords expect and help students get deposits back.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services on Moody Street?', a: 'Yes, we serve businesses along Moody Street and throughout Waltham\'s commercial areas.' },
        { q: 'Can you clean Waltham corporate offices?', a: 'Yes, we serve corporate offices throughout Waltham. We offer flexible scheduling including after-hours service.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Waltham rental properties?', a: 'Yes, we work with Waltham landlords to provide carpet cleaning between tenants and for regular maintenance.' },
        { q: 'Can you clean commercial carpets in Waltham?', a: 'Yes, we provide commercial carpet cleaning for Waltham businesses. We can work after hours to minimize disruption.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping in Waltham?', a: 'Yes, we provide regular housekeeping throughout Waltham. Our service helps busy families maintain clean, comfortable homes.' },
        { q: 'Can you clean Waltham homes during work hours?', a: 'Yes, we can clean while you\'re at work. Many Waltham professionals appreciate coming home to a freshly cleaned house.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean office furniture in Waltham?', a: 'Yes, we clean office furniture throughout Waltham including task chairs, reception areas, and conference rooms.' },
        { q: 'Can you clean restaurant seating in Waltham?', a: 'Yes, with Moody Street\'s restaurant scene, we often clean restaurant upholstery. We can work during closed hours.' }
      ]
    }
  },

  'concord': {
    name: 'Concord',
    neighborhoods: ['Concord Center', 'West Concord', 'Nine Acre Corner', 'Thoreau area'],
    landmarks: ['Walden Pond', 'Old North Bridge', 'Minuteman National Park', 'Sleepy Hollow Cemetery'],
    propertyTypes: ['historic estates', 'colonial homes', 'antique farmhouses', 'new construction'],
    population: '19,000+',
    localFact: 'Rich in literary and Revolutionary War history, Concord features some of Massachusetts\' most beautiful and historic properties requiring specialized care.',
    satisfiedClients: '55+',
    nearbyAreas: ['Lincoln', 'Acton', 'Carlisle', 'Bedford'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you deep clean Concord historic homes?', a: 'Yes, we specialize in cleaning Concord\'s historic properties. We understand the special care needed for antique homes with original features.' },
        { q: 'Can you deep clean homes near Walden Pond?', a: 'Yes, we serve all areas of Concord including the beautiful Walden Pond neighborhood.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services in Concord Center?', a: 'Yes, we serve businesses in Concord Center and throughout town. We can work around business hours.' },
        { q: 'Can you clean Concord professional offices?', a: 'Yes, we provide cleaning for professional offices, medical practices, and retail spaces throughout Concord.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean antique rugs in Concord homes?', a: 'Yes, Concord homes often have valuable antique rugs. We carefully assess each piece and use appropriate cleaning methods.' },
        { q: 'Can you clean carpets in Concord bed and breakfasts?', a: 'Yes, we work with Concord B&Bs and inns to maintain their carpets and upholstery.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping in Concord?', a: 'Yes, we provide regular housekeeping throughout Concord. Many families trust us for weekly or bi-weekly service.' },
        { q: 'Can you clean Concord homes before special events?', a: 'Yes, many Concord families schedule extra cleaning before hosting events or holiday gatherings.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean antique furniture in Concord homes?', a: 'Yes, Concord has many homes with antique furniture. We carefully assess each piece to determine appropriate cleaning methods.' },
        { q: 'Can you clean furniture at Concord B&Bs?', a: 'Yes, we work with hospitality properties to maintain clean, welcoming furnishings.' }
      ]
    }
  },

  'shrewsbury': {
    name: 'Shrewsbury',
    neighborhoods: ['Downtown', 'Northboro Road area', 'White City', 'Lake Quinsigamond area'],
    landmarks: ['Lake Quinsigamond', 'Dean Park', 'Shrewsbury Commons', 'Route 9 corridor'],
    propertyTypes: ['single-family homes', 'lakeside properties', 'retail centers', 'office parks'],
    population: '37,000+',
    localFact: 'Bordering Worcester, Shrewsbury offers excellent schools and beautiful lakeside living while maintaining convenient access to major employment centers.',
    satisfiedClients: '65+',
    nearbyAreas: ['Worcester', 'Westborough', 'Northborough', 'Grafton'],
    customFaqs: {
      'deep-cleaning': [
        { q: 'Do you deep clean Lake Quinsigamond properties?', a: 'Yes, we serve the beautiful Lake Quinsigamond area. We understand the unique cleaning needs of lakeside properties.' },
        { q: 'Can you provide deep cleaning for Shrewsbury families?', a: 'Yes, many Shrewsbury families use our deep cleaning for spring cleaning, before holidays, and other occasions.' }
      ],
      'janitorial-service': [
        { q: 'Do you provide janitorial services on Route 9 in Shrewsbury?', a: 'Yes, we serve businesses along Route 9 including retail stores and office spaces. We offer flexible scheduling.' },
        { q: 'Can you clean Shrewsbury office parks?', a: 'Yes, we provide comprehensive janitorial services for Shrewsbury office parks and commercial buildings.' }
      ],
      'carpet-cleaning': [
        { q: 'Do you clean carpets in Shrewsbury homes?', a: 'Yes, we provide residential carpet cleaning throughout Shrewsbury. We have equipment for all home sizes.' },
        { q: 'Can you clean commercial carpets in Shrewsbury?', a: 'Yes, we provide commercial carpet cleaning for Shrewsbury businesses. We can work after hours to minimize disruption.' }
      ],
      'general-housekeeping': [
        { q: 'Do you offer housekeeping in Shrewsbury?', a: 'Yes, we provide regular housekeeping throughout Shrewsbury. Our reliable service helps busy families maintain clean homes.' },
        { q: 'Can you clean Shrewsbury lakeside homes?', a: 'Yes, we serve lakeside properties. We understand the extra cleaning needs these beautiful homes can have.' }
      ],
      'upholstery-cleaning': [
        { q: 'Do you clean furniture in Shrewsbury homes?', a: 'Yes, we provide upholstery cleaning throughout Shrewsbury. We clean sofas, chairs, and all upholstered furniture.' },
        { q: 'Can you clean boat upholstery for Shrewsbury residents?', a: 'Yes, with Lake Quinsigamond nearby, we often clean boat cushions and marine upholstery for Shrewsbury residents.' }
      ]
    }
  }
};

// Default data for cities not specifically listed
const DEFAULT_CITY_DATA = {
  propertyTypes: ['single-family homes', 'condos', 'offices', 'retail spaces'],
  localFact: 'A vibrant Massachusetts community with diverse residential and commercial properties requiring professional cleaning services.',
  satisfiedClients: '30+',
  customFaqs: {
    'deep-cleaning': [
      { q: 'Do you provide deep cleaning in {{city}}?', a: 'Yes, we serve all of {{city}} and surrounding areas. Our deep cleaning service covers every corner of your home or business.' },
      { q: 'How often should I schedule deep cleaning in {{city}}?', a: 'We recommend deep cleaning 2-4 times per year, plus before holidays, special events, or when moving. Many {{city}} families schedule seasonal deep cleanings.' }
    ],
    'janitorial-service': [
      { q: 'Do you provide janitorial services in {{city}}?', a: 'Yes, we serve businesses throughout {{city}}. We offer daily, weekly, or monthly cleaning schedules to meet your needs.' },
      { q: 'Can you clean {{city}} offices after hours?', a: 'Absolutely! We offer flexible scheduling including early morning, evening, and weekend cleaning to minimize disruption to your business.' }
    ],
    'carpet-cleaning': [
      { q: 'Do you clean carpets in {{city}} homes?', a: 'Yes, we provide professional carpet cleaning throughout {{city}}. We use hot water extraction to remove deep-seated dirt and allergens.' },
      { q: 'How long does carpet cleaning take in {{city}}?', a: 'A typical home takes 1-3 hours depending on size. Carpets are usually dry within 6-12 hours after cleaning.' }
    ],
    'general-housekeeping': [
      { q: 'Do you offer housekeeping in {{city}}?', a: 'Yes, we provide weekly, bi-weekly, and monthly housekeeping throughout {{city}}. Our reliable service helps busy families maintain clean homes.' },
      { q: 'What does housekeeping include in {{city}}?', a: 'Our standard housekeeping includes dusting, vacuuming, mopping, kitchen cleaning, bathroom cleaning, and tidying. We can customize services to your needs.' }
    ],
    'upholstery-cleaning': [
      { q: 'Do you clean furniture in {{city}} homes?', a: 'Yes, we provide upholstery cleaning throughout {{city}}. We clean sofas, chairs, ottomans, and all types of upholstered furniture.' },
      { q: 'Can you clean all fabric types in {{city}}?', a: 'Yes, we\'re trained to clean all fabric types including cotton, microfiber, leather, and delicate fabrics. We assess each piece before cleaning.' }
    ]
  }
};

module.exports = { CITY_LOCAL_DATA, DEFAULT_CITY_DATA };
