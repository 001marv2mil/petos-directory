/**
 * Admin dashboard stats — aggregates everything we track into one response.
 * Replaces having to run scripts/status.ts manually.
 *
 * GET /api/admin/stats  (requires admin bearer token)
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

const ADMIN_EMAILS = ['petosdirectory@gmail.com', '001marv2mil@gmail.com', 'malak@petosdirectory.com']

async function count(table: string, filter?: (q: any) => any) {
  const base = supabase.from(table).select('*', { count: 'exact', head: true })
  const q = filter ? filter(base) : base
  const { count, error } = await q
  if (error) return 0
  return count ?? 0
}

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

  const now = new Date()
  const iso24h = new Date(now.getTime() - 24 * 3600 * 1000).toISOString()
  const iso7d = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString()
  const iso30d = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString()

  // Fire all queries in parallel for speed
  const [
    totalProviders,
    claimsPending, claimsApproved, claimsRejected, claimsTotal,
    outreachTotal, outreach24h, outreach7d, outreach30d,
    email1, email2, email3, email4, email5, email6,
    trafficTotal, traffic24h, traffic7d, traffic30d,
    featuredActive, featuredTotal,
    newsletterTotal,
  ] = await Promise.all([
    count('providers'),
    count('claim_requests', q => q.eq('status', 'pending')),
    count('claim_requests', q => q.eq('status', 'approved')),
    count('claim_requests', q => q.eq('status', 'rejected')),
    count('claim_requests'),
    count('outreach_log'),
    count('outreach_log', q => q.gte('sent_at', iso24h)),
    count('outreach_log', q => q.gte('sent_at', iso7d)),
    count('outreach_log', q => q.gte('sent_at', iso30d)),
    count('outreach_log', q => q.eq('email_num', 1)),
    count('outreach_log', q => q.eq('email_num', 2)),
    count('outreach_log', q => q.eq('email_num', 3)),
    count('outreach_log', q => q.eq('email_num', 4)),
    count('outreach_log', q => q.eq('email_num', 5)),
    count('outreach_log', q => q.eq('email_num', 6)),
    count('provider_analytics'),
    count('provider_analytics', q => q.gte('created_at', iso24h)),
    count('provider_analytics', q => q.gte('created_at', iso7d)),
    count('provider_analytics', q => q.gte('created_at', iso30d)),
    count('featured_payments', q => q.eq('status', 'active')),
    count('featured_payments'),
    count('newsletter_signups'),
  ])

  return res.status(200).json({
    generatedAt: now.toISOString(),
    catalog: {
      totalProviders,
      featuredActive,
      featuredTotal,
    },
    claims: {
      total: claimsTotal,
      pending: claimsPending,
      approved: claimsApproved,
      rejected: claimsRejected,
    },
    outreach: {
      total: outreachTotal,
      last24h: outreach24h,
      last7d: outreach7d,
      last30d: outreach30d,
      byEmailNum: { 1: email1, 2: email2, 3: email3, 4: email4, 5: email5, 6: email6 },
      dollarPitchTotal: email4 + email5 + email6, // $99/mo-focused emails
    },
    traffic: {
      total: trafficTotal,
      last24h: traffic24h,
      last7d: traffic7d,
      last30d: traffic30d,
    },
    revenue: {
      activeSubs: featuredActive,
      lifetimeSubs: featuredTotal,
      mrr: featuredActive * 99,
    },
    newsletter: {
      signups: newsletterTotal,
    },
  })
}
