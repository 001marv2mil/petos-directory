import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, city, state, category, source, referrer_slug } = req.body || {}

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  // Upsert: add if new, update city/state if they re-signup from different listing
  const { error } = await supabase
    .from('newsletter_signups')
    .upsert(
      {
        email: email.toLowerCase().trim(),
        city: city || null,
        state: state || null,
        category: category || null,
        source: source || 'provider_page',
        referrer_slug: referrer_slug || null,
        status: 'active',
      },
      { onConflict: 'email' }
    )

  if (error) {
    console.error('Newsletter signup error:', error.message)
    return res.status(500).json({ error: 'Failed to save signup' })
  }

  return res.status(200).json({ ok: true })
}
