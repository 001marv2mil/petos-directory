/**
 * Pre-render provider pages with correct SEO meta tags.
 *
 * Run AFTER the main prerender.mjs script:
 *   node scripts/prerender-providers.mjs
 *
 * Fetches all providers from Supabase and generates static HTML files
 * at dist/provider/{slug}/index.html with proper <title>, <meta description>,
 * <link canonical>, and LocalBusiness JSON-LD structured data.
 *
 * This ensures Googlebot sees unique, correct meta tags for every provider
 * page instead of falling back to the homepage defaults.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

const SITE = 'https://petosdirectory.com'

const CATEGORY_LABELS = {
  veterinarians: 'Veterinarian',
  emergency_vets: 'Emergency Vet',
  groomers: 'Pet Groomer',
  boarding: 'Pet Boarding',
  daycare: 'Dog Daycare',
  trainers: 'Pet Trainer',
  pet_pharmacies: 'Pet Pharmacy',
}

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildDescription(p) {
  const catLabel = CATEGORY_LABELS[p.category] || p.category
  const rating = p.rating ? ` Rated ${p.rating}/5` : ''
  const reviews = p.review_count ? ` with ${p.review_count} reviews.` : '.'
  return `${p.business_name} is a ${catLabel.toLowerCase()} in ${p.city}, ${p.state}.${rating}${reviews} Find hours, phone, address, and more on PetOS Directory.`
}

function buildJsonLd(p) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: p.business_name,
    url: `${SITE}/provider/${p.slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.address,
      addressLocality: p.city,
      addressRegion: p.state,
      ...(p.zip ? { postalCode: p.zip } : {}),
      addressCountry: 'US',
    },
  }

  if (p.phone) data.telephone = p.phone
  if (p.website) data.sameAs = p.website
  if (p.description) data.description = p.description

  if (p.rating !== null && p.review_count > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.rating,
      reviewCount: p.review_count,
      bestRating: 5,
    }
  }

  if (p.lat && p.lng) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: p.lat,
      longitude: p.lng,
    }
  }

  return JSON.stringify(data)
}

function buildBreadcrumbJsonLd(p) {
  const stateSlug = p.state.toLowerCase()
  const citySlug = p.city.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: p.state, item: `${SITE}/${stateSlug}` },
      { '@type': 'ListItem', position: 3, name: p.city, item: `${SITE}/${stateSlug}/${citySlug}` },
      { '@type': 'ListItem', position: 4, name: p.business_name },
    ],
  })
}

// ── Internal linking (SEO) ──────────────────────────────────────────────────
// Hidden-but-crawlable HTML block injected inside #root. Googlebot sees
// breadcrumb + nearby-provider + city + category links immediately. The visible
// React UI still renders NearbyProviders client-side for users after hydration.

function cityPath(p) {
  return `${p.state.toLowerCase()}/${p.city.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`
}

function buildInternalLinksBlock(p, nearby) {
  const catLabel = CATEGORY_LABELS[p.category] || p.category
  const cityUrl = `/${cityPath(p)}`
  const categoryUrl = `/${cityPath(p)}/${p.category}`

  const nearbyList = nearby
    .map(n => `<li><a href="/provider/${n.slug}">${escapeHtml(n.business_name)} — ${escapeHtml(n.city)}, ${escapeHtml(n.state)}</a></li>`)
    .join('')

  return `<aside class="seo-internal-links" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/${p.state.toLowerCase()}">${escapeHtml(p.state)}</a> › <a href="${cityUrl}">${escapeHtml(p.city)}</a> › <a href="${categoryUrl}">${escapeHtml(catLabel)}</a> › ${escapeHtml(p.business_name)}</nav>
  <h2>${escapeHtml(p.business_name)}</h2>
  ${p.description ? `<p>${escapeHtml(p.description)}</p>` : ''}
  <h3>More ${escapeHtml(catLabel.toLowerCase())}s in ${escapeHtml(p.city)}</h3>
  <ul>${nearbyList}</ul>
  <p><a href="${cityUrl}">All pet services in ${escapeHtml(p.city)}</a></p>
  <p><a href="${categoryUrl}">All ${escapeHtml(catLabel.toLowerCase())}s in ${escapeHtml(p.city)}</a></p>
</aside>`
}

function buildNearbyIndex(providers) {
  const map = new Map()
  for (const p of providers) {
    const k = `${p.state}|${p.city.toLowerCase()}|${p.category}`
    const arr = map.get(k) || []
    arr.push(p)
    map.set(k, arr)
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.review_count ?? 0) - (a.review_count ?? 0))
  }
  return map
}

function findNearby(p, index, limit = 5) {
  const k = `${p.state}|${p.city.toLowerCase()}|${p.category}`
  const bucket = index.get(k) || []
  return bucket.filter(n => n.slug !== p.slug).slice(0, limit)
}

async function fetchAllProviders() {
  let all = []
  let offset = 0
  const PAGE_SIZE = 1000

  while (true) {
    const { data, error } = await supabase
      .from('providers')
      .select('slug, business_name, category, address, city, state, zip, phone, website, rating, review_count, description, lat, lng, hero_image')
      .not('slug', 'is', null)
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) {
      console.error('Supabase error:', error.message)
      process.exit(1)
    }
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  return all
}

async function main() {
  console.log('Fetching providers from Supabase...')
  const providers = await fetchAllProviders()
  console.log(`  Found ${providers.length} providers`)

  // Load the template
  const backupPath = path.join(distDir, '_template.html')
  const indexPath = path.join(distDir, 'index.html')
  let template

  if (fs.existsSync(backupPath)) {
    template = fs.readFileSync(backupPath, 'utf-8')
  } else if (fs.existsSync(indexPath)) {
    template = fs.readFileSync(indexPath, 'utf-8')
  } else {
    console.error('No template found. Run npm run build first.')
    process.exit(1)
  }

  // Ensure template has SSR markers
  if (!template.includes('<!--ssr-head-->')) {
    console.error('Template missing <!--ssr-head--> marker')
    process.exit(1)
  }

  console.log(`Building nearby-provider index...`)
  const nearbyIndex = buildNearbyIndex(providers)

  console.log(`Generating ${providers.length} provider pages...\n`)

  let ok = 0
  let failed = 0

  for (const p of providers) {
    try {
      const title = `${escapeHtml(p.business_name)} — ${escapeHtml(p.city)}, ${escapeHtml(p.state)} | PetOS Directory`
      const description = escapeHtml(buildDescription(p))
      const canonical = `${SITE}/provider/${p.slug}`
      const catLabel = CATEGORY_LABELS[p.category] || p.category
      const image = p.hero_image || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80&fit=crop'

      const headTags = `
    <title>${title}</title>
    <meta name="description" content="${description}"/>
    <link rel="canonical" href="${canonical}"/>
    <meta property="og:title" content="${title}"/>
    <meta property="og:description" content="${description}"/>
    <meta property="og:image" content="${escapeHtml(image)}"/>
    <meta property="og:url" content="${canonical}"/>
    <meta property="og:type" content="website"/>
    <meta property="og:site_name" content="PetOS Directory"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="${title}"/>
    <meta name="twitter:description" content="${description}"/>
    <meta name="twitter:image" content="${escapeHtml(image)}"/>
    <script type="application/ld+json">${buildJsonLd(p)}</script>
    <script type="application/ld+json">${buildBreadcrumbJsonLd(p)}</script>`

      // Head tags: rich metadata for crawlers.
      // Body (#root): hidden-but-crawlable internal-link block so Google sees
      // nearby provider links, breadcrumb, city, and category pages immediately.
      // React hydrates on top of it after load — the visible UI is the normal
      // React-rendered page with the NearbyProviders component etc.
      const nearby = findNearby(p, nearbyIndex, 5)
      const internalLinks = buildInternalLinksBlock(p, nearby)
      const page = template
        .replace('<!--ssr-head-->', headTags)
        .replace('<!--ssr-outlet-->', internalLinks)

      const filePath = path.join(distDir, 'provider', p.slug, 'index.html')
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, page, 'utf-8')

      ok++
    } catch (err) {
      console.error(`  ✗  /provider/${p.slug}  —  ${err.message}`)
      failed++
    }
  }

  console.log(`Done. ${ok} provider pages generated, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
