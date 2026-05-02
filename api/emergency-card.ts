/**
 * Emergency Card lead magnet endpoint.
 *
 * POST /api/emergency-card
 * Body: { email, state, city? }
 *
 * - Validates + saves email to newsletter_signups (source='emergency_card')
 * - Finds the top 3 emergency vets in that state (prefers same city first)
 * - Emails the card to the signup via Resend
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)
const resend = new Resend(process.env.RESEND_API_KEY!)

const SITE = 'https://petosdirectory.com'
const FROM = 'PetOS Directory <malak@petosdirectory.com>'
const REPLY_TO = 'info@petosdirectory.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, state, city } = req.body || {}

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  if (!state || typeof state !== 'string' || state.length < 2 || state.length > 30) {
    return res.status(400).json({ error: 'State required' })
  }

  const cleanEmail = email.toLowerCase().trim()
  const cleanState = state.trim().toUpperCase().slice(0, 2) // normalize to 2-letter code
  const cleanCity = city && typeof city === 'string' ? city.trim() : null

  // Find emergency vets: prefer same city, fallback to same state
  let vets: Array<{ business_name: string; address: string; city: string; state: string; phone: string | null; rating: number | null }> = []
  if (cleanCity) {
    const { data } = await supabase
      .from('providers')
      .select('business_name, address, city, state, phone, rating')
      .eq('state', cleanState)
      .ilike('city', cleanCity)
      .eq('category', 'emergency_vets')
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(3)
    vets = data || []
  }
  if (vets.length < 3) {
    const need = 3 - vets.length
    const { data } = await supabase
      .from('providers')
      .select('business_name, address, city, state, phone, rating')
      .eq('state', cleanState)
      .eq('category', 'emergency_vets')
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(10)
    const existing = new Set(vets.map(v => v.business_name))
    for (const v of data || []) {
      if (vets.length >= 3) break
      if (!existing.has(v.business_name)) vets.push(v)
    }
  }

  // Save signup (upsert on email so re-submits don't error)
  const { error: saveErr } = await supabase
    .from('newsletter_signups')
    .upsert(
      {
        email: cleanEmail,
        city: cleanCity || null,
        state: cleanState,
        category: 'emergency_vets',
        source: 'emergency_card',
        referrer_slug: null,
        status: 'active',
      },
      { onConflict: 'email' }
    )
  if (saveErr) {
    console.error('Emergency card signup error:', saveErr.message)
    return res.status(500).json({ error: 'Failed to save signup' })
  }

  // Build email HTML
  const vetRows = vets.length === 0
    ? `<p style="font-size:14px;color:#6b7280;">We don't have emergency vet listings in ${cleanState} yet. Search <a href="${SITE}/search" style="color:#2563eb;">petosdirectory.com/search</a> to find the nearest option, or call ASPCA Poison Control below.</p>`
    : vets.map((v, i) => `
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:10px;">
        <div style="font-size:12px;color:#991b1b;font-weight:700;letter-spacing:1px;">${i + 1}. NEAREST EMERGENCY VET</div>
        <div style="font-size:16px;font-weight:700;color:#111;margin-top:6px;">${escape(v.business_name)}</div>
        <div style="font-size:14px;color:#374151;margin-top:4px;">${escape(v.address || '')}, ${escape(v.city)}, ${escape(v.state)}</div>
        ${v.phone ? `<div style="font-size:14px;color:#111;margin-top:6px;"><strong>📞 ${escape(v.phone)}</strong></div>` : ''}
        ${v.rating ? `<div style="font-size:13px;color:#6b7280;margin-top:4px;">⭐ ${v.rating.toFixed(1)}</div>` : ''}
      </div>
    `).join('')

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#374151;">
  <div style="background:#fee2e2;border:2px solid #dc2626;border-radius:12px;padding:16px;margin-bottom:20px;">
    <div style="font-size:11px;font-weight:700;color:#991b1b;letter-spacing:1.5px;">🚨 YOUR PET EMERGENCY CARD — ${escape(cleanState)}</div>
    <div style="font-size:13px;color:#7f1d1d;margin-top:6px;">Save this email. Print it. Keep it in your wallet or on the fridge.</div>
  </div>

  <h2 style="font-size:18px;color:#111;margin-bottom:12px;">Emergency vets nearest you</h2>
  ${vetRows}

  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-top:20px;">
    <div style="font-size:12px;font-weight:700;color:#78350f;letter-spacing:1px;">🧪 POISON CONTROL (24/7)</div>
    <div style="font-size:16px;font-weight:700;color:#111;margin-top:6px;">ASPCA: <a href="tel:18884264435" style="color:#111;">(888) 426-4435</a></div>
    <div style="font-size:13px;color:#78350f;margin-top:4px;">(A $95 consultation fee applies. Have your credit card ready.)</div>
  </div>

  <h3 style="font-size:15px;color:#111;margin-top:24px;">What to do in a pet emergency</h3>
  <ul style="font-size:14px;line-height:1.6;padding-left:20px;color:#374151;">
    <li><strong>Call ahead</strong> if possible — the vet can prep.</li>
    <li><strong>Bring a sample</strong> of what your pet ate or the packaging if poisoning is suspected.</li>
    <li><strong>Stay calm, stay safe</strong> — an injured pet may bite. Use a towel to restrain if needed.</li>
    <li><strong>Have your vet's info ready</strong> — your pet's age, weight, and medications.</li>
    <li><strong>Don't wait</strong> — "I'll see if it gets better" loses precious minutes.</li>
  </ul>

  <p style="font-size:13px;color:#9ca3af;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">
    Full directory: <a href="${SITE}" style="color:#2563eb;">petosdirectory.com</a><br/>
    Full report on emergency vet access: <a href="${SITE}/reports/emergency-vet-access-2026" style="color:#2563eb;">petosdirectory.com/reports/emergency-vet-access-2026</a><br/><br/>
    <a href="${SITE}/unsubscribe?email=${encodeURIComponent(cleanEmail)}" style="color:#9ca3af;font-size:12px;">Unsubscribe</a>
  </p>
</div>
`

  // Send email (non-blocking in terms of response speed but we await for error reporting)
  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: cleanEmail,
      subject: `🚨 Your Pet Emergency Card — ${cleanState}`,
      html,
      tags: [
        { name: 'campaign', value: 'emergency_card' },
        { name: 'state', value: cleanState.toLowerCase() },
      ],
    })
  } catch (err: any) {
    console.error('Emergency card send error:', err.message)
    // Don't fail the request — signup was saved; we'll retry send later
  }

  return res.status(200).json({ ok: true, vetsFound: vets.length })
}

function escape(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
