/**
 * Seeds providers for the 4 NYC boroughs: Manhattan, Queens, Bronx, Staten Island.
 * Run: npx tsx --env-file=.env.local scripts/seed-nyc-boroughs.ts
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

const NYC_BOROUGHS = ['manhattan', 'queens', 'bronx', 'staten-island']
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

function generateRating(rand: () => number): number {
  const base = 3.5 + rand() * 1.5
  return Math.round(base * 10) / 10
}

function generateReviewCount(rating: number, rand: () => number): number {
  const base = Math.floor(rand() * 200) + 10
  return rating >= 4.5 ? base + Math.floor(rand() * 300) : base
}

function generatePhone(rand: () => number): string {
  const areaCodes = ['212', '646', '718', '917', '347']
  const area = pickRandom(areaCodes, rand)
  const num1 = String(Math.floor(rand() * 900) + 100)
  const num2 = String(Math.floor(rand() * 9000) + 1000)
  return `(${area}) ${num1}-${num2}`
}

function generateAddress(city: CityCenter, rand: () => number): string {
  const streetNum = Math.floor(rand() * 9900) + 100
  const streetName = pickRandom(city.streetNames, rand)
  const streetType = pickRandom(city.streetTypes, rand)
  const zipSuffix = String(Math.floor(rand() * 90) + 10)
  return `${streetNum} ${streetName} ${streetType}, ${city.city}, NY ${city.zipBase}${zipSuffix}`
}

function generateCoords(city: CityCenter, rand: () => number) {
  const spread = 0.08
  return {
    lat: Math.round((city.lat + (rand() - 0.5) * spread * 2) * 10000000) / 10000000,
    lng: Math.round((city.lng + (rand() - 0.5) * spread * 2) * 10000000) / 10000000,
  }
}

function generateServices(category: CategorySlug, rand: () => number): string[] {
  const pool = CATEGORY_SERVICES[category]
  const count = 4 + Math.floor(rand() * 4)
  const shuffled = [...pool].sort(() => rand() - 0.5)
  return shuffled.slice(0, count)
}

function getHoursTemplate(category: CategorySlug, index: number) {
  if (category === 'emergency_vets') return STANDARD_HOURS.emergency
  if (category === 'groomers') return index % 3 === 0 ? STANDARD_HOURS.extended : STANDARD_HOURS.groomer
  if (category === 'daycare') return STANDARD_HOURS.daycare
  if (category === 'boarding') return STANDARD_HOURS.extended
  return index % 4 === 0 ? STANDARD_HOURS.extended : STANDARD_HOURS.standard
}

function generateProvider(city: CityCenter, category: CategorySlug, index: number) {
  const seed = city.lat * 1000 + city.lng * 100 + CATEGORIES.indexOf(category) * 50 + index
  const rand = seededRand(Math.floor(seed * 1000000))

  const templates = NAME_TEMPLATES[category]
  const prefix = pickRandom(templates.prefixes, rand)
  const suffix = pickRandom(templates.suffixes, rand)
  const businessName = `${prefix} ${suffix}`

  const slug = slugRegistry.generate(city.stateSlug, city.citySlug, category, businessName)
  const rating = generateRating(rand)
  const coords = generateCoords(city, rand)
  const description = pickRandom(CATEGORY_DESCRIPTIONS[category], rand)

  return {
    source: 'seed',
    source_id: null,
    slug,
    business_name: businessName,
    category,
    subcategory: null,
    address: generateAddress(city, rand),
    city: city.city,
    state: 'NY',
    zip: `${city.zipBase}${String(Math.floor(rand() * 90) + 10)}`,
    lat: coords.lat,
    lng: coords.lng,
    phone: generatePhone(rand),
    website: null,
    rating,
    review_count: generateReviewCount(rating, rand),
    hours: getHoursTemplate(category, index),
    description,
    services: generateServices(category, rand),
    hero_image: null,
    gallery_images: [],
    emergency: category === 'emergency_vets' || (category === 'veterinarians' && index % 10 === 0),
    verified: index % 7 === 0,
    last_synced_at: null,
  }
}

async function seed() {
  const cities = CITY_CENTERS.filter(c => NYC_BOROUGHS.includes(c.citySlug))
  console.log(`Seeding ${cities.map(c => c.city).join(', ')}...`)

  let total = 0
  let errors = 0

  for (const city of cities) {
    for (const category of CATEGORIES) {
      const providers = Array.from({ length: PROVIDERS_PER_BATCH }, (_, i) =>
        generateProvider(city, category, i)
      )

      const { error } = await supabaseAdmin
        .from('providers')
        .upsert(providers, { onConflict: 'slug', ignoreDuplicates: false })

      if (error) {
        console.error(`  ❌ ${city.city}/${category}: ${error.message}`)
        errors++
      } else {
        total += providers.length
        console.log(`  ✓ ${city.city} · ${category} · ${providers.length} providers`)
      }
    }
  }

  console.log(`\nDone. ${total} providers seeded (${errors} errors)`)
  process.exit(errors > 0 ? 1 : 0)
}

seed()
