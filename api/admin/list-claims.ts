import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

const ADMIN_EMAILS = ['petosdirectory@gmail.com', '001marv2mil@gmail.com', 'malak@petosdirectory.com']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // Verify admin
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = authHeader.slice(7)
  const { data: userData, error: authError } = await supabase.auth.getUser(token)
  if (authError || !userData.user) return res.status(401).json({ error: 'Invalid token' })
  if (!ADMIN_EMAILS.includes(userData.user.email?.toLowerCase() ?? '')) {
    return res.status(403).json({ error: 'Not an admin' })
  }

  const filter = (req.query.filter as string) || 'pending'

  let query = supabase
    .from('claim_requests')
    .select('*, providers(slug, city, state, category)')
    .order('created_at', { ascending: false })

  if (filter !== 'all') {
    query = query.eq('status', filter)
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json({ claims: data || [] })
}
