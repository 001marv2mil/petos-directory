/**
 * Generates personalized pitch packages per desert city:
 *   - subject line
 *   - email body
 *   - list of likely local news outlets to target
 *   - Google search URLs for finding the actual pet/lifestyle reporter at each outlet
 *
 * Run: npx tsx --env-file=.env.local scripts/journalist-pitch.ts
 *      (writes outreach/journalist-pitches.md for copy/paste)
 */
import { emergencyVetReport as R } from '../src/data/emergency-vet-report'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const REPORT_URL = 'https://petosdirectory.com/reports/emergency-vet-access-2026'
const FROM_NAME = 'Malak Ghonimy'
const FROM_TITLE = 'Founder, PetOS Directory'
const FROM_EMAIL = 'petosdirectory@gmail.com'

// Known local news outlet patterns. Not exhaustive — meant as a starter set,
// user verifies/augments manually.
const CITY_OUTLETS: Record<string, { name: string; domain: string; notes?: string }[]> = {
  'Cleveland, OH': [
    { name: 'Cleveland.com', domain: 'cleveland.com' },
    { name: 'WKYC (NBC)', domain: 'wkyc.com' },
    { name: 'Fox 8 Cleveland', domain: 'fox8.com' },
    { name: 'Cleveland Scene', domain: 'clevelandscene.com' },
    { name: 'WEWS News 5', domain: 'news5cleveland.com' },
  ],
  'St. Paul, MN': [
    { name: 'Pioneer Press', domain: 'twincities.com' },
    { name: 'MinnPost', domain: 'minnpost.com' },
    { name: 'Star Tribune', domain: 'startribune.com' },
    { name: 'KSTP (ABC)', domain: 'kstp.com' },
    { name: 'City Pages (archived) → Racket', domain: 'racketmn.com' },
  ],
  'Savannah, GA': [
    { name: 'Savannah Morning News', domain: 'savannahnow.com' },
    { name: 'WTOC (CBS)', domain: 'wtoc.com' },
    { name: 'WSAV (NBC)', domain: 'wsav.com' },
    { name: 'Connect Savannah', domain: 'connectsavannah.com' },
  ],
  'Clearwater, FL': [
    { name: 'Tampa Bay Times', domain: 'tampabay.com' },
    { name: 'ABC Action News', domain: 'abcactionnews.com' },
    { name: 'Fox 13 Tampa', domain: 'fox13news.com' },
    { name: 'Clearwater Beacon', domain: 'clearwaterbeacon.com' },
  ],
  'Overland Park, KS': [
    { name: 'Kansas City Star', domain: 'kansascity.com' },
    { name: 'Shawnee Mission Post', domain: 'shawneemissionpost.com' },
    { name: 'KSHB 41 (NBC)', domain: 'kshb.com' },
    { name: 'KCTV 5 (CBS)', domain: 'kctv5.com' },
    { name: 'Startland News', domain: 'startlandnews.com' },
  ],
}

function subject(city: string): string {
  return `${city} data story: only 1 emergency vet for the entire city (PetOS research)`
}

function body(city: string): string {
  return `Hi [REPORTER NAME],

I run PetOS Directory, a nationwide directory of pet services. We just finished an analysis of emergency vet access across ${R.totals.totalCitiesAnalyzed} major US metros — and ${city} stood out.

Headline finding for ${city}: your city has only ONE emergency veterinary clinic inside city limits. That means if a family's pet has a crisis when their primary vet is closed, they have zero backup options if that one clinic is at capacity or not equipped for the specific emergency.

Nationally:
• ${R.totals.citiesWithOnlyOne} US cities have only one emergency vet option
• ${R.totals.citiesWithTwoOrFewer} cities (${R.totals.pctCitiesUnderThree}% of those analyzed) have two or fewer
• Covers ${R.totals.totalEmergencyVets.toLocaleString()} clinics across ${R.totals.totalCitiesAnalyzed} metros

The full report, with city-by-city data for your readers:
${REPORT_URL}

${city}-specific angles your audience would care about:
  1. What do local pet owners actually do in a crisis? (drive times, nearest backup option)
  2. Why the shortage — vet workforce trends + specialty accreditation cost
  3. Practical takeaway: how families should prepare BEFORE a pet emergency

Happy to share raw data, connect you with local vet sources, or answer questions on background. The report is free to cite with attribution.

Thanks,
${FROM_NAME}
${FROM_TITLE}
${FROM_EMAIL}
${REPORT_URL}`
}

function searchUrlsFor(outlet: { name: string; domain: string }, topic = 'pets'): string[] {
  return [
    `https://www.google.com/search?q=site:${outlet.domain}+${topic}+reporter`,
    `https://www.google.com/search?q=site:${outlet.domain}+${topic}+writer+email`,
    `https://twitter.com/search?q=${encodeURIComponent(outlet.name)}%20${topic}%20reporter&src=typed_query`,
  ]
}

function main() {
  const lines: string[] = []
  lines.push('# Emergency Vet Report — Journalist Pitch Package')
  lines.push('')
  lines.push(`Generated: ${R.generatedAt}`)
  lines.push(`Report URL: ${REPORT_URL}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const c of R.deserts) {
    const key = `${c.city}, ${c.state}`
    lines.push(`## ${key} — 1 emergency vet`)
    lines.push('')
    lines.push(`**Subject:** ${subject(c.city)}`)
    lines.push('')
    lines.push('**Body (replace [REPORTER NAME] per pitch):**')
    lines.push('')
    lines.push('```')
    lines.push(body(c.city))
    lines.push('```')
    lines.push('')
    lines.push('**Target outlets (start here, find the pet/lifestyle/health reporter):**')
    lines.push('')
    const outlets = CITY_OUTLETS[key] || []
    if (!outlets.length) {
      lines.push('_(No outlet list bundled for this city — search manually on Google News: "' + c.city + ' pet reporter" or "' + c.city + ' lifestyle reporter")_')
    } else {
      for (const o of outlets) {
        lines.push(`- **${o.name}** (${o.domain})`)
        for (const u of searchUrlsFor(o)) {
          lines.push(`  - ${u}`)
        }
      }
    }
    lines.push('')
    lines.push('**Generic finder searches (works for any city):**')
    lines.push('')
    lines.push(`- [Google: ${c.city} pets reporter](https://www.google.com/search?q=${encodeURIComponent(c.city + ' pets reporter')})`)
    lines.push(`- [Muck Rack journalist search](https://muckrack.com/profile/search?q=${encodeURIComponent(c.city + ' pets')})`)
    lines.push(`- [Twitter/X: ${c.city} pet journalist](https://twitter.com/search?q=${encodeURIComponent(c.city + ' pet journalist')}&src=typed_query)`)
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  const outDir = resolve(process.cwd(), 'outreach')
  mkdirSync(outDir, { recursive: true })
  const outPath = resolve(outDir, 'journalist-pitches.md')
  writeFileSync(outPath, lines.join('\n'), 'utf-8')
  console.log(`✓ Wrote ${outPath}`)
  console.log(`  ${R.deserts.length} pitch packages ready.`)
}

main()
