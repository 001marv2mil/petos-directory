/**
 * Static pre-render script for PetOS Directory.
 *
 * Run after both Vite builds:
 *   1. vite build               -> dist/
 *   2. vite build --config vite.ssr.config.ts  -> ssr-build/
 *   3. node scripts/prerender.mjs
 *
 * For every route listed below the script renders the React tree to HTML
 * using react-dom/server (StaticRouter, no browser globals), injects the
 * Helmet <head> tags and the body HTML into the dist/index.html template,
 * then writes dist/[route]/index.html so Google sees real content
 * immediately without waiting for JS.
 *
 * Category pages (/:state/:city/:category) now pre-fetch provider data
 * from Supabase so the HTML includes real listings instead of loading
 * skeletons. This is critical for SEO -- Google needs to see content.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const ssrBuildDir = path.join(root, 'ssr-build')

// ── Supabase config ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
const HAS_SUPABASE = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

// ── Routes to pre-render ─────────────────────────────────────────────────────

const STATIC_ROUTES = [
  '/',
  '/privacy',
  '/reports/emergency-vet-access-2026',
  '/reports/pet-service-availability-2026',
]

// All states with city data
const STATES = [
  'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
  'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
  'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
  'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
  'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy',
]

// All cities per state: [stateSlug, citySlug]
const CITIES = [
  ['al', 'birmingham'],     ['al', 'huntsville'],
  ['ak', 'anchorage'],
  ['az', 'phoenix'],        ['az', 'scottsdale'],     ['az', 'tucson'],
  ['ar', 'little-rock'],    ['ar', 'fayetteville'],
  ['ca', 'los-angeles'],    ['ca', 'san-diego'],      ['ca', 'san-francisco'],
  ['ca', 'sacramento'],     ['ca', 'san-jose'],
  ['co', 'denver'],         ['co', 'colorado-springs'], ['co', 'boulder'],
  ['ct', 'hartford'],       ['ct', 'stamford'],
  ['de', 'wilmington'],
  ['fl', 'tampa'],          ['fl', 'st-petersburg'],  ['fl', 'clearwater'],
  ['fl', 'orlando'],        ['fl', 'miami'],           ['fl', 'jacksonville'],
  ['fl', 'fort-lauderdale'], ['fl', 'sarasota'],       ['fl', 'brandon'],
  ['ga', 'atlanta'],        ['ga', 'savannah'],        ['ga', 'augusta'],
  ['hi', 'honolulu'],
  ['id', 'boise'],
  ['il', 'chicago'],        ['il', 'naperville'],
  ['in', 'indianapolis'],   ['in', 'fort-wayne'],
  ['ia', 'des-moines'],     ['ia', 'cedar-rapids'],
  ['ks', 'wichita'],        ['ks', 'overland-park'],
  ['ky', 'louisville'],     ['ky', 'lexington'],
  ['la', 'new-orleans'],    ['la', 'baton-rouge'],
  ['me', 'portland'],
  ['md', 'baltimore'],      ['md', 'rockville'],
  ['ma', 'boston'],         ['ma', 'worcester'],
  ['mi', 'detroit'],        ['mi', 'grand-rapids'],
  ['mn', 'minneapolis'],    ['mn', 'st-paul'],
  ['ms', 'jackson'],
  ['mo', 'kansas-city'],    ['mo', 'st-louis'],
  ['mt', 'billings'],       ['mt', 'missoula'],
  ['ne', 'omaha'],          ['ne', 'lincoln'],
  ['nv', 'las-vegas'],      ['nv', 'reno'],
  ['nh', 'manchester'],
  ['nj', 'newark'],         ['nj', 'jersey-city'],
  ['nm', 'albuquerque'],    ['nm', 'santa-fe'],
  ['ny', 'new-york'],       ['ny', 'brooklyn'],       ['ny', 'buffalo'],
  ['ny', 'manhattan'],      ['ny', 'queens'],          ['ny', 'bronx'],
  ['ny', 'staten-island'],
  ['nc', 'charlotte'],      ['nc', 'raleigh'],         ['nc', 'durham'],
  ['nd', 'fargo'],
  ['oh', 'columbus'],       ['oh', 'cleveland'],       ['oh', 'cincinnati'],
  ['ok', 'oklahoma-city'],  ['ok', 'tulsa'],
  ['or', 'portland'],       ['or', 'eugene'],
  ['pa', 'philadelphia'],   ['pa', 'pittsburgh'],
  ['ri', 'providence'],
  ['sc', 'charleston'],     ['sc', 'columbia'],
  ['sd', 'sioux-falls'],
  ['tn', 'nashville'],      ['tn', 'memphis'],         ['tn', 'knoxville'],
  ['tx', 'houston'],        ['tx', 'dallas'],           ['tx', 'austin'],
  ['tx', 'san-antonio'],    ['tx', 'fort-worth'],       ['tx', 'el-paso'],
  ['ut', 'salt-lake-city'], ['ut', 'provo'],
  ['vt', 'burlington'],
  ['va', 'virginia-beach'], ['va', 'richmond'],         ['va', 'arlington'],
  ['wa', 'seattle'],        ['wa', 'spokane'],
  ['wv', 'charleston'],
  ['wi', 'milwaukee'],      ['wi', 'madison'],
  ['wy', 'cheyenne'],
]

const CATEGORIES = [
  'veterinarians',
  'emergency_vets',
  'groomers',
  'boarding',
  'daycare',
  'trainers',
  'pet_pharmacies',
]

function buildRouteList() {
  const routes = [...STATIC_ROUTES]
  routes.push('/faq')

  for (const state of STATES) {
    routes.push(`/${state}`)
  }

  for (const [state, city] of CITIES) {
    routes.push(`/${state}/${city}`)
    routes.push(`/${state}/${city}/faq`)
  }

  for (const [state, city] of CITIES) {
    for (const cat of CATEGORIES) {
      routes.push(`/${state}/${city}/${cat}`)
    }
  }

  return routes
}

// ── Supabase data fetching for category pages ────────────────────────────────

const PAGE_SIZE = 24

async function fetchProvidersForCategory(cityName, stateAbbr, category) {
  if (!HAS_SUPABASE) return null

  const params = new URLSearchParams({
    'select': '*',
    'state': `ilike.${stateAbbr}`,
    'city': `ilike.${cityName}`,
    'category': `eq.${category}`,
    'order': 'rating.desc.nullslast,review_count.desc',
    'limit': String(PAGE_SIZE),
    'offset': '0',
  })

  // Also get total count
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?${params}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'count=exact',
      },
    })

    if (!res.ok) return null

    const providers = await res.json()
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] ?? '0', 10)

    return {
      providers,
      total: total || providers.length,
      page: 1,
      hasMore: total > PAGE_SIZE,
      fallbackMode: 'exact',
    }
  } catch {
    return null
  }
}

function parseCategoryRoute(route) {
  // Match /:state/:city/:category
  const match = route.match(/^\/([a-z]{2})\/([a-z0-9-]+)\/([a-z_]+)$/)
  if (!match) return null
  const [, stateSlug, citySlug, category] = match
  if (!CATEGORIES.includes(category)) return null
  return { stateSlug, citySlug, category }
}

// ── Head-tag extraction ───────────────────────────────────────────────────────

function extractHeadTags(html) {
  const tags = []

  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, (m) => { tags.push(m); return '' })

  html = html.replace(/<meta\s[^>]*\/?>/gi, (m) => {
    if (
      /name=["'](description|robots|twitter:[^"']*)/i.test(m) ||
      /property=["'](og:[^"']*)/i.test(m)
    ) {
      tags.push(m)
      return ''
    }
    return m
  })

  html = html.replace(/<link\s[^>]*rel=["']canonical["'][^>]*\/?>/gi, (m) => { tags.push(m); return '' })

  html = html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, (m) => { tags.push(m); return '' })

  return { headTags: tags.join('\n    '), cleanedHtml: html }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const ssrEntryPath = path.join(ssrBuildDir, 'entry-server.js')
  if (!fs.existsSync(ssrEntryPath)) {
    console.error(`SSR bundle not found at ${ssrEntryPath}`)
    console.error('Run: vite build --config vite.ssr.config.ts')
    process.exit(1)
  }

  const { render, getCityMeta, getCategoryMeta } = await import(pathToFileURL(ssrEntryPath).href)

  const templatePath = path.join(distDir, 'index.html')
  const backupTemplatePath = path.join(distDir, '_template.html')

  if (!fs.existsSync(templatePath)) {
    console.error(`dist/index.html not found. Run: vite build`)
    process.exit(1)
  }

  let template = fs.readFileSync(templatePath, 'utf-8')

  if (!template.includes('<!--ssr-head-->') || !template.includes('<!--ssr-outlet-->')) {
    if (fs.existsSync(backupTemplatePath)) {
      template = fs.readFileSync(backupTemplatePath, 'utf-8')
      console.log('Using backup template (_template.html)')
    } else {
      console.error('dist/index.html is missing SSR markers and no backup exists.')
      process.exit(1)
    }
  }

  fs.writeFileSync(backupTemplatePath, template, 'utf-8')

  if (HAS_SUPABASE) {
    console.log('Supabase credentials found - will pre-fetch category page data')
  } else {
    console.log('No Supabase credentials - category pages will render with skeletons')
  }

  const routes = buildRouteList()
  console.log(`\nPre-rendering ${routes.length} routes...\n`)

  let ok = 0
  let failed = 0
  let dataFetched = 0

  for (const route of routes) {
    try {
      // Check if this is a category page that needs data
      let prefetchedData = undefined
      const catRoute = parseCategoryRoute(route)

      if (catRoute && HAS_SUPABASE) {
        const cityMeta = getCityMeta(catRoute.stateSlug, catRoute.citySlug)
        const categoryMeta = getCategoryMeta(catRoute.category)

        if (cityMeta && categoryMeta) {
          const result = await fetchProvidersForCategory(
            cityMeta.city,
            cityMeta.stateAbbr,
            catRoute.category
          )

          if (result && result.providers.length > 0) {
            // Build the exact query key that useProviders uses
            const queryKey = ['providers', {
              city: cityMeta.city,
              state: cityMeta.stateAbbr,
              category: catRoute.category,
              sort: 'rating',
              page: 1,
            }]

            prefetchedData = [{ queryKey, data: result }]
            dataFetched++
          }
        }
      }

      const { html, dehydratedState } = render(route, prefetchedData)

      const { headTags, cleanedHtml } = extractHeadTags(html)
      const fallbackHead = '<title>PetOS Directory -- Find Vets, Groomers, Boarding &amp; More</title>'

      let page = template
        .replace('<!--ssr-head-->', headTags || fallbackHead)
        .replace('<!--ssr-outlet-->', cleanedHtml)

      // Inject dehydrated React Query state for client hydration
      if (prefetchedData && dehydratedState?.queries?.length > 0) {
        const stateJson = JSON.stringify(dehydratedState)
        const script = `<script>window.__REACT_QUERY_STATE__=${stateJson}</script>`
        page = page.replace('</head>', `${script}\n</head>`)
      }

      const isRoot = route === '/'
      const filePath = isRoot
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route, 'index.html')

      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, page, 'utf-8')

      console.log(`  ${prefetchedData ? '++' : ' ✓'}  ${route}${prefetchedData ? ` (${prefetchedData[0].data.providers.length} providers)` : ''}`)
      ok++
    } catch (err) {
      console.error(`  X  ${route}  --  ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${ok} rendered, ${failed} failed, ${dataFetched} category pages with live data.\n`)
  if (failed > 0) process.exit(1)
}

main()
