/**
 * Generates per-state journalist pitches for the Pet Service Availability report.
 *
 * Unlike the emergency vet report (8 cities), this has 50 local angles — one
 * per state. Too many to pitch all at once; output focuses on the 10 most
 * underserved states (strongest local hook).
 *
 * Writes: outreach/availability-pitches.md
 *
 * Run: npx tsx --env-file=.env.local scripts/availability-pitches.ts
 */
import { availabilityReport as R } from '../src/data/pet-service-availability'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const REPORT_URL = 'https://petosdirectory.com/reports/pet-service-availability-2026'
const FROM_NAME = 'Malak Ghonimy'
const FROM_TITLE = 'Founder, PetOS Directory'
const FROM_EMAIL = 'petosdirectory@gmail.com'

function subject(stateName: string) {
  return `${stateName} data: pet service access below the national average (new research)`
}

function body(s: {
  stateName: string
  totalProviders: number
  population: number
  per100k: number
  vet: number
  emergency: number
  groomers: number
}) {
  const rank = R.allStates.findIndex(x => x.state === (R.allStates.find(y => y.stateName === s.stateName)!.state)) + 1
  const totalStates = R.totals.statesAnalyzed
  const gap = +(R.totals.nationalAvgPer100k - s.per100k).toFixed(2)

  return `Hi [REPORTER NAME],

I run PetOS Directory and we just finished a state-by-state analysis of pet service access across the US. ${s.stateName} stood out in a way that could matter to your readers.

${s.stateName} has ${s.totalProviders.toLocaleString()} pet service providers serving a population of ${(s.population / 1_000_000).toFixed(1)} million — or ${s.per100k} providers per 100,000 residents. That's ${gap > 0 ? `${gap} below` : `${Math.abs(gap)} above`} the national average (${R.totals.nationalAvgPer100k}). ${s.stateName} ranks ${rank} of ${totalStates} states.

Category breakdown for ${s.stateName}:
• ${s.vet} general veterinarians
• ${s.emergency} emergency/24-hour vet clinics
• ${s.groomers} pet groomers

Full national report with all 45 states ranked:
${REPORT_URL}

Story angles for your audience:
1. Why ${s.stateName} pet owners have ${gap > 0 ? 'fewer' : 'more'} local options than average
2. How access to emergency vet care affects pet mortality in a crisis
3. The economics — fewer providers means less competition and higher prices
4. Rural vs urban split within the state

Happy to share raw data, connect you with local veterinarians, or provide additional breakdowns. Report is free to cite with attribution to PetOS Directory.

Thanks,
${FROM_NAME}
${FROM_TITLE}
${FROM_EMAIL}
${REPORT_URL}`
}

function main() {
  const lines: string[] = []
  lines.push('# Pet Service Availability Report — Journalist Pitch Package')
  lines.push('')
  lines.push(`Generated: ${R.generatedAt}`)
  lines.push(`Report URL: ${REPORT_URL}`)
  lines.push('')
  lines.push(`National avg: ${R.totals.nationalAvgPer100k} providers per 100k residents`)
  lines.push(`States analyzed: ${R.totals.statesAnalyzed}`)
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('## Strategy')
  lines.push('')
  lines.push('50 states = 50 local angles. Don\'t pitch all at once — you\'ll burn the story.')
  lines.push('')
  lines.push('**Start with the 10 least-covered states** (strongest hook — "your state ranks near the bottom"). If any of those land coverage, run the same play for the top 10 (reverse angle: "your state leads the country").')
  lines.push('')
  lines.push('For each state: find 2-3 pet/lifestyle/health reporters at the top local newspapers and TV stations. Use the Hunter.io email-finder workflow from the previous pitch kit.')
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('## The 10 states to pitch (least covered)')
  lines.push('')

  for (const s of R.leastCovered) {
    lines.push(`### ${s.stateName} — ${s.per100k.toFixed(2)} / 100k (ranked ${R.allStates.findIndex(x => x.state === s.state) + 1} of ${R.totals.statesAnalyzed})`)
    lines.push('')
    lines.push(`**Subject:** ${subject(s.stateName)}`)
    lines.push('')
    lines.push('**Body (replace [REPORTER NAME] per pitch):**')
    lines.push('')
    lines.push('```')
    lines.push(body(s))
    lines.push('```')
    lines.push('')
    lines.push('**Finder searches (pick 2-3 reporters per state):**')
    lines.push('')
    lines.push(`- [Google: ${s.stateName} pet reporter](https://www.google.com/search?q=${encodeURIComponent(s.stateName + ' pet reporter')})`)
    lines.push(`- [Google: ${s.stateName} veterinary reporter](https://www.google.com/search?q=${encodeURIComponent(s.stateName + ' veterinary reporter')})`)
    lines.push(`- [Muck Rack: ${s.stateName} pets](https://muckrack.com/profile/search?q=${encodeURIComponent(s.stateName + ' pets')})`)
    lines.push(`- [Twitter/X: ${s.stateName} pet journalist](https://twitter.com/search?q=${encodeURIComponent(s.stateName + ' pet journalist')}&src=typed_query)`)
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  lines.push('')
  lines.push('## After the first 10 — the top 10 states (best covered)')
  lines.push('')
  lines.push('Use the REVERSE angle when pitching these:')
  lines.push('')
  for (const s of R.mostSaturated) {
    lines.push(`- **${s.stateName}** (${s.per100k.toFixed(2)} / 100k, ranked ${R.allStates.findIndex(x => x.state === s.state) + 1}) — pitch angle: "your state leads the country for pet service access"`)
  }

  const outDir = resolve(process.cwd(), 'outreach')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, 'availability-pitches.md'), lines.join('\n'), 'utf-8')
  console.log(`✓ Wrote outreach/availability-pitches.md`)
  console.log(`  ${R.leastCovered.length} primary pitches ready`)
}

main()
