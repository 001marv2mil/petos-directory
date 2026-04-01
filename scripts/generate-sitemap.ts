/**
 * Generates public/sitemap.xml from Supabase provider data + static routes.
 * Run: npx tsx --env-file=.env.local scripts/generate-sitemap.ts
 */
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const SITE = 'https://petosdirectory.com'
const TODAY = new Date().toISOString().split('T')[0]

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function url(loc: string, priority = '0.5', changefreq = 'weekly') {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n    <lastmod>${TODAY}</lastmod>\n  </url>`
}

async function generate() {
  const urls: string[] = []

  // Static pages
  urls.push(url('/', '1.0', 'daily'))
  urls.push(url('/search', '0.8', 'daily'))
  urls.push(url('/faq', '0.7', 'monthly'))

  // Fetch all providers — paginate to get everything (Supabase caps at 1000)
  let allProviders: Array<{ state: string; city: string; category: string; slug: string }> = []
  let offset = 0
  const PAGE_SIZE = 1000

  while (true) {
    const { data, error } = await supabase
      .from('providers')
      .select('state, city, category, slug')
      .not('state', 'is', null)
      .not('city', 'is', null)
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) {
      console.error('Supabase error:', error.message)
      process.exit(1)
    }
    if (!data || data.length === 0) break
    allProviders = allProviders.concat(data)
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  console.log(`  Fetched ${allProviders.length} providers from Supabase`)

  if (allProviders.length === 0) {
    console.error('No provider data returned')
    process.exit(1)
  }

  // Collect unique state+city pairs, categories, and provider slugs
  const citySet = new Set<string>()
  const categorySet = new Set<string>()

  for (const row of allProviders) {
    const stateSlug = row.state.toLowerCase().replace(/\s+/g, '-')
    const citySlug = row.city.toLowerCase().replace(/\s+/g, '-')
    const cityKey = `${stateSlug}/${citySlug}`
    citySet.add(cityKey)
    categorySet.add(`${cityKey}/${row.category}`)

    // Individual provider page
    if (row.slug) {
      urls.push(url(`/provider/${row.slug}`, '0.6', 'monthly'))
    }
  }

  // City pages + city FAQ pages
  for (const city of citySet) {
    urls.push(url(`/${city}`, '0.7', 'weekly'))
    urls.push(url(`/${city}/faq`, '0.6', 'monthly'))
  }

  // Category pages
  for (const cat of categorySet) {
    urls.push(url(`/${cat}`, '0.8', 'weekly'))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  const outPath = resolve(process.cwd(), 'public/sitemap.xml')
  writeFileSync(outPath, xml, 'utf-8')
  console.log(`✓ Sitemap written to ${outPath} with ${urls.length} URLs`)
  console.log(`  - ${allProviders.filter(p => p.slug).length} provider pages`)
  console.log(`  - ${citySet.size} city pages`)
  console.log(`  - ${citySet.size} FAQ pages`)
  console.log(`  - ${categorySet.size} category pages`)
  console.log(`  - 3 static pages`)
}

generate().catch(err => { console.error(err); process.exit(1) })
