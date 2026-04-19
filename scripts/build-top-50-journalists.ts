/**
 * Top 50 Journalists — Apify pipeline
 *
 * Scrapes ~40 curated high-authority pet/vet/lifestyle outlets for editor +
 * reporter emails, filters noise, ranks by relevance, outputs top 50.
 *
 * Cost: ~$3-5 in Apify credits (one-time)
 * Run:  npx tsx --env-file=.env.local scripts/build-top-50-journalists.ts
 *
 * Writes:
 *   outreach/top-50-journalists.csv  — ranked contact list
 *   outreach/top-50-raw.json         — raw scraper output (debug)
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const APIFY_TOKEN = process.env.APIFY_TOKEN
if (!APIFY_TOKEN) { console.error('Missing APIFY_TOKEN in .env.local'); process.exit(1) }

// vdrmota/contact-info-scraper on Apify. Bulk fetches a list of URLs and
// regex-extracts emails, phones, social handles + nearby text context.
const ACTOR_ID = 'vdrmota~contact-info-scraper'

// ─── Curated outlet list (tiered by authority) ──────────────────────────────
// tier S = pet/vet industry trade (highest reply rate)
// tier A = major pet consumer brands
// tier B = national outlets with pet beats
// tier D = specialized authoritative (welfare, behavior orgs)
type Tier = 'S' | 'A' | 'B' | 'D'
interface Outlet { name: string; tier: Tier; urls: string[] }

const OUTLETS: Outlet[] = [
  // Tier S — pet/vet industry trades
  { name: 'Pet Age',                    tier: 'S', urls: ['https://www.petage.com/contact-us/', 'https://www.petage.com/about/'] },
  { name: "Today's Veterinary Business",tier: 'S', urls: ['https://todaysveterinarybusiness.com/our-team/', 'https://todaysveterinarybusiness.com/contact-us/'] },
  { name: 'DVM360',                     tier: 'S', urls: ['https://www.dvm360.com/contact-us', 'https://www.dvm360.com/about'] },
  { name: 'Kinship',                    tier: 'S', urls: ['https://www.kinship.com/contact-us', 'https://www.kinship.com/about-us'] },
  { name: 'Pet Business Magazine',      tier: 'S', urls: ['https://www.petbusiness.com/contact/', 'https://www.petbusiness.com/about/'] },
  { name: 'Pet Product News',           tier: 'S', urls: ['https://www.petproductnews.com/about/contact/', 'https://www.petproductnews.com/about/'] },
  { name: 'Pet Food Industry',          tier: 'S', urls: ['https://www.petfoodindustry.com/contact-us', 'https://www.petfoodindustry.com/about-us'] },
  { name: 'Veterinary Practice News',   tier: 'S', urls: ['https://www.veterinarypracticenews.com/contact-us/', 'https://www.veterinarypracticenews.com/about-us/'] },
  { name: "Today's Veterinary Nurse",   tier: 'S', urls: ['https://todaysveterinarynurse.com/our-team/'] },
  { name: 'AAHA NEWStat',               tier: 'S', urls: ['https://www.aaha.org/resources/newstat/contact/', 'https://www.aaha.org/about/contact/'] },
  { name: 'Veterinary Advantage',       tier: 'S', urls: ['https://vet-advantage.com/contact-us/', 'https://vet-advantage.com/about-us/'] },
  { name: 'AVMA News',                  tier: 'S', urls: ['https://www.avma.org/about-avma/contact-avma'] },
  { name: 'NAVC (parent of TVB)',       tier: 'S', urls: ['https://navc.com/contact/', 'https://navc.com/our-team/'] },
  { name: 'Today\'s Veterinary Practice', tier: 'S', urls: ['https://todaysveterinarypractice.com/contact-us/'] },
  { name: 'VetSource',                  tier: 'S', urls: ['https://vetsource.com/contact/'] },

  // Tier A — major pet consumer brands
  { name: 'The Dodo',                   tier: 'A', urls: ['https://www.thedodo.com/about', 'https://www.thedodo.com/submit'] },
  { name: 'Modern Dog',                 tier: 'A', urls: ['https://moderndogmagazine.com/contact-us', 'https://moderndogmagazine.com/about'] },
  { name: 'Modern Cat',                 tier: 'A', urls: ['https://moderncat.com/contact-us/', 'https://moderncat.com/about/'] },
  { name: 'Whole Dog Journal',          tier: 'A', urls: ['https://www.whole-dog-journal.com/about/', 'https://www.whole-dog-journal.com/customer-service/contact-editor/'] },
  { name: 'Wirecutter Pets',            tier: 'A', urls: ['https://www.nytimes.com/wirecutter/about/contact-us/'] },
  { name: 'AKC News',                   tier: 'A', urls: ['https://www.akc.org/about/contact-us/', 'https://www.akc.org/press-center/'] },
  { name: 'PetMD Editorial',            tier: 'A', urls: ['https://www.petmd.com/about-us', 'https://www.petmd.com/contact'] },
  { name: 'Rover Daily Treat',          tier: 'A', urls: ['https://www.rover.com/blog/about/'] },
  { name: 'Dogster',                    tier: 'A', urls: ['https://www.dogster.com/contact-us-now', 'https://www.dogster.com/about-us'] },
  { name: 'Catster',                    tier: 'A', urls: ['https://www.catster.com/contact-us/', 'https://www.catster.com/about-us/'] },

  // Tier B — national outlets with pet beats
  { name: 'Washington Post (Karin Brulliard)', tier: 'B', urls: ['https://www.washingtonpost.com/people/karin-brulliard/'] },
  { name: 'Vox Future Perfect',         tier: 'B', urls: ['https://www.vox.com/contact'] },
  { name: 'NYT Pets',                   tier: 'B', urls: ['https://www.nytimes.com/section/pets'] },
  { name: 'The Atlantic',               tier: 'B', urls: ['https://www.theatlantic.com/about/masthead/'] },
  { name: 'Psychology Today',           tier: 'B', urls: ['https://www.psychologytoday.com/us/about/contact', 'https://www.psychologytoday.com/us/contributors'] },
  { name: 'Scientific American',        tier: 'B', urls: ['https://www.scientificamerican.com/page/contact-us/'] },

  // Tier D — specialized powerhouses
  { name: 'VIN (Veterinary Info Network)', tier: 'D', urls: ['https://www.vin.com/contact/'] },
  { name: 'ASPCA',                      tier: 'D', urls: ['https://www.aspca.org/about-us/contact-us'] },
  { name: 'Humane Society of the US',   tier: 'D', urls: ['https://www.humanesociety.org/about-us/contact'] },
  { name: 'AVMA',                       tier: 'D', urls: ['https://www.avma.org/about-avma/contact-avma'] },
  { name: 'Best Friends Animal Society',tier: 'D', urls: ['https://bestfriends.org/contact-us'] },
  { name: 'Petfinder',                  tier: 'D', urls: ['https://www.petfinder.com/about/contact/'] },
  { name: 'IAABC',                      tier: 'D', urls: ['https://iaabc.org/about/contact'] },
]

// Addresses to drop (not editorial — no point pitching)
const BLOCKED_LOCAL_PARTS = [
  // customer service / operations
  'help', 'support', 'subscriptions', 'subscribe', 'subscriber', 'customerservice',
  'custserv', 'customercare', 'circulation', 'billing', 'accounts', 'accountspayable',
  // commercial
  'advertising', 'ads', 'sponsorships', 'sponsorship', 'sales', 'partnerships',
  'marketing', 'media-kit', 'mediakit', 'business', 'commercial',
  // HR / legal / admin
  'jobs', 'careers', 'hr', 'humanresources', 'legal', 'privacy', 'permissions',
  'licensing', 'reprint', 'reprints', 'compliance',
  // Technical / bounces
  'webmaster', 'admin', 'root', 'postmaster', 'mailer-daemon', 'noreply',
  'no-reply', 'donotreply', 'unsubscribe', 'brokenlink', 'info-request',
  'newsletter-noreply', 'system', 'dns',
  // Donations / nonprofit ops (not editorial)
  'donations', 'donate', 'giving', 'plannedgiving', 'corporaterelations',
  'corprelations', 'volunteers', 'volunteer', 'internships', 'internship',
  'mailings', 'mailing', 'conferences', 'events', 'events-team', 'membership',
  'memberships', 'foundation',
  // Shelter / adoption-specific (not editorial at welfare orgs)
  'dogadoptions', 'catadoptions', 'adoptions', 'adoption', 'fostering',
  'lostfound', 'rescue', 'shelter', 'clinic', 'vetclinic',
  'horses', 'pigs', 'parrots', 'rabbits', 'birds', 'wildlife', 'wild',
  'farm', 'sanctuary', 'angelsrest', 'guardianangel',
  // Facility / visit-specific
  'lodging', 'welcomecenter', 'visitor', 'visit', 'tours', 'gift-shop',
  'giftshop', 'store', 'shop', 'cafe',
  // Networks / partners
  'bfnetwork', 'network', 'partners', 'partner',
  // Puppy mill / campaigns (advocacy, not editorial)
  'puppymillinitiatives', 'campaigns', 'initiatives', 'policy',
]

// Title keywords that raise score (editorial roles)
const EDITORIAL_KEYWORDS = [
  'editor', 'reporter', 'writer', 'journalist', 'correspondent', 'columnist',
  'contributor', 'staff writer', 'managing editor', 'editor-in-chief',
  'senior editor', 'associate editor', 'contributing editor', 'news editor',
]

// Title keywords that lower score (not editorial)
const NON_EDITORIAL_KEYWORDS = [
  'sales', 'marketing', 'advertising', 'hr', 'human resources', 'it',
  'developer', 'designer', 'accountant', 'finance', 'legal', 'operations',
  'ceo', 'president', 'vp', 'vice president', 'coo', 'cfo', 'cto',
  'customer', 'support', 'administrator',
]

// ─── Apify API call ────────────────────────────────────────────────────────
async function runApify(startUrls: { url: string }[]) {
  const endpoint = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&memory=1024&timeout=300`
  const body = {
    startUrls,
    sameDomain: false,
    maxDepth: 0,
    maxRequestsPerCrawl: startUrls.length + 5,
    considerChildFrames: false,
    proxyConfig: { useApifyProxy: true },
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Apify HTTP ${res.status}: ${text.slice(0, 500)}`)
  }
  return (await res.json()) as ApifyResult[]
}

// Expected shape from vdrmota/contact-info-scraper
interface ApifyResult {
  originalStartUrl?: string
  domain?: string
  scrapedUrls?: string[]
  emails?: string[]
  phones?: string[]
  twitters?: string[]
  linkedIns?: string[]
}

// ─── Scoring ────────────────────────────────────────────────────────────────
interface Contact {
  email: string
  name: string | null
  title: string | null
  outlet: string
  tier: Tier
  sourceUrl: string
  score: number
  reasons: string[]
}

function extractNameAndTitle(email: string, context: string | undefined): { name: string | null; title: string | null } {
  if (!context) return { name: null, title: null }

  // Try to find "Firstname Lastname" near the email
  const lines = context.split(/[\n\r]+/).map(l => l.trim()).filter(Boolean)
  let name: string | null = null
  let title: string | null = null

  const nameRe = /\b([A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-zA-Z-]+){1,2})\b/
  for (const line of lines) {
    if (!name) {
      const m = line.match(nameRe)
      if (m) name = m[1]
    }
    if (!title) {
      for (const kw of [...EDITORIAL_KEYWORDS, ...NON_EDITORIAL_KEYWORDS]) {
        if (line.toLowerCase().includes(kw)) {
          title = line.slice(0, 120)
          break
        }
      }
    }
    if (name && title) break
  }
  return { name, title }
}

function scoreContact(c: Omit<Contact, 'score' | 'reasons'>): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Tier bonus
  if (c.tier === 'S') { score += 5; reasons.push('tier S outlet (+5)') }
  else if (c.tier === 'A') { score += 3; reasons.push('tier A outlet (+3)') }
  else if (c.tier === 'B') { score += 2; reasons.push('tier B outlet (+2)') }
  else if (c.tier === 'D') { score += 1; reasons.push('tier D outlet (+1)') }

  const local = c.email.split('@')[0].toLowerCase()

  // Direct personal email (firstname or firstname.lastname)
  if (/^[a-z]+\.[a-z]+$/.test(local) || /^[a-z]{2,}$/.test(local)) {
    score += 3
    reasons.push('direct personal email (+3)')
  }
  // Editorial tip lines (better than generic info@)
  else if (['editorial', 'news', 'tips', 'editor', 'editors', 'newsdesk', 'stories', 'press'].some(k => local === k || local.startsWith(k + '@') || local === k)) {
    score += 2
    reasons.push('editorial tip line (+2)')
  }
  // Generic info@/contact@ is last resort
  else if (['info', 'contact', 'hello', 'general'].includes(local)) {
    score += 0
    reasons.push('generic info@ (+0)')
  }

  // Title bonus
  if (c.title) {
    const tLower = c.title.toLowerCase()
    if (EDITORIAL_KEYWORDS.some(kw => tLower.includes(kw))) {
      score += 2
      reasons.push('editorial title (+2)')
    }
    if (['editor-in-chief', 'chief', 'managing'].some(kw => tLower.includes(kw))) {
      score += 1
      reasons.push('senior editorial title (+1)')
    }
    if (NON_EDITORIAL_KEYWORDS.some(kw => tLower.includes(kw))) {
      score -= 3
      reasons.push('non-editorial title (−3)')
    }
  }

  // Named contact (not anonymous tip line) — only if name present AND looks like a person
  if (c.name && /^[A-Z][a-z]+\s+[A-Z]/.test(c.name)) {
    score += 1
    reasons.push('named contact (+1)')
  }

  return { score, reasons }
}

function isBlockedLocalPart(email: string): boolean {
  const local = email.split('@')[0].toLowerCase()
  return BLOCKED_LOCAL_PARTS.some(blocked => local === blocked || local.startsWith(blocked + '+') || local.startsWith(blocked + '-'))
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n=== Top 50 Journalists Pipeline ===`)
  console.log(`Outlets: ${OUTLETS.length}`)
  const urlsToScrape = OUTLETS.flatMap(o => o.urls.map(url => ({ url })))
  console.log(`URLs to scrape: ${urlsToScrape.length}`)
  console.log(`Estimated cost: ~$${(urlsToScrape.length * 0.001 + 0.01).toFixed(2)} (Apify credits)`)
  const outDir = resolve(process.cwd(), 'outreach')
  mkdirSync(outDir, { recursive: true })
  const rawPath = resolve(outDir, 'top-50-raw.json')

  // Cache: skip Apify call if raw results already on disk (pass --refresh to force)
  const forceRefresh = process.argv.includes('--refresh')
  let results: ApifyResult[]
  if (!forceRefresh && existsSync(rawPath)) {
    console.log(`\nUsing cached results at ${rawPath} (pass --refresh to re-scrape)`)
    results = JSON.parse(readFileSync(rawPath, 'utf-8'))
  } else {
    console.log(`\nStarting Apify Contact Info Scraper run...`)
    const startedAt = Date.now()
    results = await runApify(urlsToScrape)
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
    console.log(`✓ Apify returned ${results.length} results in ${elapsed}s`)
    writeFileSync(rawPath, JSON.stringify(results, null, 2), 'utf-8')
  }
  console.log()

  // Index URL → outlet lookup
  const urlToOutlet = new Map<string, Outlet>()
  for (const o of OUTLETS) for (const u of o.urls) urlToOutlet.set(u.replace(/\/$/, ''), o)

  // Extract contacts
  const seen = new Set<string>() // email → don't duplicate
  const contacts: Contact[] = []

  for (const r of results) {
    const rUrl = r.originalStartUrl ?? (r.scrapedUrls && r.scrapedUrls[0]) ?? ''
    if (!rUrl) continue

    // Find outlet by exact URL match, falling back to hostname match
    const cleanUrl = rUrl.replace(/\/$/, '')
    let outlet = urlToOutlet.get(cleanUrl)
    if (!outlet) {
      try {
        const host = new URL(rUrl).hostname.toLowerCase().replace(/^www\./, '')
        outlet = OUTLETS.find(o => o.urls.some(u => new URL(u).hostname.toLowerCase().replace(/^www\./, '') === host))
      } catch { /* bad URL, skip */ }
    }
    if (!outlet) continue

    const emails = r.emails ?? []
    for (const rawEmail of emails) {
      const email = rawEmail.trim().toLowerCase()
      if (!email) continue
      // basic sanity
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue
      if (seen.has(email)) continue
      if (isBlockedLocalPart(email)) continue
      seen.add(email)

      // contact-info-scraper doesn't give us inline context — name/title stay null
      const base: Omit<Contact, 'score' | 'reasons'> = {
        email, name: null, title: null,
        outlet: outlet.name,
        tier: outlet.tier,
        sourceUrl: rUrl,
      }
      const { score, reasons } = scoreContact(base)
      contacts.push({ ...base, score, reasons })
    }
  }

  console.log(`Raw contacts after dedup + block list: ${contacts.length}`)

  // Sort + slice
  contacts.sort((a, b) => b.score - a.score)
  const top50 = contacts.slice(0, 50)

  console.log(`\nTop 10 preview:\n`)
  for (const [i, c] of top50.slice(0, 10).entries()) {
    console.log(`  ${i + 1}. [${c.score}] ${c.email}  —  ${c.outlet} (${c.tier})${c.name ? ' · ' + c.name : ''}${c.title ? ' · ' + c.title.slice(0, 40) : ''}`)
  }

  // Write CSV
  const csvRows = [
    'rank,score,email,name,title,outlet,tier,source_url,reasons',
    ...top50.map((c, i) =>
      [i + 1, c.score, c.email, c.name ?? '', c.title ?? '', c.outlet, c.tier, c.sourceUrl, c.reasons.join(' | ')]
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    ),
  ]
  writeFileSync(resolve(outDir, 'top-50-journalists.csv'), csvRows.join('\n'), 'utf-8')

  console.log(`\n✓ Wrote outreach/top-50-journalists.csv (${top50.length} contacts)`)
  console.log(`  raw data at outreach/top-50-raw.json`)
}

main().catch(e => { console.error(e); process.exit(1) })
