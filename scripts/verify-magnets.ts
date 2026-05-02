/**
 * Verifies every lead magnet has all expected content.
 * Lists category, title, every section heading, and bullet count per section.
 *
 * Run: npx tsx scripts/verify-magnets.ts
 */
import { MAGNETS } from '../src/data/lead-magnets'

console.log('Lead Magnet Content Verification\n' + '='.repeat(60))
for (const [cat, m] of Object.entries(MAGNETS)) {
  console.log(`\n[${cat}] ${m.title}`)
  console.log(`Subject: ${m.emailSubject}`)
  console.log(`Sections (${m.sections.length}):`)
  for (const s of m.sections) {
    console.log(`  - "${s.heading}" (${s.bullets.length} bullets)`)
  }
}

// Specific check: emergency vets must have CPR, toxins, transport, what to bring
const er = MAGNETS.emergency_vets
const headings = er.sections.map(s => s.heading.toLowerCase())
console.log('\n' + '='.repeat(60))
console.log('Emergency Vets specific checks:')
console.log(`  Has CPR section?       ${headings.some(h => h.includes('cpr')) ? '✓' : '✗'}`)
console.log(`  Has toxins section?    ${headings.some(h => h.includes('toxin')) ? '✓' : '✗'}`)
console.log(`  Has transport section? ${headings.some(h => h.includes('transport')) ? '✓' : '✗'}`)
console.log(`  Has phone-call info?   ${headings.some(h => h.includes('call') || h.includes('phone')) ? '✓' : '✗'}`)
console.log(`  Has "bring with you"?  ${headings.some(h => h.includes('bring')) ? '✓' : '✗'}`)
