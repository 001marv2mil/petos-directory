/**
 * Seed script — generates realistic placeholder provider data
 * for all 17 cities × 7 categories × 25 providers = 2,975 rows.
 *
 * Run: npx tsx --env-file=.env.local scripts/seed-providers.ts
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
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

const CATEGORIES: CategorySlug[] = [
  'veterinarians', 'emergency_vets', 'groomers', 'boarding', 'daycare', 'trainers', 'pet_pharmacies',
]

const PROVIDERS_PER_BATCH = 25
const slugRegistry = new SlugRegistry()

// Deterministic pseudo-random — stable across runs for same seed
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
  // Weighted distribution: most 3.8-4.8, few outliers
  const base = 3.5 + rand() * 1.5
  return Math.round(base * 10) / 10
}

function generateReviewCount(rating: number, rand: () => number): number {
  const base = Math.floor(rand() * 200) + 10
  // Higher rated tend to have more reviews
  return rating >= 4.5 ? base + Math.floor(rand() * 300) : base
}

function generatePhone(city: CityCenter, rand: () => number): string {
  const areaCodes: Record<string, string[]> = {
    FL: ['813', '727', '321', '407', '305', '786'],
    TX: ['214', '972', '512', '713', '832'],
    GA: ['404', '678', '770'],
    TN: ['615', '629'],
    NC: ['704', '980'],
    AZ: ['602', '480', '623'],
    CO: ['303', '720'],
    CA: ['310', '213', '323', '818'],
    IL: ['312', '773', '847'],
    NY: ['212', '646', '718', '917'],
  }
  const codes = areaCodes[city.stateAbbr] ?? ['555']
  const area = pickRandom(codes, rand)
  const num1 = String(Math.floor(rand() * 900) + 100)
  const num2 = String(Math.floor(rand() * 9000) + 1000)
  return `(${area}) ${num1}-${num2}`
}

function generateAddress(city: CityCenter, rand: () => number, _index: number): string {
  const streetNum = Math.floor(rand() * 9900) + 100
  const streetName = pickRandom(city.streetNames, rand)
  const streetType = pickRandom(city.streetTypes, rand)
  const zipSuffix = String(Math.floor(rand() * 90) + 10)
  return `${streetNum} ${streetName} ${streetType}, ${city.city}, ${city.stateAbbr} ${city.zipBase}${zipSuffix}`
}

function generateCoords(city: CityCenter, rand: () => number): { lat: number; lng: number } {
  const spread = 0.15  // ~10 mile radius
  return {
    lat: Math.round((city.lat + (rand() - 0.5) * spread * 2) * 10000000) / 10000000,
    lng: Math.round((city.lng + (rand() - 0.5) * spread * 2) * 10000000) / 10000000,
  }
}

function generateServices(category: CategorySlug, rand: () => number): string[] {
  const pool = CATEGORY_SERVICES[category]
  const count = 4 + Math.floor(rand() * 4)  // 4-7 services
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

function generateProvider(
  city: CityCenter,
  category: CategorySlug,
  index: number,
) {
  const seed = city.lat * 1000 + city.lng * 100 + CATEGORIES.indexOf(category) * 50 + index
  const rand = seededRand(Math.floor(seed * 1000000))

  const templates = NAME_TEMPLATES[category]
  const prefix = pickRandom(templates.prefixes, rand)
  const suffix = pickRandom(templates.suffixes, rand)
  const businessName = `${prefix} ${suffix}`

  const slug = slugRegistry.generate(city.stateSlug, city.citySlug, category, businessName)
  const rating = generateRating(rand)
  const coords = generateCoords(city, rand)

  const descriptions = CATEGORY_DESCRIPTIONS[category]
  const description = pickRandom(descriptions, rand)

  return {
    source: 'seed',
    source_id: null,
    slug,
    business_name: businessName,
    category,
    subcategory: null,
    address: generateAddress(city, rand, index),
    city: city.city,
    state: city.stateAbbr,
    zip: `${city.zipBase}${String(Math.floor(rand() * 90) + 10)}`,
    lat: coords.lat,
    lng: coords.lng,
    phone: generatePhone(city, rand),
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
  console.log('🌱 Starting PetOS seed...')
  console.log(`📍 ${CITY_CENTERS.length} cities × ${CATEGORIES.length} categories × ${PROVIDERS_PER_BATCH} providers`)

  let total = 0
  let errors = 0

  for (const city of CITY_CENTERS) {
    for (const category of CATEGORIES) {
      const providers = Array.from({ length: PROVIDERS_PER_BATCH }, (_, i) =>
        generateProvider(city, category, i)
      )

      const { error } = await supabaseAdmin
        .from('providers')
        .upsert(providers, { onConflict: 'slug', ignoreDuplicates: false })

      if (error) {
        console.error(`❌ Error seeding ${city.city}/${category}:`, error.message)
        errors++
      } else {
        total += providers.length
        console.log(`  ✓ ${city.city} · ${category} · ${providers.length} providers`)
      }
    }
  }

  console.log(`\n✅ Seeded ${total} providers (${errors} errors)`)
  console.log(`📊 Expected: ${CITY_CENTERS.length * CATEGORIES.length * PROVIDERS_PER_BATCH} total`)
}

seed().catch((err) => {
  console.error('Fatal seed error:', err)
  process.exit(1)
})
