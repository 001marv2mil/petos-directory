/**
 * One-off status script: visits, email outreach, claims, payments.
 * Run: npx tsx --env-file=../../../.env.local scripts/status.ts
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
const sb = createClient(url, key, { auth: { persistSession: false } })

const now = new Date()
const iso24h = new Date(now.getTime() - 24 * 3600 * 1000).toISOString()
const iso7d = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString()
const iso30d = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString()

async function count(table: string, filters: (q: any) => any = q => q) {
  const q = filters(sb.from(table).select('*', { count: 'exact', head: true }))
  const { count, error } = await q
  if (error) return `ERR: ${error.message}`
  return count ?? 0
}

async function groupCount(table: string, col: string, since?: string) {
  let q = sb.from(table).select(col)
  if (since) q = q.gte('created_at', since)
  const { data, error } = await q
  if (error) return { error: error.message }
  const out: Record<string, number> = {}
  for (const row of data || []) {
    const k = (row as any)[col] ?? 'null'
    out[k] = (out[k] || 0) + 1
  }
  return out
}

;(async () => {
  console.log('=== PetOS Directory — Status ===')
  console.log('Time:', now.toISOString())
  console.log('')

  // Providers
  console.log('--- Providers ---')
  console.log('Total providers:', await count('providers'))
  console.log('Featured providers:', await count('providers', q => q.eq('featured', true)))
  console.log('')

  // Traffic / analytics
  console.log('--- Traffic (provider_analytics) ---')
  console.log('Total events all-time:', await count('provider_analytics'))
  console.log('Events last 24h:', await count('provider_analytics', q => q.gte('created_at', iso24h)))
  console.log('Events last 7d:', await count('provider_analytics', q => q.gte('created_at', iso7d)))
  console.log('Events last 30d:', await count('provider_analytics', q => q.gte('created_at', iso30d)))
  console.log('')
  console.log('Event breakdown (last 30d):', await groupCount('provider_analytics', 'event_type', iso30d))
  console.log('Event breakdown (all-time):', await groupCount('provider_analytics', 'event_type'))
  console.log('')

  // Outreach
  console.log('--- Outreach emails ---')
  console.log('Total outreach rows:', await count('outreach_log'))
  console.log('Outreach last 24h:', await count('outreach_log', q => q.gte('sent_at', iso24h)))
  console.log('Outreach last 7d:', await count('outreach_log', q => q.gte('sent_at', iso7d)))
  console.log('Outreach last 30d:', await count('outreach_log', q => q.gte('sent_at', iso30d)))
  console.log('Breakdown by email_num (all-time):', await groupCount('outreach_log', 'email_num'))
  console.log('')

  // Claims
  console.log('--- Claim requests ---')
  console.log('Total claims:', await count('claim_requests'))
  console.log('Claims by status:', await groupCount('claim_requests', 'status'))
  console.log('')

  // Payments
  console.log('--- Featured payments ---')
  console.log('Total payments:', await count('featured_payments'))
  console.log('Payments by status:', await groupCount('featured_payments', 'status'))

  // Newsletter
  console.log('')
  console.log('--- Newsletter ---')
  console.log('Total signups:', await count('newsletter_signups'))

  // Top providers by views last 30d
  console.log('')
  console.log('--- Top providers by events (last 30d) ---')
  const { data: topData, error: topErr } = await sb
    .from('provider_analytics')
    .select('provider_id')
    .gte('created_at', iso30d)
  if (topErr) { console.log('ERR:', topErr.message) }
  else {
    const counts: Record<string, number> = {}
    for (const r of topData || []) counts[r.provider_id] = (counts[r.provider_id] || 0) + 1
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10)
    if (top.length) {
      const ids = top.map(t => t[0])
      const { data: provs } = await sb.from('providers').select('id,name,city').in('id', ids)
      const nameMap = new Map((provs || []).map(p => [p.id, `${p.name} (${p.city})`]))
      top.forEach(([id, n]) => console.log(`  ${n}\t${nameMap.get(id) || id}`))
    } else {
      console.log('  (no events)')
    }
  }
})().catch(e => { console.error(e); process.exit(1) })
