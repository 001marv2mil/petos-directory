/**
 * Generates outreach/send-pitches.html — curated launcher with every
 * verified editorial contact we've found. One click opens a pre-filled email.
 *
 * Combines:
 * - Original 8 "great fits" manually curated
 * - New contacts from Apify Contact Info Scraper (top-50-journalists.csv)
 * - Dedup + human-pick quality only (no location/volunteer/dept addresses)
 *
 * Run: npx tsx --env-file=.env.local scripts/generate-mailto-launcher.ts
 */
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

interface Pitch {
  id: number
  outletName: string
  reason: string
  contact: string
  subject: string
  body: string
  category: 'pet-press' | 'desert-city'
  quality: 'A' | 'B' // A = top pick, B = solid backup
}

function petPressBody(greeting: string): string {
  return `${greeting}

I run PetOS Directory and just finished an analysis of emergency vet access across 82 major US metros. The findings aren't getting much coverage and I think your audience would care.

Headlines:
- 8 major US cities have only 1 emergency vet clinic inside city limits — including Cleveland, St. Paul, Savannah, and Clearwater
- 15 cities (18.3% of those analyzed) have 2 or fewer options
- Analyzed 863 emergency vet clinics total

Why this matters: when a pet has a crisis and the primary vet is closed, pet owners in these cities have no backup. If the one clinic is at capacity or not equipped for the specific emergency, the nearest alternative is often 30–90 minutes away.

Full report with city-by-city data, methodology, and state-level breakdown:
https://petosdirectory.com/reports/emergency-vet-access-2026

A few angles your readers would engage with:
1. The shortage mapped — which metros are best/worst for after-hours care
2. Why the shortage exists — vet workforce trends, specialty accreditation costs
3. What pet owners should do — how to prepare BEFORE a pet emergency

Happy to share raw data, additional breakdowns, or connect you with vet sources. Free to cite with attribution to PetOS Directory.

Thanks,
Malak Ghonimy
Founder, PetOS Directory
petosdirectory@gmail.com
https://petosdirectory.com`
}

function cityBody(city: string, greeting: string): string {
  return `${greeting}

I run PetOS Directory, a nationwide directory of pet services. We just finished an analysis of emergency vet access across 82 major US metros — and ${city} stood out.

Headline for ${city}: your city has only ONE emergency veterinary clinic inside city limits. That means if a family's pet has a crisis when their primary vet is closed, they have zero backup options if that one clinic is at capacity or not equipped for the specific emergency.

Nationally, 8 US cities share this problem, and 15 have 2 or fewer options (18.3% of those analyzed).

Full report with city-by-city data, methodology, and state-level breakdown:
https://petosdirectory.com/reports/emergency-vet-access-2026

${city}-specific angles your audience would care about:
1. What local pet owners actually do in a crisis (drive times, nearest backup)
2. Why the shortage exists — vet workforce trends, specialty accreditation costs
3. Practical takeaway: how families should prepare BEFORE a pet emergency

Happy to share raw data, connect you with local vet sources, or answer questions on background. Free to cite with attribution to PetOS Directory.

Thanks,
Malak Ghonimy
Founder, PetOS Directory
petosdirectory@gmail.com
https://petosdirectory.com`
}

const PET_PRESS_SUBJECT = `New data: 8 major US cities have only 1 emergency vet — America's vet shortage mapped`

// ─── Curated list: 8 originals + best Apify finds + dedup ──────────────────
const PITCHES: Pitch[] = [
  // === Tier A: Top picks (priority sends) ===
  { id: 1,  outletName: 'Pet Age — Glenn Polyn (Editor-in-Chief)', reason: 'Editor of a pet industry trade. Lives for this data.', contact: 'gpolyn@petage.com',            subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Glenn,'),                 category: 'pet-press', quality: 'A' },
  { id: 2,  outletName: "Today's Veterinary Business — Sarah Mahan (Editor)", reason: 'Vet trade editor. Vet workforce shortage is her beat.', contact: 'smahan@navc.com',         subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Sarah,'),                 category: 'pet-press', quality: 'A' },
  { id: 3,  outletName: "Today's Veterinary Business — Ken Niedziela (Editor)", reason: 'Outgoing Editor at TVB. Still covers this beat.', contact: 'kniedziela@navc.com',   subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Ken,'),                   category: 'pet-press', quality: 'A' },
  { id: 4,  outletName: 'Kinship — editorial',                     reason: 'Condé Nast pet brand. Huge audience. Publishes data stories.', contact: 'editorial@kinship.com', subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Kinship team,'),          category: 'pet-press', quality: 'A' },
  { id: 5,  outletName: 'DVM360 — news tips',                      reason: 'Vet industry news tip line. Covers workforce/access stories.', contact: 'news@dvm360.com',       subject: PET_PRESS_SUBJECT, body: petPressBody('Hi DVM360 team,'),           category: 'pet-press', quality: 'A' },
  { id: 6,  outletName: 'AKC News — Brandi Munden (Communications VP)', reason: 'Top press contact at the AKC. Routes industry data stories.', contact: 'brandi.munden@akc.org', subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Brandi,'),          category: 'pet-press', quality: 'A' },
  { id: 7,  outletName: 'AKC News — Jessica D\'Amato',              reason: 'AKC communications team member.',                            contact: 'jessica.damato@akc.org',subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Jessica,'),               category: 'pet-press', quality: 'A' },
  { id: 8,  outletName: 'AKC News — Sarah Bank',                    reason: 'AKC communications team member.',                            contact: 'sarah.bank@akc.org',    subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Sarah,'),                 category: 'pet-press', quality: 'A' },
  { id: 9,  outletName: 'MinnPost — Andy Steiner (Health/lifestyle)', reason: 'Her Minnesota beat includes St. Paul vet desert.',       contact: 'asteiner@minnpost.com', subject: 'St. Paul data: only 1 emergency vet for the entire city (PetOS research)', body: cityBody('St. Paul', 'Hi Andy,'),       category: 'desert-city', quality: 'A' },
  { id: 10, outletName: 'Kansas City Star — Greg Farmer (Exec Editor)', reason: 'Routes KC-area editorial. Overland Park is his metro.', contact: 'gfarmer@kcstar.com',    subject: 'Overland Park data: only 1 emergency vet for the entire city (PetOS research)', body: cityBody('Overland Park', 'Hi Greg,'), category: 'desert-city', quality: 'A' },
  { id: 11, outletName: 'Signal Cleveland — Frank W. Lewis (Editors Bureau)', reason: 'Local Cleveland editor.',                      contact: 'frank@signalcleveland.org', subject: 'Cleveland data: only 1 emergency vet for the entire city (PetOS research)', body: cityBody('Cleveland', 'Hi Frank,'),      category: 'desert-city', quality: 'A' },
  { id: 12, outletName: 'Missoula Current — Martin Kidston (Editor)', reason: 'Independent local editor in Missoula.',                 contact: 'editor@missoulacurrent.com', subject: 'Missoula data: only 1 emergency vet for the entire city (PetOS research)', body: cityBody('Missoula', 'Hi Martin,'),  category: 'desert-city', quality: 'A' },

  // === Tier B: Solid backups (send if no response from Tier A after 7 days) ===
  { id: 13, outletName: 'Kinship — press (backup)',                 reason: 'Press/partnerships backup for Kinship.',                     contact: 'press@kinship.com',     subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Kinship press,'),         category: 'pet-press', quality: 'B' },
  { id: 14, outletName: 'DVM360 — articles (backup)',               reason: 'Article submissions backup for DVM360.',                     contact: 'articles@dvm360.com',   subject: PET_PRESS_SUBJECT, body: petPressBody('Hi DVM360 team,'),           category: 'pet-press', quality: 'B' },
  { id: 15, outletName: 'AKC News — Communications catchall',       reason: 'General AKC press inbox.',                                   contact: 'communications@akc.org',subject: PET_PRESS_SUBJECT, body: petPressBody('Hi AKC Communications,'),    category: 'pet-press', quality: 'B' },
  { id: 16, outletName: 'Scientific American — Editors',            reason: 'Editors catchall. SciAm covers pet science occasionally.',   contact: 'editors@sciam.com',     subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Scientific American editors,'), category: 'pet-press', quality: 'B' },
  { id: 17, outletName: 'Best Friends Animal Society — Editor',     reason: 'Editorial catchall at the largest pet welfare org.',         contact: 'editor@bestfriends.org',subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Best Friends editorial,'),category: 'pet-press', quality: 'B' },
  { id: 18, outletName: 'Pet Age — Juliana Hefford (backup)',       reason: 'Backup editor at Pet Age.',                                  contact: 'jhefford@petage.com',   subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Juliana,'),               category: 'pet-press', quality: 'B' },
  { id: 19, outletName: "Today's Veterinary Business — editor@ catchall", reason: 'Backup catchall at TVB.',                            contact: 'editor@navc.com',       subject: PET_PRESS_SUBJECT, body: petPressBody('Hi editor,'),                category: 'pet-press', quality: 'B' },
  { id: 20, outletName: 'Modern Dog — general',                     reason: 'Only published address. Reaches editorial team.',            contact: 'info@moderndogmagazine.com', subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Modern Dog team,'),   category: 'pet-press', quality: 'B' },
  { id: 21, outletName: 'Modern Cat — general',                     reason: 'Only published address. Reaches editorial team.',            contact: 'info@moderncat.com',    subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Modern Cat team,'),       category: 'pet-press', quality: 'B' },
  { id: 22, outletName: 'Pet Life Radio',                           reason: 'Podcast/interview angle.',                                   contact: 'info@petliferadio.com', subject: PET_PRESS_SUBJECT, body: petPressBody('Hi Pet Life Radio team,'),   category: 'pet-press', quality: 'B' },
]

// ─── Build HTML ────────────────────────────────────────────────────────────
function encodeMailto(p: Pitch): string {
  const params = new URLSearchParams({ subject: p.subject, body: p.body })
  return `mailto:${encodeURIComponent(p.contact)}?${params.toString().replace(/\+/g, '%20')}`
}

function pitchCard(p: Pitch): string {
  const href = encodeMailto(p)
  return `
  <div class="card card-${p.quality}">
    <div class="header">
      <span class="num">#${p.id}</span>
      <span class="tag tag-${p.category}">${p.category === 'pet-press' ? 'Pet Press' : 'Desert City'}</span>
      <span class="quality quality-${p.quality}">${p.quality === 'A' ? 'Top pick' : 'Backup'}</span>
    </div>
    <div class="outlet">${p.outletName}</div>
    <div class="reason">${p.reason}</div>
    <div class="contact">${p.contact}</div>
    <div class="subject"><strong>Subject:</strong> ${p.subject}</div>
    <a href="${href}" class="send-btn">📧 Open in Outlook / email client</a>
  </div>`
}

function main() {
  const tierA = PITCHES.filter(p => p.quality === 'A')
  const tierB = PITCHES.filter(p => p.quality === 'B')

  const cards: string[] = []
  cards.push(`<h2>🎯 Tier A — Top picks (${tierA.length}) — send these first</h2>`)
  cards.push(`<p class="section-note">These are the highest-relevance contacts: editors, reporters, and named team members whose job description maps directly to your story. Expected response rate: ~15–25%.</p>`)
  for (const p of tierA) cards.push(pitchCard(p))

  cards.push(`<h2 style="margin-top:48px">📋 Tier B — Solid backups (${tierB.length}) — send if Tier A goes quiet after 7 days</h2>`)
  cards.push(`<p class="section-note">Catchall inboxes, backup editors, and generic press addresses. Lower reply rate (~5-10%) but still worth trying if Tier A doesn't land anything.</p>`)
  for (const p of tierB) cards.push(pitchCard(p))

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>PetOS Pitch Launcher — ${PITCHES.length} curated targets</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 820px; margin: 0 auto; padding: 32px 16px; background: #fafafa; color: #111; line-height: 1.5; }
  h1 { font-size: 28px; margin-bottom: 8px; }
  h2 { font-size: 20px; margin-top: 32px; }
  .lead { color: #6b7280; font-size: 14px; margin-bottom: 16px; }
  .schedule { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 16px; margin: 16px 0; }
  .schedule h3 { margin: 0 0 8px; font-size: 14px; color: #1e40af; text-transform: uppercase; letter-spacing: 1px; }
  .schedule ol { margin: 0; padding-left: 20px; font-size: 14px; color: #1e3a8a; }
  .section-note { font-size: 13px; color: #6b7280; background: #f3f4f6; border-radius: 8px; padding: 12px; margin: 12px 0; }
  .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
  .card-A { border-left: 4px solid #10b981; }
  .card-B { border-left: 4px solid #6b7280; opacity: 0.85; }
  .header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
  .num { font-size: 12px; font-weight: 700; color: #6b7280; background: #f3f4f6; padding: 2px 8px; border-radius: 999px; }
  .tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 2px 8px; border-radius: 999px; }
  .tag-pet-press { background: #dbeafe; color: #1e40af; }
  .tag-desert-city { background: #fee2e2; color: #991b1b; }
  .quality { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 2px 8px; border-radius: 999px; }
  .quality-A { background: #d1fae5; color: #065f46; }
  .quality-B { background: #e5e7eb; color: #374151; }
  .outlet { font-weight: 600; color: #111; font-size: 15px; margin-bottom: 4px; }
  .reason { font-size: 13px; color: #6b7280; font-style: italic; margin-bottom: 10px; }
  .contact { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 13px; color: #111; background: #f9fafb; padding: 4px 8px; border-radius: 6px; display: inline-block; margin-bottom: 10px; }
  .subject { font-size: 13px; color: #374151; margin-bottom: 12px; }
  .send-btn { display: inline-block; background: #2563eb; color: #fff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
  .send-btn:hover { background: #1d4ed8; }
  .tracker-note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px; font-size: 13px; color: #78350f; margin: 20px 0; }
</style>
</head>
<body>
<h1>📫 PetOS Pitch Launcher</h1>
<p class="lead">
  ${PITCHES.length} curated recipients — ${tierA.length} Tier A (top picks) + ${tierB.length} Tier B (backups).
  One click opens Outlook with subject + body pre-filled. Review, click Send.
</p>

<div class="schedule">
  <h3>📅 Recommended 6-day cadence (2/day, Tier A first)</h3>
  <ol>
    <li><strong>Day 1:</strong> #1 Pet Age (Glenn) + #2 Today's Vet (Sarah)</li>
    <li><strong>Day 2:</strong> #3 Today's Vet (Ken) + #4 Kinship editorial</li>
    <li><strong>Day 3:</strong> #5 DVM360 + #6 AKC Brandi Munden</li>
    <li><strong>Day 4:</strong> #7 AKC Jessica D'Amato + #8 AKC Sarah Bank</li>
    <li><strong>Day 5:</strong> #9 MinnPost Andy + #10 KC Star Greg</li>
    <li><strong>Day 6:</strong> #11 Signal Cleveland Frank + #12 Missoula Martin</li>
    <li><em>Week 2:</em> Check replies. Send Tier B to outlets that went silent.</li>
  </ol>
</div>

<div class="tracker-note">
  <strong>Before your first click:</strong> install <a href="https://mailtrack.io" target="_blank">Mailtrack.io</a>
  (free Gmail extension) or enable Outlook read receipts so you see which pitches got opened.
  Log each send in <code>outreach/backlink-tracker.csv</code>.
</div>

${cards.join('\n')}

<p class="lead" style="margin-top: 40px; text-align: center; color: #9ca3af;">
  Generated ${new Date().toISOString().slice(0, 10)} by scripts/generate-mailto-launcher.ts · ${PITCHES.length} pitches
</p>
</body>
</html>`

  const outDir = resolve(process.cwd(), 'outreach')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, 'send-pitches.html'), html, 'utf-8')
  console.log(`✓ Wrote outreach/send-pitches.html`)
  console.log(`  ${tierA.length} Tier A (top picks) + ${tierB.length} Tier B (backups) = ${PITCHES.length} total`)
}

main()
