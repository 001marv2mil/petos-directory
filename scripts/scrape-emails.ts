/**
 * Scrape contact emails from provider websites.
 *
 * Visits each provider's website, looks for email addresses on the page
 * (and common contact/about pages), then saves found emails to the
 * providers table in a `contact_email` column.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/scrape-emails.ts              # scrape batch of 50
 *   npx tsx --env-file=.env.local scripts/scrape-emails.ts --batch=100  # bigger batch
 *   npx tsx --env-file=.env.local scripts/scrape-emails.ts --retry      # retry previously failed ones
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
})

const args = process.argv.slice(2)
const BATCH_SIZE = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '50')
const RETRY = args.includes('--retry')

// Domains to skip - chains, platforms, social media
const SKIP_DOMAINS = new Set([
  'google.com', 'facebook.com', 'yelp.com', 'instagram.com', 'tiktok.com',
  'twitter.com', 'linkedin.com', 'youtube.com', 'nextdoor.com',
  'petsmart.com', 'petco.com', 'petsupermarket.com', 'banfield.com',
  'vcahospitals.com', 'nvavet.com', 'bluepearlvet.com', 'dogtopia.com',
  'dogtrainingelite.com', 'sagecenters.com', 'veg.com', 'rover.com',
  'wag.com', 'va.gov', 'wix.com', 'squarespace.com', 'wordpress.com',
  'booking.com', 'sites.google.com',
  'walgreens.com', 'cvs.com', 'walmart.com', 'costco.com', 'target.com',
  'chewy.com', 'amazon.com', 'petflow.com',
])

function getDomain(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (SKIP_DOMAINS.has(host)) return null
    return host
  } catch {
    return null
  }
}

// Email regex - finds emails in page HTML
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g

// Filter out junk emails
function isValidEmail(email: string, _domain: string): boolean {
  const lower = email.toLowerCase()
  // Skip image files, CSS, JS references
  if (/\.(png|jpg|jpeg|gif|svg|webp|css|js)$/i.test(lower)) return false
  // Skip example/placeholder emails
  if (lower.includes('example.com') || lower.includes('test.com')) return false
  // Skip generic placeholder patterns
  if (lower.startsWith('user@domain') || lower.startsWith('info@domain') || lower.startsWith('email@domain')) return false
  if (lower.startsWith('name@') || lower.startsWith('your') || lower.startsWith('username@')) return false
  // Skip wordpress/platform emails
  if (lower.includes('wordpress') || lower.includes('wix') || lower.includes('squarespace')) return false
  // Skip sentry, tracking, no-reply generic
  if (lower.includes('sentry') || lower.includes('cloudflare')) return false
  // Prefer emails on the same domain, but accept others
  return true
}

function rankEmail(email: string, domain: string): number {
  const lower = email.toLowerCase()
  // Same domain = best
  if (lower.endsWith(`@${domain}`)) {
    // Prefer specific contact emails
    if (lower.startsWith('info@') || lower.startsWith('contact@') || lower.startsWith('hello@')) return 100
    if (lower.startsWith('office@') || lower.startsWith('reception@') || lower.startsWith('admin@')) return 90
    if (lower.startsWith('appointments@') || lower.startsWith('front') || lower.startsWith('staff@')) return 85
    // Any other email on the domain
    return 80
  }
  // Gmail/outlook for the business owner
  if (lower.endsWith('@gmail.com') || lower.endsWith('@yahoo.com') || lower.endsWith('@outlook.com')) return 40
  // Other domain
  return 20
}

async function fetchPage(url: string, timeout = 5000): Promise<string | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const text = await res.text()
    return text
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function extractEmails(html: string): string[] {
  // Also decode mailto: links and HTML entities
  const decoded = html
    .replace(/&#64;/g, '@')
    .replace(/&#x40;/g, '@')
    .replace(/\[at\]/gi, '@')
    .replace(/\(at\)/gi, '@')
    .replace(/ at /gi, '@')
    .replace(/&#46;/g, '.')
    .replace(/\[dot\]/gi, '.')

  const matches = decoded.match(EMAIL_REGEX) || []
  return [...new Set(matches)]
}

async function scrapeProvider(website: string, domain: string): Promise<string | null> {
  // Try main page first
  let html = await fetchPage(website)
  if (!html) return null

  let allEmails = extractEmails(html)

  // If no emails on main page, try common contact page paths
  if (allEmails.filter(e => isValidEmail(e, domain)).length === 0) {
    const base = website.replace(/\/$/, '')
    const contactPaths = ['/contact']

    for (const path of contactPaths) {
      const contactHtml = await fetchPage(`${base}${path}`)
      if (contactHtml) {
        allEmails = allEmails.concat(extractEmails(contactHtml))
      }
      // Found emails? Stop checking more pages
      if (allEmails.filter(e => isValidEmail(e, domain)).length > 0) break
    }
  }

  // Filter and rank
  const valid = allEmails
    .filter(e => isValidEmail(e, domain))
    .sort((a, b) => rankEmail(b, domain) - rankEmail(a, domain))

  return valid[0] || null
}

async function main() {
  console.log(`\nPetOS Email Scraper`)
  console.log(`Batch size: ${BATCH_SIZE}\n`)

  // First ensure contact_email column exists
  // (This is idempotent - won't error if it already exists)
  const { error: colErr } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS contact_email text;
          ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS email_scraped boolean NOT NULL DEFAULT false;`
  }).single()

  // If RPC doesn't exist, try direct
  if (colErr) {
    console.log('Note: Could not add columns via RPC. They may already exist or need manual creation.')
    console.log('Run this in Supabase SQL Editor if you get errors:')
    console.log('  ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS contact_email text;')
    console.log('  ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS email_scraped boolean NOT NULL DEFAULT false;\n')
  }

  // Fetch providers that haven't been scraped yet
  let query = supabase
    .from('providers')
    .select('id, business_name, website, city, state, slug')
    .not('website', 'is', null)
    .not('slug', 'is', null)

  if (!RETRY) {
    query = query.eq('email_scraped', false)
  }

  const { data: providers, error: fetchErr } = await query
    .limit(BATCH_SIZE)

  if (fetchErr) {
    console.error('Fetch error:', fetchErr.message)

    // If email_scraped column doesn't exist yet, fetch without it
    if (fetchErr.message.includes('email_scraped')) {
      console.log('\nThe email_scraped column does not exist yet.')
      console.log('Please run this SQL in Supabase SQL Editor first:\n')
      console.log('  ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS contact_email text;')
      console.log('  ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS email_scraped boolean NOT NULL DEFAULT false;')
      process.exit(1)
    }
    process.exit(1)
  }

  if (!providers || providers.length === 0) {
    console.log('No providers to scrape. All done!')
    return
  }

  console.log(`Scraping ${providers.length} websites...\n`)

  let found = 0
  let notFound = 0
  let errors = 0

  for (const p of providers) {
    const domain = getDomain(p.website)
    if (!domain) {
      // Skip chain/platform sites, mark as scraped
      await supabase.from('providers').update({ email_scraped: true }).eq('id', p.id)
      continue
    }

    try {
      const email = await scrapeProvider(p.website, domain)

      if (email) {
        await supabase
          .from('providers')
          .update({ contact_email: email, email_scraped: true })
          .eq('id', p.id)
        console.log(`  ✓  ${email.padEnd(40)} ${p.business_name}`)
        found++
      } else {
        await supabase
          .from('providers')
          .update({ email_scraped: true })
          .eq('id', p.id)
        console.log(`  —  ${'(none)'.padEnd(40)} ${p.business_name}`)
        notFound++
      }
    } catch (err: any) {
      await supabase
        .from('providers')
        .update({ email_scraped: true })
        .eq('id', p.id)
      console.log(`  ✗  ${'(error)'.padEnd(40)} ${p.business_name} — ${err.message?.slice(0, 50)}`)
      errors++
    }
  }

  console.log(`\nDone. ${found} emails found, ${notFound} not found, ${errors} errors.`)

  // Count remaining
  const { count } = await supabase
    .from('providers')
    .select('id', { count: 'exact', head: true })
    .not('website', 'is', null)
    .eq('email_scraped', false)

  if (count && count > 0) {
    console.log(`${count} providers remaining — run again to scrape the next batch.`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
