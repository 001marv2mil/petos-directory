/**
 * Generates a sitemap index + multiple sub-sitemaps from Supabase provider data.
 *
 * Output:
 *   public/sitemap.xml                - sitemap index
 *   public/sitemap-static.xml         - homepage, search, faq
 *   public/sitemap-cities.xml         - /state/city + /state/city/faq
 *   public/sitemap-categories.xml     - /state/city/category
 *   public/sitemap-providers-N.xml    - /provider/:slug (chunked 5000/file)
 *
 * Splitting lets Google Search Console report indexed counts per type, which
 * surfaces which pages Google is ignoring. Also keeps each file small so
 * crawl budget can chew through them faster.
 *
 * Run: npx tsx --env-file=.env.local scripts/generate-sitemap.ts
 */
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const SITE = 'https://petosdirectory.com'
const TODAY = new Date().toISOString().split('T')[0]
const PROVIDERS_PER_SITEMAP = 5000

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function urlEntry(loc: string, priority = '0.5', changefreq = 'weekly') {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n    <lastmod>${TODAY}</lastmod>\n  </url>`
}

function writeUrlset(filename: string, urls: string[]) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
  writeFileSync(resolve(process.cwd(), 'public', filename), xml, 'utf-8')
}

function writeSitemapIndex(filenames: string[]) {
  const entries = filenames.map(
    f => `  <sitemap>\n    <loc>${SITE}/${f}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`,
  )
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`
  writeFileSync(resolve(process.cwd(), 'public/sitemap.xml'), xml, 'utf-8')
}

async function generate() {
  // Fetch all providers (Supabase caps at 1000/query)
  let allProviders: Array<{ state: string; city: string; category: string; slug: string }> = []
  let offset = 0
  const PAGE = 1000
  while (true) {
    const { data, error } = await supabase
      .from('providers')
      .select('state, city, category, slug')
      .not('state', 'is', null)
      .not('city', 'is', null)
      .range(offset, offset + PAGE - 1)
    if (error) { console.error('Supabase error:', error.message); process.exit(1) }
    if (!data || data.length === 0) break
    allProviders = allProviders.concat(data)
    if (data.length < PAGE) break
    offset += PAGE
  }
  console.log(`  Fetched ${allProviders.length} providers from Supabase`)
  if (!allProviders.length) { console.error('No providers'); process.exit(1) }

  const citySet = new Set<string>()
  const categorySet = new Set<string>()
  const providerSlugs: string[] = []

  for (const row of allProviders) {
    const stateSlug = row.state.toLowerCase().replace(/\s+/g, '-')
    const citySlug = row.city.toLowerCase().replace(/\s+/g, '-')
    const cityKey = `${stateSlug}/${citySlug}`
    citySet.add(cityKey)
    categorySet.add(`${cityKey}/${row.category}`)
    if (row.slug) providerSlugs.push(row.slug)
  }

  // --- Static ---
  const staticUrls = [
    urlEntry('/', '1.0', 'daily'),
    urlEntry('/search', '0.8', 'daily'),
    urlEntry('/faq', '0.7', 'monthly'),
  ]
  writeUrlset('sitemap-static.xml', staticUrls)

  // --- Cities (city + city faq) ---
  const cityUrls: string[] = []
  for (const c of citySet) {
    cityUrls.push(urlEntry(`/${c}`, '0.7', 'weekly'))
    cityUrls.push(urlEntry(`/${c}/faq`, '0.6', 'monthly'))
  }
  writeUrlset('sitemap-cities.xml', cityUrls)

  // --- Categories ---
  const categoryUrls = [...categorySet].map(c => urlEntry(`/${c}`, '0.8', 'weekly'))
  writeUrlset('sitemap-categories.xml', categoryUrls)

  // --- Providers (chunked) ---
  const providerFiles: string[] = []
  for (let i = 0; i < providerSlugs.length; i += PROVIDERS_PER_SITEMAP) {
    const chunk = providerSlugs.slice(i, i + PROVIDERS_PER_SITEMAP)
    const filename = `sitemap-providers-${Math.floor(i / PROVIDERS_PER_SITEMAP) + 1}.xml`
    writeUrlset(filename, chunk.map(s => urlEntry(`/provider/${s}`, '0.6', 'monthly')))
    providerFiles.push(filename)
  }

  // --- Index ---
  const indexFiles = ['sitemap-static.xml', 'sitemap-cities.xml', 'sitemap-categories.xml', ...providerFiles]
  writeSitemapIndex(indexFiles)

  console.log(`✓ Sitemap index written with ${indexFiles.length} sub-sitemaps`)
  console.log(`  - static: 3 urls`)
  console.log(`  - cities: ${cityUrls.length} urls`)
  console.log(`  - categories: ${categoryUrls.length} urls`)
  console.log(`  - providers: ${providerSlugs.length} urls across ${providerFiles.length} files`)
  console.log(`  Total: ${3 + cityUrls.length + categoryUrls.length + providerSlugs.length} urls`)
}

generate().catch(err => { console.error(err); process.exit(1) })
