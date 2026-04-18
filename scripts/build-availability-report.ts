/**
 * Computes the "Pet Service Availability Index" data report.
 *
 * Methodology: total pet service providers per state ÷ state population × 100k
 *   = providers per 100k residents
 *
 * Output: src/data/pet-service-availability.ts (auto-generated TS module)
 *
 * Run: npx tsx --env-file=.env.local scripts/build-availability-report.ts
 */
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// 2024 Census estimates (US Census Bureau). Rounded to thousands for clean display.
// Source: https://www.census.gov/quickfacts/
const STATE_POPULATION: Record<string, { name: string; pop: number }> = {
  AL: { name: 'Alabama', pop: 5108468 },
  AK: { name: 'Alaska', pop: 733406 },
  AZ: { name: 'Arizona', pop: 7431344 },
  AR: { name: 'Arkansas', pop: 3067732 },
  CA: { name: 'California', pop: 38965193 },
  CO: { name: 'Colorado', pop: 5877610 },
  CT: { name: 'Connecticut', pop: 3617176 },
  DE: { name: 'Delaware', pop: 1031890 },
  DC: { name: 'District of Columbia', pop: 678972 },
  FL: { name: 'Florida', pop: 22610726 },
  GA: { name: 'Georgia', pop: 11029227 },
  HI: { name: 'Hawaii', pop: 1435138 },
  ID: { name: 'Idaho', pop: 1964726 },
  IL: { name: 'Illinois', pop: 12549689 },
  IN: { name: 'Indiana', pop: 6862199 },
  IA: { name: 'Iowa', pop: 3207004 },
  KS: { name: 'Kansas', pop: 2940546 },
  KY: { name: 'Kentucky', pop: 4526154 },
  LA: { name: 'Louisiana', pop: 4573749 },
  ME: { name: 'Maine', pop: 1395722 },
  MD: { name: 'Maryland', pop: 6180253 },
  MA: { name: 'Massachusetts', pop: 7001399 },
  MI: { name: 'Michigan', pop: 10037261 },
  MN: { name: 'Minnesota', pop: 5737915 },
  MS: { name: 'Mississippi', pop: 2939690 },
  MO: { name: 'Missouri', pop: 6196156 },
  MT: { name: 'Montana', pop: 1132812 },
  NE: { name: 'Nebraska', pop: 1978379 },
  NV: { name: 'Nevada', pop: 3194176 },
  NH: { name: 'New Hampshire', pop: 1402054 },
  NJ: { name: 'New Jersey', pop: 9290841 },
  NM: { name: 'New Mexico', pop: 2114371 },
  NY: { name: 'New York', pop: 19571216 },
  NC: { name: 'North Carolina', pop: 10835491 },
  ND: { name: 'North Dakota', pop: 783926 },
  OH: { name: 'Ohio', pop: 11785935 },
  OK: { name: 'Oklahoma', pop: 4053824 },
  OR: { name: 'Oregon', pop: 4233358 },
  PA: { name: 'Pennsylvania', pop: 12961683 },
  RI: { name: 'Rhode Island', pop: 1095962 },
  SC: { name: 'South Carolina', pop: 5373555 },
  SD: { name: 'South Dakota', pop: 919318 },
  TN: { name: 'Tennessee', pop: 7126489 },
  TX: { name: 'Texas', pop: 30503301 },
  UT: { name: 'Utah', pop: 3417734 },
  VT: { name: 'Vermont', pop: 647464 },
  VA: { name: 'Virginia', pop: 8715698 },
  WA: { name: 'Washington', pop: 7812880 },
  WV: { name: 'West Virginia', pop: 1770071 },
  WI: { name: 'Wisconsin', pop: 5910955 },
  WY: { name: 'Wyoming', pop: 584057 },
}

async function main() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })

  // Fetch all providers in pages
  let all: Array<{ state: string; category: string }> = []
  let off = 0
  while (true) {
    const { data } = await sb.from('providers').select('state, category').range(off, off + 999)
    if (!data?.length) break
    all = all.concat(data as any)
    if (data.length < 1000) break
    off += 1000
  }

  // Count by state + by state-category
  const byState: Record<string, number> = {}
  const byStateCategory: Record<string, Record<string, number>> = {}

  for (const p of all) {
    byState[p.state] = (byState[p.state] || 0) + 1
    if (!byStateCategory[p.state]) byStateCategory[p.state] = {}
    byStateCategory[p.state][p.category] = (byStateCategory[p.state][p.category] || 0) + 1
  }

  // Compute per-100k ratio for each state we have population for
  const rankings: Array<{
    state: string
    stateName: string
    totalProviders: number
    population: number
    per100k: number
    vet: number
    emergency: number
    groomers: number
  }> = []

  for (const [state, count] of Object.entries(byState)) {
    const meta = STATE_POPULATION[state]
    if (!meta) continue // skip territories or unknowns
    const cats = byStateCategory[state] || {}
    rankings.push({
      state,
      stateName: meta.name,
      totalProviders: count,
      population: meta.pop,
      per100k: +(count / meta.pop * 100000).toFixed(2),
      vet: cats.veterinarians || 0,
      emergency: cats.emergency_vets || 0,
      groomers: cats.groomers || 0,
    })
  }

  rankings.sort((a, b) => b.per100k - a.per100k)

  const mostSaturated = rankings.slice(0, 10)
  const leastCovered = rankings.slice(-10).reverse()

  const nationalTotal = rankings.reduce((s, r) => s + r.totalProviders, 0)
  const nationalPop = rankings.reduce((s, r) => s + r.population, 0)
  const nationalAvg = +(nationalTotal / nationalPop * 100000).toFixed(2)

  const report = {
    generatedAt: new Date().toISOString().slice(0, 10),
    totals: {
      totalProviders: nationalTotal,
      statesAnalyzed: rankings.length,
      nationalAvgPer100k: nationalAvg,
    },
    mostSaturated,
    leastCovered,
    allStates: rankings,
  }

  const out = `// AUTO-GENERATED by scripts/build-availability-report.ts — do not edit
export interface StateRanking {
  state: string
  stateName: string
  totalProviders: number
  population: number
  per100k: number
  vet: number
  emergency: number
  groomers: number
}

export const availabilityReport = ${JSON.stringify(report, null, 2)} as const
`
  writeFileSync(resolve(process.cwd(), 'src/data/pet-service-availability.ts'), out, 'utf-8')
  console.log(`✓ Wrote src/data/pet-service-availability.ts`)
  console.log(`  ${nationalTotal} providers across ${rankings.length} states`)
  console.log(`  National avg: ${nationalAvg} per 100k residents`)
  console.log(`  Most saturated: ${mostSaturated[0].stateName} (${mostSaturated[0].per100k}/100k)`)
  console.log(`  Least covered: ${leastCovered[0].stateName} (${leastCovered[0].per100k}/100k)`)
}

main().catch(e => { console.error(e); process.exit(1) })
