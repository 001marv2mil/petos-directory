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
const BATCH_PER_EMAIL = 100 // per email number per run (was 50 — doubled Apr 23 to shorten pool runway)
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
  // Corporate chains (won't forward to franchise/store owner)
  'enroll@petco.com',
  'info@petsmart.com',
  'info@banfield.com',
  'info@dogtopia.com',
  'psp0044@petsuppliesplus.com',
  'privacy@nva.com',
  'info@petbarinc.com',
  // Scraped junk: website template/CMS/font-designer emails, not business owners
  'impallari@gmail.com',
  'eben@eyebytes.com',
  'info@indiantypefoundry.com',
  'micah@micahrich.com',
  'contact@sansoxygen.com',
  'milenabbrandao@gmail.com',
  'jonpinhorn.typedesign@gmail.com',
  'hi@mystore.com',
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
    case 4: return `${p.business_name} — ready to stand out?`
    case 5: return `${p.business_name} — your listing has been live for a month`
    case 6: return `Last note about Featured Listing for ${p.business_name}`
    default: return ''
  }
}

function getHtml(emailNum: number, p: Provider, stats?: ProviderStats): string {
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

        <div style="border-top:1px solid #e5e7eb;margin:28px 0;padding-top:24px;">
          <p style="font-size:15px;line-height:1.6;font-weight:600;color:#111827;">
            Want to stand out from other ${catLabel}s in ${p.city}?
          </p>
          <p style="font-size:14px;line-height:1.6;color:#374151;">
            Featured businesses get <strong>top placement</strong>, a highlighted card
            with photo, and <strong>priority in search results</strong> across the directory.
          </p>
          <p style="text-align:center;margin:20px 0;">
            <a href="${FEATURED_URL}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Get Featured — $99/mo
            </a>
          </p>
          <p style="font-size:13px;color:#6b7280;text-align:center;">
            Cancel anytime. Your basic listing stays free, always.
          </p>
        </div>

        <p style="font-size:15px;line-height:1.6;">Best,<br/>Malak<br/>PetOS Directory</p>
      ${footer}`

    case 2: {
      const views2 = stats?.views ?? 0
      const viewLine = views2 > 0
        ? `<p style="font-size:15px;line-height:1.6;">In the past 30 days, your listing has been viewed <strong>${views2} time${views2 !== 1 ? 's' : ''}</strong> by pet owners searching for ${catLabel}s in ${p.city}.</p>`
        : `<p style="font-size:15px;line-height:1.6;">Your listing is live and showing up in searches for ${catLabel}s in ${p.city}.</p>`
      return `${base}
        <p style="font-size:15px;line-height:1.6;">Hi,</p>
        <p style="font-size:15px;line-height:1.6;">Quick update on <strong>${p.business_name}</strong>'s listing on PetOS Directory.</p>
        ${viewLine}
        <p style="font-size:15px;line-height:1.6;">
          If you want to update your hours, add photos, or include a special offer, you can claim your listing here — it takes less than 2 minutes and it's free:
        </p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${claimUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            Claim Your Listing (Free)
          </a>
        </p>
        <p style="font-size:15px;line-height:1.6;">— Malak<br/>PetOS Directory</p>
      ${footer}`
    }

    case 3: {
      const views3 = stats?.views ?? 0
      const clicks3 = stats?.clicks ?? 0
      const statsSummary = views3 > 0
        ? `<p style="font-size:15px;line-height:1.6;">Your listing has received <strong>${views3} view${views3 !== 1 ? 's' : ''}${clicks3 > 0 ? ` and ${clicks3} website click${clicks3 !== 1 ? 's' : ''}` : ''}</strong> from pet owners in ${p.city} over the past 30 days.</p>`
        : `<p style="font-size:15px;line-height:1.6;">Pet owners in ${p.city} are actively searching for ${catLabel}s — your listing is showing up in those results.</p>`
      return `${base}
        <p style="font-size:15px;line-height:1.6;">Hi,</p>
        <p style="font-size:15px;line-height:1.6;">One more note about <strong>${p.business_name}</strong>'s free listing on PetOS Directory.</p>
        ${statsSummary}
        <p style="font-size:15px;line-height:1.6;">
          Claiming your listing lets you update your hours, add photos, and make sure pet owners see accurate info. It's completely free:
        </p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${claimUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            Claim Your Listing (Free)
          </a>
        </p>
        <p style="font-size:13px;color:#9ca3af;">Won't be claiming it? No worries — your free listing stays up regardless.</p>
        <p style="font-size:15px;line-height:1.6;">— Malak<br/>PetOS Directory</p>
      ${footer}`
    }

    case 4:
      return `${base}
        <p style="font-size:15px;line-height:1.6;">Hi,</p>
        <p style="font-size:15px;line-height:1.6;">
          Thanks for claiming <strong>${p.business_name}</strong> on
          <a href="${SITE}" style="color:#16a34a;">petosdirectory.com</a> — your listing
          is now verified and showing updated info to pet owners in ${p.city}.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          Want to take it a step further? <strong>Featured businesses get
          top placement</strong> — meaning pet owners see you first when they search
          for ${catLabel}s in ${p.city}.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          Here's what Featured includes:
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
        <p style="font-size:13px;color:#6b7280;text-align:center;">
          Cancel anytime. No contracts.
        </p>
        <p style="font-size:15px;line-height:1.6;">— Malak<br/>PetOS Directory</p>
      ${footer}`

    case 5:
      return `${base}
        <p style="font-size:15px;line-height:1.6;">Hi,</p>
        <p style="font-size:15px;line-height:1.6;">
          Quick update — <strong>${p.business_name}</strong> has been live on
          <a href="${SITE}" style="color:#16a34a;">petosdirectory.com</a> for about a month now.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          Pet owners are searching for ${catLabel}s in ${p.city} every day. Right now your
          listing shows up alongside everyone else in the area. <strong>Featured businesses
          get the top spot</strong> — they're the first thing pet owners see, with a bigger
          card, photo, and a special offer banner.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          For $99/mo, you get:
        </p>
        <ul style="font-size:14px;line-height:1.8;padding-left:20px;color:#374151;">
          <li>Top placement on the ${p.city} ${catLabel} page</li>
          <li>A promotional offer banner (e.g. "20% off first visit") that pet owners see right when they land on your listing</li>
          <li>Priority across search results</li>
        </ul>
        <p style="text-align:center;margin:24px 0;">
          <a href="${FEATURED_URL}" style="display:inline-block;background:#16a34a;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            Upgrade to Featured — $99/mo
          </a>
        </p>
        <p style="font-size:13px;color:#6b7280;text-align:center;">
          Cancel anytime. Your basic listing always stays free.
        </p>
        <p style="font-size:15px;line-height:1.6;">— Malak<br/>PetOS Directory</p>
      ${footer}`

    case 6:
      return `${base}
        <p style="font-size:15px;line-height:1.6;">Hi,</p>
        <p style="font-size:15px;line-height:1.6;">
          Last note from me about Featured — I won't keep emailing about this.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          <strong>${p.business_name}</strong> has been on petosdirectory.com for two months.
          You've claimed it, your info is verified, but you're still listed alongside other
          ${catLabel}s in ${p.city}.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          Featured businesses are seeing the difference — top placement, highlighted listings,
          and the ability to run promotional offers like "first visit free" right on their listing.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          If you want to give it a try, here's the link one more time:
        </p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${FEATURED_URL}" style="display:inline-block;background:#16a34a;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            Get Featured — $99/mo
          </a>
        </p>
        <p style="font-size:13px;color:#6b7280;text-align:center;">
          Cancel anytime. No contracts.
        </p>
        <p style="font-size:15px;line-height:1.6;">
          Either way, your basic listing stays up and continues sending you referrals at no cost.
          Thanks for being part of ${p.city}'s pet community.
        </p>
        <p style="font-size:15px;line-height:1.6;">— Malak<br/>PetOS Directory</p>
      ${footer}`

    default:
      return ''
  }
}

// ─── Exclusion lists ──────────────────────────────────────────────────────────

async function getClaimedProviderIds(): Promise<Set<string>> {
  const ids = new Set<string>()
  const { data } = await supabase.from('claim_requests').select('provider_id')
  if (data) data.forEach(c => ids.add(c.provider_id))
  return ids
}

async function getPaidProviderIds(): Promise<Set<string>> {
  const ids = new Set<string>()
  const { data } = await supabase.from('featured_payments').select('provider_id').eq('status', 'active')
  if (data) data.forEach(p => ids.add(p.provider_id))
  return ids
}

// ─── Provider stats ───────────────────────────────────────────────────────────

interface ProviderStats {
  views: number
  clicks: number
}

async function fetchStatsForProviders(ids: string[]): Promise<Map<string, ProviderStats>> {
  const map = new Map<string, ProviderStats>()
  if (ids.length === 0) return map

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100)
    const { data } = await supabase
      .from('provider_analytics')
      .select('provider_id, event_type')
      .in('provider_id', chunk)
      .gte('created_at', since)

    for (const row of data || []) {
      const s = map.get(row.provider_id) ?? { views: 0, clicks: 0 }
      if (row.event_type === 'view') s.views++
      else if (row.event_type === 'click_website') s.clicks++
      map.set(row.provider_id, s)
    }
  }
  return map
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

  // Claimed businesses get Email 4 instead; paid businesses get nothing
  const claimedIds = await getClaimedProviderIds()
  const paidIds = await getPaidProviderIds()

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
    .filter(id => !claimedIds.has(id))  // Claimed → routed to Email 4 instead
    .filter(id => !paidIds.has(id))     // Paid → done, no more emails

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

// Shared helper: fetch providers whose claim was APPROVED at least N days ago,
// haven't received the given email yet, and haven't paid for Featured.
async function fetchPostApprovalTargets(emailNum: number, daysAgo: number): Promise<Provider[]> {
  const cutoff = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

  // Only APPROVED claims (admin has verified them) past the age cutoff
  const { data: claims } = await supabase
    .from('claim_requests')
    .select('provider_id')
    .eq('status', 'approved')
    .lt('approved_at', cutoff)

  if (!claims || claims.length === 0) return []

  const approvedIds = [...new Set(claims.map(c => c.provider_id))]

  // Exclude those who already got this email
  const { data: alreadySent } = await supabase
    .from('outreach_log')
    .select('provider_id')
    .eq('email_num', emailNum)

  const alreadySentIds = new Set((alreadySent || []).map(s => s.provider_id))

  // Exclude those who already paid for Featured
  const paidIds = await getPaidProviderIds()

  const targetIds = approvedIds
    .filter(id => !alreadySentIds.has(id))
    .filter(id => !paidIds.has(id))

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

// Email 4: post-approval upsell (1 day after admin approves)
async function fetchEmail4Targets(): Promise<Provider[]> {
  return fetchPostApprovalTargets(4, 1)
}

// Email 5: 30-day check-in (30 days after approval)
async function fetchEmail5Targets(): Promise<Provider[]> {
  return fetchPostApprovalTargets(5, 30)
}

// Email 6: 60-day final nudge (60 days after approval)
async function fetchEmail6Targets(): Promise<Provider[]> {
  return fetchPostApprovalTargets(6, 60)
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

  // Pre-fetch stats for emails that use them
  const statsMap = (emailNum === 2 || emailNum === 3)
    ? await fetchStatsForProviders(batch.map(p => p.id))
    : new Map<string, ProviderStats>()

  let sent = 0
  let failed = 0

  for (const p of batch) {
    try {
      await resend.emails.send({
        from: FROM,
        replyTo: REPLY_TO,
        to: p.contact_email,
        subject: getSubject(emailNum, p),
        html: getHtml(emailNum, p, statsMap.get(p.id)),
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

    // Email #3 — follow up on #2 sent 3+ days ago (unclaimed, unpaid only)
    const email3Targets = await fetchFollowUpTargets(3)
    const r3 = email3Targets.length > 0
      ? await sendBatch(email3Targets, 3)
      : { sent: 0, failed: 0 }
    results.email3 = { ...r3, eligible: email3Targets.length }

    // Email #4 — post-approval upsell (1 day after admin approves the claim, not paid)
    const email4Targets = await fetchEmail4Targets()
    const r4 = email4Targets.length > 0
      ? await sendBatch(email4Targets, 4)
      : { sent: 0, failed: 0 }
    results.email4 = { ...r4, eligible: email4Targets.length }

    // Email #5 — 30-day check-in (30 days after approval, not paid)
    const email5Targets = await fetchEmail5Targets()
    const r5 = email5Targets.length > 0
      ? await sendBatch(email5Targets, 5)
      : { sent: 0, failed: 0 }
    results.email5 = { ...r5, eligible: email5Targets.length }

    // Email #6 — final nudge (60 days after approval, not paid)
    const email6Targets = await fetchEmail6Targets()
    const r6 = email6Targets.length > 0
      ? await sendBatch(email6Targets, 6)
      : { sent: 0, failed: 0 }
    results.email6 = { ...r6, eligible: email6Targets.length }

    console.log('Outreach cron complete:', JSON.stringify(results))
    return res.status(200).json({ success: true, results })
  } catch (err: any) {
    console.error('Outreach cron error:', err)
    return res.status(500).json({ error: err.message })
  }
}
