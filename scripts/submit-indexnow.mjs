/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs              # submit all provider URLs
 *   node scripts/submit-indexnow.mjs --guides      # submit best-of guide URLs
 *   node scripts/submit-indexnow.mjs --all         # submit everything
 *
 * IndexNow accepts up to 10,000 URLs per batch submission.
 * Run: npx tsx --env-file=.env.local scripts/submit-indexnow.mjs
 */

const SITE = 'https://petosdirectory.com'
const KEY = '9844631f90874d9b9cce24ce540ec1e2'
const KEY_LOCATION = `${SITE}/${KEY}.txt`
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const BATCH_SIZE = 9500 // stay under 10k limit

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const CATEGORIES = [
  'veterinarians', 'emergency_vets', 'groomers',
  'boarding', 'daycare', 'trainers', 'pet_pharmacies',
]

async function fetchProviderSlugs() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials')
    process.exit(1)
  }

  let all = []
  let offset = 0
  const PAGE = 1000

  while (true) {
    const params = new URLSearchParams({
      select: 'slug,state,city,category',
      'slug': 'not.is.null',
      order: 'slug.asc',
      offset: String(offset),
      limit: String(PAGE),
    })

    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?${params}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })

    if (!res.ok) { console.error('Supabase error:', res.status); process.exit(1) }
    const data = await res.json()
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < PAGE) break
    offset += PAGE
  }

  return all
}

function buildCityGuideUrls(providers) {
  const combos = new Set()
  for (const p of providers) {
    const state = p.state?.toLowerCase().replace(/\s+/g, '-')
    const city = p.city?.toLowerCase().replace(/\s+/g, '-')
    if (state && city) {
      combos.add(`${state}/${city}`)
    }
  }

  const urls = []
  for (const combo of combos) {
    // City page + FAQ
    urls.push(`${SITE}/${combo}`)
    urls.push(`${SITE}/${combo}/faq`)
    // Category + best-of pages
    for (const cat of CATEGORIES) {
      urls.push(`${SITE}/${combo}/${cat}`)
      urls.push(`${SITE}/${combo}/best/${cat}`)
    }
  }
  return urls
}

async function submitBatch(urls) {
  const body = {
    host: 'petosdirectory.com',
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  return { status: res.status, ok: res.ok || res.status === 202 }
}

async function main() {
  const args = process.argv.slice(2)
  const doAll = args.includes('--all')
  const doGuides = args.includes('--guides')
  const doProviders = !doGuides || doAll

  console.log('Fetching provider data from Supabase...')
  const providers = await fetchProviderSlugs()
  console.log(`  Found ${providers.length} providers\n`)

  let allUrls = []

  // Static pages
  allUrls.push(
    `${SITE}/`,
    `${SITE}/search`,
    `${SITE}/faq`,
    `${SITE}/quiz`,
    `${SITE}/calculator`,
    `${SITE}/reports/emergency-vet-access-2026`,
    `${SITE}/reports/pet-service-availability-2026`,
  )

  if (doProviders) {
    const providerUrls = providers.map(p => `${SITE}/provider/${p.slug}`)
    allUrls = allUrls.concat(providerUrls)
    console.log(`  Provider URLs: ${providerUrls.length}`)
  }

  if (doGuides || doAll) {
    const guideUrls = buildCityGuideUrls(providers)
    allUrls = allUrls.concat(guideUrls)
    console.log(`  Guide/city URLs: ${guideUrls.length}`)
  }

  console.log(`  Total URLs to submit: ${allUrls.length}\n`)

  // Submit in batches
  let submitted = 0
  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(allUrls.length / BATCH_SIZE)

    console.log(`  Submitting batch ${batchNum}/${totalBatches} (${batch.length} URLs)...`)
    const { status, ok } = await submitBatch(batch)

    if (ok) {
      submitted += batch.length
      console.log(`    OK (HTTP ${status})`)
    } else {
      console.error(`    FAILED (HTTP ${status})`)
    }

    // Small delay between batches
    if (i + BATCH_SIZE < allUrls.length) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  console.log(`\nDone. ${submitted}/${allUrls.length} URLs submitted to IndexNow.`)
}

main().catch(err => { console.error(err); process.exit(1) })
