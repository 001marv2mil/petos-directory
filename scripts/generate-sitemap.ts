/**
 * Generates public/sitemap.xml from Supabase provider data + static routes.
 * Run: npx tsx scripts/generate-sitemap.ts
 */
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import 'dotenv/config'

const SITE = 'https://petos.directory'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function url(loc: string, priority = '0.5', changefreq = 'weekly') {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

async function generate() {
  const urls: string[] = []

  // Static pages
  urls.push(url('/', '1.0', 'daily'))
  urls.push(url('/search', '0.8', 'daily'))

  // Fetch all unique state/city/category combos
  const { data: combos } = await supabase
    .from('providers')
    .select('state, city, category, slug')
    .not('state', 'is', null)
    .not('city', 'is', null)

  if (!combos) {
    console.error('No provider data returned')
    process.exit(1)
  }

  // Collect unique state+city pairs and slugs
  const citySet = new Set<string>()
  const categorySet = new Set<string>()

  for (const row of combos) {
    const stateSlug = row.state.toLowerCase().replace(/\s+/g, '-')
    const citySlug = row.city.toLowerCase().replace(/\s+/g, '-')
    const cityKey = `${stateSlug}/${citySlug}`
    citySet.add(cityKey)
    categorySet.add(`${cityKey}/${row.category}`)

    // Provider page
    if (row.slug) {
      urls.push(url(`/provider/${row.slug}`, '0.6', 'monthly'))
    }
  }

  // City pages
  for (const city of citySet) {
    urls.push(url(`/${city}`, '0.7', 'weekly'))
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
}

generate().catch(err => { console.error(err); process.exit(1) })
