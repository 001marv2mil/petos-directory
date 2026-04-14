/**
 * Automated outreach email script for PetOS Directory.
 *
 * Sends a 3-email sequence to business owners inviting them to claim their listing.
 * Derives contact email from the business website domain (info@domain.com).
 * Tracks every send in the outreach_log table to avoid duplicates.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/outreach.ts              # dry run (default)
 *   npx tsx --env-file=.env.local scripts/outreach.ts --send        # actually send
 *   npx tsx --env-file=.env.local scripts/outreach.ts --send --batch=50
 *   npx tsx --env-file=.env.local scripts/outreach.ts --email=2     # send email #2 to those who got #1 5+ days ago
 *   npx tsx --env-file=.env.local scripts/outreach.ts --email=3     # send email #3 to those who got #2 5+ days ago
 */

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RESEND_API_KEY = process.env.RESEND_API_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
})
const resend = new Resend(RESEND_API_KEY)

const SITE = 'https://petosdirectory.com'
const FROM = 'Malak from PetOS Directory <malak@petosdirectory.com>'
const REPLY_TO = 'info@petoshealth.com'
const DELAY_MS = 500 // 500ms between sends to respect rate limits
const FEATURED_URL = 'https://buy.stripe.com/fZu00jeJLblfecd4tg04802'

const CATEGORY_LABELS: Record<string, string> = {
  veterinarians: 'veterinarian',
  emergency_vets: 'emergency vet',
  groomers: 'pet groomer',
  boarding: 'pet boarding facility',
  daycare: 'dog daycare',
  trainers: 'pet trainer',
  pet_pharmacies: 'pet pharmacy',
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const DRY_RUN = !args.includes('--send')
const BATCH_SIZE = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '50')
const EMAIL_NUM = parseInt(args.find(a => a.startsWith('--email='))?.split('=')[1] || '1')

// ─── Email templates ──────────────────────────────────────────────────────────

interface Provider {
  id: string
  business_name: string
  website: string
  contact_email: string | null
  phone: string | null
  city: string
  state: string
  category: string
  slug: string
  rating: number | null
  review_count: number | null
}


function getSubject(emailNum: number, p: Provider): string {
  switch (emailNum) {
    case 1: return `${p.business_name} is now on petosdirectory.com`
    case 2: return `Your listing on petosdirectory.com`
    case 3: return `Want to be the top ${p.city} ${CATEGORY_LABELS[p.category] || 'pet service'}?`
    default: return ''
  }
}

function getHtml(emailNum: number, p: Provider): string {
  const listingUrl = `${SITE}/provider/${p.slug}`
  const claimUrl = `${SITE}/claim/${p.slug}?name=${encodeURIComponent(p.business_name)}`
  const catLabel = CATEGORY_LABELS[p.category] || 'pet service'
  const ratingLine = p.rating && p.review_count
    ? `<p style="color:#374151;font-size:14px;">Your listing shows a <strong>${p.rating}/5 rating</strong> from ${p.review_count} reviews — that's great social proof for pet owners searching in ${p.city}.</p>`
    : ''

  const base = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#374151;">
  `
  const footer = `
      <p style="font-size:13px;color:#9ca3af;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;">
        PetOS Directory — Trusted pet services near you<br/>
        <a href="${SITE}" style="color:#16a34a;">petosdirectory.com</a><br/><br/>
        <a href="${SITE}/unsubscribe?email={{email}}" style="color:#9ca3af;font-size:12px;">Unsubscribe</a>
      </p>
    </div>
  `

  switch (emailNum) {
    case 1:
      return `${base}
        <p style="font-size:15px;line-height:1.6;">Hi there,</p>
        <p style="font-size:15px;line-height:1.6;">
          We just added <strong>${p.business_name}</strong> to
          <a href="${SITE}" style="color:#16a34a;">petosdirectory.com</a> — a free
          directory helping pet owners find trusted ${catLabel}s in ${p.city}, ${p.state}.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          Your listing is live here:
          <a href="${listingUrl}" style="color:#16a34a;">${listingUrl}</a>
        </p>
        ${ratingLine}
        <p style="font-size:15px;line-height:1.6;">
          No action needed — it's completely free. If you'd like to update your hours,
          add photos, or include a special offer, you can claim it here:
        </p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${claimUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            Claim Your Listing (Free)
          </a>
        </p>
        <p style="font-size:15px;line-height:1.6;">Best,<br/>Malak<br/>PetOS Directory</p>
      ${footer}`

    case 2:
      return `${base}
        <p style="font-size:15px;line-height:1.6;">Hi,</p>
        <p style="font-size:15px;line-height:1.6;">
          Just checking in — your listing for <strong>${p.business_name}</strong> has been
          live for a few days and is showing up in searches for ${catLabel}s in ${p.city}.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          Claimed listings rank higher and show more info to pet owners. Takes less than 2 minutes:
        </p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${claimUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            Claim Your Listing (Free)
          </a>
        </p>

        <div style="border-top:1px solid #e5e7eb;margin:28px 0;padding-top:24px;">
          <p style="font-size:15px;line-height:1.6;font-weight:600;color:#111827;">
            Want to stand out from other ${catLabel}s in ${p.city}?
          </p>
          <p style="font-size:14px;line-height:1.6;color:#374151;">
            Some businesses are upgrading to <strong>Featured</strong> — here's what you get:
          </p>
          <ul style="font-size:14px;line-height:1.8;padding-left:20px;color:#374151;">
            <li>Top placement on the ${p.city} ${catLabel} page</li>
            <li>Highlighted card with your photo &amp; call-to-action</li>
            <li>Priority in search results</li>
          </ul>
          <p style="text-align:center;margin:20px 0;">
            <a href="${FEATURED_URL}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Get Featured — $99/mo
            </a>
          </p>
          <p style="font-size:13px;color:#6b7280;text-align:center;">
            Cancel anytime. Your basic listing stays free, always.
          </p>
        </div>

        <p style="font-size:15px;line-height:1.6;">— Malak<br/>PetOS Directory</p>
      ${footer}`

    case 3:
      return `${base}
        <p style="font-size:15px;line-height:1.6;">Hi,</p>
        <p style="font-size:15px;line-height:1.6;">
          Quick question — do you want <strong>${p.business_name}</strong> to be the first
          ${catLabel} pet owners see when they search in ${p.city}?
        </p>
        <p style="font-size:15px;line-height:1.6;">
          Right now your listing is live on
          <a href="${SITE}" style="color:#16a34a;">petosdirectory.com</a> alongside other
          ${catLabel}s in the area. <strong>Featured businesses appear first</strong> — with a
          highlighted card, photo, and a direct call-to-action button.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          We're featuring <strong>5 ${catLabel}s per city</strong>. Here's what's included:
        </p>
        <ul style="font-size:14px;line-height:1.8;padding-left:20px;color:#374151;">
          <li><strong>Top placement</strong> on the ${p.city} ${catLabel} page</li>
          <li><strong>Highlighted card</strong> with your photo &amp; call button</li>
          <li><strong>Priority</strong> in search results across the directory</li>
        </ul>
        <p style="text-align:center;margin:24px 0;">
          <a href="${FEATURED_URL}" style="display:inline-block;background:#16a34a;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            Get Featured — $99/mo
          </a>
        </p>
        <p style="font-size:13px;color:#6b7280;text-align:center;margin-bottom:24px;">
          Cancel anytime. No contracts.
        </p>
        <p style="font-size:13px;color:#9ca3af;">
          Not interested in Featured? Your free listing stays up —
          <a href="${claimUrl}" style="color:#16a34a;">claim it here</a> to update your info anytime.
        </p>
        <p style="font-size:15px;line-height:1.6;">— Malak<br/>PetOS Directory</p>
      ${footer}`

    default:
      return ''
  }
}

// ─── Exclusion lists ──────────────────────────────────────────────────────────

async function getExcludedProviderIds(): Promise<Set<string>> {
  const excluded = new Set<string>()

  // Exclude businesses that have submitted a claim request
  const { data: claimed } = await supabase
    .from('claim_requests')
    .select('provider_id')

  if (claimed) claimed.forEach(c => excluded.add(c.provider_id))

  // Exclude businesses that have paid for featured listing
  const { data: paid } = await supabase
    .from('featured_payments')
    .select('provider_id')
    .eq('status', 'active')

  if (paid) paid.forEach(p => excluded.add(p.provider_id))

  return excluded
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function fetchTargets(): Promise<Provider[]> {
  if (EMAIL_NUM === 1) {
    // Get providers with websites who haven't received email 1 yet
    const PAGE_SIZE = 1000
    let all: Provider[] = []
    let offset = 0

    while (true) {
      const { data, error } = await supabase
        .from('providers')
        .select('id, business_name, website, contact_email, phone, city, state, category, slug, rating, review_count')
        .not('contact_email', 'is', null)
        .not('slug', 'is', null)
        .range(offset, offset + PAGE_SIZE - 1)

      if (error) { console.error('Supabase error:', error.message); process.exit(1) }
      if (!data || data.length === 0) break
      all = all.concat(data as Provider[])
      if (data.length < PAGE_SIZE) break
      offset += PAGE_SIZE
    }

    // Filter out those already sent email 1
    const { data: sent } = await supabase
      .from('outreach_log')
      .select('provider_id')
      .eq('email_num', 1)

    const sentIds = new Set((sent || []).map(s => s.provider_id))
    return all.filter(p => !sentIds.has(p.id))
  } else {
    // For email 2/3: find providers who got the previous email 5+ days ago
    // and haven't received this email yet
    const prevEmailNum = EMAIL_NUM - 1
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

    // Get providers who already claimed or paid — skip them
    const excludedIds = await getExcludedProviderIds()

    const { data: eligible } = await supabase
      .from('outreach_log')
      .select('provider_id')
      .eq('email_num', prevEmailNum)
      .lt('sent_at', threeDaysAgo)

    if (!eligible || eligible.length === 0) return []

    const { data: alreadySent } = await supabase
      .from('outreach_log')
      .select('provider_id')
      .eq('email_num', EMAIL_NUM)

    const alreadySentIds = new Set((alreadySent || []).map(s => s.provider_id))
    const targetIds = [...new Set(eligible.map(e => e.provider_id))]
      .filter(id => !alreadySentIds.has(id))
      .filter(id => !excludedIds.has(id)) // Skip claimed + paid businesses

    if (targetIds.length === 0) return []

    // Fetch provider details in chunks
    const all: Provider[] = []
    for (let i = 0; i < targetIds.length; i += 100) {
      const chunk = targetIds.slice(i, i + 100)
      const { data } = await supabase
        .from('providers')
        .select('id, business_name, website, contact_email, phone, city, state, category, slug, rating, review_count')
        .in('id', chunk)

      if (data) all.push(...(data as Provider[]))
    }
    return all
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log(`\nPetOS Directory Outreach — Email #${EMAIL_NUM}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (add --send to actually send)' : 'LIVE SENDING'}`)
  console.log(`Batch size: ${BATCH_SIZE}\n`)

  const targets = await fetchTargets()
  console.log(`Found ${targets.length} eligible providers`)

  // Filter out placeholder/invalid emails
  const PLACEHOLDER_PATTERNS = [
    /^info@domain\.com$/i, /^user@domain\.com$/i, /^example@/i,
    /^test@test\./i, /^filler@/i, /^noreply@/i, /^no-reply@/i,
    /^donotreply@/i, /^yourname@/i, /^name@/i, /^email@/i,
    /^sample@/i, /^placeholder@/i,
  ]
  const CHAIN_EMAILS = ['enroll@petco.com', 'info@petsmart.com', 'info@banfield.com', 'info@dogtopia.com']

  const withEmail = targets
    .filter((p): p is Provider & { contact_email: string } => {
      if (!p.contact_email) return false
      const lower = p.contact_email.toLowerCase().trim()
      if (CHAIN_EMAILS.includes(lower)) return false
      if (PLACEHOLDER_PATTERNS.some(pat => pat.test(lower))) return false
      if (lower.includes('@example.') || lower.includes('@domain.')) return false
      return true
    })
    .map(p => ({ ...p, email: p.contact_email }))

  // Deduplicate by email
  const seen = new Set<string>()
  const unique = withEmail.filter(p => {
    if (seen.has(p.email)) return false
    seen.add(p.email)
    return true
  })

  console.log(`${unique.length} unique verified emails`)

  const batch = unique.slice(0, BATCH_SIZE)
  console.log(`Sending to ${batch.length} providers...\n`)

  let sent = 0
  let failed = 0

  for (const p of batch) {
    const subject = getSubject(EMAIL_NUM, p)
    const html = getHtml(EMAIL_NUM, p).replace('{{email}}', encodeURIComponent(p.email))

    if (DRY_RUN) {
      console.log(`  [DRY] ${p.email} — ${p.business_name} (${p.city}, ${p.state})`)
      sent++
      continue
    }

    try {
      await resend.emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: p.email,
        subject,
        html,
      })

      // Log to outreach_log
      await supabase.from('outreach_log').insert({
        provider_id: p.id,
        email_to: p.email,
        email_num: EMAIL_NUM,
      })

      console.log(`  ✓  ${p.email} — ${p.business_name}`)
      sent++
      await sleep(DELAY_MS)
    } catch (err: any) {
      console.error(`  ✗  ${p.email} — ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${sent} sent, ${failed} failed.`)
  if (withEmail.length > BATCH_SIZE) {
    console.log(`${withEmail.length - BATCH_SIZE} remaining — run again to send the next batch.`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
