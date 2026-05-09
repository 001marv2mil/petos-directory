/**
 * Generate unique descriptions for all providers that are missing one.
 *
 * Uses existing data (name, category, city, state, rating, review_count,
 * hours, address) to build natural, human sounding descriptions.
 *
 * Run:  node scripts/generate-descriptions.mjs
 *
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars
 *           (or VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY as fallback)
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials.')
  process.exit(1)
}

const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
}

// ── State name map ──────────────────────────────────────────────────────────

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'Washington, D.C.',
}

// ── Category labels and service descriptors ─────────────────────────────────

const CATEGORY_INFO = {
  veterinarians: {
    label: 'veterinary clinic',
    serviceWords: ['wellness exams', 'vaccinations', 'dental care', 'surgery', 'preventive care', 'diagnostics'],
    whatTheyDo: 'provides comprehensive veterinary care for dogs, cats, and other companion animals',
    trust: 'trusted veterinary care',
  },
  emergency_vets: {
    label: 'emergency veterinary hospital',
    serviceWords: ['emergency surgery', 'critical care', 'urgent treatment', 'after hours care', 'trauma stabilization', 'overnight monitoring'],
    whatTheyDo: 'offers emergency and urgent veterinary care when pets need immediate attention',
    trust: 'emergency pet care',
  },
  groomers: {
    label: 'pet grooming salon',
    serviceWords: ['baths', 'haircuts', 'nail trimming', 'ear cleaning', 'deshedding', 'breed specific styling'],
    whatTheyDo: 'offers professional grooming services to keep dogs and cats looking and feeling their best',
    trust: 'professional pet grooming',
  },
  daycare: {
    label: 'pet daycare facility',
    serviceWords: ['supervised play', 'socialization', 'indoor and outdoor play areas', 'group activities', 'rest periods', 'webcam access'],
    whatTheyDo: 'provides a safe, supervised environment where dogs can socialize and play throughout the day',
    trust: 'trusted pet daycare',
  },
  boarding: {
    label: 'pet boarding facility',
    serviceWords: ['overnight stays', 'individual suites', 'feeding schedules', 'exercise time', 'daily updates', 'medication administration'],
    whatTheyDo: 'offers comfortable overnight boarding so pet owners can travel with peace of mind',
    trust: 'reliable pet boarding',
  },
  trainers: {
    label: 'dog training service',
    serviceWords: ['obedience training', 'puppy classes', 'behavior modification', 'private lessons', 'group classes', 'leash manners'],
    whatTheyDo: 'helps dogs and their owners build better behavior through structured training programs',
    trust: 'professional dog training',
  },
  pet_pharmacies: {
    label: 'pet pharmacy',
    serviceWords: ['prescription medications', 'compounding', 'flea and tick prevention', 'supplements', 'specialty formulas', 'refill services'],
    whatTheyDo: 'provides prescription medications and health products for pets',
    trust: 'pet medication and pharmacy services',
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Simple hash of a string to pick template variants deterministically */
function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/** Pick N unique items from an array using a seed */
function pickN(arr, n, seed) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed + i * 31) % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, n)
}

/** Format hours into a human readable summary */
function formatHours(hours) {
  if (!hours) return null

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const openDays = days.filter(d => hours[d] && !hours[d].closed)

  if (openDays.length === 0) return null
  if (openDays.length === 7) return 'seven days a week'

  // Check if open Mon-Fri
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  const weekend = ['saturday', 'sunday']
  const openWeekdays = weekdays.filter(d => hours[d] && !hours[d].closed)
  const openWeekend = weekend.filter(d => hours[d] && !hours[d].closed)

  if (openWeekdays.length === 5 && openWeekend.length === 1) {
    const wkndDay = openWeekend[0] === 'saturday' ? 'Saturday' : 'Sunday'
    return `Monday through Friday and ${wkndDay}`
  }

  if (openWeekdays.length === 5 && openWeekend.length === 2) {
    return 'seven days a week'
  }

  if (openWeekdays.length === 5 && openWeekend.length === 0) {
    return 'Monday through Friday'
  }

  if (openDays.length >= 5) {
    return `${openDays.length} days a week`
  }

  return `${openDays.length} days a week`
}

/** Check if any day is 24 hours */
function is24Hours(hours) {
  if (!hours) return false
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  return days.some(d => {
    const h = hours[d]
    if (!h || h.closed) return false
    return h.open === '00:00' && (h.close === '23:59' || h.close === '00:00' || h.close === null)
  })
}

/** Build a rating phrase */
function ratingPhrase(rating, reviewCount, seed) {
  if (!rating || !reviewCount || reviewCount === 0) return null

  const templates = [
    `Rated ${rating} stars by ${reviewCount} reviewers`,
    `With a ${rating} star rating from ${reviewCount} reviews`,
    `Holding a ${rating} star rating across ${reviewCount} reviews`,
    `Backed by ${reviewCount} reviews and a ${rating} star rating`,
    `Pet owners have given them ${rating} stars across ${reviewCount} reviews`,
  ]

  // High rating variants
  if (rating >= 4.5) {
    templates.push(
      `Highly rated at ${rating} stars from ${reviewCount} reviews`,
      `A ${rating} star favorite among ${reviewCount} reviewers`,
      `One of the top rated options with ${rating} stars from ${reviewCount} reviews`,
    )
  }

  // High review count variants
  if (reviewCount >= 100) {
    templates.push(
      `Trusted by hundreds of pet owners with a ${rating} star rating`,
      `A well reviewed choice with ${rating} stars across ${reviewCount} reviews`,
    )
  }

  return templates[seed % templates.length]
}

// ── Description generators (one per category) ──────────────────────────────

function generateDescription(provider) {
  const {
    id,
    business_name: name,
    category,
    city,
    state,
    rating,
    review_count: reviewCount,
    hours,
    address,
  } = provider

  const info = CATEGORY_INFO[category]
  if (!info) {
    // Fallback for unknown categories
    return `${name} serves pet owners in ${city}, ${state}. Contact them to learn more about the services they offer.`
  }

  const seed = hash(id || name + city)
  const stateName = STATE_NAMES[state] || state
  const schedule = formatHours(hours)
  const is24h = is24Hours(hours)
  const services = pickN(info.serviceWords, 3, seed)
  const serviceList = services.slice(0, 2).join(', ') + ', and ' + services[2]

  // Build sentence components
  const location = `${city}, ${stateName}`

  const rPhrase = ratingPhrase(rating, reviewCount, seed)

  // ── Template pool ───────────────────────────────────────────────────────

  const openers = [
    `${name} is a ${info.label} serving pet owners in ${location}.`,
    `Located in ${city}, ${state}, ${name} ${info.whatTheyDo}.`,
    `${name} ${info.whatTheyDo} in ${location}.`,
    `Pet owners in ${city} count on ${name} for ${info.trust}.`,
    `Serving the ${city}, ${state} community, ${name} is a ${info.label} focused on quality care.`,
    `${name} brings ${info.trust} to pet owners across ${city}, ${state}.`,
    `For ${info.trust} in ${location}, pet owners turn to ${name}.`,
    `${name} is a go to ${info.label} for pet owners in ${city}, ${state}.`,
  ]

  const middles = [
    `Their services include ${serviceList}.`,
    `They offer ${serviceList} and more.`,
    `Specializing in ${serviceList}, they take a thorough approach to every visit.`,
    `From ${services[0]} to ${services[2]}, they cover the essentials and then some.`,
    `Pet owners appreciate their focus on ${services[0]} and ${services[1]}.`,
    `They provide ${services[0]}, ${services[1]}, and additional services tailored to each pet.`,
  ]

  const closers = []

  // Rating closers
  if (rPhrase) {
    closers.push(
      `${rPhrase}, reflecting their commitment to every pet they see.`,
      `${rPhrase}, this is a spot that pet owners come back to.`,
      `${rPhrase}, they have earned the confidence of the local pet community.`,
    )
  }

  // Hours closers
  if (is24h) {
    closers.push(
      `They are open around the clock for whenever your pet needs care.`,
      `Available 24 hours, they are there when it matters most.`,
    )
  } else if (schedule) {
    closers.push(
      `Open ${schedule}, they make it easy to fit an appointment into your schedule.`,
      `They welcome visitors ${schedule}.`,
      `With hours ${schedule}, they are accessible when pet owners need them.`,
    )
  }

  // Fallback closers
  if (closers.length === 0) {
    closers.push(
      `Reach out to them directly to learn more about their services and availability.`,
      `Contact them to schedule a visit or learn about their current offerings.`,
    )
  }

  // ── Assemble ──────────────────────────────────────────────────────────

  const opener = openers[seed % openers.length]
  const middle = middles[(seed >> 3) % middles.length]
  const closer = closers[(seed >> 6) % closers.length]

  return `${opener} ${middle} ${closer}`
}

// ── Fetch providers missing descriptions ────────────────────────────────────

async function fetchProvidersMissingDescriptions() {
  let all = []
  let offset = 0
  const PAGE_SIZE = 1000

  while (true) {
    const params = new URLSearchParams({
      select: 'id,business_name,category,city,state,rating,review_count,hours,address',
      description: 'is.null',
      order: 'id.asc',
      offset: String(offset),
      limit: String(PAGE_SIZE),
    })

    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?${params}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    })

    if (!res.ok) {
      console.error(`Fetch error: ${res.status} ${res.statusText}`)
      const body = await res.text()
      console.error(body)
      process.exit(1)
    }

    const data = await res.json()
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
    console.log(`  Fetched ${all.length} providers so far...`)
  }

  return all
}

// ── Batch update descriptions ───────────────────────────────────────────────

async function updateDescription(id, description) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?id=eq.${id}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ description }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`PATCH failed for ${id}: ${res.status} ${body}`)
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching providers missing descriptions...')
  const providers = await fetchProvidersMissingDescriptions()
  console.log(`Found ${providers.length} providers without descriptions.\n`)

  if (providers.length === 0) {
    console.log('All providers already have descriptions. Nothing to do.')
    return
  }

  // Show a few examples before running
  console.log('Sample descriptions:\n')
  for (let i = 0; i < Math.min(5, providers.length); i++) {
    const p = providers[i]
    const desc = generateDescription(p)
    console.log(`  ${p.business_name} (${p.category}, ${p.city} ${p.state}):`)
    console.log(`  "${desc}"\n`)
  }

  console.log(`\nUpdating ${providers.length} providers...\n`)

  let ok = 0
  let failed = 0
  const BATCH_DELAY = 50 // ms between requests to avoid rate limits

  for (const provider of providers) {
    try {
      const description = generateDescription(provider)
      await updateDescription(provider.id, description)
      ok++

      if (ok % 500 === 0) {
        console.log(`  ... ${ok} / ${providers.length} updated`)
      }
    } catch (err) {
      console.error(`  X  ${provider.business_name}: ${err.message}`)
      failed++
    }

    // Small delay to avoid hammering the API
    if (BATCH_DELAY > 0) {
      await new Promise(r => setTimeout(r, BATCH_DELAY))
    }
  }

  console.log(`\nDone. ${ok} descriptions generated, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
