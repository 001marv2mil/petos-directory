/**
 * Pre-render provider pages with full SSR content + SEO meta tags.
 *
 * Run AFTER both Vite builds and the main prerender.mjs:
 *   1. vite build
 *   2. vite build --config vite.ssr.config.ts
 *   3. node scripts/prerender.mjs
 *   4. node scripts/prerender-providers.mjs
 *
 * Fetches ALL providers from Supabase, then for each one:
 *   - Passes provider data into the SSR render function via React Query prefetch
 *   - Renders the full ProviderPage React component with real content
 *   - Injects dehydrated React Query state for seamless client hydration
 *   - Writes dist/provider/{slug}/index.html
 *
 * This ensures Google sees real business details (name, address, phone, hours,
 * description, rating) instead of loading skeletons, fixing the Soft 404 issue.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const ssrBuildDir = path.join(root, 'ssr-build')

// ── Supabase config ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// ── Head-tag extraction (same as prerender.mjs) ─────────────────────────────

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

// ── Fetch all providers from Supabase REST API ──────────────────────────────

async function fetchAllProviders() {
  let all = []
  let offset = 0
  const PAGE_SIZE = 1000

  while (true) {
    const params = new URLSearchParams({
      'select': '*',
      'slug': 'not.is.null',
      'order': 'slug.asc',
      'offset': String(offset),
      'limit': String(PAGE_SIZE),
    })

    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?${params}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    })

    if (!res.ok) {
      console.error(`Supabase fetch error: ${res.status} ${res.statusText}`)
      process.exit(1)
    }

    const data = await res.json()
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  return all
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const ssrEntryPath = path.join(ssrBuildDir, 'entry-server.js')
  if (!fs.existsSync(ssrEntryPath)) {
    console.error(`SSR bundle not found at ${ssrEntryPath}`)
    console.error('Run: vite build --config vite.ssr.config.ts')
    process.exit(1)
  }

  const { render } = await import(pathToFileURL(ssrEntryPath).href)

  const templatePath = path.join(distDir, '_template.html')
  const indexPath = path.join(distDir, 'index.html')

  let template
  if (fs.existsSync(templatePath)) {
    template = fs.readFileSync(templatePath, 'utf-8')
  } else if (fs.existsSync(indexPath)) {
    template = fs.readFileSync(indexPath, 'utf-8')
  } else {
    console.error('No template found. Run vite build first.')
    process.exit(1)
  }

  if (!template.includes('<!--ssr-head-->') || !template.includes('<!--ssr-outlet-->')) {
    console.error('Template missing SSR markers (<!--ssr-head--> / <!--ssr-outlet-->)')
    process.exit(1)
  }

  console.log('Fetching all providers from Supabase...')
  const providers = await fetchAllProviders()
  console.log(`  Found ${providers.length} providers\n`)
  console.log(`Pre-rendering ${providers.length} provider pages...\n`)

  let ok = 0
  let failed = 0

  for (const provider of providers) {
    try {
      const slug = provider.slug
      const url = `/provider/${slug}`

      // Build prefetch data matching the exact query key useProvider uses:
      // queryKey: ['provider', slug]
      // The hook also attaches `featured` flag; default to false for SSR
      const providerData = { ...provider, featured: false }

      const prefetchedData = [
        { queryKey: ['provider', slug], data: providerData },
      ]

      const { html, dehydratedState } = render(url, prefetchedData)

      const { headTags, cleanedHtml } = extractHeadTags(html)
      const fallbackHead = `<title>${provider.business_name} | PetOS Directory</title>`

      let page = template
        .replace('<!--ssr-head-->', headTags || fallbackHead)
        .replace('<!--ssr-outlet-->', cleanedHtml)

      // Inject dehydrated React Query state for client hydration
      if (dehydratedState?.queries?.length > 0) {
        const stateJson = JSON.stringify(dehydratedState)
        const script = `<script>window.__REACT_QUERY_STATE__=${stateJson}</script>`
        page = page.replace('</head>', `${script}\n</head>`)
      }

      const filePath = path.join(distDir, 'provider', slug, 'index.html')
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, page, 'utf-8')

      ok++
      if (ok % 500 === 0) {
        console.log(`  ... ${ok} / ${providers.length} done`)
      }
    } catch (err) {
      console.error(`  X  /provider/${provider.slug}  --  ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${ok} provider pages rendered, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
