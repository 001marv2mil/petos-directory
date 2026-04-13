import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

const VALID_EVENTS = ['view', 'click_phone', 'click_website', 'click_directions']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for frontend calls
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { provider_id, event_type } = req.body || {}

  if (!provider_id || typeof provider_id !== 'string') {
    return res.status(400).json({ error: 'Missing provider_id' })
  }
  if (!event_type || !VALID_EVENTS.includes(event_type)) {
    return res.status(400).json({ error: 'Invalid event_type' })
  }

  const { error } = await supabase.from('provider_analytics').insert({
    provider_id,
    event_type,
  })

  if (error) {
    console.error('Track error:', error.message)
    return res.status(500).json({ error: 'Failed to log event' })
  }

  return res.status(200).json({ ok: true })
}
