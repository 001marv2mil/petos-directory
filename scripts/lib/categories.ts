import type { CategorySlug } from '../../src/types/index.js'

export interface CityCenter {
  city: string
  state: string
  stateAbbr: string
  stateSlug: string
  citySlug: string
  lat: number
  lng: number
  streetTypes: string[]
  streetNames: string[]
  zipBase: string
}

export const CITY_CENTERS: CityCenter[] = [
  {
    city: 'Tampa', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'tampa',
    lat: 27.9506, lng: -82.4572, zipBase: '336',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln', 'Way', 'Ct'],
    streetNames: ['Bay Shore', 'Dale Mabry', 'Armenia', 'MacDill', 'Busch', 'Fletcher', 'Nebraska', 'Waters', 'Hillsborough', 'Columbus', 'Fowler', 'Bruce B Downs'],
  },
  {
    city: 'St. Petersburg', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'st-petersburg',
    lat: 27.7731, lng: -82.6400, zipBase: '337',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Central', 'Park', 'Mirror Lake', '4th', '22nd', 'Tyrone', 'MLK', 'Ulmerton', 'Bay Pines'],
  },
  {
    city: 'Clearwater', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'clearwater',
    lat: 27.9659, lng: -82.8001, zipBase: '337',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Gulf To Bay', 'US-19', 'McMullen Booth', 'Drew', 'Main', 'Belleair', 'Sunset Point'],
  },
  {
    city: 'Brandon', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'brandon',
    lat: 27.9378, lng: -82.2859, zipBase: '335',
    streetTypes: ['Blvd', 'Ave', 'Dr', 'Rd', 'Ln', 'Way'],
    streetNames: ['Brandon', 'Bloomingdale', 'Lithia Pinecrest', 'Bell Shoals', 'Lumsden', 'Kings', 'Providence'],
  },
  {
    city: 'Orlando', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'orlando',
    lat: 28.5383, lng: -81.3792, zipBase: '328',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Way'],
    streetNames: ['Orange', 'Colonial', 'Semoran', 'John Young', 'OBT', 'Sand Lake', 'University', 'Lake Underhill'],
  },
  {
    city: 'Miami', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'miami',
    lat: 25.7617, lng: -80.1918, zipBase: '331',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Biscayne', 'Collins', 'NW 7th', 'Coral Way', 'Flagler', 'Bird Rd', 'LeJeune', 'US-1', 'Kendall'],
  },
  {
    city: 'Dallas', state: 'Texas', stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'dallas',
    lat: 32.7767, lng: -96.7970, zipBase: '752',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln', 'Pkwy'],
    streetNames: ['Greenville', 'Lovers Lane', 'Preston', 'Mockingbird', 'Oak Lawn', 'Inwood', 'Forest', 'Northwest Hwy'],
  },
  {
    city: 'Austin', state: 'Texas', stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'austin',
    lat: 30.2672, lng: -97.7431, zipBase: '787',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Loop'],
    streetNames: ['Lamar', 'Burnet', 'South Congress', 'Oltorf', 'Slaughter', 'Manchaca', 'Brodie', 'Anderson'],
  },
  {
    city: 'Houston', state: 'Texas', stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'houston',
    lat: 29.7604, lng: -95.3698, zipBase: '770',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Westheimer', 'Memorial', 'Shepherd', 'Kirby', 'Richmond', 'Bellaire', 'Bissonnet', 'Hillcroft'],
  },
  {
    city: 'Atlanta', state: 'Georgia', stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'atlanta',
    lat: 33.7490, lng: -84.3880, zipBase: '303',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pkwy'],
    streetNames: ['Peachtree', 'Piedmont', 'Ponce de Leon', 'Cheshire Bridge', 'Howell Mill', 'Briarcliff', 'Buford Hwy'],
  },
  {
    city: 'Nashville', state: 'Tennessee', stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'nashville',
    lat: 36.1627, lng: -86.7816, zipBase: '372',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pike'],
    streetNames: ['Charlotte', 'Gallatin', 'Nolensville', 'Harding', 'West End', 'Thompson Ln', 'Murfreesboro'],
  },
  {
    city: 'Charlotte', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'charlotte',
    lat: 35.2271, lng: -80.8431, zipBase: '282',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Park', 'South Blvd', 'Monroe', 'Independence', 'Albemarle', 'Rea', 'Providence', 'Sharon Amity'],
  },
  {
    city: 'Phoenix', state: 'Arizona', stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'phoenix',
    lat: 33.4484, lng: -112.0740, zipBase: '850',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Way'],
    streetNames: ['Camelback', 'Thomas', 'Indian School', 'McDowell', 'Van Buren', 'Bell', 'Northern', 'Glendale'],
  },
  {
    city: 'Denver', state: 'Colorado', stateAbbr: 'CO', stateSlug: 'co', citySlug: 'denver',
    lat: 39.7392, lng: -104.9903, zipBase: '802',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Colfax', 'Broadway', 'Colorado', 'University', 'Monaco', 'Havana', 'Leetsdale', 'Evans'],
  },
  {
    city: 'Boulder', state: 'Colorado', stateAbbr: 'CO', stateSlug: 'co', citySlug: 'boulder',
    lat: 40.0150, lng: -105.2705, zipBase: '803',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Pearl', 'Broadway', 'Arapahoe', 'Canyon', 'Baseline', 'Folsom', 'Diagonal Hwy'],
  },
  {
    city: 'Los Angeles', state: 'California', stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'los-angeles',
    lat: 34.0522, lng: -118.2437, zipBase: '900',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Way'],
    streetNames: ['Wilshire', 'Sunset', 'Pico', 'Olympic', 'Venice', 'La Cienega', 'Sepulveda', 'Cahuenga'],
  },
  {
    city: 'Chicago', state: 'Illinois', stateAbbr: 'IL', stateSlug: 'il', citySlug: 'chicago',
    lat: 41.8781, lng: -87.6298, zipBase: '606',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Clark', 'Halsted', 'Ashland', 'Western', 'Milwaukee', 'Lincoln', 'Broadway', 'Devon'],
  },
  {
    city: 'New York', state: 'New York', stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'new-york',
    lat: 40.7128, lng: -74.0060, zipBase: '100',
    streetTypes: ['Ave', 'St', 'Blvd', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Broadway', 'Lexington', 'Amsterdam', 'Columbus', 'Central Park West', 'Riverside', 'Madison', 'Park'],
  },
  {
    city: 'Jacksonville', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'jacksonville',
    lat: 30.3322, lng: -81.6557, zipBase: '322',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Beach', 'Atlantic', 'Hendricks', 'San Jose', 'Arlington', 'Baymeadows', 'Southside'],
  },
  {
    city: 'Fort Lauderdale', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'fort-lauderdale',
    lat: 26.1224, lng: -80.1373, zipBase: '333',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Federal Hwy', 'Oakland Park', 'Commercial', 'Sunrise', 'Broward', 'Las Olas', 'Griffin'],
  },
  {
    city: 'Sarasota', state: 'Florida', stateAbbr: 'FL', stateSlug: 'fl', citySlug: 'sarasota',
    lat: 27.3364, lng: -82.5307, zipBase: '342',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Fruitville', 'Bee Ridge', 'Clark', 'Osprey', 'Beneva', 'Tuttle', 'Tamiami Trail'],
  },
  {
    city: 'San Antonio', state: 'Texas', stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'san-antonio',
    lat: 29.4241, lng: -98.4936, zipBase: '782',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Loop'],
    streetNames: ['Broadway', 'San Pedro', 'Fredericksburg', 'Culebra', 'Military', 'Ingram', 'Bandera'],
  },
  {
    city: 'Fort Worth', state: 'Texas', stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'fort-worth',
    lat: 32.7555, lng: -97.3308, zipBase: '761',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Camp Bowie', 'University', 'Hulen', 'Berry', 'Cleburne', 'South Fwy', 'Seminary'],
  },
  {
    city: 'Savannah', state: 'Georgia', stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'savannah',
    lat: 32.0835, lng: -81.0998, zipBase: '314',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Ln'],
    streetNames: ['Victory Dr', 'DeRenne', 'Abercorn', 'Skidaway', 'Oglethorpe', 'Bull', 'Waters'],
  },
  {
    city: 'Memphis', state: 'Tennessee', stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'memphis',
    lat: 35.1495, lng: -90.0490, zipBase: '381',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Poplar', 'Summer', 'Union', 'Elvis Presley', 'Getwell', 'Quince', 'Germantown'],
  },
  {
    city: 'Raleigh', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'raleigh',
    lat: 35.7796, lng: -78.6382, zipBase: '276',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pkwy'],
    streetNames: ['Capital', 'Falls of Neuse', 'Wake Forest', 'Six Forks', 'Glenwood', 'New Bern', 'Western'],
  },
  {
    city: 'Scottsdale', state: 'Arizona', stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'scottsdale',
    lat: 33.4942, lng: -111.9261, zipBase: '852',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Way'],
    streetNames: ['Scottsdale Rd', 'Shea', 'Frank Lloyd Wright', 'McDowell', 'Camelback', 'Lincoln', 'Thomas'],
  },
  {
    city: 'Tucson', state: 'Arizona', stateAbbr: 'AZ', stateSlug: 'az', citySlug: 'tucson',
    lat: 32.2226, lng: -110.9747, zipBase: '857',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Speedway', 'Grant', 'Broadway', 'Kolb', 'Swan', 'Oracle', 'Campbell'],
  },
  {
    city: 'Colorado Springs', state: 'Colorado', stateAbbr: 'CO', stateSlug: 'co', citySlug: 'colorado-springs',
    lat: 38.8339, lng: -104.8214, zipBase: '809',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Nevada', 'Academy', 'Powers', 'Woodmen', 'Platte', 'Fountain', 'Centennial'],
  },
  {
    city: 'San Diego', state: 'California', stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-diego',
    lat: 32.7157, lng: -117.1611, zipBase: '921',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Way'],
    streetNames: ['El Cajon', 'Mission', 'University', 'Adams', 'Balboa', 'Clairemont Mesa', 'Miramar'],
  },
  {
    city: 'San Francisco', state: 'California', stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-francisco',
    lat: 37.7749, lng: -122.4194, zipBase: '941',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr'],
    streetNames: ['Market', 'Geary', 'Mission', 'Valencia', 'Castro', 'Haight', 'Divisadero', 'Irving'],
  },
  {
    city: 'Sacramento', state: 'California', stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'sacramento',
    lat: 38.5816, lng: -121.4944, zipBase: '958',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Arden Way', 'Watt', 'Florin', 'Stockton', 'El Camino', 'Sunrise', 'Folsom'],
  },
  {
    city: 'Seattle', state: 'Washington', stateAbbr: 'WA', stateSlug: 'wa', citySlug: 'seattle',
    lat: 47.6062, lng: -122.3321, zipBase: '981',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Way'],
    streetNames: ['Aurora', 'Rainier', 'Lake City', 'Eastlake', 'Ballard', 'Broadway', 'MLK Jr'],
  },
  {
    city: 'Portland', state: 'Oregon', stateAbbr: 'OR', stateSlug: 'or', citySlug: 'portland',
    lat: 45.5051, lng: -122.6750, zipBase: '972',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Burnside', 'Powell', 'Hawthorne', 'Division', 'Alberta', 'Broadway', 'Sandy'],
  },
  {
    city: 'Las Vegas', state: 'Nevada', stateAbbr: 'NV', stateSlug: 'nv', citySlug: 'las-vegas',
    lat: 36.1699, lng: -115.1398, zipBase: '891',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pkwy'],
    streetNames: ['Flamingo', 'Charleston', 'Sahara', 'Tropicana', 'Sunset', 'Craig', 'Cheyenne'],
  },
  {
    city: 'Philadelphia', state: 'Pennsylvania', stateAbbr: 'PA', stateSlug: 'pa', citySlug: 'philadelphia',
    lat: 39.9526, lng: -75.1652, zipBase: '191',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Market', 'Chestnut', 'Broad', 'Roosevelt', 'Ridge', 'Frankford', 'Lancaster'],
  },
  {
    city: 'Pittsburgh', state: 'Pennsylvania', stateAbbr: 'PA', stateSlug: 'pa', citySlug: 'pittsburgh',
    lat: 40.4406, lng: -79.9959, zipBase: '152',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Penn', 'Fifth', 'Forbes', 'Liberty', 'Baum', 'Centre', 'Banksville'],
  },
  {
    city: 'Columbus', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'columbus',
    lat: 39.9612, lng: -82.9988, zipBase: '432',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['High', 'Broad', 'Dublin Granville', 'Morse', 'Clintonville', 'Henderson', 'Bethel'],
  },
  {
    city: 'Cleveland', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'cleveland',
    lat: 41.4993, lng: -81.6944, zipBase: '441',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Euclid', 'Detroit', 'Carnegie', 'Cedar', 'Lorain', 'Pearl', 'Broadview'],
  },
  {
    city: 'Detroit', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'mi', citySlug: 'detroit',
    lat: 42.3314, lng: -83.0458, zipBase: '482',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Woodward', 'Grand River', 'Michigan', 'Jefferson', 'Gratiot', 'Livernois', 'McNichols'],
  },
  {
    city: 'Minneapolis', state: 'Minnesota', stateAbbr: 'MN', stateSlug: 'mn', citySlug: 'minneapolis',
    lat: 44.9778, lng: -93.2650, zipBase: '554',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Lyndale', 'Lake', 'Franklin', 'Nicollet', 'Penn', 'Hennepin', 'Cedar'],
  },
  {
    city: 'Kansas City', state: 'Missouri', stateAbbr: 'MO', stateSlug: 'mo', citySlug: 'kansas-city',
    lat: 39.0997, lng: -94.5786, zipBase: '641',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pkwy'],
    streetNames: ['Wornall', 'Ward Pkwy', 'Troost', 'Brookside', 'Holmes', 'Metcalf', 'State Line'],
  },
  {
    city: 'St. Louis', state: 'Missouri', stateAbbr: 'MO', stateSlug: 'mo', citySlug: 'st-louis',
    lat: 38.6270, lng: -90.1994, zipBase: '631',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Lindell', 'Delmar', 'Manchester', 'Gravois', 'Hampton', 'Watson', 'Chippewa'],
  },
  {
    city: 'Virginia Beach', state: 'Virginia', stateAbbr: 'VA', stateSlug: 'va', citySlug: 'virginia-beach',
    lat: 36.8529, lng: -75.9780, zipBase: '234',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pkwy'],
    streetNames: ['Virginia Beach Blvd', 'Shore Dr', 'Laskin', 'Independence', 'Kempsville', 'Holland'],
  },
  {
    city: 'Richmond', state: 'Virginia', stateAbbr: 'VA', stateSlug: 'va', citySlug: 'richmond',
    lat: 37.5407, lng: -77.4360, zipBase: '232',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Broad', 'Main', 'Cary', 'Patterson', 'Three Chopt', 'Forest Hill', 'Hull'],
  },
  {
    city: 'Baltimore', state: 'Maryland', stateAbbr: 'MD', stateSlug: 'md', citySlug: 'baltimore',
    lat: 39.2904, lng: -76.6122, zipBase: '212',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Harford', 'Belair', 'Pulaski', 'Reisterstown', 'York', 'Falls', 'Liberty'],
  },
  {
    city: 'Boston', state: 'Massachusetts', stateAbbr: 'MA', stateSlug: 'ma', citySlug: 'boston',
    lat: 42.3601, lng: -71.0589, zipBase: '021',
    streetTypes: ['Ave', 'St', 'Rd', 'Blvd', 'Dr'],
    streetNames: ['Commonwealth', 'Beacon', 'Newbury', 'Boylston', 'Huntington', 'Mass Ave', 'Cambridge'],
  },
  {
    city: 'Indianapolis', state: 'Indiana', stateAbbr: 'IN', stateSlug: 'in', citySlug: 'indianapolis',
    lat: 39.7684, lng: -86.1581, zipBase: '462',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Keystone', 'Meridian', 'Washington', 'Michigan', '38th', '86th', 'Fall Creek'],
  },
  {
    city: 'Milwaukee', state: 'Wisconsin', stateAbbr: 'WI', stateSlug: 'wi', citySlug: 'milwaukee',
    lat: 43.0389, lng: -87.9065, zipBase: '532',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Wisconsin', 'Oklahoma', 'National', 'Greenfield', 'Bluemound', 'Capitol', 'Lisbon'],
  },
  {
    city: 'Oklahoma City', state: 'Oklahoma', stateAbbr: 'OK', stateSlug: 'ok', citySlug: 'oklahoma-city',
    lat: 35.4676, lng: -97.5164, zipBase: '731',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['Memorial', 'Penn', 'May', 'Western', 'Classen', 'NW Expressway', 'Council'],
  },
  {
    city: 'New Orleans', state: 'Louisiana', stateAbbr: 'LA', stateSlug: 'la', citySlug: 'new-orleans',
    lat: 29.9511, lng: -90.0715, zipBase: '701',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr'],
    streetNames: ['Magazine', 'St Charles', 'Canal', 'Claiborne', 'Jefferson Hwy', 'Gentilly', 'Esplanade'],
  },
  {
    city: 'Salt Lake City', state: 'Utah', stateAbbr: 'UT', stateSlug: 'ut', citySlug: 'salt-lake-city',
    lat: 40.7608, lng: -111.8910, zipBase: '841',
    streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'],
    streetNames: ['State', 'Main', '700 East', '900 South', 'Foothill', 'Highland', 'Redwood'],
  },
  {
    city: 'Brooklyn', state: 'New York', stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'brooklyn',
    lat: 40.6782, lng: -73.9442, zipBase: '112',
    streetTypes: ['Ave', 'St', 'Blvd', 'Rd'],
    streetNames: ['Flatbush', 'Atlantic', 'Bedford', 'Fifth', 'Church', 'Kings Hwy', 'Nostrand'],
  },
  // Alabama
  { city: 'Birmingham', state: 'Alabama', stateAbbr: 'AL', stateSlug: 'al', citySlug: 'birmingham', lat: 33.5186, lng: -86.8104, zipBase: '352', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Clairmont', 'Montclair', 'Lakeshore', '280', 'University', 'Cahaba Valley', 'Pinson Valley'] },
  { city: 'Huntsville', state: 'Alabama', stateAbbr: 'AL', stateSlug: 'al', citySlug: 'huntsville', lat: 34.7304, lng: -86.5861, zipBase: '358', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Memorial Pkwy', 'University', 'Jordan Ln', 'Whitesburg', 'Research Park', 'Bailey Cove'] },
  // Alaska
  { city: 'Anchorage', state: 'Alaska', stateAbbr: 'AK', stateSlug: 'ak', citySlug: 'anchorage', lat: 61.2181, lng: -149.9003, zipBase: '995', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Northern Lights', 'Benson', 'Tudor', 'Dimond', 'Old Seward', 'Huffman', 'Abbott'] },
  // Arkansas
  { city: 'Little Rock', state: 'Arkansas', stateAbbr: 'AR', stateSlug: 'ar', citySlug: 'little-rock', lat: 34.7465, lng: -92.2896, zipBase: '722', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Cantrell', 'Kanis', 'Rodney Parham', 'Chenal Pkwy', 'University', 'Markham', 'Colonel Glenn'] },
  { city: 'Fayetteville', state: 'Arkansas', stateAbbr: 'AR', stateSlug: 'ar', citySlug: 'fayetteville', lat: 36.0626, lng: -94.1574, zipBase: '727', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['College', 'Dickson', 'Joyce', 'MLK Jr', 'Garland', 'Wedington', 'Mission'] },
  // Connecticut
  { city: 'Hartford', state: 'Connecticut', stateAbbr: 'CT', stateSlug: 'ct', citySlug: 'hartford', lat: 41.7658, lng: -72.6851, zipBase: '061', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Farmington', 'New Britain', 'Albany', 'Maple', 'Asylum', 'Park', 'New Park'] },
  { city: 'Stamford', state: 'Connecticut', stateAbbr: 'CT', stateSlug: 'ct', citySlug: 'stamford', lat: 41.0534, lng: -73.5387, zipBase: '069', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['High Ridge', 'Long Ridge', 'Summer', 'Bedford', 'Hope', 'Shippan', 'Newfield'] },
  // Delaware
  { city: 'Wilmington', state: 'Delaware', stateAbbr: 'DE', stateSlug: 'de', citySlug: 'wilmington', lat: 39.7447, lng: -75.5484, zipBase: '198', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Concord Pike', 'Lancaster Pike', 'Kirkwood Hwy', 'Philadelphia Pike', 'Market', 'Union', 'Delaware'] },
  // Georgia additions
  { city: 'Augusta', state: 'Georgia', stateAbbr: 'GA', stateSlug: 'ga', citySlug: 'augusta', lat: 33.4735, lng: -82.0105, zipBase: '309', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Washington', 'Wrightsboro', 'Gordon Hwy', 'Walton Way', 'Peach Orchard', 'Deans Bridge', 'Wheeler'] },
  // Hawaii
  { city: 'Honolulu', state: 'Hawaii', stateAbbr: 'HI', stateSlug: 'hi', citySlug: 'honolulu', lat: 21.3069, lng: -157.8583, zipBase: '968', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Kapiolani', 'King', 'Beretania', 'Pali Hwy', 'Nimitz', 'Kalakaua', 'Ala Moana'] },
  // Idaho
  { city: 'Boise', state: 'Idaho', stateAbbr: 'ID', stateSlug: 'id', citySlug: 'boise', lat: 43.6150, lng: -116.2023, zipBase: '837', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['State', 'Overland', 'Fairview', 'Broadway', 'Ustick', 'McMillan', 'Orchard'] },
  // Illinois additions
  { city: 'Naperville', state: 'Illinois', stateAbbr: 'IL', stateSlug: 'il', citySlug: 'naperville', lat: 41.7508, lng: -88.1535, zipBase: '605', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Ogden', 'Diehl', 'Jefferson', 'Washington', 'Aurora', 'Plainfield', 'Book'] },
  // Indiana additions
  { city: 'Fort Wayne', state: 'Indiana', stateAbbr: 'IN', stateSlug: 'in', citySlug: 'fort-wayne', lat: 41.1306, lng: -85.1289, zipBase: '468', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Coliseum', 'Illinois', 'Lima', 'Clinton', 'Anthony', 'Maplecrest', 'Stellhorn'] },
  // Iowa
  { city: 'Des Moines', state: 'Iowa', stateAbbr: 'IA', stateSlug: 'ia', citySlug: 'des-moines', lat: 41.5868, lng: -93.6250, zipBase: '503', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Ingersoll', 'University', 'Fleur Dr', 'Merle Hay', 'Douglas', 'MLK Jr Pkwy', 'Hickman'] },
  { city: 'Cedar Rapids', state: 'Iowa', stateAbbr: 'IA', stateSlug: 'ia', citySlug: 'cedar-rapids', lat: 41.9779, lng: -91.6656, zipBase: '524', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Collins Rd', 'Center Point Rd', 'Blairs Ferry', 'Edgewood', 'Williams', 'Mt Vernon', 'J Ave'] },
  // Kansas
  { city: 'Wichita', state: 'Kansas', stateAbbr: 'KS', stateSlug: 'ks', citySlug: 'wichita', lat: 37.6872, lng: -97.3301, zipBase: '672', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Kellogg', 'Rock', 'Meridian', 'Oliver', 'Woodlawn', 'Central', 'Harry'] },
  { city: 'Overland Park', state: 'Kansas', stateAbbr: 'KS', stateSlug: 'ks', citySlug: 'overland-park', lat: 38.9822, lng: -94.6708, zipBase: '662', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Metcalf', 'Antioch', 'Quivira', 'Roe', '119th', '135th', 'College'] },
  // Kentucky
  { city: 'Louisville', state: 'Kentucky', stateAbbr: 'KY', stateSlug: 'ky', citySlug: 'louisville', lat: 38.2527, lng: -85.7585, zipBase: '402', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Bardstown', 'Shelbyville', 'Brownsboro', 'Taylorsville', 'Preston', 'Dixie Hwy', 'Newburg'] },
  { city: 'Lexington', state: 'Kentucky', stateAbbr: 'KY', stateSlug: 'ky', citySlug: 'lexington', lat: 38.0406, lng: -84.5037, zipBase: '405', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pike'], streetNames: ['Nicholasville', 'Tates Creek', 'Richmond', 'Harrodsburg', 'Paris', 'Leestown', 'Georgetown'] },
  // Louisiana additions
  { city: 'Baton Rouge', state: 'Louisiana', stateAbbr: 'LA', stateSlug: 'la', citySlug: 'baton-rouge', lat: 30.4515, lng: -91.1871, zipBase: '708', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Airline', 'Florida', 'Perkins', 'Jefferson Hwy', 'Highland', 'Siegen Ln', 'College'] },
  // Maine
  { city: 'Portland', state: 'Maine', stateAbbr: 'ME', stateSlug: 'me', citySlug: 'portland', lat: 43.6591, lng: -70.2568, zipBase: '041', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Congress', 'Forest', 'Park', 'Brighton', 'Stevens', 'Woodford', 'Allen'] },
  // Maryland additions
  { city: 'Rockville', state: 'Maryland', stateAbbr: 'MD', stateSlug: 'md', citySlug: 'rockville', lat: 39.0840, lng: -77.1528, zipBase: '208', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Rockville Pike', 'Veirs Mill', 'First', 'Hungerford', 'Maryland', 'Twinbrook', 'Norbeck'] },
  // Massachusetts additions
  { city: 'Worcester', state: 'Massachusetts', stateAbbr: 'MA', stateSlug: 'ma', citySlug: 'worcester', lat: 42.2626, lng: -71.8023, zipBase: '016', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Main', 'Chandler', 'Grafton', 'Shrewsbury', 'Burncoat', 'Belmont', 'Pleasant'] },
  // Michigan additions
  { city: 'Grand Rapids', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'mi', citySlug: 'grand-rapids', lat: 42.9634, lng: -85.6681, zipBase: '495', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Division', 'Michigan', 'Leonard', 'Fulton', 'Eastern', 'Wilson', 'Plainfield'] },
  // Minnesota additions
  { city: 'St. Paul', state: 'Minnesota', stateAbbr: 'MN', stateSlug: 'mn', citySlug: 'st-paul', lat: 44.9537, lng: -93.0900, zipBase: '551', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Grand', 'Marshall', 'Snelling', 'University', 'Rice', 'White Bear', 'Payne'] },
  // Mississippi
  { city: 'Jackson', state: 'Mississippi', stateAbbr: 'MS', stateSlug: 'ms', citySlug: 'jackson', lat: 32.2988, lng: -90.1848, zipBase: '392', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Lakeland', 'Ridgewood', 'Robinson', 'McDowell', 'State', 'Woodrow Wilson', 'County Line'] },
  // Montana
  { city: 'Billings', state: 'Montana', stateAbbr: 'MT', stateSlug: 'mt', citySlug: 'billings', lat: 45.7833, lng: -108.5007, zipBase: '591', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['King', 'Grand', 'Broadwater', 'Rimrock', 'Central', 'Main', 'Laurel'] },
  { city: 'Missoula', state: 'Montana', stateAbbr: 'MT', stateSlug: 'mt', citySlug: 'missoula', lat: 46.8721, lng: -113.9940, zipBase: '598', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Brooks', 'Reserve', 'Russell', 'Broadway', 'Mullan', 'South Ave', 'Mount'] },
  // Nebraska
  { city: 'Omaha', state: 'Nebraska', stateAbbr: 'NE', stateSlug: 'ne', citySlug: 'omaha', lat: 41.2565, lng: -95.9345, zipBase: '681', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Dodge', 'Center', 'Pacific', 'Maple', 'Blondo', '72nd', '108th'] },
  { city: 'Lincoln', state: 'Nebraska', stateAbbr: 'NE', stateSlug: 'ne', citySlug: 'lincoln', lat: 40.8136, lng: -96.7026, zipBase: '685', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['O', 'South', 'Pine Lake', 'Pioneers', 'Old Cheney', 'Highway 2', '70th'] },
  // Nevada additions
  { city: 'Reno', state: 'Nevada', stateAbbr: 'NV', stateSlug: 'nv', citySlug: 'reno', lat: 39.5296, lng: -119.8138, zipBase: '895', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Virginia', 'South McCarran', 'Wells', 'Plumb Ln', 'Kings Row', 'Kietzke', 'Longley'] },
  // New Hampshire
  { city: 'Manchester', state: 'New Hampshire', stateAbbr: 'NH', stateSlug: 'nh', citySlug: 'manchester', lat: 42.9956, lng: -71.4548, zipBase: '031', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Elm', 'Goffs Falls', 'South Willow', 'Brown', 'Candia', 'Mammoth', 'Hooksett'] },
  // New Jersey
  { city: 'Newark', state: 'New Jersey', stateAbbr: 'NJ', stateSlug: 'nj', citySlug: 'newark', lat: 40.7357, lng: -74.1724, zipBase: '071', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Broad', 'Market', 'Clinton', 'Bergen', 'McCarter Hwy', 'Springfield', 'Mt Prospect'] },
  { city: 'Jersey City', state: 'New Jersey', stateAbbr: 'NJ', stateSlug: 'nj', citySlug: 'jersey-city', lat: 40.7178, lng: -74.0431, zipBase: '073', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Kennedy', 'Bergen', 'Central', 'Newark', 'West Side', 'Tonnele', 'Communipaw'] },
  // New Mexico
  { city: 'Albuquerque', state: 'New Mexico', stateAbbr: 'NM', stateSlug: 'nm', citySlug: 'albuquerque', lat: 35.0844, lng: -106.6504, zipBase: '871', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'NE', 'NW'], streetNames: ['Central', 'Coors', 'Lomas', 'Montgomery', 'Menaul', 'Gibson', 'Paseo del Norte'] },
  { city: 'Santa Fe', state: 'New Mexico', stateAbbr: 'NM', stateSlug: 'nm', citySlug: 'santa-fe', lat: 35.6870, lng: -105.9378, zipBase: '875', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Cerrillos', 'St Francis', 'Airport', 'Guadalupe', 'St Michaels', 'Zia', 'Siringo'] },
  // New York additions
  { city: 'Buffalo', state: 'New York', stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'buffalo', lat: 42.8864, lng: -78.8784, zipBase: '142', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Delaware', 'Hertel', 'Bailey', 'Elmwood', 'Main', 'Kenmore', 'Sheridan'] },
  { city: 'Manhattan', state: 'New York', stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'manhattan', lat: 40.7831, lng: -73.9712, zipBase: '100', streetTypes: ['Ave', 'St', 'Blvd', 'Dr'], streetNames: ['Amsterdam', 'Columbus', 'Broadway', 'Lexington', 'Madison', 'Riverside', '125th', '86th', '72nd', 'Fort Washington'] },
  { city: 'Queens', state: 'New York', stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'queens', lat: 40.7282, lng: -73.7949, zipBase: '114', streetTypes: ['Ave', 'St', 'Blvd', 'Rd', 'Dr'], streetNames: ['Jamaica', 'Hillside', 'Merrick', 'Springfield', 'Francis Lewis', 'Kissena', 'Main', 'Sutphin', 'Linden', 'Parsons'] },
  { city: 'Bronx', state: 'New York', stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'bronx', lat: 40.8448, lng: -73.8648, zipBase: '104', streetTypes: ['Ave', 'St', 'Blvd', 'Rd', 'Dr'], streetNames: ['Grand Concourse', 'Fordham', 'Tremont', 'Boston Post', 'Pelham Pkwy', 'White Plains', 'Jerome', 'Westchester', 'East Tremont', 'Gun Hill'] },
  { city: 'Staten Island', state: 'New York', stateAbbr: 'NY', stateSlug: 'ny', citySlug: 'staten-island', lat: 40.5795, lng: -74.1502, zipBase: '103', streetTypes: ['Ave', 'St', 'Blvd', 'Rd', 'Dr'], streetNames: ['Hylan Blvd', 'Richmond', 'Victory', 'Forest', 'Bay', 'Richmond Terrace', 'Arthur Kill', 'Richmond Hill', 'Amboy', 'Manor'] },
  // North Carolina additions
  { city: 'Durham', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'nc', citySlug: 'durham', lat: 35.9940, lng: -78.8986, zipBase: '277', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Guess', 'Roxboro', 'Duke', 'Chapel Hill', 'Hillsborough', 'University', 'Fayetteville'] },
  // North Dakota
  { city: 'Fargo', state: 'North Dakota', stateAbbr: 'ND', stateSlug: 'nd', citySlug: 'fargo', lat: 46.8772, lng: -96.7898, zipBase: '581', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['25th', '32nd', '45th', 'Main', 'University', 'Sheyenne', 'Broadway'] },
  // Ohio additions
  { city: 'Cincinnati', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'oh', citySlug: 'cincinnati', lat: 39.1031, lng: -84.5120, zipBase: '452', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pike'], streetNames: ['Montgomery', 'Madison', 'Columbia Pkwy', 'Delhi', 'Galbraith', 'Reading', 'Kenwood'] },
  // Oklahoma additions
  { city: 'Tulsa', state: 'Oklahoma', stateAbbr: 'OK', stateSlug: 'ok', citySlug: 'tulsa', lat: 36.1540, lng: -95.9928, zipBase: '741', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Peoria', 'Yale', 'Memorial', 'Lewis', 'Harvard', 'Sheridan', 'Riverside'] },
  // Oregon additions
  { city: 'Eugene', state: 'Oregon', stateAbbr: 'OR', stateSlug: 'or', citySlug: 'eugene', lat: 44.0521, lng: -123.0868, zipBase: '974', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Willamette', 'Coburg', 'River', 'W 11th', 'Amazon', 'Donald', 'Barger'] },
  // Rhode Island
  { city: 'Providence', state: 'Rhode Island', stateAbbr: 'RI', stateSlug: 'ri', citySlug: 'providence', lat: 41.8240, lng: -71.4128, zipBase: '029', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['North Main', 'Broad', 'Charles', 'Elmwood', 'Smith', 'Chalkstone', 'Douglas'] },
  // South Carolina
  { city: 'Charleston', state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'sc', citySlug: 'charleston', lat: 32.7765, lng: -79.9311, zipBase: '294', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Savannah Hwy', 'Meeting', 'Rivers', 'Sam Rittenberg', 'Ashley', 'James Island', 'Folly'] },
  { city: 'Columbia', state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'sc', citySlug: 'columbia', lat: 34.0007, lng: -81.0348, zipBase: '292', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Garners Ferry', 'Two Notch', 'Forest', 'Bush River', 'Broad River', 'Knox Abbott', 'Devine'] },
  // South Dakota
  { city: 'Sioux Falls', state: 'South Dakota', stateAbbr: 'SD', stateSlug: 'sd', citySlug: 'sioux-falls', lat: 43.5446, lng: -96.7311, zipBase: '571', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Minnesota', 'Western', 'Cliff', 'Louise', 'Marion', '41st', '57th'] },
  // Tennessee additions
  { city: 'Knoxville', state: 'Tennessee', stateAbbr: 'TN', stateSlug: 'tn', citySlug: 'knoxville', lat: 35.9606, lng: -83.9207, zipBase: '379', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd', 'Pike'], streetNames: ['Kingston', 'Chapman Hwy', 'Broadway', 'Clinton', 'Alcoa Hwy', 'Cumberland', 'Merchants'] },
  // Texas additions
  { city: 'El Paso', state: 'Texas', stateAbbr: 'TX', stateSlug: 'tx', citySlug: 'el-paso', lat: 31.7619, lng: -106.4850, zipBase: '799', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Mesa', 'Montana', 'Alameda', 'Dyer', 'Viscount', 'Edgemere', 'Loop 375'] },
  // Utah additions
  { city: 'Provo', state: 'Utah', stateAbbr: 'UT', stateSlug: 'ut', citySlug: 'provo', lat: 40.2338, lng: -111.6585, zipBase: '846', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['University', 'State', 'Center', '900 East', 'Geneva', 'Canyon', 'Bulldog'] },
  // Vermont
  { city: 'Burlington', state: 'Vermont', stateAbbr: 'VT', stateSlug: 'vt', citySlug: 'burlington', lat: 44.4759, lng: -73.2121, zipBase: '054', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Williston', 'Shelburne', 'Dorset', 'Spear', 'Hinesburg', 'North', 'Pearl'] },
  // Virginia additions
  { city: 'Arlington', state: 'Virginia', stateAbbr: 'VA', stateSlug: 'va', citySlug: 'arlington', lat: 38.8799, lng: -77.1068, zipBase: '222', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Columbia Pike', 'Lee Hwy', 'Wilson', 'Clarendon', 'Glebe', 'Walter Reed', 'Pershing'] },
  // Washington additions
  { city: 'Spokane', state: 'Washington', stateAbbr: 'WA', stateSlug: 'wa', citySlug: 'spokane', lat: 47.6588, lng: -117.4260, zipBase: '992', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Division', 'Sprague', 'Francis', 'Newport Hwy', 'Regal', 'Monroe', 'Ash'] },
  // West Virginia
  { city: 'Charleston', state: 'West Virginia', stateAbbr: 'WV', stateSlug: 'wv', citySlug: 'charleston', lat: 38.3498, lng: -81.6326, zipBase: '253', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['MacCorkle', 'Washington', 'Kanawha', 'Bridge', 'Patrick', 'Lee', 'Oakwood'] },
  // Wisconsin additions
  { city: 'Madison', state: 'Wisconsin', stateAbbr: 'WI', stateSlug: 'wi', citySlug: 'madison', lat: 43.0731, lng: -89.4012, zipBase: '537', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['University', 'Monroe', 'Park', 'Whitney Way', 'Verona', 'Gammon', 'East Washington'] },
  // Wyoming
  { city: 'Cheyenne', state: 'Wyoming', stateAbbr: 'WY', stateSlug: 'wy', citySlug: 'cheyenne', lat: 41.1400, lng: -104.8202, zipBase: '820', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Dell Range', 'Pershing', 'Yellowstone', 'Converse', 'College Dr', 'Morrie', 'Warren'] },
  // California additions
  { city: 'San Jose', state: 'California', stateAbbr: 'CA', stateSlug: 'ca', citySlug: 'san-jose', lat: 37.3382, lng: -121.8863, zipBase: '951', streetTypes: ['Blvd', 'Ave', 'St', 'Dr', 'Rd'], streetNames: ['Blossom Hill', 'Santa Teresa', 'Meridian', 'Bascom', 'Winchester', 'Capitol', 'Story'] },
]

export const NAME_TEMPLATES: Record<CategorySlug, { prefixes: string[]; suffixes: string[] }> = {
  veterinarians: {
    prefixes: ['Happy Paws', 'Sunshine', 'Gentle Care', 'Loving Hands', 'Caring Hearts', 'Bayview', 'Lakeside', 'Sunset', 'Riverside', 'Greenfield', 'Kindred', 'Harmony', 'Summit', 'Legacy', 'Prestige', 'Premier', 'Pinnacle', 'Noble', 'Trusted', 'Compassionate'],
    suffixes: ['Veterinary Clinic', 'Animal Hospital', 'Vet Care', 'Pet Clinic', 'Animal Clinic', 'Veterinary Center', 'Animal Medical Center', 'Pet Health Center'],
  },
  emergency_vets: {
    prefixes: ['24/7 Emergency', 'Critical Care', 'After Hours', 'Urgent Care', 'Emergency', 'Advanced', 'Regional', 'Metro', 'City', 'Central'],
    suffixes: ['Animal Hospital', 'Emergency Vet', 'Animal Emergency Center', 'Critical Care Center', 'Emergency Animal Clinic', 'Veterinary Emergency'],
  },
  groomers: {
    prefixes: ['Pampered Paws', 'Fluffy Friends', 'The Grooming Spot', 'Suds & Scissors', 'Posh Pets', 'Snip & Shine', 'Bubbles', 'Fancy Fur', 'Clip N Style', 'Pretty Paws', 'Bark & Bath', 'Tail Waggers', 'Glamour Pups', 'Lavish Pets'],
    suffixes: ['Pet Salon', 'Grooming Spa', 'Dog Grooming', 'Pet Grooming Studio', 'Grooming Boutique', 'Pet Styling'],
  },
  boarding: {
    prefixes: ['Cozy Paws', 'Home Away', 'The Pet Retreat', 'Peaceful Tails', 'Country Club', 'Luxury', 'Premier', 'Pampered', 'Relaxing', 'Serene', 'Tranquil', 'Happy', 'Safe Haven', 'Comfy'],
    suffixes: ['Pet Resort', 'Dog Boarding', 'Animal Lodge', 'Pet Hotel', 'Boarding Suites', 'Pet Inn', 'Dog Retreat'],
  },
  daycare: {
    prefixes: ['Playful Paws', 'Wag Time', 'Doggy', 'Happy Tails', 'Bark Avenue', 'Fetch & Play', 'Tail Waggers', 'Pup Squad', 'The Dog Den', 'Canine Castle', 'Pawsome', 'Fun Run', 'Run & Play'],
    suffixes: ['Dog Daycare', 'Doggy Daycare', 'Pet Playcare', 'Canine Club', 'Dog Play Center', 'Doggy Day School'],
  },
  trainers: {
    prefixes: ['Perfect Paws', 'Obedient', 'Smart Dogs', 'Good Boy', 'Alpha', 'Certified', 'Pro Dog', 'Top Dog', 'Behavior', 'Expert', 'Elite', 'Master', 'Pawsitive', 'Balanced'],
    suffixes: ['Dog Training', 'Pet Training Academy', 'Canine Academy', 'Training Center', 'Dog School', 'Obedience Academy'],
  },
  pet_pharmacies: {
    prefixes: ['Pet Meds', 'Animal Health', 'Critter Care', 'Paws Rx', 'Pet Health', 'Companion', 'Veterinary', 'Complete Pet', 'Total Pet', 'PetScript'],
    suffixes: ['Pet Pharmacy', 'Animal Pharmacy', 'Compounding & Pet Care', 'Pet Rx', 'Animal Dispensary', 'Pet Meds Plus'],
  },
}

export const CATEGORY_SERVICES: Record<CategorySlug, string[]> = {
  veterinarians: [
    'Wellness Exams', 'Vaccinations', 'Dental Cleaning', 'Surgery', 'X-Ray & Imaging',
    'Lab Work', 'Parasite Prevention', 'Microchipping', 'Spay & Neuter', 'Senior Pet Care',
    'Puppy & Kitten Care', 'Nutritional Counseling', 'Allergy Testing', 'Orthopedics',
  ],
  emergency_vets: [
    '24/7 Emergency Care', 'Critical Care Unit', 'Surgery', 'Blood Transfusions',
    'Oxygen Therapy', 'IV Fluids', 'Toxin Treatment', 'Trauma Care', 'ICU Monitoring',
    'Diagnostic Imaging', 'After-Hours Care',
  ],
  groomers: [
    'Full Groom', 'Bath & Brush', 'Nail Trim', 'Ear Cleaning', 'Teeth Brushing',
    'De-shedding Treatment', 'Breed-Specific Cuts', 'Puppy First Groom', 'Flea Bath',
    'Blueberry Facial', 'Paw Treatment', 'Medicated Shampoo',
  ],
  boarding: [
    'Overnight Boarding', 'Extended Stay', 'Daily Updates', 'Playtime Sessions',
    'Medication Administration', 'Webcam Access', 'Pick-up & Drop-off', 'Cat Suites',
    'Luxury Suites', 'Group Play', 'Individual Attention',
  ],
  daycare: [
    'Full-Day Daycare', 'Half-Day Option', 'Group Play', 'Individual Attention',
    'Training Reinforcement', 'Temperament Testing', 'Pick-up & Drop-off', 'Report Cards',
    'Pool Play', 'Indoor & Outdoor Play',
  ],
  trainers: [
    'Puppy Kindergarten', 'Basic Obedience', 'Advanced Obedience', 'Behavioral Correction',
    'Leash Training', 'Agility', 'Private Sessions', 'Group Classes', 'Board & Train',
    'Service Dog Training', 'Anxiety & Fear Training',
  ],
  pet_pharmacies: [
    'Prescription Medications', 'Compounding', 'Flea & Tick Prevention',
    'Heartworm Prevention', 'Vitamins & Supplements', 'Specialty Diets',
    'Delivery Available', 'Vet Consultation', 'Prescription Transfer',
  ],
}

export const CATEGORY_DESCRIPTIONS: Record<CategorySlug, string[]> = {
  veterinarians: [
    'Providing compassionate veterinary care for dogs, cats, and small animals. Our experienced team offers comprehensive health services from routine checkups to complex procedures.',
    'A full-service animal clinic dedicated to the health and wellbeing of your pets. We combine advanced diagnostics with a warm, welcoming environment.',
    'Your neighborhood veterinary partner, offering preventive care, dental services, and wellness programs to keep your pets healthy at every life stage.',
  ],
  emergency_vets: [
    'When your pet needs urgent care, our 24/7 emergency team is ready. Equipped with state-of-the-art diagnostic tools and a dedicated critical care unit.',
    'Providing life-saving emergency veterinary services around the clock. Our trained specialists handle everything from trauma cases to toxic ingestions.',
    'Advanced emergency and critical care for pets when it matters most. Board-certified emergency veterinarians available 24 hours a day, 7 days a week.',
  ],
  groomers: [
    'A boutique grooming salon where your pet gets the pampering they deserve. From breed-specific cuts to relaxing spa treatments, we make every visit special.',
    'Professional pet grooming services using premium products. Our experienced groomers handle dogs of all breeds and sizes with patience and care.',
    'A full-service grooming studio offering bathing, styling, nail care, and more. We treat every pet like family and send them home looking their best.',
  ],
  boarding: [
    'A safe and loving home away from home for your pets. Our trained staff provides individualized attention, playtime, and all the comforts your pet deserves.',
    'Premium pet boarding in a stress-free, cage-free environment. We cater to the unique needs of each pet with personalized care plans.',
    'Your pet will love staying with us! Climate-controlled suites, daily exercise, and round-the-clock supervision ensure a happy, comfortable stay.',
  ],
  daycare: [
    'A fun and stimulating environment where dogs can socialize, play, and burn energy. Perfect for keeping your pup happy and active while you are at work.',
    'Professional dog daycare services with structured play groups, trained staff, and a safe, clean facility. Your dog will look forward to every visit.',
    'Give your dog the social life they deserve! Our daycare program offers group play, individual attention, and enrichment activities throughout the day.',
  ],
  trainers: [
    'Certified professional dog trainers using positive reinforcement methods. From basic obedience to complex behavioral issues, we help dogs become their best selves.',
    'Science-based dog training that gets results. Our certified trainers work with dogs and owners to build lasting skills and a stronger bond.',
    'Personalized training programs for dogs of all ages and temperaments. Whether you need puppy basics or advanced obedience, we have the right solution.',
  ],
  pet_pharmacies: [
    'Your trusted source for pet medications, supplements, and preventive care products. We offer competitive pricing, compounding services, and convenient delivery.',
    'A full-service pet pharmacy providing prescription medications, compounded drugs, and wellness products for dogs, cats, and exotic pets.',
    'Expert pharmacy services for your pets. We work with your veterinarian to ensure proper medication management and offer affordable alternatives.',
  ],
}

export const STANDARD_HOURS = {
  standard: {
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '14:00', closed: false },
    sunday: { open: null, close: null, closed: true },
  },
  extended: {
    monday: { open: '07:00', close: '19:00', closed: false },
    tuesday: { open: '07:00', close: '19:00', closed: false },
    wednesday: { open: '07:00', close: '19:00', closed: false },
    thursday: { open: '07:00', close: '19:00', closed: false },
    friday: { open: '07:00', close: '18:00', closed: false },
    saturday: { open: '08:00', close: '17:00', closed: false },
    sunday: { open: '10:00', close: '15:00', closed: false },
  },
  emergency: {
    monday: { open: '00:00', close: '23:59', closed: false },
    tuesday: { open: '00:00', close: '23:59', closed: false },
    wednesday: { open: '00:00', close: '23:59', closed: false },
    thursday: { open: '00:00', close: '23:59', closed: false },
    friday: { open: '00:00', close: '23:59', closed: false },
    saturday: { open: '00:00', close: '23:59', closed: false },
    sunday: { open: '00:00', close: '23:59', closed: false },
  },
  groomer: {
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '16:00', closed: false },
    sunday: { open: null, close: null, closed: true },
  },
  daycare: {
    monday: { open: '06:30', close: '18:30', closed: false },
    tuesday: { open: '06:30', close: '18:30', closed: false },
    wednesday: { open: '06:30', close: '18:30', closed: false },
    thursday: { open: '06:30', close: '18:30', closed: false },
    friday: { open: '06:30', close: '18:30', closed: false },
    saturday: { open: '08:00', close: '17:00', closed: false },
    sunday: { open: null, close: null, closed: true },
  },
}
