import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// ─── Config ────────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)
const resend = new Resend(process.env.RESEND_API_KEY!)

const SITE = 'https://petosdirectory.com'
const FROM = 'Malak from PetOS Directory <malak@petosdirectory.com>'
const REPLY_TO = 'info@petoshealth.com'
const BATCH_PER_EMAIL = 50 // per email number per run
const DELAY_MS = 500
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

// ─── Placeholder email filter ─────────────────────────────────────────────────

const PLACEHOLDER_PATTERNS = [
  /^info@domain\.com$/i,
  /^user@domain\.com$/i,
  /^example@/i,
  /^test@test\./i,
  /^filler@/i,
  /^noreply@/i,
  /^no-reply@/i,
  /^donotreply@/i,
  /^admin@example\./i,
  /^yourname@/i,
  /^name@/i,
  /^email@/i,
  /^sample@/i,
  /^placeholder@/i,
  /^contact@example\./i,
]

const CHAIN_EMAILS = [
  'enroll@petco.com',
  'info@petsmart.com',
  'info@banfield.com',
  'info@dogtopia.com',
]

function isValidOutreachEmail(email: string): boolean {
  const lower = email.toLowerCase().trim()
  if (CHAIN_EMAILS.includes(lower)) return false
  if (PLACEHOLDER_PATTERNS.some(p => p.test(lower))) return false
  if (lower.includes('@example.') || lower.includes('@domain.')) return false
  return true
}

// ─── Email templates ──────────────────────────────────────────────────────────

interface Provider {
  id: string
  business_name: string
  contact_email: string
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

  const base = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#374151;">`
  const footer = `
    <p style="font-size:13px;color:#9ca3af;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;">
      PetOS Directory — Trusted pet services near you<br/>
      <a href="${SITE}" style="color:#16a34a;">petosdirectory.com</a><br/><br/>
      <a href="${SITE}/unsubscribe?email=${encodeURIComponent(p.contact_email)}" style="color:#9ca3af;font-size:12px;">Unsubscribe</a>
    </p></div>`

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
// Businesses that have claimed their listing or paid for featured should not
// receive follow-up emails pitching them things they've already done.

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

// ─── Fetch targets ─────────────────────────────────────────────────────────────

async function fetchEmail1Targets(): Promise<Provider[]> {
  const PAGE_SIZE = 1000
  let all: Provider[] = []
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from('providers')
      .select('id, business_name, contact_email, city, state, category, slug, rating, review_count')
      .not('contact_email', 'is', null)
      .not('slug', 'is', null)
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) throw new Error(`Supabase error: ${error.message}`)
    if (!data || data.length === 0) break
    all = all.concat(data as Provider[])
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  // Filter out already sent
  const { data: sent } = await supabase
    .from('outreach_log')
    .select('provider_id')
    .eq('email_num', 1)

  const sentIds = new Set((sent || []).map(s => s.provider_id))
  return all.filter(p => !sentIds.has(p.id) && isValidOutreachEmail(p.contact_email))
}

async function fetchFollowUpTargets(emailNum: number): Promise<Provider[]> {
  const prevEmailNum = emailNum - 1
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

  // Get providers who already claimed or paid — skip them for follow-ups
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
    .eq('email_num', emailNum)

  const alreadySentIds = new Set((alreadySent || []).map(s => s.provider_id))
  const targetIds = Array.from(new Set(eligible.map(e => e.provider_id)))
    .filter(id => !alreadySentIds.has(id))
    .filter(id => !excludedIds.has(id)) // Skip claimed + paid businesses

  if (targetIds.length === 0) return []

  const all: Provider[] = []
  for (let i = 0; i < targetIds.length; i += 100) {
    const chunk = targetIds.slice(i, i + 100)
    const { data } = await supabase
      .from('providers')
      .select('id, business_name, contact_email, city, state, category, slug, rating, review_count')
      .in('id', chunk)

    if (data) all.push(...(data as Provider[]))
  }
  return all.filter(p => p.contact_email && isValidOutreachEmail(p.contact_email))
}

// ─── Send batch ────────────────────────────────────────────────────────────────

async function sendBatch(providers: Provider[], emailNum: number): Promise<{ sent: number; failed: number }> {
  // Deduplicate by email
  const seen = new Set<string>()
  const unique = providers.filter(p => {
    const email = p.contact_email.toLowerCase()
    if (seen.has(email)) return false
    seen.add(email)
    return true
  })

  const batch = unique.slice(0, BATCH_PER_EMAIL)
  let sent = 0
  let failed = 0

  for (const p of batch) {
    try {
      await resend.emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: p.contact_email,
        subject: getSubject(emailNum, p),
        html: getHtml(emailNum, p),
      })

      await supabase.from('outreach_log').insert({
        provider_id: p.id,
        email_to: p.contact_email,
        email_num: emailNum,
      })

      sent++

      // Rate limit
      await new Promise(r => setTimeout(r, DELAY_MS))
    } catch (err: any) {
      console.error(`Failed: ${p.contact_email} — ${err.message}`)
      failed++
    }
  }

  return { sent, failed }
}

// ─── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret (Vercel sends this automatically for cron jobs)
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const results: Record<string, { sent: number; failed: number; eligible: number }> = {}

  try {
    // Email #1 — new providers
    const email1Targets = await fetchEmail1Targets()
    const r1 = email1Targets.length > 0
      ? await sendBatch(email1Targets, 1)
      : { sent: 0, failed: 0 }
    results.email1 = { ...r1, eligible: email1Targets.length }

    // Email #2 — follow up on #1 sent 5+ days ago
    const email2Targets = await fetchFollowUpTargets(2)
    const r2 = email2Targets.length > 0
      ? await sendBatch(email2Targets, 2)
      : { sent: 0, failed: 0 }
    results.email2 = { ...r2, eligible: email2Targets.length }

    // Email #3 — follow up on #2 sent 5+ days ago
    const email3Targets = await fetchFollowUpTargets(3)
    const r3 = email3Targets.length > 0
      ? await sendBatch(email3Targets, 3)
      : { sent: 0, failed: 0 }
    results.email3 = { ...r3, eligible: email3Targets.length }

    console.log('Outreach cron complete:', JSON.stringify(results))
    return res.status(200).json({ success: true, results })
  } catch (err: any) {
    console.error('Outreach cron error:', err)
    return res.status(500).json({ error: err.message })
  }
}
