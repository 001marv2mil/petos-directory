import type { CategoryMeta, CityMeta } from '@/types'

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80&fit=crop`

export const CITIES: CityMeta[] = [
  // Alabama
  { city: 'Birmingham',     state: 'Alabama',        stateAbbr: 'AL', stateSlug: 'al', citySlug: 'birmingham',     heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'Huntsville',     state: 'Alabama',        stateAbbr: 'AL', stateSlug: 'al', citySlug: 'huntsville',     heroImage: img('1575517111839-3a3843ee7f5d') },
  // Alaska
  { city: 'Anchorage',      state: 'Alaska',         stateAbbr: 'AK', stateSlug: 'ak', citySlug: 'anchorage',      heroImage: img('1508739773434-c26b3d09e071') },
  // Arizona
  { city: 'Phoenix',        state: 'Arizona',        stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'phoenix',        heroImage: img('1558618666-fcd25c85cd64') },
  { city: 'Scottsdale',     state: 'Arizona',        stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'scottsdale',     heroImage: img('1558618666-fcd25c85cd64') },
  { city: 'Tucson',         state: 'Arizona',        stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'tucson',         heroImage: img('1558618666-fcd25c85cd64') },
  // Arkansas
  { city: 'Little Rock',    state: 'Arkansas',       stateAbbr: 'AR', stateSlug: 'ar', citySlug: 'little-rock',    heroImage: img('1575383502153-5f9d5d07e5f3') },
  { city: 'Fayetteville',   state: 'Arkansas',       stateAbbr: 'AR', stateSlug: 'ar', citySlug: 'fayetteville',   heroImage: img('1575383502153-5f9d5d07e5f3') },
  // California
  { city: 'Los Angeles',    state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'los-angeles',    heroImage: img('1485738422979-f5c462d49f74') },
  { city: 'San Diego',      state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-diego',      heroImage: img('1485738422979-f5c462d49f74') },
  { city: 'San Francisco',  state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-francisco',  heroImage: img('1449034446853-66c86144b0ad') },
  { city: 'Sacramento',     state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'sacramento',     heroImage: img('1485738422979-f5c462d49f74') },
  { city: 'San Jose',       state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-jose',       heroImage: img('1485738422979-f5c462d49f74') },
  // Colorado
  { city: 'Denver',         state: 'Colorado',       stateAbbr: 'CO', stateSlug: 'co', citySlug: 'denver',         heroImage: img('1546156929-a4c0ac411f47') },
  { city: 'Colorado Springs', state: 'Colorado',     stateAbbr: 'CO', stateSlug: 'co', citySlug: 'colorado-springs', heroImage: img('1546156929-a4c0ac411f47') },
  { city: 'Boulder',        state: 'Colorado',       stateAbbr: 'CO', stateSlug: 'co', citySlug: 'boulder',        heroImage: img('1546156929-a4c0ac411f47') },
  // Connecticut
  { city: 'Hartford',       state: 'Connecticut',    stateAbbr: 'CT', stateSlug: 'ct', citySlug: 'hartford',       heroImage: img('1501979376754-f40fba83ec7d') },
  { city: 'Stamford',       state: 'Connecticut',    stateAbbr: 'CT', stateSlug: 'ct', citySlug: 'stamford',       heroImage: img('1501979376754-f40fba83ec7d') },
  // Delaware
  { city: 'Wilmington',     state: 'Delaware',       stateAbbr: 'DE', stateSlug: 'de', citySlug: 'wilmington',     heroImage: img('1569761316261-9a8696fa2ca3') },
  // Florida
  { city: 'Tampa',          state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'tampa',          heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'St. Petersburg', state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'st-petersburg',  heroImage: img('1506905925346-21bda4d32df4') },
  { city: 'Clearwater',     state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'clearwater',     heroImage: img('1507525428034-b723cf961d3e') },
  { city: 'Orlando',        state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'orlando',        heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'Miami',          state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'miami',          heroImage: img('1533106418989-88406c7cc8ca') },
  { city: 'Jacksonville',   state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'jacksonville',   heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'Fort Lauderdale', state: 'Florida',       stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'fort-lauderdale', heroImage: img('1507525428034-b723cf961d3e') },
  { city: 'Sarasota',       state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'sarasota',       heroImage: img('1507525428034-b723cf961d3e') },
  { city: 'Brandon',        state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'brandon',        heroImage: img('1575517111839-3a3843ee7f5d') },
  // Georgia
  { city: 'Atlanta',        state: 'Georgia',        stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'atlanta',        heroImage: img('1575383502153-5f9d5d07e5f3') },
  { city: 'Savannah',       state: 'Georgia',        stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'savannah',       heroImage: img('1575383502153-5f9d5d07e5f3') },
  { city: 'Augusta',        state: 'Georgia',        stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'augusta',        heroImage: img('1575383502153-5f9d5d07e5f3') },
  // Hawaii
  { city: 'Honolulu',       state: 'Hawaii',         stateAbbr: 'HI', stateSlug: 'hi', citySlug: 'honolulu',       heroImage: img('1507525428034-b723cf961d3e') },
  // Idaho
  { city: 'Boise',          state: 'Idaho',          stateAbbr: 'ID', stateSlug: 'id', citySlug: 'boise',          heroImage: img('1546156929-a4c0ac411f47') },
  // Illinois
  { city: 'Chicago',        state: 'Illinois',       stateAbbr: 'IL', stateSlug: 'il', citySlug: 'chicago',        heroImage: img('1494522855154-9297ac14b55f') },
  { city: 'Naperville',     state: 'Illinois',       stateAbbr: 'IL', stateSlug: 'il', citySlug: 'naperville',     heroImage: img('1494522855154-9297ac14b55f') },
  // Indiana
  { city: 'Indianapolis',   state: 'Indiana',        stateAbbr: 'IN', stateSlug: 'in', citySlug: 'indianapolis',   heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'Fort Wayne',     state: 'Indiana',        stateAbbr: 'IN', stateSlug: 'in', citySlug: 'fort-wayne',     heroImage: img('1575517111839-3a3843ee7f5d') },
  // Iowa
  { city: 'Des Moines',     state: 'Iowa',           stateAbbr: 'IA', stateSlug: 'ia', citySlug: 'des-moines',     heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'Cedar Rapids',   state: 'Iowa',           stateAbbr: 'IA', stateSlug: 'ia', citySlug: 'cedar-rapids',   heroImage: img('1575517111839-3a3843ee7f5d') },
  // Kansas
  { city: 'Wichita',        state: 'Kansas',         stateAbbr: 'KS', stateSlug: 'ks', citySlug: 'wichita',        heroImage: img('1545194445-dddb8f4487c6') },
  { city: 'Overland Park',  state: 'Kansas',         stateAbbr: 'KS', stateSlug: 'ks', citySlug: 'overland-park',  heroImage: img('1545194445-dddb8f4487c6') },
  // Kentucky
  { city: 'Louisville',     state: 'Kentucky',       stateAbbr: 'KY', stateSlug: 'ky', citySlug: 'louisville',     heroImage: img('1575383502153-5f9d5d07e5f3') },
  { city: 'Lexington',      state: 'Kentucky',       stateAbbr: 'KY', stateSlug: 'ky', citySlug: 'lexington',      heroImage: img('1575383502153-5f9d5d07e5f3') },
  // Louisiana
  { city: 'New Orleans',    state: 'Louisiana',      stateAbbr: 'LA', stateSlug: 'la', citySlug: 'new-orleans',    heroImage: img('1533106418989-88406c7cc8ca') },
  { city: 'Baton Rouge',    state: 'Louisiana',      stateAbbr: 'LA', stateSlug: 'la', citySlug: 'baton-rouge',    heroImage: img('1533106418989-88406c7cc8ca') },
  // Maine
  { city: 'Portland',       state: 'Maine',          stateAbbr: 'ME', stateSlug: 'me', citySlug: 'portland',       heroImage: img('1501979376754-f40fba83ec7d') },
  // Maryland
  { city: 'Baltimore',      state: 'Maryland',       stateAbbr: 'MD', stateSlug: 'md', citySlug: 'baltimore',      heroImage: img('1569761316261-9a8696fa2ca3') },
  { city: 'Rockville',      state: 'Maryland',       stateAbbr: 'MD', stateSlug: 'md', citySlug: 'rockville',      heroImage: img('1569761316261-9a8696fa2ca3') },
  // Massachusetts
  { city: 'Boston',         state: 'Massachusetts',  stateAbbr: 'MA', stateSlug: 'ma', citySlug: 'boston',         heroImage: img('1501979376754-f40fba83ec7d') },
  { city: 'Worcester',      state: 'Massachusetts',  stateAbbr: 'MA', stateSlug: 'ma', citySlug: 'worcester',      heroImage: img('1501979376754-f40fba83ec7d') },
  // Michigan
  { city: 'Detroit',        state: 'Michigan',       stateAbbr: 'MI', stateSlug: 'mi', citySlug: 'detroit',        heroImage: img('1494522855154-9297ac14b55f') },
  { city: 'Grand Rapids',   state: 'Michigan',       stateAbbr: 'MI', stateSlug: 'mi', citySlug: 'grand-rapids',   heroImage: img('1494522855154-9297ac14b55f') },
  // Minnesota
  { city: 'Minneapolis',    state: 'Minnesota',      stateAbbr: 'MN', stateSlug: 'mn', citySlug: 'minneapolis',    heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'St. Paul',       state: 'Minnesota',      stateAbbr: 'MN', stateSlug: 'mn', citySlug: 'st-paul',        heroImage: img('1575517111839-3a3843ee7f5d') },
  // Mississippi
  { city: 'Jackson',        state: 'Mississippi',    stateAbbr: 'MS', stateSlug: 'ms', citySlug: 'jackson',        heroImage: img('1575383502153-5f9d5d07e5f3') },
  // Missouri
  { city: 'Kansas City',    state: 'Missouri',       stateAbbr: 'MO', stateSlug: 'mo', citySlug: 'kansas-city',    heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'St. Louis',      state: 'Missouri',       stateAbbr: 'MO', stateSlug: 'mo', citySlug: 'st-louis',       heroImage: img('1575517111839-3a3843ee7f5d') },
  // Montana
  { city: 'Billings',       state: 'Montana',        stateAbbr: 'MT', stateSlug: 'mt', citySlug: 'billings',       heroImage: img('1546156929-a4c0ac411f47') },
  { city: 'Missoula',       state: 'Montana',        stateAbbr: 'MT', stateSlug: 'mt', citySlug: 'missoula',       heroImage: img('1546156929-a4c0ac411f47') },
  // Nebraska
  { city: 'Omaha',          state: 'Nebraska',       stateAbbr: 'NE', stateSlug: 'ne', citySlug: 'omaha',          heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'Lincoln',        state: 'Nebraska',       stateAbbr: 'NE', stateSlug: 'ne', citySlug: 'lincoln',        heroImage: img('1575517111839-3a3843ee7f5d') },
  // Nevada
  { city: 'Las Vegas',      state: 'Nevada',         stateAbbr: 'NV', stateSlug: 'nv', citySlug: 'las-vegas',      heroImage: img('1581351721010-8cf859cb14a4') },
  { city: 'Reno',           state: 'Nevada',         stateAbbr: 'NV', stateSlug: 'nv', citySlug: 'reno',           heroImage: img('1581351721010-8cf859cb14a4') },
  // New Hampshire
  { city: 'Manchester',     state: 'New Hampshire',  stateAbbr: 'NH', stateSlug: 'nh', citySlug: 'manchester',     heroImage: img('1501979376754-f40fba83ec7d') },
  // New Jersey
  { city: 'Newark',         state: 'New Jersey',     stateAbbr: 'NJ', stateSlug: 'nj', citySlug: 'newark',         heroImage: img('1499092346589-b9b6be3e94b2') },
  { city: 'Jersey City',    state: 'New Jersey',     stateAbbr: 'NJ', stateSlug: 'nj', citySlug: 'jersey-city',    heroImage: img('1499092346589-b9b6be3e94b2') },
  // New Mexico
  { city: 'Albuquerque',    state: 'New Mexico',     stateAbbr: 'NM', stateSlug: 'nm', citySlug: 'albuquerque',    heroImage: img('1558618666-fcd25c85cd64') },
  { city: 'Santa Fe',       state: 'New Mexico',     stateAbbr: 'NM', stateSlug: 'nm', citySlug: 'santa-fe',       heroImage: img('1558618666-fcd25c85cd64') },
  // New York
  { city: 'New York',       state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'new-york',       heroImage: img('1499092346589-b9b6be3e94b2') },
  { city: 'Brooklyn',       state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'brooklyn',       heroImage: img('1499092346589-b9b6be3e94b2') },
  { city: 'Buffalo',        state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'buffalo',        heroImage: img('1499092346589-b9b6be3e94b2') },
  { city: 'Manhattan',      state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'manhattan',      heroImage: img('1499092346589-b9b6be3e94b2') },
  { city: 'Queens',         state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'queens',         heroImage: img('1499092346589-b9b6be3e94b2') },
  { city: 'Bronx',          state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'bronx',          heroImage: img('1499092346589-b9b6be3e94b2') },
  { city: 'Staten Island',  state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'staten-island',  heroImage: img('1499092346589-b9b6be3e94b2') },
  // North Carolina
  { city: 'Charlotte',      state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'charlotte',      heroImage: img('1570461226513-e08b58a52c53') },
  { city: 'Raleigh',        state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'raleigh',        heroImage: img('1570461226513-e08b58a52c53') },
  { city: 'Durham',         state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'durham',         heroImage: img('1570461226513-e08b58a52c53') },
  // North Dakota
  { city: 'Fargo',          state: 'North Dakota',   stateAbbr: 'ND', stateSlug: 'nd', citySlug: 'fargo',          heroImage: img('1575517111839-3a3843ee7f5d') },
  // Ohio
  { city: 'Columbus',       state: 'Ohio',           stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'columbus',       heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'Cleveland',      state: 'Ohio',           stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'cleveland',      heroImage: img('1575517111839-3a3843ee7f5d') },
  { city: 'Cincinnati',     state: 'Ohio',           stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'cincinnati',     heroImage: img('1575517111839-3a3843ee7f5d') },
  // Oklahoma
  { city: 'Oklahoma City',  state: 'Oklahoma',       stateAbbr: 'OK', stateSlug: 'ok', citySlug: 'oklahoma-city',  heroImage: img('1545194445-dddb8f4487c6') },
  { city: 'Tulsa',          state: 'Oklahoma',       stateAbbr: 'OK', stateSlug: 'ok', citySlug: 'tulsa',          heroImage: img('1545194445-dddb8f4487c6') },
  // Oregon
  { city: 'Portland',       state: 'Oregon',         stateAbbr: 'OR', stateSlug: 'or', citySlug: 'portland',       heroImage: img('1497290756760-23ac55edf36f') },
  { city: 'Eugene',         state: 'Oregon',         stateAbbr: 'OR', stateSlug: 'or', citySlug: 'eugene',         heroImage: img('1497290756760-23ac55edf36f') },
  // Pennsylvania
  { city: 'Philadelphia',   state: 'Pennsylvania',   stateAbbr: 'PA', stateSlug: 'pa', citySlug: 'philadelphia',   heroImage: img('1569761316261-9a8696fa2ca3') },
  { city: 'Pittsburgh',     state: 'Pennsylvania',   stateAbbr: 'PA', stateSlug: 'pa', citySlug: 'pittsburgh',     heroImage: img('1569761316261-9a8696fa2ca3') },
  // Rhode Island
  { city: 'Providence',     state: 'Rhode Island',   stateAbbr: 'RI', stateSlug: 'ri', citySlug: 'providence',     heroImage: img('1501979376754-f40fba83ec7d') },
  // South Carolina
  { city: 'Charleston',     state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'sc', citySlug: 'charleston',     heroImage: img('1575383502153-5f9d5d07e5f3') },
  { city: 'Columbia',       state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'sc', citySlug: 'columbia',       heroImage: img('1575383502153-5f9d5d07e5f3') },
  // South Dakota
  { city: 'Sioux Falls',    state: 'South Dakota',   stateAbbr: 'SD', stateSlug: 'sd', citySlug: 'sioux-falls',    heroImage: img('1575517111839-3a3843ee7f5d') },
  // Tennessee
  { city: 'Nashville',      state: 'Tennessee',      stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'nashville',      heroImage: img('1545272334-3073d05a6038') },
  { city: 'Memphis',        state: 'Tennessee',      stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'memphis',        heroImage: img('1545272334-3073d05a6038') },
  { city: 'Knoxville',      state: 'Tennessee',      stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'knoxville',      heroImage: img('1545272334-3073d05a6038') },
  // Texas
  { city: 'Houston',        state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'houston',        heroImage: img('1530089711124-9ca31fb9e863') },
  { city: 'Dallas',         state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'dallas',         heroImage: img('1545194445-dddb8f4487c6') },
  { city: 'Austin',         state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'austin',         heroImage: img('1531218150217-54595bc2b934') },
  { city: 'San Antonio',    state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'san-antonio',    heroImage: img('1545194445-dddb8f4487c6') },
  { city: 'Fort Worth',     state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'fort-worth',     heroImage: img('1545194445-dddb8f4487c6') },
  { city: 'El Paso',        state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'el-paso',        heroImage: img('1545194445-dddb8f4487c6') },
  // Utah
  { city: 'Salt Lake City', state: 'Utah',           stateAbbr: 'UT', stateSlug: 'ut', citySlug: 'salt-lake-city', heroImage: img('1546156929-a4c0ac411f47') },
  { city: 'Provo',          state: 'Utah',           stateAbbr: 'UT', stateSlug: 'ut', citySlug: 'provo',          heroImage: img('1546156929-a4c0ac411f47') },
  // Vermont
  { city: 'Burlington',     state: 'Vermont',        stateAbbr: 'VT', stateSlug: 'vt', citySlug: 'burlington',     heroImage: img('1501979376754-f40fba83ec7d') },
  // Virginia
  { city: 'Virginia Beach', state: 'Virginia',       stateAbbr: 'VA', stateSlug: 'va', citySlug: 'virginia-beach', heroImage: img('1507525428034-b723cf961d3e') },
  { city: 'Richmond',       state: 'Virginia',       stateAbbr: 'VA', stateSlug: 'va', citySlug: 'richmond',       heroImage: img('1575383502153-5f9d5d07e5f3') },
  { city: 'Arlington',      state: 'Virginia',       stateAbbr: 'VA', stateSlug: 'va', citySlug: 'arlington',      heroImage: img('1569761316261-9a8696fa2ca3') },
  // Washington
  { city: 'Seattle',        state: 'Washington',     stateAbbr: 'WA', stateSlug: 'wa', citySlug: 'seattle',        heroImage: img('1502175353174-a7a70e73b362') },
  { city: 'Spokane',        state: 'Washington',     stateAbbr: 'WA', stateSlug: 'wa', citySlug: 'spokane',        heroImage: img('1502175353174-a7a70e73b362') },
  // West Virginia
  { city: 'Charleston',     state: 'West Virginia',  stateAbbr: 'WV', stateSlug: 'wv', citySlug: 'charleston',     heroImage: img('1575383502153-5f9d5d07e5f3') },
  // Wisconsin
  { city: 'Milwaukee',      state: 'Wisconsin',      stateAbbr: 'WI', stateSlug: 'wi', citySlug: 'milwaukee',      heroImage: img('1494522855154-9297ac14b55f') },
  { city: 'Madison',        state: 'Wisconsin',      stateAbbr: 'WI', stateSlug: 'wi', citySlug: 'madison',        heroImage: img('1494522855154-9297ac14b55f') },
  // Wyoming
  { city: 'Cheyenne',       state: 'Wyoming',        stateAbbr: 'WY', stateSlug: 'wy', citySlug: 'cheyenne',       heroImage: img('1546156929-a4c0ac411f47') },
]

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'veterinarians',
    label: 'Veterinarian',
    pluralLabel: 'Veterinarians',
    icon: 'Stethoscope',
    description: 'Routine checkups, vaccinations, and general pet health care',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  {
    slug: 'emergency_vets',
    label: 'Emergency Vet',
    pluralLabel: 'Emergency Vets',
    icon: 'AlertCircle',
    description: '24/7 emergency and critical care animal hospitals',
    color: 'bg-red-50 text-red-700 border-red-100',
  },
  {
    slug: 'groomers',
    label: 'Pet Groomer',
    pluralLabel: 'Pet Groomers',
    icon: 'Scissors',
    description: 'Bathing, haircuts, nail trims, and full grooming services',
    color: 'bg-pink-50 text-pink-700 border-pink-100',
  },
  {
    slug: 'boarding',
    label: 'Pet Boarding',
    pluralLabel: 'Pet Boarding',
    icon: 'Home',
    description: 'Overnight and extended stays for dogs, cats, and small animals',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    slug: 'daycare',
    label: 'Dog Daycare',
    pluralLabel: 'Dog Daycares',
    icon: 'Sun',
    description: 'Supervised daytime play and socialization for dogs',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  },
  {
    slug: 'trainers',
    label: 'Pet Trainer',
    pluralLabel: 'Pet Trainers',
    icon: 'Award',
    description: 'Obedience training, behavioral correction, and puppy classes',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
  },
  {
    slug: 'pet_pharmacies',
    label: 'Pet Pharmacy',
    pluralLabel: 'Pet Pharmacies',
    icon: 'Pill',
    description: 'Prescription medications and supplements for pets',
    color: 'bg-teal-50 text-teal-700 border-teal-100',
  },
]

export function getCityMeta(stateSlug: string, citySlug: string): CityMeta | undefined {
  return CITIES.find(c => c.stateSlug === stateSlug && c.citySlug === citySlug)
}

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find(c => c.slug === slug)
}
