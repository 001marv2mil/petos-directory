/**
 * Import Apify Google Maps Scraper results into Supabase
 *
 * Run: npx tsx scripts/import-apify.ts
 * Options:
 *   --dry-run    Print what would be imported without writing to DB
 *
 * Reads from Apify datasets via API and upserts into the providers table.
 * Deduplicates against existing data using source + source_id (Google CID).
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { supabaseAdmin } from './lib/supabase-admin.js'
import { SlugRegistry, slugify } from './lib/slug.js'
import type { CategorySlug } from '../src/types/index.js'

const APIFY_TOKEN = process.env.APIFY_TOKEN

if (!APIFY_TOKEN) {
  console.error('❌ APIFY_TOKEN is not set. Add it to .env.local')
  process.exit(1)
}

// Dataset IDs from our 4 borough runs
const DATASETS: Record<string, string> = {
  manhattan:     'rreakC6dXZHFhn1Rx',
  queens:        'YifElaOG8Tq0omDeP',
  bronx:         'kF6vwCtkujbNNWsBP',
  statenIsland:  '7YcAA4ZB0LheooUvm',
}

// Borough → city/state metadata for the providers table
const BOROUGH_META: Record<string, { city: string; state: string; stateSlug: string; citySlug: string }> = {
  manhattan:    { city: 'Manhattan',      state: 'NY', stateSlug: 'ny', citySlug: 'manhattan' },
  queens:       { city: 'Queens',         state: 'NY', stateSlug: 'ny', citySlug: 'queens' },
  bronx:        { city: 'Bronx',          state: 'NY', stateSlug: 'ny', citySlug: 'bronx' },
  statenIsland: { city: 'Staten Island',  state: 'NY', stateSlug: 'ny', citySlug: 'staten-island' },
}

// Map Apify's searchString → our CategorySlug
function mapCategory(searchString: string, categoryName: string): CategorySlug {
  const s = (searchString || '').toLowerCase()
  const c = (categoryName || '').toLowerCase()

  if (s.includes('emergency') || c.includes('emergency')) return 'emergency_vets'
  if (s.includes('veterinarian') || c.includes('veterinar')) return 'veterinarians'
  if (s.includes('groomer') || c.includes('groom')) return 'groomers'
  if (s.includes('boarding') || c.includes('boarding') || c.includes('kennel')) return 'boarding'
  if (s.includes('daycare') || c.includes('daycare')) return 'daycare'
  if (s.includes('trainer') || c.includes('trainer') || c.includes('training')) return 'trainers'
  if (s.includes('pharmacy') || c.includes('pharmacy')) return 'pet_pharmacies'

  // Fallback: try categoryName
  if (c.includes('pet store') || c.includes('pet supply')) return 'pet_pharmacies'
  return 'veterinarians' // safe default
}

// Map Apify's openingHours to our WeeklyHours format
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

function normalizeApifyHours(openingHours: any[] | undefined) {
  if (!openingHours || openingHours.length === 0) return null

  const result: Record<string, { open: string | null; close: string | null; closed: boolean }> = {}
  for (const day of DAYS) {
    result[day] = { open: null, close: null, closed: true }
  }

  for (const entry of openingHours) {
    // Apify format: { day: "Monday", hours: "9 AM to 6 PM" } or similar
    if (!entry.day || !entry.hours) continue
    const dayKey = entry.day.toLowerCase() as typeof DAYS[number]
    if (!DAYS.includes(dayKey)) continue

    const hours = entry.hours as string
    if (hours.toLowerCase().includes('closed')) {
      result[dayKey] = { open: null, close: null, closed: true }
      continue
    }

    // Try to parse "9 AM to 6 PM" or "9:00 AM to 6:00 PM" format
    const match = hours.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*(?:to|–|-|—)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/i)
    if (match) {
      result[dayKey] = {
        open: convertTo24h(match[1].trim()),
        close: convertTo24h(match[2].trim()),
        closed: false,
      }
    } else if (hours.toLowerCase().includes('open 24')) {
      result[dayKey] = { open: '00:00', close: '23:59', closed: false }
    }
  }

  return result
}

function convertTo24h(time12: string): string {
  const match = time12.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
  if (!match) return '00:00'
  let hour = parseInt(match[1])
  const minute = match[2] ? parseInt(match[2]) : 0
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM' && hour !== 12) hour += 12
  if (ampm === 'AM' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

// Extract zip from address like "1215 2nd Ave, New York, NY 10065"
function extractZip(address: string): string | null {
  const match = address.match(/\b(\d{5})(?:-\d{4})?\b/)
  return match ? match[1] : null
}

const slugRegistry = new SlugRegistry()
const dryRun = process.argv.includes('--dry-run')

async function fetchDataset(datasetId: string): Promise<any[]> {
  const url = `https://api.apify.com/v2/datasets/${datasetId}/items?format=json`
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${APIFY_TOKEN}` },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch dataset ${datasetId}: ${res.status}`)
  }
  return res.json()
}

async function importBorough(boroughKey: string): Promise<number> {
  const datasetId = DATASETS[boroughKey]
  const meta = BOROUGH_META[boroughKey]

  console.log(`\n📍 Importing ${meta.city}...`)

  const items = await fetchDataset(datasetId)
  console.log(`   Found ${items.length} raw items`)

  // Deduplicate by CID (Google unique place ID)
  const seen = new Set<string>()
  const unique = items.filter(item => {
    const cid = String(item.cid || item.placeId || item.fid || '')
    if (!cid || seen.has(cid)) return false
    seen.add(cid)
    return true
  })
  console.log(`   ${unique.length} unique after dedup (removed ${items.length - unique.length} duplicates)`)

  let imported = 0
  const batch: any[] = []

  for (const item of unique) {
    if (!item.title) continue

    const category = mapCategory(item.searchString || '', item.categoryName || '')
    const sourceId = String(item.cid || item.placeId || item.fid || `apify-${slugify(item.title)}`)
    const slug = slugRegistry.generate(meta.stateSlug, meta.citySlug, category, item.title)

    const provider = {
      source: 'google_places' as const,
      source_id: sourceId,
      slug,
      business_name: item.title,
      category,
      subcategory: item.categoryName || null,
      address: item.address || item.street || '',
      city: meta.city,
      state: meta.state,
      zip: extractZip(item.address || ''),
      lat: item.location?.lat ?? null,
      lng: item.location?.lng ?? null,
      phone: item.phone || null,
      website: item.website || null,
      rating: item.totalScore || null,
      review_count: item.reviewsCount || 0,
      hours: normalizeApifyHours(item.openingHours),
      description: null,
      services: [],
      hero_image: item.imageUrl || null,
      gallery_images: [],
      emergency: category === 'emergency_vets',
      verified: false,
      last_synced_at: new Date().toISOString(),
    }

    if (dryRun) {
      console.log(`   [dry-run] ${provider.business_name} — ${provider.category} — ${provider.address}`)
      imported++
      continue
    }

    batch.push(provider)

    // Upsert in batches of 25
    if (batch.length >= 25) {
      const { error } = await supabaseAdmin
        .from('providers')
        .upsert(batch, { onConflict: 'source,source_id' })
      if (error) {
        console.error(`   ❌ Batch upsert error: ${error.message}`)
      } else {
        imported += batch.length
      }
      batch.length = 0
    }
  }

  // Flush remaining batch
  if (batch.length > 0 && !dryRun) {
    const { error } = await supabaseAdmin
      .from('providers')
      .upsert(batch, { onConflict: 'source,source_id' })
    if (error) {
      console.error(`   ❌ Final batch upsert error: ${error.message}`)
    } else {
      imported += batch.length
    }
  }

  console.log(`   ✅ ${imported} providers imported for ${meta.city}`)
  return imported
}

async function main() {
  if (dryRun) console.log('🔍 DRY RUN — no data will be written\n')
  console.log('🗽 Importing Apify Google Maps data for NYC boroughs...')

  let grandTotal = 0

  for (const boroughKey of Object.keys(DATASETS)) {
    try {
      const count = await importBorough(boroughKey)
      grandTotal += count
    } catch (err) {
      console.error(`   ❌ Failed to import ${boroughKey}:`, err)
    }
  }

  console.log(`\n🎉 Done: ${grandTotal} total providers imported across ${Object.keys(DATASETS).length} boroughs`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
