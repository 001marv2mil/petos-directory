import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = authHeader.slice(7)
  const { data: userData, error: authError } = await supabase.auth.getUser(token)
  if (authError || !userData.user) return res.status(401).json({ error: 'Invalid token' })

  const userEmail = userData.user.email?.toLowerCase().trim() ?? ''
  if (!userEmail) return res.status(401).json({ error: 'No email on user' })

  const { provider_id, description, phone, website, special_offer, hero_image } = req.body || {}
  if (!provider_id) return res.status(400).json({ error: 'Missing provider_id' })

  // Verify the logged-in user OWNS this provider (claimed_by_email match)
  const { data: provider, error: getErr } = await supabase
    .from('providers')
    .select('id, claimed_by_email')
    .eq('id', provider_id)
    .single()

  if (getErr || !provider) return res.status(404).json({ error: 'Provider not found' })
  if (provider.claimed_by_email?.toLowerCase().trim() !== userEmail) {
    return res.status(403).json({ error: 'You do not own this listing' })
  }

  // Special Offer requires active Featured payment
  let isFeatured = false
  if (special_offer !== undefined) {
    const { data: payment } = await supabase
      .from('featured_payments')
      .select('id')
      .eq('provider_id', provider_id)
      .eq('status', 'active')
      .limit(1)
      .single()
    isFeatured = !!payment
  }

  // Whitelist fields — business cannot change anything else (business_name, city, category, etc. locked)
  const updates: Record<string, any> = {}
  if (description !== undefined) updates.description = description?.slice(0, 2000) || null
  if (phone !== undefined) updates.phone = phone?.slice(0, 30) || null
  if (website !== undefined) updates.website = website?.slice(0, 500) || null
  if (hero_image !== undefined) updates.hero_image = hero_image?.slice(0, 1000) || null
  // Only allow special_offer if business has paid for Featured
  if (special_offer !== undefined && isFeatured) {
    updates.special_offer = special_offer?.slice(0, 120) || null
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update' })
  }

  const { error: updateErr } = await supabase.from('providers').update(updates).eq('id', provider_id)
  if (updateErr) return res.status(500).json({ error: updateErr.message })

  return res.status(200).json({ ok: true })
}
