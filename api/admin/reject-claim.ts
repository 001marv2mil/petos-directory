import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

const ADMIN_EMAILS = ['petosdirectory@gmail.com', '001marv2mil@gmail.com', 'marv2mil@gmail.com', 'malak@petosdirectory.com', 'info@petoshealth.com']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = authHeader.slice(7)
  const { data: userData, error: authError } = await supabase.auth.getUser(token)
  if (authError || !userData.user) return res.status(401).json({ error: 'Invalid token' })
  if (!ADMIN_EMAILS.includes(userData.user.email?.toLowerCase() ?? '')) {
    return res.status(403).json({ error: 'Not an admin' })
  }

  const { claim_id } = req.body || {}
  if (!claim_id) return res.status(400).json({ error: 'Missing claim_id' })

  const { error } = await supabase
    .from('claim_requests')
    .update({ status: 'rejected', approved_by: userData.user.email ?? null })
    .eq('id', claim_id)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
