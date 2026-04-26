/**
 * Deduplicate seed providers created by running the seed script twice.
 *
 * When the seed ran a second time after adding Boulder/Brandon to CITY_CENTERS,
 * the SlugRegistry started fresh and re-assigned -2/-3 suffixed slugs to records
 * that already existed under canonical (un-suffixed) slugs, producing doubles.
 *
 * Strategy:
 *   1. Fetch all source='seed' providers
 *   2. Group by (business_name, city, state, category) — case-insensitive
 *   3. In each group with >1 member, keep the shortest slug (canonical)
 *   4. Delete the rest
 *
 * Run:      npx tsx --env-file=.env.local scripts/dedupe-providers.ts
 * Dry run:  DRY_RUN=1 npx tsx --env-file=.env.local scripts/dedupe-providers.ts
 */

import { supabaseAdmin } from './lib/supabase-admin.js'

const DRY_RUN = process.env.DRY_RUN === '1'
const PAGE_SIZE = 1000

interface Provider {
  id: string
  slug: string
  business_name: string
  city: string
  state: string
  category: string
}

async function fetchAllSeedProviders(): Promise<Provider[]> {
  const all: Provider[] = []
  let offset = 0

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('providers')
      .select('id, slug, business_name, city, state, category')
      .eq('source', 'seed')
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) { console.error('Fetch error:', error.message); process.exit(1) }
    if (!data || data.length === 0) break

    all.push(...(data as Provider[]))
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
    process.stdout.write(`  Fetched ${all.length}...\r`)
  }

  return all
}

async function deleteInBatches(ids: string[], batchSize = 500): Promise<number> {
  let deleted = 0
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    const { error } = await supabaseAdmin
      .from('providers')
      .delete()
      .in('id', batch)

    if (error) { console.error(`Delete error at batch ${i}:`, error.message); process.exit(1) }
    deleted += batch.length
    process.stdout.write(`  Deleted ${deleted}/${ids.length}...\r`)
  }
  return deleted
}

async function main() {
  console.log(`\n🔍 PetOS dedup — ${DRY_RUN ? 'DRY RUN (no deletes)' : 'LIVE MODE'}\n`)

  // ── 1. Fetch ──────────────────────────────────────────────────────────────
  console.log('Fetching all seed providers...')
  const providers = await fetchAllSeedProviders()
  console.log(`\nTotal seed providers fetched: ${providers.length}`)

  // ── 2. Group by (business_name, city, state, category) ───────────────────
  const groups = new Map<string, Provider[]>()
  for (const p of providers) {
    const key = [
      p.business_name.toLowerCase().trim(),
      p.city.toLowerCase().trim(),
      p.state.toLowerCase().trim(),
      p.category.toLowerCase().trim(),
    ].join('||')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(p)
  }

  const dupGroups = [...groups.values()].filter(g => g.length > 1)
  console.log(`Duplicate groups (same name+city+state+category): ${dupGroups.length}`)

  // ── 3. Pick what to delete ────────────────────────────────────────────────
  const toDelete: string[] = []
  const examples: string[] = []

  for (const group of dupGroups) {
    // Shortest slug = canonical (no -2/-3 suffix); alpha tiebreak
    group.sort((a, b) => a.slug.length - b.slug.length || a.slug.localeCompare(b.slug))
    const [keep, ...discard] = group
    for (const p of discard) toDelete.push(p.id)

    if (examples.length < 5) {
      examples.push(`  keep: ${keep.slug}\n  drop: ${discard.map(d => d.slug).join(', ')}`)
    }
  }

  console.log(`\nRecords to delete: ${toDelete.length}`)
  console.log(`Records to keep:   ${providers.length - toDelete.length}`)

  if (examples.length > 0) {
    console.log('\nSample duplicate groups:')
    examples.forEach(e => console.log(e))
  }

  if (toDelete.length === 0) {
    console.log('\n✅ No duplicates found — database is clean.')
    return
  }

  // ── 4. Delete ─────────────────────────────────────────────────────────────
  if (DRY_RUN) {
    console.log('\n⚠️  DRY_RUN=1 — skipping deletes. Re-run without DRY_RUN=1 to apply.')
    return
  }

  console.log('\nDeleting duplicates...')
  const deleted = await deleteInBatches(toDelete)
  console.log(`\n✅ Done. Deleted ${deleted} duplicate seed providers.`)

  // ── 5. Final count ────────────────────────────────────────────────────────
  const { count, error } = await supabaseAdmin
    .from('providers')
    .select('id', { count: 'exact', head: true })

  if (error) console.error('Count check error:', error.message)
  else console.log(`📊 Total providers in database after cleanup: ${count}`)
}

main().catch(e => { console.error(e); process.exit(1) })
