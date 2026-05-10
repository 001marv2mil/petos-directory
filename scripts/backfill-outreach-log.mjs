/**
 * Backfill outreach_log from Resend email history.
 *
 * The cron was sending emails but the outreach_log inserts were failing
 * (broken SUPABASE_URL). This script pulls emails from Resend, deduplicates
 * by (provider_id + email_num), and inserts ONE record per unique combination.
 *
 * Run: node --env-file=.env.local scripts/backfill-outreach-log.mjs
 *
 * Optional: set MAX_PAGES env var to limit fetch (default: 600 pages = 60k emails)
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const MAX_PAGES = parseInt(process.env.MAX_PAGES || '600')

if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing RESEND_API_KEY, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

// Determine email_num from subject line
function getEmailNum(subject) {
  if (!subject) return 1
  if (subject.includes('is now on petosdirectory.com')) return 1
  if (subject.includes('Still unclaimed')) return 2
  if (subject.includes('Your listing on petosdirectory.com')) return 2
  if (subject.includes('ready to stand out')) return 4
  if (subject.includes('has been live for a month')) return 5
  if (subject.includes('Last note about Featured')) return 6
  if (subject.includes('Want to be the top')) return 3
  return 1
}

// Build a map of email -> provider_id from the database
async function fetchProviderEmailMap() {
  const map = new Map()
  let offset = 0
  const PAGE_SIZE = 1000

  while (true) {
    const params = new URLSearchParams({
      select: 'id,contact_email',
      'contact_email': 'not.is.null',
      order: 'id.asc',
      offset: String(offset),
      limit: String(PAGE_SIZE),
    })

    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?${params}`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    })

    if (!res.ok) {
      console.error(`Supabase error: ${res.status}`)
      break
    }

    const data = await res.json()
    if (!data || data.length === 0) break

    for (const p of data) {
      if (p.contact_email) {
        map.set(p.contact_email.toLowerCase().trim(), p.id)
      }
    }

    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  return map
}

async function main() {
  // Phase 1: Build provider email map
  console.log('Fetching provider email map from Supabase...')
  const providerMap = await fetchProviderEmailMap()
  console.log(`Providers with emails: ${providerMap.size}`)

  if (providerMap.size === 0) {
    console.log('No providers found. Exiting.')
    return
  }

  // Phase 2: Fetch emails from Resend and deduplicate in memory
  // Key: "provider_id:email_num" -> value: { earliest sent_at record }
  const deduped = new Map()
  let cursor = null
  let page = 0
  let totalFetched = 0
  let rateLimitHits = 0

  console.log(`\nFetching emails from Resend (max ${MAX_PAGES} pages)...`)

  while (page < MAX_PAGES) {
    let url = 'https://api.resend.com/emails?limit=100'
    if (cursor) url += `&starting_after=${cursor}`

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` },
    })

    if (res.status === 429) {
      rateLimitHits++
      if (rateLimitHits > 50) {
        console.log(`  Too many rate limits (${rateLimitHits}). Stopping fetch.`)
        break
      }
      await sleep(3000)
      continue
    }

    if (!res.ok) {
      console.error(`Resend API error: ${res.status}`)
      break
    }

    const body = await res.json()
    if (!body.data || body.data.length === 0) break

    totalFetched += body.data.length
    page++

    // Match and deduplicate
    for (const email of body.data) {
      const to = Array.isArray(email.to) ? email.to[0] : email.to
      if (!to) continue

      const providerId = providerMap.get(to.toLowerCase().trim())
      if (!providerId) continue

      const emailNum = getEmailNum(email.subject)
      const key = `${providerId}:${emailNum}`

      // Keep earliest record for each (provider, email_num) pair
      if (!deduped.has(key)) {
        deduped.set(key, {
          provider_id: providerId,
          email_to: to,
          email_num: emailNum,
          sent_at: email.created_at,
        })
      } else {
        const existing = deduped.get(key)
        if (email.created_at < existing.sent_at) {
          existing.sent_at = email.created_at
        }
      }
    }

    if (page % 50 === 0) {
      console.log(`  Page ${page}: ${totalFetched} fetched, ${deduped.size} unique (provider,email_num) pairs`)
    }

    if (body.data.length < 100) break
    cursor = body.data[body.data.length - 1].id

    // 1s between requests to avoid most rate limits
    await sleep(1000)
  }

  console.log(`\nFetch complete.`)
  console.log(`  Pages fetched: ${page}`)
  console.log(`  Total emails: ${totalFetched}`)
  console.log(`  Unique (provider, email_num) records: ${deduped.size}`)
  console.log(`  Rate limit hits: ${rateLimitHits}`)

  if (deduped.size === 0) {
    console.log('Nothing to insert.')
    return
  }

  // Phase 3: Insert deduplicated records
  const records = Array.from(deduped.values())
  console.log(`\nInserting ${records.length} unique records into outreach_log...`)
  let inserted = 0
  let failed = 0

  for (let i = 0; i < records.length; i += 200) {
    const batch = records.slice(i, i + 200)

    const res = await fetch(`${SUPABASE_URL}/rest/v1/outreach_log`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(batch),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`  Insert error (batch ${Math.floor(i/200)+1}): ${res.status} ${body}`)
      failed += batch.length
    } else {
      inserted += batch.length
    }
  }

  console.log(`\n=== DONE ===`)
  console.log(`Inserted: ${inserted}`)
  console.log(`Failed: ${failed}`)
  console.log(`\nThe cron will now skip these providers for the logged email numbers.`)
}

main().catch(err => { console.error(err); process.exit(1) })
