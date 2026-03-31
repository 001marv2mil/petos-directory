export interface CityMeta {
  city: string
  state: string
  stateAbbr: string
  stateSlug: string
  citySlug: string
}

export interface CategoryMeta {
  slug: string
  label: string
  pluralLabel: string
  description: string
}

export const CITIES: CityMeta[] = [
  // Alabama
  { city: 'Birmingham',     state: 'Alabama',        stateAbbr: 'AL', stateSlug: 'al', citySlug: 'birmingham' },
  { city: 'Huntsville',     state: 'Alabama',        stateAbbr: 'AL', stateSlug: 'al', citySlug: 'huntsville' },
  // Alaska
  { city: 'Anchorage',      state: 'Alaska',         stateAbbr: 'AK', stateSlug: 'ak', citySlug: 'anchorage' },
  // Arizona
  { city: 'Phoenix',        state: 'Arizona',        stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'phoenix' },
  { city: 'Scottsdale',     state: 'Arizona',        stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'scottsdale' },
  { city: 'Tucson',         state: 'Arizona',        stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'tucson' },
  // Arkansas
  { city: 'Little Rock',    state: 'Arkansas',       stateAbbr: 'AR', stateSlug: 'ar', citySlug: 'little-rock' },
  { city: 'Fayetteville',   state: 'Arkansas',       stateAbbr: 'AR', stateSlug: 'ar', citySlug: 'fayetteville' },
  // California
  { city: 'Los Angeles',    state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'los-angeles' },
  { city: 'San Diego',      state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-diego' },
  { city: 'San Francisco',  state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-francisco' },
  { city: 'Sacramento',     state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'sacramento' },
  { city: 'San Jose',       state: 'California',     stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-jose' },
  // Colorado
  { city: 'Denver',         state: 'Colorado',       stateAbbr: 'CO', stateSlug: 'co', citySlug: 'denver' },
  { city: 'Colorado Springs', state: 'Colorado',     stateAbbr: 'CO', stateSlug: 'co', citySlug: 'colorado-springs' },
  { city: 'Boulder',        state: 'Colorado',       stateAbbr: 'CO', stateSlug: 'co', citySlug: 'boulder' },
  // Connecticut
  { city: 'Hartford',       state: 'Connecticut',    stateAbbr: 'CT', stateSlug: 'ct', citySlug: 'hartford' },
  { city: 'Stamford',       state: 'Connecticut',    stateAbbr: 'CT', stateSlug: 'ct', citySlug: 'stamford' },
  // Delaware
  { city: 'Wilmington',     state: 'Delaware',       stateAbbr: 'DE', stateSlug: 'de', citySlug: 'wilmington' },
  // Florida
  { city: 'Tampa',          state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'tampa' },
  { city: 'St. Petersburg', state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'st-petersburg' },
  { city: 'Clearwater',     state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'clearwater' },
  { city: 'Orlando',        state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'orlando' },
  { city: 'Miami',          state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'miami' },
  { city: 'Jacksonville',   state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'jacksonville' },
  { city: 'Fort Lauderdale', state: 'Florida',       stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'fort-lauderdale' },
  { city: 'Sarasota',       state: 'Florida',        stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'sarasota' },
  // Georgia
  { city: 'Atlanta',        state: 'Georgia',        stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'atlanta' },
  { city: 'Savannah',       state: 'Georgia',        stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'savannah' },
  { city: 'Augusta',        state: 'Georgia',        stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'augusta' },
  // Hawaii
  { city: 'Honolulu',       state: 'Hawaii',         stateAbbr: 'HI', stateSlug: 'hi', citySlug: 'honolulu' },
  // Idaho
  { city: 'Boise',          state: 'Idaho',          stateAbbr: 'ID', stateSlug: 'id', citySlug: 'boise' },
  // Illinois
  { city: 'Chicago',        state: 'Illinois',       stateAbbr: 'IL', stateSlug: 'il', citySlug: 'chicago' },
  { city: 'Naperville',     state: 'Illinois',       stateAbbr: 'IL', stateSlug: 'il', citySlug: 'naperville' },
  // Indiana
  { city: 'Indianapolis',   state: 'Indiana',        stateAbbr: 'IN', stateSlug: 'in', citySlug: 'indianapolis' },
  { city: 'Fort Wayne',     state: 'Indiana',        stateAbbr: 'IN', stateSlug: 'in', citySlug: 'fort-wayne' },
  // Iowa
  { city: 'Des Moines',     state: 'Iowa',           stateAbbr: 'IA', stateSlug: 'ia', citySlug: 'des-moines' },
  { city: 'Cedar Rapids',   state: 'Iowa',           stateAbbr: 'IA', stateSlug: 'ia', citySlug: 'cedar-rapids' },
  // Kansas
  { city: 'Wichita',        state: 'Kansas',         stateAbbr: 'KS', stateSlug: 'ks', citySlug: 'wichita' },
  { city: 'Overland Park',  state: 'Kansas',         stateAbbr: 'KS', stateSlug: 'ks', citySlug: 'overland-park' },
  // Kentucky
  { city: 'Louisville',     state: 'Kentucky',       stateAbbr: 'KY', stateSlug: 'ky', citySlug: 'louisville' },
  { city: 'Lexington',      state: 'Kentucky',       stateAbbr: 'KY', stateSlug: 'ky', citySlug: 'lexington' },
  // Louisiana
  { city: 'New Orleans',    state: 'Louisiana',      stateAbbr: 'LA', stateSlug: 'la', citySlug: 'new-orleans' },
  { city: 'Baton Rouge',    state: 'Louisiana',      stateAbbr: 'LA', stateSlug: 'la', citySlug: 'baton-rouge' },
  // Maine
  { city: 'Portland',       state: 'Maine',          stateAbbr: 'ME', stateSlug: 'me', citySlug: 'portland' },
  // Maryland
  { city: 'Baltimore',      state: 'Maryland',       stateAbbr: 'MD', stateSlug: 'md', citySlug: 'baltimore' },
  { city: 'Rockville',      state: 'Maryland',       stateAbbr: 'MD', stateSlug: 'md', citySlug: 'rockville' },
  // Massachusetts
  { city: 'Boston',         state: 'Massachusetts',  stateAbbr: 'MA', stateSlug: 'ma', citySlug: 'boston' },
  { city: 'Worcester',      state: 'Massachusetts',  stateAbbr: 'MA', stateSlug: 'ma', citySlug: 'worcester' },
  // Michigan
  { city: 'Detroit',        state: 'Michigan',       stateAbbr: 'MI', stateSlug: 'mi', citySlug: 'detroit' },
  { city: 'Grand Rapids',   state: 'Michigan',       stateAbbr: 'MI', stateSlug: 'mi', citySlug: 'grand-rapids' },
  // Minnesota
  { city: 'Minneapolis',    state: 'Minnesota',      stateAbbr: 'MN', stateSlug: 'mn', citySlug: 'minneapolis' },
  { city: 'St. Paul',       state: 'Minnesota',      stateAbbr: 'MN', stateSlug: 'mn', citySlug: 'st-paul' },
  // Mississippi
  { city: 'Jackson',        state: 'Mississippi',    stateAbbr: 'MS', stateSlug: 'ms', citySlug: 'jackson' },
  // Missouri
  { city: 'Kansas City',    state: 'Missouri',       stateAbbr: 'MO', stateSlug: 'mo', citySlug: 'kansas-city' },
  { city: 'St. Louis',      state: 'Missouri',       stateAbbr: 'MO', stateSlug: 'mo', citySlug: 'st-louis' },
  // Montana
  { city: 'Billings',       state: 'Montana',        stateAbbr: 'MT', stateSlug: 'mt', citySlug: 'billings' },
  { city: 'Missoula',       state: 'Montana',        stateAbbr: 'MT', stateSlug: 'mt', citySlug: 'missoula' },
  // Nebraska
  { city: 'Omaha',          state: 'Nebraska',       stateAbbr: 'NE', stateSlug: 'ne', citySlug: 'omaha' },
  { city: 'Lincoln',        state: 'Nebraska',       stateAbbr: 'NE', stateSlug: 'ne', citySlug: 'lincoln' },
  // Nevada
  { city: 'Las Vegas',      state: 'Nevada',         stateAbbr: 'NV', stateSlug: 'nv', citySlug: 'las-vegas' },
  { city: 'Reno',           state: 'Nevada',         stateAbbr: 'NV', stateSlug: 'nv', citySlug: 'reno' },
  // New Hampshire
  { city: 'Manchester',     state: 'New Hampshire',  stateAbbr: 'NH', stateSlug: 'nh', citySlug: 'manchester' },
  // New Jersey
  { city: 'Newark',         state: 'New Jersey',     stateAbbr: 'NJ', stateSlug: 'nj', citySlug: 'newark' },
  { city: 'Jersey City',    state: 'New Jersey',     stateAbbr: 'NJ', stateSlug: 'nj', citySlug: 'jersey-city' },
  // New Mexico
  { city: 'Albuquerque',    state: 'New Mexico',     stateAbbr: 'NM', stateSlug: 'nm', citySlug: 'albuquerque' },
  { city: 'Santa Fe',       state: 'New Mexico',     stateAbbr: 'NM', stateSlug: 'nm', citySlug: 'santa-fe' },
  // New York
  { city: 'New York',       state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'new-york' },
  { city: 'Brooklyn',       state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'brooklyn' },
  { city: 'Buffalo',        state: 'New York',       stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'buffalo' },
  // North Carolina
  { city: 'Charlotte',      state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'charlotte' },
  { city: 'Raleigh',        state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'raleigh' },
  { city: 'Durham',         state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'durham' },
  // North Dakota
  { city: 'Fargo',          state: 'North Dakota',   stateAbbr: 'ND', stateSlug: 'nd', citySlug: 'fargo' },
  // Ohio
  { city: 'Columbus',       state: 'Ohio',           stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'columbus' },
  { city: 'Cleveland',      state: 'Ohio',           stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'cleveland' },
  { city: 'Cincinnati',     state: 'Ohio',           stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'cincinnati' },
  // Oklahoma
  { city: 'Oklahoma City',  state: 'Oklahoma',       stateAbbr: 'OK', stateSlug: 'ok', citySlug: 'oklahoma-city' },
  { city: 'Tulsa',          state: 'Oklahoma',       stateAbbr: 'OK', stateSlug: 'ok', citySlug: 'tulsa' },
  // Oregon
  { city: 'Portland',       state: 'Oregon',         stateAbbr: 'OR', stateSlug: 'or', citySlug: 'portland' },
  { city: 'Eugene',         state: 'Oregon',         stateAbbr: 'OR', stateSlug: 'or', citySlug: 'eugene' },
  // Pennsylvania
  { city: 'Philadelphia',   state: 'Pennsylvania',   stateAbbr: 'PA', stateSlug: 'pa', citySlug: 'philadelphia' },
  { city: 'Pittsburgh',     state: 'Pennsylvania',   stateAbbr: 'PA', stateSlug: 'pa', citySlug: 'pittsburgh' },
  // Rhode Island
  { city: 'Providence',     state: 'Rhode Island',   stateAbbr: 'RI', stateSlug: 'ri', citySlug: 'providence' },
  // South Carolina
  { city: 'Charleston',     state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'sc', citySlug: 'charleston' },
  { city: 'Columbia',       state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'sc', citySlug: 'columbia' },
  // South Dakota
  { city: 'Sioux Falls',    state: 'South Dakota',   stateAbbr: 'SD', stateSlug: 'sd', citySlug: 'sioux-falls' },
  // Tennessee
  { city: 'Nashville',      state: 'Tennessee',      stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'nashville' },
  { city: 'Memphis',        state: 'Tennessee',      stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'memphis' },
  { city: 'Knoxville',      state: 'Tennessee',      stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'knoxville' },
  // Texas
  { city: 'Houston',        state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'houston' },
  { city: 'Dallas',         state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'dallas' },
  { city: 'Austin',         state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'austin' },
  { city: 'San Antonio',    state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'san-antonio' },
  { city: 'Fort Worth',     state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'fort-worth' },
  { city: 'El Paso',        state: 'Texas',          stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'el-paso' },
  // Utah
  { city: 'Salt Lake City', state: 'Utah',           stateAbbr: 'UT', stateSlug: 'ut', citySlug: 'salt-lake-city' },
  { city: 'Provo',          state: 'Utah',           stateAbbr: 'UT', stateSlug: 'ut', citySlug: 'provo' },
  // Vermont
  { city: 'Burlington',     state: 'Vermont',        stateAbbr: 'VT', stateSlug: 'vt', citySlug: 'burlington' },
  // Virginia
  { city: 'Virginia Beach', state: 'Virginia',       stateAbbr: 'VA', stateSlug: 'va', citySlug: 'virginia-beach' },
  { city: 'Richmond',       state: 'Virginia',       stateAbbr: 'VA', stateSlug: 'va', citySlug: 'richmond' },
  { city: 'Arlington',      state: 'Virginia',       stateAbbr: 'VA', stateSlug: 'va', citySlug: 'arlington' },
  // Washington
  { city: 'Seattle',        state: 'Washington',     stateAbbr: 'WA', stateSlug: 'wa', citySlug: 'seattle' },
  { city: 'Spokane',        state: 'Washington',     stateAbbr: 'WA', stateSlug: 'wa', citySlug: 'spokane' },
  // West Virginia
  { city: 'Charleston',     state: 'West Virginia',  stateAbbr: 'WV', stateSlug: 'wv', citySlug: 'charleston' },
  // Wisconsin
  { city: 'Milwaukee',      state: 'Wisconsin',      stateAbbr: 'WI', stateSlug: 'wi', citySlug: 'milwaukee' },
  { city: 'Madison',        state: 'Wisconsin',      stateAbbr: 'WI', stateSlug: 'wi', citySlug: 'madison' },
  // Wyoming
  { city: 'Cheyenne',       state: 'Wyoming',        stateAbbr: 'WY', stateSlug: 'wy', citySlug: 'cheyenne' },
]

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'veterinarians',
    label: 'Veterinarian',
    pluralLabel: 'Veterinarians',
    description: 'Routine checkups, vaccinations, and general pet health care',
  },
  {
    slug: 'emergency_vets',
    label: 'Emergency Vet',
    pluralLabel: 'Emergency Vets',
    description: '24/7 emergency and critical care animal hospitals',
  },
  {
    slug: 'groomers',
    label: 'Pet Groomer',
    pluralLabel: 'Pet Groomers',
    description: 'Bathing, haircuts, nail trims, and full grooming services',
  },
  {
    slug: 'boarding',
    label: 'Pet Boarding',
    pluralLabel: 'Pet Boarding',
    description: 'Overnight and extended stays for dogs, cats, and small animals',
  },
  {
    slug: 'daycare',
    label: 'Dog Daycare',
    pluralLabel: 'Dog Daycares',
    description: 'Supervised daytime play and socialization for dogs',
  },
  {
    slug: 'trainers',
    label: 'Pet Trainer',
    pluralLabel: 'Pet Trainers',
    description: 'Obedience training, behavioral correction, and puppy classes',
  },
  {
    slug: 'pet_pharmacies',
    label: 'Pet Pharmacy',
    pluralLabel: 'Pet Pharmacies',
    description: 'Prescription medications and supplements for pets',
  },
]
