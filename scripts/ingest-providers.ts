/**
 * Google Places API (New) ingestion script
 * Uses Places API v1 via direct fetch — no SDK required
 *
 * Run: npm run ingest
 * Options:
 *   --city=Tampa         Only ingest a specific city
 *   --category=groomers  Only ingest a specific category
 *   --dry-run            Print what would be ingested without writing to DB
 */

import { supabaseAdmin } from './lib/supabase-admin.js'
import { normalizeNewPlace } from './lib/normalizer.js'
import { CITY_CENTERS, type CityCenter } from './lib/categories.js'
import type { CategorySlug } from '../src/types/index.js'

const CATEGORIES: CategorySlug[] = [
  'veterinarians', 'emergency_vets', 'groomers', 'boarding', 'daycare', 'trainers', 'pet_pharmacies',
]

const CATEGORY_QUERIES: Record<CategorySlug, string> = {
  veterinarians:  'veterinarian animal clinic',
  emergency_vets: 'emergency animal hospital 24 hour',
  groomers:       'dog groomer pet grooming salon',
  boarding:       'pet boarding dog boarding kennel',
  daycare:        'dog daycare doggy daycare',
  trainers:       'dog trainer obedience training',
  pet_pharmacies: 'pet pharmacy animal pharmacy',
}

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
const BASE_URL = 'https://places.googleapis.com/v1'

if (!API_KEY) {
  console.error('❌ GOOGLE_PLACES_API_KEY is not set. Add it to .env.local')
  process.exit(1)
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Parse CLI flags
const args = process.argv.slice(2)
const cityFilter = args.find(a => a.startsWith('--city='))?.split('=')[1]
const categoryFilter = args.find(a => a.startsWith('--category='))?.split('=')[1] as CategorySlug | undefined
const dryRun = args.includes('--dry-run')

if (dryRun) console.log('🔍 DRY RUN — no data will be written\n')

async function searchPlaces(query: string, city: CityCenter): Promise<any[]> {
  const body = {
    textQuery: `${query} in ${city.city}, ${city.stateAbbr}`,
    locationBias: {
      circle: {
        center: { latitude: city.lat, longitude: city.lng },
        radius: 16000.0,
      },
    },
    maxResultCount: 20,
    languageCode: 'en',
  }

  const res = await fetch(`${BASE_URL}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY!,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.shortFormattedAddress',
        'places.location',
        'places.rating',
        'places.userRatingCount',
        'places.photos',
      ].join(','),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`searchText ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json() as { places?: any[] }
  return data.places ?? []
}

async function getPlaceDetails(placeId: string): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': API_KEY!,
        'X-Goog-FieldMask': 'nationalPhoneNumber,websiteUri,regularOpeningHours,photos',
      },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function resolvePhotoUrl(photoName: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true`,
      { headers: { 'X-Goog-Api-Key': API_KEY! } },
    )
    if (!res.ok) return null
    const data = await res.json() as { photoUri?: string }
    return data.photoUri ?? null
  } catch {
    return null
  }
}

async function ingestCityCategory(city: CityCenter, category: CategorySlug): Promise<number> {
  const query = CATEGORY_QUERIES[category]
  let totalIngested = 0

  const places = await searchPlaces(query, city)
  if (!places.length) return 0

  for (const place of places) {
    if (!place.id || !place.displayName?.text) continue

    const details = await getPlaceDetails(place.id)

    // Resolve first photo to a real Google CDN URL
    const photos = (place.photos ?? details?.photos ?? []) as Array<{ name: string }>
    const heroImage = photos.length > 0 ? await resolvePhotoUrl(photos[0].name) : null
    await delay(120)

    const normalized = normalizeNewPlace(place, details, city, category, heroImage)

    if (dryRun) {
      console.log(`    [dry-run] ${normalized.business_name} — ${normalized.address}`)
      totalIngested++
      continue
    }

    const { error } = await supabaseAdmin
      .from('providers')
      .upsert(normalized, { onConflict: 'source,source_id' })

    if (error) {
      console.error(`    ❌ Failed to upsert ${place.displayName.text}:`, error.message)
    } else {
      totalIngested++
    }
  }

  return totalIngested
}

async function ingest() {
  console.log('🗺  Starting Google Places ingestion...')

  const citiesToIngest = cityFilter
    ? CITY_CENTERS.filter(c => c.city.toLowerCase() === cityFilter.toLowerCase())
    : CITY_CENTERS

  const categoriesToIngest = categoryFilter
    ? CATEGORIES.filter(c => c === categoryFilter)
    : CATEGORIES

  if (cityFilter && citiesToIngest.length === 0) {
    console.error(`❌ City not found: ${cityFilter}`)
    process.exit(1)
  }

  console.log(`  ${citiesToIngest.length} cities × ${categoriesToIngest.length} categories\n`)

  let grandTotal = 0

  for (const city of citiesToIngest) {
    for (const category of categoriesToIngest) {
      process.stdout.write(`  📍 ${city.city} · ${category}... `)
      try {
        const count = await ingestCityCategory(city, category)
        console.log(`✓ ${count}`)
        grandTotal += count
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.log(`❌ ${message}`)
      }
      await delay(300)
    }
  }

  console.log(`\n✅ Done: ${grandTotal} real providers upserted`)
}

ingest().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
