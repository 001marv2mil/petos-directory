/**
 * Static pre-render script for PetOS Directory.
 *
 * Run after both Vite builds:
 *   1. vite build               → dist/
 *   2. vite build --config vite.ssr.config.ts  → ssr-build/
 *   3. node scripts/prerender.mjs
 *
 * For every route listed below the script renders the React tree to HTML
 * using react-dom/server (StaticRouter, no browser globals), injects the
 * Helmet <head> tags and the body HTML into the dist/index.html template,
 * then writes dist/[route]/index.html so Google sees real content
 * immediately without waiting for JS.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const ssrBuildDir = path.join(root, 'ssr-build')

// ── Routes to pre-render ─────────────────────────────────────────────────────
// Keep this list focused on high-value SEO pages.
// Provider pages (/provider/:slug) are intentionally excluded — there can be
// thousands and they are indexed fine via Google's JS rendering + sitemap.

const STATIC_ROUTES = [
  '/',
  '/privacy',
]

// Top states to generate state landing pages for
const STATES = [
  'fl', 'tx', 'ca', 'ny', 'ga', 'nc', 'wa', 'il', 'pa', 'oh',
  'tn', 'co', 'az', 'nv', 'or', 'mn', 'mo', 'in', 'ma', 'va',
]

// Top cities per state: [stateSlug, citySlug]
const CITIES = [
  ['fl', 'tampa'],        ['fl', 'miami'],         ['fl', 'orlando'],
  ['fl', 'jacksonville'], ['fl', 'fort-lauderdale'],['fl', 'sarasota'],
  ['tx', 'houston'],      ['tx', 'dallas'],         ['tx', 'austin'],
  ['tx', 'san-antonio'],  ['tx', 'fort-worth'],
  ['ca', 'los-angeles'],  ['ca', 'san-diego'],      ['ca', 'san-francisco'],
  ['ca', 'sacramento'],   ['ca', 'san-jose'],
  ['ny', 'new-york'],     ['ny', 'brooklyn'],       ['ny', 'buffalo'],
  ['ga', 'atlanta'],      ['ga', 'savannah'],
  ['nc', 'charlotte'],    ['nc', 'raleigh'],        ['nc', 'durham'],
  ['wa', 'seattle'],      ['wa', 'spokane'],
  ['il', 'chicago'],
  ['pa', 'philadelphia'], ['pa', 'pittsburgh'],
  ['oh', 'columbus'],     ['oh', 'cleveland'],      ['oh', 'cincinnati'],
  ['tn', 'nashville'],    ['tn', 'memphis'],
  ['co', 'denver'],       ['co', 'boulder'],
  ['az', 'phoenix'],      ['az', 'scottsdale'],     ['az', 'tucson'],
  ['nv', 'las-vegas'],    ['nv', 'reno'],
  ['or', 'portland'],
  ['mn', 'minneapolis'],
  ['mo', 'kansas-city'],  ['mo', 'st-louis'],
  ['ma', 'boston'],
  ['va', 'virginia-beach'], ['va', 'richmond'],
  ['in', 'indianapolis'],
]

// Categories to generate per city
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

  // Global FAQ page
  routes.push('/faq')

  // State pages
  for (const state of STATES) {
    routes.push(`/${state}`)
  }

  // City pages + city FAQ pages
  for (const [state, city] of CITIES) {
    routes.push(`/${state}/${city}`)
    routes.push(`/${state}/${city}/faq`)
  }

  // Category pages (city × category)
  for (const [state, city] of CITIES) {
    for (const cat of CATEGORIES) {
      routes.push(`/${state}/${city}/${cat}`)
    }
  }

  return routes
}

// ── Head-tag extraction ───────────────────────────────────────────────────────
// react-helmet-async v3 on React 19 renders <title>/<meta>/<link> as React
// elements directly in the HTML string (body). We extract them here and hoist
// them into <head> so crawlers see a properly structured document.

function extractHeadTags(html) {
  const tags = []

  // <title>
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, (m) => { tags.push(m); return '' })

  // SEO <meta> tags — skip charset / viewport / http-equiv (already in template)
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

  // <link rel="canonical">
  html = html.replace(/<link\s[^>]*rel=["']canonical["'][^>]*\/?>/gi, (m) => { tags.push(m); return '' })

  // JSON-LD <script> blocks (structured data — fine anywhere, but cleaner in head)
  html = html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, (m) => { tags.push(m); return '' })

  return { headTags: tags.join('\n    '), cleanedHtml: html }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Load the SSR bundle built by vite.ssr.config.ts
  const ssrEntryPath = path.join(ssrBuildDir, 'entry-server.js')
  if (!fs.existsSync(ssrEntryPath)) {
    console.error(`SSR bundle not found at ${ssrEntryPath}`)
    console.error('Run: vite build --config vite.ssr.config.ts')
    process.exit(1)
  }

  const { render } = await import(pathToFileURL(ssrEntryPath).href)

  // Load the client-built index.html as the template.
  // We prefer a previously-saved clean copy (_template.html) so that running
  // this script standalone (after a full build) still has the SSR markers even
  // though dist/index.html was overwritten when the '/' route was last rendered.
  const templatePath = path.join(distDir, 'index.html')
  const backupTemplatePath = path.join(distDir, '_template.html')

  if (!fs.existsSync(templatePath)) {
    console.error(`dist/index.html not found. Run: vite build`)
    process.exit(1)
  }

  let template = fs.readFileSync(templatePath, 'utf-8')

  // If the main template has already been replaced (missing markers), use backup
  if (!template.includes('<!--ssr-head-->') || !template.includes('<!--ssr-outlet-->')) {
    if (fs.existsSync(backupTemplatePath)) {
      template = fs.readFileSync(backupTemplatePath, 'utf-8')
      console.log('Using backup template (_template.html)')
    } else {
      console.error('dist/index.html is missing SSR markers and no backup exists.')
      console.error('Run: vite build  (to regenerate the template with SSR markers)')
      process.exit(1)
    }
  }

  // Save a clean backup before the loop overwrites dist/index.html for '/'
  fs.writeFileSync(backupTemplatePath, template, 'utf-8')

  const routes = buildRouteList()
  console.log(`\nPre-rendering ${routes.length} routes…\n`)

  let ok = 0
  let failed = 0

  for (const route of routes) {
    try {
      const { html } = render(route)

      // react-helmet-async v3 / React 19 renders <title>/<meta> as inline
      // React elements — extract them from the body HTML and hoist to <head>.
      const { headTags, cleanedHtml } = extractHeadTags(html)

      const fallbackHead = '<title>PetOS Directory — Find Vets, Groomers, Boarding &amp; More</title>'

      let page = template
        .replace('<!--ssr-head-->', headTags || fallbackHead)
        .replace('<!--ssr-outlet-->', cleanedHtml)

      // Determine output path
      const isRoot = route === '/'
      const filePath = isRoot
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route, 'index.html')

      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, page, 'utf-8')

      console.log(`  ✓  ${route}`)
      ok++
    } catch (err) {
      console.error(`  ✗  ${route}  —  ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${ok} rendered, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main()
