/**
 * Fix thin-content providers by adding descriptions
 *
 * Run: cd "C:\Users\m1uva\OneDrive\Desktop\Petos directory" && npx tsx --env-file=.env.local scripts/fix-thin-providers.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

const SLUGS = [
  'de-wilmington-veterinarians-branmar-veterinary-hospital',
  'fl-sarasota-petpharmacies-hedges-pharmacy',
  'tx-fort-worth-veterinarians-mellina-animal-hospital',
  'oh-columbus-groomers-tlc-grooming-clintonville',
  'fl-sarasota-daycare-doggy-resort-srq',
  'ne-omaha-veterinarians-rockbrook-animal-clinic',
]

function buildDescription(p: {
  business_name: string
  city: string
  state: string
  rating: number | null
  review_count: number | null
  category: string
  slug: string
}): string {
  const { business_name: name, city, state, rating, review_count, slug } = p
  const hasRating = rating !== null && rating >= 4.0
  const hasReviews = review_count !== null && review_count >= 10

  // Wilmington vet
  if (slug === 'de-wilmington-veterinarians-branmar-veterinary-hospital') {
    const ratingLine =
      hasRating && hasReviews
        ? ` With a ${rating}-star rating across ${review_count} reviews, they're known for attentive care and a friendly team.`
        : ' Their team is known for attentive care and making both pets and owners feel at ease.'
    return `Branmar Veterinary Hospital provides comprehensive veterinary care to pets and their families in Wilmington, Delaware.${ratingLine}`
  }

  // Sarasota pet pharmacy
  if (slug === 'fl-sarasota-petpharmacies-hedges-pharmacy') {
    const ratingLine =
      hasRating && hasReviews
        ? ` Rated ${rating} stars across ${review_count} reviews, customers appreciate their knowledgeable staff and quick turnaround.`
        : ' Customers appreciate their knowledgeable staff and personalized service.'
    return `Hedges Pharmacy serves the Sarasota, Florida community with prescription fulfillment and specialty medications for pets.${ratingLine}`
  }

  // Fort Worth vet
  if (slug === 'tx-fort-worth-veterinarians-mellina-animal-hospital') {
    const ratingLine =
      hasRating && hasReviews
        ? ` With ${review_count} reviews averaging ${rating} stars, pet owners trust them for both routine visits and urgent care.`
        : ' Pet owners in the area trust them for both routine wellness visits and urgent care needs.'
    return `Mellina Animal Hospital offers full-service veterinary care to pets and their owners across Fort Worth, Texas.${ratingLine}`
  }

  // Columbus groomer
  if (slug === 'oh-columbus-groomers-tlc-grooming-clintonville') {
    const ratingLine =
      hasRating && hasReviews
        ? ` Rated ${rating} stars from ${review_count} reviews, regulars praise the calm handling and consistent results.`
        : ' Regulars praise the calm handling and consistent, thorough grooming sessions.'
    return `TLC Grooming is a neighborhood grooming shop in the Clintonville area of Columbus, Ohio, offering baths, cuts, and styling for dogs and cats.${ratingLine}`
  }

  // Sarasota dog daycare
  if (slug === 'fl-sarasota-daycare-doggy-resort-srq') {
    const ratingLine =
      hasRating && hasReviews
        ? ` A ${rating}-star rating across ${review_count} reviews reflects happy dogs and confident owners.`
        : ' Owners appreciate the supervised play environment and attentive staff.'
    return `Doggy Resort SRQ provides dog daycare and boarding services to pets in Sarasota, Florida, with a focus on supervised socialization and comfort.${ratingLine}`
  }

  // Omaha vet
  if (slug === 'ne-omaha-veterinarians-rockbrook-animal-clinic') {
    const ratingLine =
      hasRating && hasReviews
        ? ` With a ${rating}-star rating across ${review_count} reviews, they're known for thorough exams and a welcoming staff.`
        : " They're known for thorough exams and a welcoming, unhurried approach to pet care."
    return `Rockbrook Animal Clinic has served pets and their owners in west Omaha for years.${ratingLine}`
  }

  // Fallback (should not reach here given the fixed slug list)
  const ratingLine =
    hasRating && hasReviews
      ? ` Rated ${rating} stars from ${review_count} reviews.`
      : ''
  return `${name} provides quality pet services to the ${city}, ${state} community.${ratingLine}`
}

async function main() {
  console.log('🔍 Fetching provider data from Supabase...\n')

  const { data: providers, error } = await supabase
    .from('providers')
    .select('id, slug, business_name, city, state, rating, review_count, category, description')
    .in('slug', SLUGS)

  if (error) {
    console.error('❌ Fetch error:', error.message)
    process.exit(1)
  }

  if (!providers || providers.length === 0) {
    console.error('❌ No providers found for the given slugs')
    process.exit(1)
  }

  console.log(`Found ${providers.length} of ${SLUGS.length} providers\n`)
  console.log('─'.repeat(70))

  const updates: Array<{ id: string; slug: string; description: string; name: string }> = []

  for (const p of providers) {
    const description = buildDescription(p)
    console.log(`\n📍 ${p.business_name} (${p.city}, ${p.state})`)
    console.log(`   Slug:        ${p.slug}`)
    console.log(`   Category:    ${p.category}`)
    console.log(`   Rating:      ${p.rating ?? 'n/a'} (${p.review_count ?? 0} reviews)`)
    console.log(`   Existing:    ${p.description ? `"${p.description.slice(0, 60)}..."` : '(none)'}`)
    console.log(`   New desc:    "${description}"`)
    updates.push({ id: p.id, slug: p.slug, description, name: p.business_name })
  }

  // Log any missing slugs
  const foundSlugs = new Set(providers.map((p: { slug: string }) => p.slug))
  const missingSlugs = SLUGS.filter(s => !foundSlugs.has(s))
  if (missingSlugs.length > 0) {
    console.log(`\n⚠️  Not found in DB (${missingSlugs.length}):`)
    missingSlugs.forEach(s => console.log(`   - ${s}`))
  }

  console.log('\n' + '─'.repeat(70))
  console.log('\n✏️  Writing descriptions...\n')

  let successCount = 0
  let failCount = 0

  for (const { id, slug: _slug, description, name } of updates) {
    const { error: updateError } = await supabase
      .from('providers')
      .update({ description })
      .eq('id', id)

    if (updateError) {
      console.error(`  ❌ ${name}: ${updateError.message}`)
      failCount++
    } else {
      console.log(`  ✅ ${name}`)
      successCount++
    }
  }

  console.log('\n' + '─'.repeat(70))
  console.log(`\nDone. ${successCount} updated, ${failCount} failed, ${missingSlugs.length} not found.\n`)
}

main().catch(err => {
  console.error('Unhandled error:', err)
  process.exit(1)
})
