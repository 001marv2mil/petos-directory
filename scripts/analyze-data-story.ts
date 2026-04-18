/**
 * One-off: pull candidate data angles for the digital PR piece.
 * Run: npx tsx --env-file=.env.local scripts/analyze-data-story.ts
 */
import { createClient } from '@supabase/supabase-js'

async function main() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })

  // fetch all providers in pages
  let all: any[] = []
  let off = 0
  while (true) {
    const { data } = await sb.from('providers').select('state, city, category, rating, review_count, emergency').range(off, off + 999)
    if (!data?.length) break
    all = all.concat(data)
    if (data.length < 1000) break
    off += 1000
  }
  console.log(`Total providers: ${all.length}\n`)

  // --- Emergency vet density per metro ---
  console.log('=== EMERGENCY VET DENSITY — cities with fewest options ===')
  const emByCity: Record<string, number> = {}
  for (const p of all) {
    if (p.category === 'emergency_vets') {
      const k = `${p.city}, ${p.state}`
      emByCity[k] = (emByCity[k] || 0) + 1
    }
  }
  const sorted = Object.entries(emByCity).sort((a, b) => a[1] - b[1])
  console.log('  Cities w/ only 1 emergency vet:', sorted.filter(([, n]) => n === 1).length)
  console.log('  Cities w/ 2 emergency vets:', sorted.filter(([, n]) => n === 2).length)
  console.log('  Cities w/ 10+:', sorted.filter(([, n]) => n >= 10).length)
  console.log('  Lowest:', sorted.slice(0, 5))
  console.log('  Highest:', sorted.slice(-5).reverse())

  // --- Cities total coverage ---
  console.log('\n=== TOP / BOTTOM BY TOTAL PET SERVICES ===')
  const totByCity: Record<string, number> = {}
  for (const p of all) {
    const k = `${p.city}, ${p.state}`
    totByCity[k] = (totByCity[k] || 0) + 1
  }
  const totSorted = Object.entries(totByCity).sort((a, b) => b[1] - a[1])
  console.log('  Top 10 cities:', totSorted.slice(0, 10))
  console.log('  Cities with <5 total services:', totSorted.filter(([, n]) => n < 5).length)

  // --- Rating averages by state ---
  console.log('\n=== AVG RATING BY STATE (min 50 reviewed businesses) ===')
  const stateRatings: Record<string, { sum: number; count: number }> = {}
  for (const p of all) {
    if (p.rating && p.review_count && p.review_count >= 5) {
      const s = p.state
      if (!stateRatings[s]) stateRatings[s] = { sum: 0, count: 0 }
      stateRatings[s].sum += p.rating
      stateRatings[s].count += 1
    }
  }
  const stateAvgs = Object.entries(stateRatings)
    .filter(([, v]) => v.count >= 50)
    .map(([s, v]) => ({ state: s, avg: v.sum / v.count, n: v.count }))
    .sort((a, b) => b.avg - a.avg)
  console.log('  Top 5 states by avg rating:', stateAvgs.slice(0, 5))
  console.log('  Bottom 5:', stateAvgs.slice(-5))

  // --- Most-reviewed (potential "most loved" list) ---
  console.log('\n=== MOST REVIEWED BUSINESSES (candidate "Americas most loved" list) ===')
  const top = [...all]
    .filter(p => p.review_count)
    .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
    .slice(0, 10)
  for (const p of top) {
    console.log(`  ${p.review_count} reviews, ${p.rating}★ — ${p.category}`)
  }

  // --- Category breakdown ---
  console.log('\n=== CATEGORY BREAKDOWN ===')
  const byCat: Record<string, number> = {}
  for (const p of all) byCat[p.category] = (byCat[p.category] || 0) + 1
  for (const [c, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${c}: ${n}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
