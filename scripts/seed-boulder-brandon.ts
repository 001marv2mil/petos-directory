/**
 * Seeds providers for Boulder, CO and Brandon, FL.
 * Run: npx tsx --env-file=.env.local scripts/seed-boulder-brandon.ts
 */
import { supabaseAdmin } from './lib/supabase-admin.js'
import { SlugRegistry } from './lib/slug.js'
import {
  CITY_CENTERS,
  NAME_TEMPLATES,
  CATEGORY_SERVICES,
  CATEGORY_DESCRIPTIONS,
  STANDARD_HOURS,
  type CityCenter,
} from './lib/categories.js'
import type { CategorySlug } from '../src/types/index.js'

const TARGET_SLUGS = ['boulder', 'brandon']
const CATEGORIES: CategorySlug[] = [
  'veterinarians', 'emergency_vets', 'groomers', 'boarding', 'daycare', 'trainers', 'pet_pharmacies',
]
const PROVIDERS_PER_BATCH = 25
const slugRegistry = new SlugRegistry()

function seededRand(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xFFFFFFFF
  }
}

function pickRandom<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]
}

function generateProvider(city: CityCenter, category: CategorySlug, index: number) {
  const seed = city.lat * 1000 + city.lng * 100 + CATEGORIES.indexOf(category) * 50 + index
  const rand = seededRand(Math.floor(seed * 1000000))

  const templates = NAME_TEMPLATES[category]
  const businessName = `${pickRandom(templates.prefixes, rand)} ${pickRandom(templates.suffixes, rand)}`
  const slug = slugRegistry.generate(city.stateSlug, city.citySlug, category, businessName)
  const base = 3.5 + rand() * 1.5
  const rating = Math.round(base * 10) / 10
  const streetNum = Math.floor(rand() * 9900) + 100
  const street = `${pickRandom(city.streetNames, rand)} ${pickRandom(city.streetTypes, rand)}`
  const zipSuffix = String(Math.floor(rand() * 90) + 10)
  const areaCodes = city.stateAbbr === 'CO' ? ['303', '720'] : ['813', '727', '813']
  const area = pickRandom(areaCodes, rand)
  const phone = `(${area}) ${Math.floor(rand()*900)+100}-${Math.floor(rand()*9000)+1000}`
  const spread = 0.10
  const lat = Math.round((city.lat + (rand() - 0.5) * spread * 2) * 1e7) / 1e7
  const lng = Math.round((city.lng + (rand() - 0.5) * spread * 2) * 1e7) / 1e7
  const hours = category === 'emergency_vets' ? STANDARD_HOURS.emergency
    : category === 'daycare' ? STANDARD_HOURS.daycare
    : category === 'boarding' ? STANDARD_HOURS.extended
    : STANDARD_HOURS.standard

  return {
    source: 'seed', source_id: null, slug, business_name: businessName, category, subcategory: null,
    address: `${streetNum} ${street}, ${city.city}, ${city.stateAbbr} ${city.zipBase}${zipSuffix}`,
    city: city.city, state: city.stateAbbr, zip: `${city.zipBase}${zipSuffix}`, lat, lng, phone,
    website: null, rating, review_count: Math.floor(rand() * 200) + 10, hours,
    description: pickRandom(CATEGORY_DESCRIPTIONS[category], rand),
    services: [...CATEGORY_SERVICES[category]].sort(() => rand() - 0.5).slice(0, 5),
    hero_image: null, gallery_images: [],
    emergency: category === 'emergency_vets', verified: index % 7 === 0, last_synced_at: null,
  }
}

async function seed() {
  const cities = CITY_CENTERS.filter(c => TARGET_SLUGS.includes(c.citySlug))
  console.log(`Seeding ${cities.map(c => c.city).join(', ')}...`)
  let total = 0, errors = 0

  for (const city of cities) {
    for (const category of CATEGORIES) {
      const providers = Array.from({ length: PROVIDERS_PER_BATCH }, (_, i) =>
        generateProvider(city, category, i)
      )
      const { error } = await supabaseAdmin
        .from('providers')
        .upsert(providers, { onConflict: 'slug', ignoreDuplicates: false })
      if (error) { console.error(`  ❌ ${city.city}/${category}: ${error.message}`); errors++ }
      else { total += providers.length; console.log(`  ✓ ${city.city} · ${category} · ${providers.length}`) }
    }
  }
  console.log(`\nDone. ${total} providers seeded (${errors} errors)`)
  process.exit(errors > 0 ? 1 : 0)
}

seed()
