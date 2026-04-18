/**
 * Send a "please backlink us" email to approved claim requests.
 *
 * High-ROI play: businesses that claimed their listing already engaged positively.
 * They're the most likely segment to add a backlink from their own site.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backlink-outreach.ts              # dry run
 *   npx tsx --env-file=.env.local scripts/backlink-outreach.ts --send       # actually send
 *
 * Sends at most once per claim — tracked in outreach_log as email_num=99
 * (reserved for backlink asks, distinct from the claim sequence 1-6).
 */
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RESEND_API_KEY = process.env.RESEND_API_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
const resend = new Resend(RESEND_API_KEY)

const SITE = 'https://petosdirectory.com'
const FROM = 'Malak from PetOS Directory <malak@petosdirectory.com>'
const REPLY_TO = 'petosdirectory@gmail.com'
const BACKLINK_EMAIL_NUM = 99
const DRY_RUN = !process.argv.includes('--send')

function subject(businessName: string): string {
  return `Quick favor, ${businessName}?`
}

function html(p: {
  owner_name: string
  business_name: string
  slug: string
  city: string
  state: string
}): string {
  const listingUrl = `${SITE}/provider/${p.slug}`
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; line-height: 1.6; color: #111; max-width: 560px;">
<p>Hi ${p.owner_name.split(' ')[0]},</p>

<p>Thanks again for claiming ${p.business_name} on PetOS Directory — your listing is live:</p>

<p><a href="${listingUrl}" style="color: #1d4ed8;">${listingUrl}</a></p>

<p>Quick ask: if you have a website, would you mind adding a small link back to your PetOS profile? Somewhere like a "Featured On" or "Find Us On" section works great. Even a single line like:</p>

<p style="background: #f4f4f5; padding: 12px; border-left: 3px solid #1d4ed8; font-family: monospace; font-size: 14px;">
Also listed on <a href="${listingUrl}">PetOS Directory</a>
</p>

<p>It helps both of us:</p>
<ul>
  <li><strong>For you:</strong> pet owners searching for ${p.city} services will find you faster</li>
  <li><strong>For us:</strong> Google trusts the directory more when real businesses link to it</li>
</ul>

<p>Takes 30 seconds. No pressure if not — your listing stays live either way. Just reply if you need help adding it.</p>

<p>Thanks,<br>
Malak<br>
PetOS Directory</p>
</div>
`.trim()
}

interface Target {
  claim_id: string
  provider_id: string
  owner_name: string
  owner_email: string
  business_name: string
  slug: string
  city: string
  state: string
}

async function fetchTargets(): Promise<Target[]> {
  // approved claims
  const { data: claims, error: cErr } = await supabase
    .from('claim_requests')
    .select('id, provider_id, owner_name, owner_email, business_name')
    .eq('status', 'approved')
  if (cErr) throw cErr
  if (!claims?.length) return []

  const providerIds = claims.map(c => c.provider_id)
  const { data: providers, error: pErr } = await supabase
    .from('providers')
    .select('id, slug, city, state')
    .in('id', providerIds)
  if (pErr) throw pErr
  const byId = new Map((providers || []).map(p => [p.id, p]))

  // already-sent blocklist
  const { data: sent } = await supabase
    .from('outreach_log')
    .select('provider_id')
    .eq('email_num', BACKLINK_EMAIL_NUM)
  const sentSet = new Set((sent || []).map(s => s.provider_id))

  const seen = new Set<string>()
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return claims
    .filter(c => !sentSet.has(c.provider_id))
    .filter(c => emailRx.test(c.owner_email.trim()))
    .filter(c => {
      // dedupe by provider — one ask per business, even if claimed twice
      if (seen.has(c.provider_id)) return false
      seen.add(c.provider_id)
      return true
    })
    .map(c => {
      const p = byId.get(c.provider_id)
      if (!p) return null
      return {
        claim_id: c.id,
        provider_id: c.provider_id,
        owner_name: c.owner_name,
        owner_email: c.owner_email,
        business_name: c.business_name,
        slug: p.slug,
        city: p.city,
        state: p.state,
      } as Target
    })
    .filter((x): x is Target => x !== null)
}

async function logSent(providerId: string, to: string) {
  await supabase.from('outreach_log').insert({
    provider_id: providerId,
    email_num: BACKLINK_EMAIL_NUM,
    recipient: to,
    sent_at: new Date().toISOString(),
  })
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== SENDING ===')
  const targets = await fetchTargets()
  console.log(`Found ${targets.length} approved claims eligible for backlink ask`)

  for (const t of targets) {
    console.log(`${DRY_RUN ? '[dry]' : '[send]'} ${t.business_name} → ${t.owner_email}`)
    if (DRY_RUN) continue

    try {
      await resend.emails.send({
        from: FROM,
        to: t.owner_email,
        replyTo: REPLY_TO,
        subject: subject(t.business_name),
        html: html(t),
      })
      await logSent(t.provider_id, t.owner_email)
      await new Promise(r => setTimeout(r, 500))
    } catch (e: any) {
      console.error(`  FAILED: ${e.message}`)
    }
  }

  console.log(`\nDone. ${targets.length} ${DRY_RUN ? 'would be' : 'were'} contacted.`)
}

main().catch(e => { console.error(e); process.exit(1) })
