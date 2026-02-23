/**
 * Dorys Cleaning Services - Service Pages Generator
 *
 * Este script gera automaticamente todas as paginas de servico+cidade
 * para o site Dorys Cleaning Services.
 *
 * Uso: node scripts/generate-service-pages.js
 *
 * O script ira gerar 5 servicos x 101 cidades = 505 paginas
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACAO DOS SERVICOS
// ============================================================================

const SERVICES = {
  'medical-office-cleaning': {
    name: 'Medical Office Cleaning',
    slug: 'medical-office-cleaning',
    title: 'Medical Office Cleaning',
    description: 'Specialized sanitation for medical offices, dental practices, and physician clinics with infection control protocols.',
    metaDescription: 'Professional medical office cleaning in {{city}}, MA. 22 years healthcare experience. EPA-registered disinfectants, compliance documentation. $2M insured. Schedule a facility assessment: (978) 307-8107.',
    keywords: 'medical office cleaning {{city}} MA, dental office sanitation {{city}}, physician office cleaning {{city}}, healthcare cleaning services {{city}} Massachusetts, infection control cleaning {{city}}',
    leadText: 'Our medical office cleaning services in {{city}} are designed to meet the stringent hygiene standards required by healthcare facilities. With 22 years of hands-on healthcare experience, we follow CDC and OSHA guidelines, use EPA-registered hospital-grade disinfectants, and deliver documented results that support your facility\'s compliance requirements.',
    servicesList: [
      'EPA-registered hospital-grade disinfectant application',
      'Exam room terminal cleaning protocols',
      'Waiting area and reception sanitization',
      'Restroom medical-grade disinfection',
      'Biohazard-aware waste handling procedures',
      'HVAC vent and air quality maintenance',
      'Medical equipment surface disinfection',
      'Floor care with healthcare-grade solutions'
    ],
    faqs: [
      {
        question: 'What infection control protocols do you follow for medical office cleaning in {{city}}?',
        answer: 'We follow CDC and OSHA guidelines for healthcare environmental cleaning in {{city}}, including use of EPA-registered hospital-grade disinfectants, proper contact time protocols, and trained staff with bloodborne pathogen awareness. Our team understands the unique requirements of clinical environments.'
      },
      {
        question: 'Do you provide cleaning documentation for compliance purposes in {{city}}?',
        answer: 'Yes. We provide detailed cleaning logs, quality control checklists, and scheduled sanitation reports that support your {{city}} facility\'s compliance documentation requirements. These records are available for regulatory audits and internal quality reviews.'
      },
      {
        question: 'Can you clean during off-hours to avoid disrupting patient care in {{city}}?',
        answer: 'Absolutely. We offer flexible scheduling including early morning, evening, and weekend cleaning to ensure zero disruption to your patient flow and clinical operations in {{city}}. We customize our schedule around your practice hours.'
      }
    ]
  },
  'clinic-outpatient-sanitation': {
    name: 'Clinic & Outpatient Facility Sanitation',
    slug: 'clinic-outpatient-sanitation',
    title: 'Clinic & Outpatient Sanitation',
    description: 'Professional sanitation for urgent care centers, outpatient surgery centers, therapy clinics, and specialty healthcare facilities.',
    metaDescription: 'Clinic and outpatient facility sanitation in {{city}}, MA. Terminal cleaning, between-patient protocols. 22 years healthcare experience, $2M insured. Schedule assessment: (978) 307-8107.',
    keywords: 'clinic sanitation {{city}} MA, outpatient facility cleaning {{city}}, urgent care cleaning {{city}}, healthcare sanitation services {{city}} Massachusetts, clinic disinfection {{city}}',
    leadText: 'Our clinic and outpatient facility sanitation services in {{city}} address the unique challenges of high-traffic healthcare environments. Urgent care centers, outpatient surgery facilities, physical therapy clinics, and specialty practices require rigorous cleaning protocols that go beyond surface-level sanitation. Our team delivers terminal cleaning, between-patient room turnover, and comprehensive facility-wide disinfection.',
    servicesList: [
      'Terminal cleaning for procedure and exam rooms',
      'Between-patient room turnover protocols',
      'High-traffic waiting area disinfection',
      'Surgical suite and procedure room sanitation',
      'Biohazard spill response and cleanup',
      'Restroom and common area deep disinfection',
      'Staff break room and locker area cleaning',
      'Entrance and lobby sanitation with floor care'
    ],
    faqs: [
      {
        question: 'What is terminal cleaning and when is it needed in {{city}} clinics?',
        answer: 'Terminal cleaning is a thorough, top-to-bottom disinfection of a room after a patient has been discharged or a procedure completed. In {{city}}, we perform terminal cleaning for procedure rooms, exam rooms, and any area where infection control is critical. This includes all surfaces, equipment, and fixtures.'
      },
      {
        question: 'How do you handle biohazard spills in {{city}} clinic settings?',
        answer: 'Our staff serving {{city}} is trained in proper biohazard spill response protocols, including containment, personal protective equipment usage, EPA-registered disinfectant application, and proper waste disposal following OSHA bloodborne pathogen standards.'
      },
      {
        question: 'Can you work around our {{city}} clinic\'s patient schedule?',
        answer: 'Yes. We understand that outpatient facilities in {{city}} often have varying schedules. We offer flexible cleaning times and can perform between-patient room turnovers during operating hours, with comprehensive cleaning scheduled during off-hours.'
      }
    ]
  },
  'assisted-living-senior-care': {
    name: 'Assisted Living & Senior Care Cleaning',
    slug: 'assisted-living-senior-care',
    title: 'Assisted Living & Senior Care Cleaning',
    description: 'Compassionate, thorough cleaning for nursing homes, assisted living communities, and memory care facilities.',
    metaDescription: 'Assisted living and senior care cleaning in {{city}}, MA. Fragrance-free options, resident-safe protocols. 22 years healthcare experience, $2M insured. Schedule assessment: (978) 307-8107.',
    keywords: 'assisted living cleaning {{city}} MA, nursing home sanitation {{city}}, senior care facility cleaning {{city}}, memory care cleaning {{city}} Massachusetts, elder care sanitation {{city}}',
    leadText: 'Senior care facilities in {{city}} require a specialized approach to environmental cleaning that prioritizes resident safety, comfort, and dignity. Our assisted living cleaning services use fragrance-sensitive, low-toxicity products appropriate for elderly and immunocompromised residents, delivering consistent sanitation that supports infection prevention and regulatory compliance.',
    servicesList: [
      'Resident room and bathroom deep cleaning',
      'Common area and dining hall sanitation',
      'Memory care unit specialized protocols',
      'Fragrance-free and low-toxicity product options',
      'Handrail, elevator, and mobility aid disinfection',
      'Laundry room and utility area cleaning',
      'Activity room and therapy space sanitation',
      'Entrance and reception area maintenance'
    ],
    faqs: [
      {
        question: 'Do you use products safe for elderly residents in {{city}}?',
        answer: 'Yes. For senior care facilities in {{city}}, we offer fragrance-free and low-toxicity cleaning product options specifically chosen for elderly and immunocompromised residents. All products are EPA-registered and effective against common healthcare pathogens while being safe for residents with respiratory sensitivities.'
      },
      {
        question: 'How do you handle infection outbreaks in {{city}} senior care facilities?',
        answer: 'We have outbreak response protocols for {{city}} facilities that include enhanced disinfection frequency, targeted high-touch surface treatment, and coordination with facility management. We can rapidly escalate our cleaning protocols during flu season, COVID outbreaks, or other infectious disease events.'
      },
      {
        question: 'Can you clean around residents\' schedules in {{city}}?',
        answer: 'Absolutely. We understand that senior care facilities in {{city}} operate 24/7 and residents have established routines. Our team works quietly and respectfully around meal times, activity schedules, and rest periods to minimize disruption.'
      }
    ]
  },
  'infection-control-disinfection': {
    name: 'Infection Control & High-Touch Disinfection',
    slug: 'infection-control-disinfection',
    title: 'Infection Control & Disinfection',
    description: 'Targeted high-touch surface disinfection and infection prevention services for healthcare facilities.',
    metaDescription: 'Infection control and high-touch disinfection in {{city}}, MA. EPA-registered products effective against MRSA, C. diff. 22 years healthcare experience, $2M insured. Call (978) 307-8107.',
    keywords: 'infection control cleaning {{city}} MA, high-touch surface disinfection {{city}}, healthcare disinfection services {{city}} Massachusetts, MRSA cleaning {{city}}, pathogen disinfection {{city}}',
    leadText: 'Our infection control and high-touch surface disinfection services in {{city}} provide an additional layer of protection for healthcare facilities. Focusing on surfaces most frequently touched by patients, staff, and visitors, we deliver systematic disinfection using EPA-registered products with proven efficacy against healthcare-associated pathogens including MRSA, C. diff, and respiratory viruses.',
    servicesList: [
      'Systematic high-touch surface identification and mapping',
      'EPA-registered disinfectants with proven pathogen kill claims',
      'Door handle, light switch, and handrail disinfection',
      'Elevator button and check-in kiosk sanitization',
      'Shared equipment and waiting room surface treatment',
      'Proper contact time verification protocols',
      'Outbreak response enhanced disinfection',
      'Documentation and verification reporting'
    ],
    faqs: [
      {
        question: 'What surfaces are considered high-touch in {{city}} healthcare facilities?',
        answer: 'High-touch surfaces in {{city}} healthcare facilities include door handles, light switches, handrails, elevator buttons, reception counters, check-in kiosks, shared pens, chair armrests, restroom fixtures, and any surface frequently touched by multiple people throughout the day.'
      },
      {
        question: 'Are your disinfectants effective against MRSA and C. diff in {{city}}?',
        answer: 'Yes. We use EPA-registered hospital-grade disinfectants with proven kill claims against common healthcare pathogens including MRSA, C. difficile, Norovirus, Influenza, and SARS-CoV-2. We follow manufacturer-specified contact times to ensure full efficacy at every {{city}} facility we serve.'
      },
      {
        question: 'How often should high-touch disinfection be performed in {{city}}?',
        answer: 'Frequency depends on your {{city}} facility type and patient volume. High-traffic areas like urgent care waiting rooms may benefit from multiple-times-daily disinfection, while lower-traffic medical offices may need once-daily treatment. We customize the schedule based on your risk assessment.'
      }
    ]
  },
  'compliance-scheduled-sanitation': {
    name: 'Compliance Documentation & Scheduled Sanitation',
    slug: 'compliance-scheduled-sanitation',
    title: 'Compliance & Scheduled Sanitation',
    description: 'Structured sanitation programs with compliance documentation, quality control reporting, and scheduled cleaning verification.',
    metaDescription: 'Compliance documentation and scheduled sanitation in {{city}}, MA. Quality control reports, inspection-ready documentation. 22 years healthcare experience, $2M insured. Call (978) 307-8107.',
    keywords: 'compliance sanitation documentation {{city}} MA, scheduled sanitation programs {{city}}, healthcare cleaning compliance {{city}} Massachusetts, sanitation quality control {{city}}, facility inspection cleaning {{city}}',
    leadText: 'Our compliance documentation and scheduled sanitation service in {{city}} provides healthcare facilities with a structured, contract-based cleaning program that includes detailed documentation for regulatory compliance. We deliver scheduled sanitation with verified cleaning logs, quality control audits, and reporting that demonstrates your facility\'s commitment to environmental hygiene standards.',
    servicesList: [
      'Customized sanitation schedule development',
      'Detailed cleaning verification logs and checklists',
      'Quality control audits and spot inspections',
      'Monthly and quarterly compliance reports',
      'Pre-inspection and pre-accreditation deep cleaning',
      'Staff training documentation and protocol records',
      'Corrective action tracking and resolution',
      'Contract-based service level agreements'
    ],
    faqs: [
      {
        question: 'What compliance documentation do you provide for {{city}} facilities?',
        answer: 'We provide detailed cleaning verification logs, task completion checklists, quality control audit reports, monthly summary reports, and corrective action records for {{city}} facilities. All documentation is organized and available for regulatory inspections, internal audits, and accreditation reviews.'
      },
      {
        question: 'Can you create a custom sanitation schedule for our {{city}} facility?',
        answer: 'Yes. We conduct an initial facility walkthrough assessment in {{city}} to understand your specific needs, patient flow, high-risk areas, and regulatory requirements. From this, we develop a customized sanitation schedule with defined tasks, frequencies, and accountability measures.'
      },
      {
        question: 'Do you offer contract-based service agreements in {{city}}?',
        answer: 'Yes. We offer flexible contract-based service level agreements for {{city}} facilities that define scope, frequency, quality standards, documentation requirements, and pricing. Contracts provide predictable costs and guaranteed service levels.'
      }
    ]
  }
};

// ============================================================================
// MAPA DE CIDADES COM COORDENADAS GPS E CONDADOS
// ============================================================================

const CITIES = {
  'acton': { name: 'Acton', slug: 'acton-ma', county: 'Middlesex County', lat: 42.4851, lng: -71.4329, zipCode: '01720' },
  'arlington-heights': { name: 'Arlington Heights', slug: 'arlington-heights-ma', county: 'Middlesex County', lat: 42.4251, lng: -71.1709, zipCode: '02474' },
  'ashland': { name: 'Ashland', slug: 'ashland-ma', county: 'Middlesex County', lat: 42.2612, lng: -71.4634, zipCode: '01721' },
  'auburndale': { name: 'Auburndale', slug: 'auburndale-ma', county: 'Middlesex County', lat: 42.3451, lng: -71.2479, zipCode: '02466' },
  'auburn': { name: 'Auburn', slug: 'auburn-ma', county: 'Worcester County', lat: 42.1945, lng: -71.8356, zipCode: '01501' },
  'ayer': { name: 'Ayer', slug: 'ayer-ma', county: 'Middlesex County', lat: 42.5612, lng: -71.5887, zipCode: '01432' },
  'babson-park': { name: 'Babson Park', slug: 'babson-park-ma', county: 'Norfolk County', lat: 42.2998, lng: -71.2679, zipCode: '02457' },
  'bedford': { name: 'Bedford', slug: 'bedford-ma', county: 'Middlesex County', lat: 42.4906, lng: -71.2760, zipCode: '01730' },
  'bellingham': { name: 'Bellingham', slug: 'bellingham-ma', county: 'Norfolk County', lat: 42.0868, lng: -71.4746, zipCode: '02019' },
  'belmont': { name: 'Belmont', slug: 'belmont-ma', county: 'Middlesex County', lat: 42.3959, lng: -71.1784, zipCode: '02478' },
  'berlin': { name: 'Berlin', slug: 'berlin-ma', county: 'Worcester County', lat: 42.3812, lng: -71.6370, zipCode: '01503' },
  'bolton': { name: 'Bolton', slug: 'bolton-ma', county: 'Worcester County', lat: 42.4337, lng: -71.6078, zipCode: '01740' },
  'boxborough': { name: 'Boxborough', slug: 'boxborough-ma', county: 'Middlesex County', lat: 42.4901, lng: -71.5217, zipCode: '01719' },
  'boylston': { name: 'Boylston', slug: 'boylston-ma', county: 'Worcester County', lat: 42.3515, lng: -71.7079, zipCode: '01505' },
  'carlisle': { name: 'Carlisle', slug: 'carlisle-ma', county: 'Middlesex County', lat: 42.5298, lng: -71.3484, zipCode: '01741' },
  'chelmsford': { name: 'Chelmsford', slug: 'chelmsford-ma', county: 'Middlesex County', lat: 42.5998, lng: -71.3673, zipCode: '01824' },
  'cherry-valley': { name: 'Cherry Valley', slug: 'cherry-valley-ma', county: 'Worcester County', lat: 42.2334, lng: -71.8779, zipCode: '01611' },
  'chestnut-hill': { name: 'Chestnut Hill', slug: 'chestnut-hill-ma', county: 'Middlesex County', lat: 42.3226, lng: -71.1673, zipCode: '02467' },
  'clinton': { name: 'Clinton', slug: 'clinton-ma', county: 'Worcester County', lat: 42.4168, lng: -71.6828, zipCode: '01510' },
  'concord': { name: 'Concord', slug: 'concord-ma', county: 'Middlesex County', lat: 42.4604, lng: -71.3489, zipCode: '01742' },
  'devens': { name: 'Devens', slug: 'devens-ma', county: 'Worcester County', lat: 42.5412, lng: -71.6134, zipCode: '01434' },
  'dover': { name: 'Dover', slug: 'dover-ma', county: 'Norfolk County', lat: 42.2451, lng: -71.2834, zipCode: '02030' },
  'east-princeton': { name: 'East Princeton', slug: 'east-princeton-ma', county: 'Worcester County', lat: 42.4598, lng: -71.8623, zipCode: '01517' },
  'fayville': { name: 'Fayville', slug: 'fayville-ma', county: 'Worcester County', lat: 42.2912, lng: -71.5345, zipCode: '01745' },
  'framingham': { name: 'Framingham', slug: 'framingham-ma', county: 'Middlesex County', lat: 42.2793, lng: -71.4162, zipCode: '01701' },
  'franklin': { name: 'Franklin', slug: 'franklin-ma', county: 'Norfolk County', lat: 42.0834, lng: -71.3967, zipCode: '02038' },
  'grafton': { name: 'Grafton', slug: 'grafton-ma', county: 'Worcester County', lat: 42.2070, lng: -71.6856, zipCode: '01519' },
  'groton': { name: 'Groton', slug: 'groton-ma', county: 'Middlesex County', lat: 42.6112, lng: -71.5745, zipCode: '01450' },
  'hanscom-afb': { name: 'Hanscom AFB', slug: 'hanscom-afb-ma', county: 'Middlesex County', lat: 42.4668, lng: -71.2795, zipCode: '01731' },
  'harvard': { name: 'Harvard', slug: 'harvard-ma', county: 'Worcester County', lat: 42.5001, lng: -71.5828, zipCode: '01451' },
  'holden': { name: 'Holden', slug: 'holden-ma', county: 'Worcester County', lat: 42.3518, lng: -71.8634, zipCode: '01520' },
  'holliston': { name: 'Holliston', slug: 'holliston-ma', county: 'Middlesex County', lat: 42.2001, lng: -71.4245, zipCode: '01746' },
  'hopedale': { name: 'Hopedale', slug: 'hopedale-ma', county: 'Worcester County', lat: 42.1312, lng: -71.5412, zipCode: '01747' },
  'hopkinton': { name: 'Hopkinton', slug: 'hopkinton-ma', county: 'Middlesex County', lat: 42.2287, lng: -71.5223, zipCode: '01748' },
  'hudson': { name: 'Hudson', slug: 'hudson-ma', county: 'Middlesex County', lat: 42.3918, lng: -71.5662, zipCode: '01749' },
  'jefferson': { name: 'Jefferson', slug: 'jefferson-ma', county: 'Worcester County', lat: 42.3812, lng: -71.8712, zipCode: '01522' },
  'lancaster': { name: 'Lancaster', slug: 'lancaster-ma', county: 'Worcester County', lat: 42.4554, lng: -71.6828, zipCode: '01523' },
  'leominster': { name: 'Leominster', slug: 'leominster-ma', county: 'Worcester County', lat: 42.5251, lng: -71.7598, zipCode: '01453' },
  'lexington': { name: 'Lexington', slug: 'lexington-ma', county: 'Middlesex County', lat: 42.4473, lng: -71.2245, zipCode: '02420' },
  'lincoln': { name: 'Lincoln', slug: 'lincoln-ma', county: 'Middlesex County', lat: 42.4259, lng: -71.3034, zipCode: '01773' },
  'linwood': { name: 'Linwood', slug: 'linwood-ma', county: 'Worcester County', lat: 42.1023, lng: -71.6434, zipCode: '01525' },
  'littleton': { name: 'Littleton', slug: 'littleton-ma', county: 'Middlesex County', lat: 42.5351, lng: -71.4878, zipCode: '01460' },
  'lunenburg': { name: 'Lunenburg', slug: 'lunenburg-ma', county: 'Worcester County', lat: 42.5934, lng: -71.7262, zipCode: '01462' },
  'marlborough': { name: 'Marlborough', slug: 'marlborough-ma', county: 'Middlesex County', lat: 42.3459, lng: -71.5523, zipCode: '01752' },
  'maynard': { name: 'Maynard', slug: 'maynard-ma', county: 'Middlesex County', lat: 42.4334, lng: -71.4534, zipCode: '01754' },
  'medfield': { name: 'Medfield', slug: 'medfield-ma', county: 'Norfolk County', lat: 42.1876, lng: -71.3062, zipCode: '02052' },
  'medway': { name: 'Medway', slug: 'medway-ma', county: 'Norfolk County', lat: 42.1418, lng: -71.3962, zipCode: '02053' },
  'mendon': { name: 'Mendon', slug: 'mendon-ma', county: 'Worcester County', lat: 42.1054, lng: -71.5523, zipCode: '01756' },
  'milford': { name: 'Milford', slug: 'milford-ma', county: 'Worcester County', lat: 42.1398, lng: -71.5162, zipCode: '01757' },
  'millbury': { name: 'Millbury', slug: 'millbury-ma', county: 'Worcester County', lat: 42.1937, lng: -71.7612, zipCode: '01527' },
  'millis': { name: 'Millis', slug: 'millis-ma', county: 'Norfolk County', lat: 42.1668, lng: -71.3579, zipCode: '02054' },
  'natick': { name: 'Natick', slug: 'natick-ma', county: 'Middlesex County', lat: 42.2834, lng: -71.3495, zipCode: '01760' },
  'needham': { name: 'Needham', slug: 'needham-ma', county: 'Norfolk County', lat: 42.2793, lng: -71.2373, zipCode: '02492' },
  'needham-heights': { name: 'Needham Heights', slug: 'needham-heights-ma', county: 'Norfolk County', lat: 42.2979, lng: -71.2284, zipCode: '02494' },
  'newton': { name: 'Newton', slug: 'newton-ma', county: 'Middlesex County', lat: 42.3370, lng: -71.2092, zipCode: '02458' },
  'newton-center': { name: 'Newton Center', slug: 'newton-center-ma', county: 'Middlesex County', lat: 42.3112, lng: -71.1962, zipCode: '02459' },
  'newton-highlands': { name: 'Newton Highlands', slug: 'newton-highlands-ma', county: 'Middlesex County', lat: 42.3173, lng: -71.2079, zipCode: '02461' },
  'newton-lower-falls': { name: 'Newton Lower Falls', slug: 'newton-lower-falls-ma', county: 'Middlesex County', lat: 42.3301, lng: -71.2612, zipCode: '02462' },
  'newton-upper-falls': { name: 'Newton Upper Falls', slug: 'newton-upper-falls-ma', county: 'Middlesex County', lat: 42.3079, lng: -71.2234, zipCode: '02464' },
  'newtonville': { name: 'Newtonville', slug: 'newtonville-ma', county: 'Middlesex County', lat: 42.3512, lng: -71.2073, zipCode: '02460' },
  'nonantum': { name: 'Nonantum', slug: 'nonantum-ma', county: 'Middlesex County', lat: 42.3612, lng: -71.2123, zipCode: '02458' },
  'norfolk': { name: 'Norfolk', slug: 'norfolk-ma', county: 'Norfolk County', lat: 42.1179, lng: -71.3290, zipCode: '02056' },
  'northborough': { name: 'Northborough', slug: 'northborough-ma', county: 'Worcester County', lat: 42.3193, lng: -71.6412, zipCode: '01532' },
  'northbridge': { name: 'Northbridge', slug: 'northbridge-ma', county: 'Worcester County', lat: 42.1512, lng: -71.6495, zipCode: '01534' },
  'north-grafton': { name: 'North Grafton', slug: 'north-grafton-ma', county: 'Worcester County', lat: 42.2334, lng: -71.6912, zipCode: '01536' },
  'north-uxbridge': { name: 'North Uxbridge', slug: 'north-uxbridge-ma', county: 'Worcester County', lat: 42.0812, lng: -71.6312, zipCode: '01538' },
  'north-waltham': { name: 'North Waltham', slug: 'north-waltham-ma', county: 'Middlesex County', lat: 42.4012, lng: -71.2234, zipCode: '02451' },
  'nutting-lake': { name: 'Nutting Lake', slug: 'nutting-lake-ma', county: 'Middlesex County', lat: 42.5012, lng: -71.4212, zipCode: '01821' },
  'paxton': { name: 'Paxton', slug: 'paxton-ma', county: 'Worcester County', lat: 42.3118, lng: -71.9312, zipCode: '01612' },
  'princeton': { name: 'Princeton', slug: 'princeton-ma', county: 'Worcester County', lat: 42.4501, lng: -71.8795, zipCode: '01541' },
  'readville': { name: 'Readville', slug: 'readville-ma', county: 'Suffolk County', lat: 42.2401, lng: -71.1312, zipCode: '02136' },
  'sherborn': { name: 'Sherborn', slug: 'sherborn-ma', county: 'Middlesex County', lat: 42.2393, lng: -71.3689, zipCode: '01770' },
  'shirley': { name: 'Shirley', slug: 'shirley-ma', county: 'Middlesex County', lat: 42.5437, lng: -71.6478, zipCode: '01464' },
  'shrewsbury': { name: 'Shrewsbury', slug: 'shrewsbury-ma', county: 'Worcester County', lat: 42.2959, lng: -71.7126, zipCode: '01545' },
  'southborough': { name: 'Southborough', slug: 'southborough-ma', county: 'Worcester County', lat: 42.3054, lng: -71.5245, zipCode: '01772' },
  'south-grafton': { name: 'South Grafton', slug: 'south-grafton-ma', county: 'Worcester County', lat: 42.1812, lng: -71.6812, zipCode: '01560' },
  'south-lancaster': { name: 'South Lancaster', slug: 'south-lancaster-ma', county: 'Worcester County', lat: 42.4312, lng: -71.6812, zipCode: '01561' },
  'sterling': { name: 'Sterling', slug: 'sterling-ma', county: 'Worcester County', lat: 42.4376, lng: -71.7606, zipCode: '01564' },
  'still-river': { name: 'Still River', slug: 'still-river-ma', county: 'Worcester County', lat: 42.4912, lng: -71.6012, zipCode: '01467' },
  'stow': { name: 'Stow', slug: 'stow-ma', county: 'Middlesex County', lat: 42.4368, lng: -71.5062, zipCode: '01775' },
  'sudbury': { name: 'Sudbury', slug: 'sudbury-ma', county: 'Middlesex County', lat: 42.3834, lng: -71.4162, zipCode: '01776' },
  'sutton': { name: 'Sutton', slug: 'sutton-ma', county: 'Worcester County', lat: 42.1501, lng: -71.7612, zipCode: '01590' },
  'upton': { name: 'Upton', slug: 'upton-ma', county: 'Worcester County', lat: 42.1737, lng: -71.6034, zipCode: '01568' },
  'village-of-nagog-woods': { name: 'Village of Nagog Woods', slug: 'village-of-nagog-woods-ma', county: 'Middlesex County', lat: 42.5012, lng: -71.4712, zipCode: '01718' },
  'waban': { name: 'Waban', slug: 'waban-ma', county: 'Middlesex County', lat: 42.3262, lng: -71.2312, zipCode: '02468' },
  'waltham': { name: 'Waltham', slug: 'waltham-ma', county: 'Middlesex County', lat: 42.3765, lng: -71.2356, zipCode: '02451' },
  'waverley': { name: 'Waverley', slug: 'waverley-ma', county: 'Middlesex County', lat: 42.3912, lng: -71.1912, zipCode: '02479' },
  'wayland': { name: 'Wayland', slug: 'wayland-ma', county: 'Middlesex County', lat: 42.3626, lng: -71.3612, zipCode: '01778' },
  'wellesley': { name: 'Wellesley', slug: 'wellesley-ma', county: 'Norfolk County', lat: 42.2968, lng: -71.2912, zipCode: '02481' },
  'wellesley-hills': { name: 'Wellesley Hills', slug: 'wellesley-hills-ma', county: 'Norfolk County', lat: 42.3112, lng: -71.2712, zipCode: '02481' },
  'westborough': { name: 'Westborough', slug: 'westborough-ma', county: 'Worcester County', lat: 42.2693, lng: -71.6162, zipCode: '01581' },
  'west-boylston': { name: 'West Boylston', slug: 'west-boylston-ma', county: 'Worcester County', lat: 42.3668, lng: -71.7812, zipCode: '01583' },
  'westford': { name: 'Westford', slug: 'westford-ma', county: 'Middlesex County', lat: 42.5793, lng: -71.4378, zipCode: '01886' },
  'west-groton': { name: 'West Groton', slug: 'west-groton-ma', county: 'Middlesex County', lat: 42.6112, lng: -71.6212, zipCode: '01472' },
  'west-millbury': { name: 'West Millbury', slug: 'west-millbury-ma', county: 'Worcester County', lat: 42.1912, lng: -71.7912, zipCode: '01586' },
  'west-newton': { name: 'West Newton', slug: 'west-newton-ma', county: 'Middlesex County', lat: 42.3512, lng: -71.2279, zipCode: '02465' },
  'weston': { name: 'Weston', slug: 'weston-ma', county: 'Middlesex County', lat: 42.3668, lng: -71.3034, zipCode: '02493' },
  'westwood': { name: 'Westwood', slug: 'westwood-ma', county: 'Norfolk County', lat: 42.2168, lng: -71.2245, zipCode: '02090' },
  'whitinsville': { name: 'Whitinsville', slug: 'whitinsville-ma', county: 'Worcester County', lat: 42.1112, lng: -71.6623, zipCode: '01588' },
  'woodville': { name: 'Woodville', slug: 'woodville-ma', county: 'Middlesex County', lat: 42.2612, lng: -71.4812, zipCode: '01784' },
  'worcester': { name: 'Worcester', slug: 'worcester-ma', county: 'Worcester County', lat: 42.2626, lng: -71.8023, zipCode: '01601' }
};

// ============================================================================
// CIDADES PROXIMAS (para cada cidade, lista de cidades vizinhas)
// ============================================================================

function getNearbyCities(cityKey, service) {
  // Mapa de cidades proximas baseado em proximidade geografica
  const nearbyMap = {
    'worcester': ['shrewsbury', 'auburn', 'holden', 'millbury'],
    'shrewsbury': ['worcester', 'westborough', 'northborough', 'grafton'],
    'auburn': ['worcester', 'millbury', 'grafton', 'sutton'],
    'framingham': ['natick', 'ashland', 'sudbury', 'marlborough'],
    'natick': ['framingham', 'wellesley', 'wayland', 'sherborn'],
    'marlborough': ['hudson', 'southborough', 'westborough', 'berlin'],
    'hudson': ['marlborough', 'stow', 'bolton', 'berlin'],
    'westborough': ['northborough', 'shrewsbury', 'southborough', 'grafton'],
    'newton': ['waltham', 'wellesley', 'needham', 'brookline'],
    'waltham': ['newton', 'lexington', 'belmont', 'lincoln'],
    'lexington': ['waltham', 'bedford', 'lincoln', 'concord'],
    'concord': ['acton', 'lincoln', 'sudbury', 'maynard'],
    'wellesley': ['natick', 'needham', 'newton', 'dover'],
    'needham': ['wellesley', 'newton', 'dover', 'medfield'],
    // Default: retorna 4 cidades aleatorias da mesma regiao
  };

  const nearby = nearbyMap[cityKey] || ['worcester', 'framingham', 'natick', 'marlborough'];
  return nearby.slice(0, 4).map(key => ({
    ...CITIES[key],
    key: key,
    url: `/services/${service}/${CITIES[key]?.slug || key + '-ma'}.html`
  })).filter(c => c.name);
}

// ============================================================================
// TEMPLATE HTML DA PAGINA DE SERVICO
// ============================================================================

function generatePageHTML(service, city, cityKey) {
  const serviceData = SERVICES[service];
  const cityData = city;
  const nearbyCities = getNearbyCities(cityKey, service);

  // Substituir placeholders
  const replacePlaceholders = (text) => {
    return text
      .replace(/\{\{city\}\}/g, cityData.name)
      .replace(/\{\{citySlug\}\}/g, cityData.slug)
      .replace(/\{\{county\}\}/g, cityData.county)
      .replace(/\{\{service\}\}/g, serviceData.name)
      .replace(/\{\{serviceSlug\}\}/g, serviceData.slug);
  };

  const metaDescription = replacePlaceholders(serviceData.metaDescription);
  const keywords = replacePlaceholders(serviceData.keywords);
  const leadText = replacePlaceholders(serviceData.leadText);

  // Gerar lista de servicos
  const servicesList = serviceData.servicesList.map(item => `                <li>${item}</li>`).join('\n');

  // Gerar FAQs
  const faqsSchema = serviceData.faqs.map(faq => ({
    "@type": "Question",
    "name": replacePlaceholders(faq.question),
    "acceptedAnswer": {
      "@type": "Answer",
      "text": replacePlaceholders(faq.answer)
    }
  }));

  const faqsHTML = serviceData.faqs.map(faq => `
          <div class="accordion__item">
            <button class="accordion__header" aria-expanded="false">
              ${replacePlaceholders(faq.question)}
              <svg class="accordion__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            <div class="accordion__content">
              <div class="accordion__body">
                <p>${replacePlaceholders(faq.answer)}</p>
              </div>
            </div>
          </div>`).join('');

  // Gerar links de cidades proximas
  const nearbyCitiesHTML = nearbyCities.map(nc =>
    `              <a href="${nc.url}" class="nearby-cities__link">${nc.name}</a>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${serviceData.title} in ${cityData.name}, MA | Dorys Healthcare Environmental Services</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://doryscleaningservices.com/services/${serviceData.slug}/${cityData.slug}.html">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://doryscleaningservices.com/services/${serviceData.slug}/${cityData.slug}.html">
  <meta property="og:title" content="${serviceData.title} in ${cityData.name}, MA | Dorys Healthcare Environmental Services">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:image" content="https://doryscleaningservices.com/assets/images/services/${serviceData.slug}.jpg">

  <!-- Geo Tags -->
  <meta name="geo.region" content="US-MA">
  <meta name="geo.placename" content="${cityData.name}, Massachusetts">
  <meta name="geo.position" content="${cityData.lat};${cityData.lng}">
  <meta name="ICBM" content="${cityData.lat}, ${cityData.lng}">

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

  <!-- Schema.org LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Dorys Healthcare Environmental Services - ${serviceData.title} in ${cityData.name}",
    "image": "https://doryscleaningservices.com/assets/images/services/${serviceData.slug}.jpg",
    "url": "https://doryscleaningservices.com/services/${serviceData.slug}/${cityData.slug}.html",
    "telephone": "+19783078107",
    "email": "contact@doryscleaningservices.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "${cityData.name}",
      "addressRegion": "MA",
      "postalCode": "${cityData.zipCode}",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${cityData.lat},
      "longitude": ${cityData.lng}
    },
    "areaServed": {
      "@type": "City",
      "name": "${cityData.name}",
      "containedInPlace": {"@type": "State", "name": "Massachusetts"}
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "05:00",
      "closes": "19:00"
    }],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Healthcare Sanitation Services",
      "itemListElement": [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "${serviceData.title}",
          "description": "${serviceData.description}",
          "areaServed": {"@type": "City", "name": "${cityData.name}"}
        }
      }]
    }
  }
  </script>

  <!-- Schema.org FAQ -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ${JSON.stringify(faqsSchema)}
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
      {"@type": "ListItem", "position": 3, "name": "${serviceData.title}", "item": "https://doryscleaningservices.com/services/${serviceData.slug}/"},
      {"@type": "ListItem", "position": 4, "name": "${cityData.name}", "item": "https://doryscleaningservices.com/services/${serviceData.slug}/${cityData.slug}.html"}
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
        <a href="mailto:contact@doryscleaningservices.com" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>contact@doryscleaningservices.com</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <div class="container header__wrapper">
      <a href="/" class="header__logo">
        <img src="/assets/images/logo/logo-original.jpg" alt="Dorys Healthcare Environmental Services" width="180" height="60">
      </a>
      <nav class="header__nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
          <li class="nav-item has-dropdown">
            <a href="/services/" class="nav-link nav-link--active">Services <svg class="nav-link__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg></a>
            <div class="nav-dropdown">
              <a href="/services/medical-office-cleaning/" class="nav-dropdown__link">Medical Office Cleaning</a>
              <a href="/services/clinic-outpatient-sanitation/" class="nav-dropdown__link">Clinic & Outpatient Sanitation</a>
              <a href="/services/assisted-living-senior-care/" class="nav-dropdown__link">Assisted Living & Senior Care</a>
              <a href="/services/infection-control-disinfection/" class="nav-dropdown__link">Infection Control & Disinfection</a>
              <a href="/services/compliance-scheduled-sanitation/" class="nav-dropdown__link">Compliance & Scheduled Sanitation</a>
            </div>
          </li>
          <li class="nav-item"><a href="/locations/" class="nav-link">Service Areas</a></li>
          <li class="nav-item"><a href="/about.html" class="nav-link">About Us</a></li>
          <li class="nav-item"><a href="/reviews.html" class="nav-link">Reviews</a></li>
          <li class="nav-item"><a href="/contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <a href="/contact.html" class="btn btn--primary header__cta hide-mobile">Healthcare Assessment</a>
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
        <li class="breadcrumb__item"><a href="/services/${serviceData.slug}/" class="breadcrumb__link">${serviceData.title}</a></li>
        <li class="breadcrumb__item" aria-current="page">${cityData.name}</li>
      </ol>
    </div>
  </nav>

  <main id="main-content">
    <!-- Hero -->
    <section class="hero hero--inner">
      <div class="hero__background">
        <img src="/assets/images/services/${serviceData.slug}.jpg" alt="${serviceData.title} in ${cityData.name}, MA - Professional cleaning services" loading="eager">
        <div class="hero__overlay hero__overlay--gradient"></div>
      </div>
      <div class="container">
        <div class="hero__content hero__content--center">
          <h1 class="hero__title">${serviceData.title} in ${cityData.name}, MA</h1>
          <p class="hero__subtitle">${serviceData.description} Serving ${cityData.name} and ${cityData.county} with 22 years of healthcare experience. CDC/OSHA compliant protocols. $2M insured.</p>
          <div class="hero__ctas">
            <a href="/contact.html" class="btn btn--primary btn--lg btn--pulse">Schedule a Facility Assessment</a>
            <a href="tel:+19783078107" class="btn btn--outline-light btn--lg">Call (978) 307-8107</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Details -->
    <section class="section">
      <div class="container">
        <div class="two-col">
          <div class="animate-on-scroll animate-fade-right">
            <h2>${serviceData.title} Services in ${cityData.name}, Massachusetts</h2>
            <p class="lead">${leadText}</p>

            <h3>What We Offer in ${cityData.name}</h3>
            <ul class="list list--check">
${servicesList}
            </ul>

            <h3>Why Choose Dorys for ${serviceData.title} in ${cityData.name}?</h3>
            <p>When you need professional ${serviceData.name.toLowerCase()} in ${cityData.name}, MA, Dorys Healthcare Environmental Services delivers results backed by 22 years of healthcare experience. Serving ${cityData.county} and throughout Massachusetts, we understand the infection control, compliance, and patient safety demands of healthcare facilities.</p>
            <p>Our team is fully licensed (HIC #213341) and carries $2,000,000 in insurance coverage. Staff are trained in healthcare-appropriate protocols including bloodborne pathogen awareness, CDC environmental cleaning guidelines, and EPA-registered disinfectant application with proper contact times. We provide full compliance documentation and quality control reporting.</p>

            <div class="btn-group mt-xl">
              <a href="/contact.html" class="btn btn--primary">Schedule a Healthcare Assessment</a>
              <a href="tel:+19783078107" class="btn btn--secondary">Call (978) 307-8107</a>
            </div>
          </div>

          <div class="animate-on-scroll animate-fade-left animate-delay-200">
            <div class="form-embed" style="background: var(--bg-light); border-radius: var(--radius-lg); padding: var(--space-lg);">
              <h3 class="text-center mb-lg">Request a Healthcare Site Assessment</h3>
              <iframe src="https://api.leadconnectorhq.com/widget/form/oaN0aNeRAK8fPG4AnIzl" style="width:100%;height:600px;border:none;border-radius:8px" title="Contact Form"></iframe>
              <script src="https://link.msgsndr.com/js/form_embed.js"></script>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nearby Cities -->
    <section class="section section--alt">
      <div class="container">
        <h2 class="section__title">Also Serving Nearby ${cityData.name} Areas</h2>
        <p class="section__subtitle">We provide ${serviceData.name.toLowerCase()} throughout ${cityData.county} and surrounding communities.</p>
        <div class="nearby-cities">
          <div class="nearby-cities__list">
${nearbyCitiesHTML}
          </div>
        </div>
        <div class="text-center mt-xl">
          <a href="/locations/" class="btn btn--primary">View All Service Areas</a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <div class="container container--narrow">
        <h2 class="section__title">${serviceData.title} FAQ for ${cityData.name}</h2>
        <div class="accordion">
          ${faqsHTML}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section section--primary">
      <div class="container text-center">
        <h2 class="text-white mb-lg">Ready for Professional ${serviceData.title} in ${cityData.name}?</h2>
        <p class="lead text-white mb-xl" style="opacity:0.9">Schedule a healthcare facility walkthrough today. 22 years of healthcare experience. $2M insured.</p>
        <div class="btn-group btn-group--center">
          <a href="/contact.html" class="btn btn--white btn--lg">Schedule Facility Assessment</a>
          <a href="tel:+19783078107" class="btn btn--outline-light btn--lg">Call (978) 307-8107</a>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <!-- Footer CTA -->
      <div class="footer__cta">
        <h2 class="footer__cta-title">Schedule a Healthcare Facility Assessment</h2>
        <p class="footer__cta-text">Healthcare-focused environmental services with 22 years of experience. Licensed, $2M insured, and trained in healthcare protocols.</p>
        <div class="footer__cta-buttons">
          <a href="/#contact" class="btn btn--white btn--lg">Request Healthcare Assessment</a>
          <a href="tel:+19783078107" class="btn btn--outline-light btn--lg">Call (978) 307-8107</a>
        </div>
      </div>

      <!-- Footer Grid -->
      <div class="footer__grid">
        <!-- Brand Column -->
        <div class="footer__col footer__brand">
          <a href="/" class="footer__logo">
            <img src="/assets/images/logo/logo-original.jpg" alt="Dorys Healthcare Environmental Services" class="footer__logo-img" width="180" height="60">
            <span class="footer__logo-text">Dorys Healthcare</span>
          </a>
          <p class="footer__description">Healthcare-focused environmental services in Massachusetts since 2004. 22 years of healthcare experience delivering precision sanitation, compliance-driven protocols, and infection control support.</p>

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
            <li><a href="/services/medical-office-cleaning/">Medical Office Cleaning</a></li>
            <li><a href="/services/clinic-outpatient-sanitation/">Clinic & Outpatient Sanitation</a></li>
            <li><a href="/services/assisted-living-senior-care/">Assisted Living & Senior Care</a></li>
            <li><a href="/services/infection-control-disinfection/">Infection Control & Disinfection</a></li>
            <li><a href="/services/compliance-scheduled-sanitation/">Compliance & Scheduled Sanitation</a></li>
          </ul>
        </div>

        <!-- Top Cities -->
        <div class="footer__col">
          <h4 class="footer__title">Service Areas</h4>
          <div class="footer__cities">
            <a href="/locations/worcester-ma.html">Worcester</a>
            <a href="/locations/marlborough-ma.html">Marlborough</a>
            <a href="/locations/framingham-ma.html">Framingham</a>
            <a href="/locations/hudson-ma.html">Hudson</a>
            <a href="/locations/westborough-ma.html">Westborough</a>
            <a href="/locations/natick-ma.html">Natick</a>
            <a href="/locations/wellesley-ma.html">Wellesley</a>
            <a href="/locations/newton-ma.html">Newton</a>
          </div>
          <div class="footer__cities-more">
            <a href="/locations/">View All 100+ Cities</a>
          </div>
        </div>

        <!-- Contact Info -->
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
            <span class="footer__credential-value">2004 (22 Years Healthcare)</span>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2026 Dorys Healthcare Environmental Services Inc. All rights reserved.</p>
        <nav class="footer__legal">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms of Service</a>
          <a href="/sitemap.html">Sitemap</a>
        </nav>
      </div>
    </div>
  </footer>

  <button class="back-to-top" aria-label="Back to top">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
  </button>

  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/header.js"></script>
  <script src="/assets/js/animations.js"></script>
  <script src="/assets/js/navigation.js"></script>
</body>
</html>`;
}

// ============================================================================
// FUNCAO PRINCIPAL DE GERACAO
// ============================================================================

function generateAllPages() {
  const baseDir = path.join(__dirname, '..');
  const servicesDir = path.join(baseDir, 'services');

  let totalGenerated = 0;
  let errors = [];

  console.log('='.repeat(60));
  console.log('Dorys Cleaning - Service Pages Generator');
  console.log('='.repeat(60));
  console.log(`\nServices: ${Object.keys(SERVICES).length}`);
  console.log(`Cities: ${Object.keys(CITIES).length}`);
  console.log(`Total pages to generate: ${Object.keys(SERVICES).length * Object.keys(CITIES).length}`);
  console.log('');

  // Iterar sobre cada servico
  for (const [serviceKey, serviceData] of Object.entries(SERVICES)) {
    const serviceDir = path.join(servicesDir, serviceKey);

    // Criar diretorio do servico se nao existir
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
      console.log(`Created directory: ${serviceDir}`);
    }

    console.log(`\nGenerating ${serviceData.name} pages...`);
    let serviceCount = 0;

    // Iterar sobre cada cidade
    for (const [cityKey, cityData] of Object.entries(CITIES)) {
      try {
        const html = generatePageHTML(serviceKey, cityData, cityKey);
        const filePath = path.join(serviceDir, `${cityData.slug}.html`);

        fs.writeFileSync(filePath, html, 'utf8');
        serviceCount++;
        totalGenerated++;

        // Mostrar progresso a cada 20 paginas
        if (serviceCount % 20 === 0) {
          console.log(`  Generated ${serviceCount} pages for ${serviceData.name}...`);
        }
      } catch (error) {
        errors.push({
          service: serviceKey,
          city: cityKey,
          error: error.message
        });
        console.error(`  Error generating ${serviceKey}/${cityData.slug}: ${error.message}`);
      }
    }

    console.log(`  Completed: ${serviceCount} pages for ${serviceData.name}`);
  }

  // Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total pages generated: ${totalGenerated}`);

  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(err => {
      console.log(`  - ${err.service}/${err.city}: ${err.error}`);
    });
  } else {
    console.log('No errors occurred.');
  }

  console.log('');
}

// ============================================================================
// FUNCAO PARA GERAR PAGINA INDIVIDUAL (para testes)
// ============================================================================

function generateSinglePage(service, cityKey) {
  if (!SERVICES[service]) {
    console.error(`Service "${service}" not found.`);
    return;
  }

  if (!CITIES[cityKey]) {
    console.error(`City "${cityKey}" not found.`);
    return;
  }

  const html = generatePageHTML(service, CITIES[cityKey], cityKey);
  console.log(html);
}

// ============================================================================
// FUNCAO PARA LISTAR CIDADES
// ============================================================================

function listCities() {
  console.log('Available cities:');
  Object.entries(CITIES)
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .forEach(([key, city]) => {
      console.log(`  ${key}: ${city.name}, ${city.county} (${city.lat}, ${city.lng})`);
    });
  console.log(`\nTotal: ${Object.keys(CITIES).length} cities`);
}

// ============================================================================
// FUNCAO PARA LISTAR SERVICOS
// ============================================================================

function listServices() {
  console.log('Available services:');
  Object.entries(SERVICES).forEach(([key, service]) => {
    console.log(`  ${key}: ${service.name}`);
  });
  console.log(`\nTotal: ${Object.keys(SERVICES).length} services`);
}

// ============================================================================
// EXECUCAO
// ============================================================================

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Dorys Cleaning - Service Pages Generator

Usage:
  node generate-service-pages.js              Generate all pages
  node generate-service-pages.js --list-cities    List all cities
  node generate-service-pages.js --list-services  List all services
  node generate-service-pages.js --test SERVICE CITY  Generate single page (for testing)
  node generate-service-pages.js --help           Show this help

Examples:
  node generate-service-pages.js
  node generate-service-pages.js --test deep-cleaning worcester
`);
} else if (args.includes('--list-cities')) {
  listCities();
} else if (args.includes('--list-services')) {
  listServices();
} else if (args.includes('--test')) {
  const testIndex = args.indexOf('--test');
  const service = args[testIndex + 1];
  const city = args[testIndex + 2];

  if (!service || !city) {
    console.error('Usage: node generate-service-pages.js --test SERVICE CITY');
    console.error('Example: node generate-service-pages.js --test deep-cleaning worcester');
  } else {
    generateSinglePage(service, city);
  }
} else {
  // Gerar todas as paginas
  generateAllPages();
}
