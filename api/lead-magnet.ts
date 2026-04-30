/**
 * Category-aware lead magnet endpoint.
 *
 * POST /api/lead-magnet
 * Body: { email, category, providerSlug, providerName, city, state }
 *
 * - Picks the magnet matched to the provider's category (vet prep sheet,
 *   emergency card, grooming calendar, etc.)
 * - Saves email to newsletter_signups (source='lead_magnet:<category>')
 * - Sends the magnet content to the user via Resend
 * - Bridges to PetOS Health at the bottom of every email
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { getMagnetForCategory, type Magnet } from '../src/data/lead-magnets'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)
const resend = new Resend(process.env.RESEND_API_KEY!)

const SITE = 'https://petosdirectory.com'
const HEALTH = 'https://petoshealth.com'
const FROM = 'PetOS Directory <malak@petosdirectory.com>'
const REPLY_TO = 'support@petoshealth.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, category, providerSlug, providerName, city, state } = req.body || {}

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Category required' })
  }

  const cleanEmail = email.toLowerCase().trim()
  const cleanState = typeof state === 'string' ? state.trim().toUpperCase().slice(0, 2) : null
  const cleanCity = typeof city === 'string' ? city.trim() : null
  const cleanSlug = typeof providerSlug === 'string' ? providerSlug.slice(0, 200) : null
  const cleanProviderName = typeof providerName === 'string' ? providerName.slice(0, 200) : null

  const magnet = getMagnetForCategory(category)

  // Save signup
  const { error: saveErr } = await supabase
    .from('newsletter_signups')
    .upsert(
      {
        email: cleanEmail,
        city: cleanCity,
        state: cleanState,
        category,
        source: `lead_magnet:${category}`,
        referrer_slug: cleanSlug,
        status: 'active',
      },
      { onConflict: 'email' }
    )
  if (saveErr) {
    console.error('Lead magnet signup error:', saveErr.message)
    return res.status(500).json({ error: 'Failed to save signup' })
  }

  // Build email
  const html = renderEmail(magnet, { providerName: cleanProviderName, city: cleanCity, state: cleanState, email: cleanEmail })

  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: cleanEmail,
      subject: magnet.emailSubject,
      html,
      tags: [
        { name: 'campaign', value: 'lead_magnet' },
        { name: 'magnet_category', value: category },
        ...(cleanState ? [{ name: 'state', value: cleanState.toLowerCase() }] : []),
      ],
    })
  } catch (err: any) {
    console.error('Lead magnet send error:', err.message)
    // Signup was saved; don't fail the response on email send issues
  }

  return res.status(200).json({ ok: true, magnetTitle: magnet.title })
}

interface EmailContext {
  providerName: string | null
  city: string | null
  state: string | null
  email: string
}

function renderEmail(magnet: Magnet, ctx: EmailContext): string {
  const sectionsHtml = magnet.sections.map(s => `
    <div style="margin-top:20px;">
      <h3 style="font-size:15px;color:#111;margin:0 0 8px 0;font-weight:700;">${escape(s.heading)}</h3>
      <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.65;color:#374151;">
        ${s.bullets.map(b => `<li style="margin-bottom:6px;">${escape(b)}</li>`).join('')}
      </ul>
    </div>
  `).join('')

  const fromContext = ctx.providerName
    ? `<p style="font-size:12px;color:#9ca3af;margin:6px 0 0 0;">You requested this on the listing for <strong>${escape(ctx.providerName)}</strong>${ctx.city ? ` in ${escape(ctx.city)}` : ''}${ctx.state ? `, ${escape(ctx.state)}` : ''}.</p>`
    : ''

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:620px;margin:0 auto;padding:32px 16px;color:#374151;">

  <div style="background:linear-gradient(135deg,#fef3c7,#fed7aa);border-radius:14px;padding:24px;margin-bottom:24px;">
    <div style="font-size:11px;color:#92400e;font-weight:700;letter-spacing:1.5px;">PETOS DIRECTORY · FREE FOR PET OWNERS</div>
    <h1 style="font-size:26px;color:#111;margin:8px 0 0 0;font-weight:800;line-height:1.2;">${escape(magnet.emailHeadline)}</h1>
    ${fromContext}
  </div>

  <p style="font-size:15px;line-height:1.65;color:#374151;margin:0 0 8px 0;">${escape(magnet.emailIntro)}</p>

  ${sectionsHtml}

  <div style="margin-top:32px;padding:20px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
    <div style="font-size:11px;color:#1d4ed8;font-weight:700;letter-spacing:1.5px;">WANT THIS AUTOMATED?</div>
    <h3 style="font-size:18px;color:#111;margin:6px 0 8px 0;font-weight:700;">PetOS Health does this — for every visit, every pet.</h3>
    <p style="font-size:14px;line-height:1.6;color:#1e3a8a;margin:0 0 12px 0;">
      Track vaccines, store records, schedule vet visits, get AI symptom checks, and never lose a piece of your pet's health history again. All in one app.
    </p>
    <a href="${HEALTH}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:8px;">Try PetOS Health free →</a>
  </div>

  <p style="font-size:13px;color:#9ca3af;margin-top:28px;border-top:1px solid #e5e7eb;padding-top:16px;line-height:1.6;">
    Browse the full directory: <a href="${SITE}" style="color:#2563eb;">petosdirectory.com</a><br/>
    Reply to this email if you have questions — a real person reads every reply.<br/><br/>
    <a href="${SITE}/unsubscribe?email=${encodeURIComponent(ctx.email)}" style="color:#9ca3af;font-size:12px;">Unsubscribe</a>
  </p>
</div>
`
}

function escape(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
