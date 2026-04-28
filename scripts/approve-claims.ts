// @ts-nocheck
/**
 * Approve 3 pending claim requests and update provider listings in Supabase
 *
 * Run: cd "C:\Users\m1uva\OneDrive\Desktop\Petos directory" && npx tsx --env-file=.env.local scripts/approve-claims.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { supabaseAdmin } from './lib/supabase-admin.js'
import type { WeeklyHours } from '../src/types/index.js'

const now = new Date().toISOString()

// ─────────────────────────────────────────────
// Claim definitions
// ─────────────────────────────────────────────

const CLAIMS = [
  {
    label: 'Claim 1 — Sparkle Grooming Co.',
    claimId: 'a8f77e97-37f2-4dd9-9708-f66a65a953a2',
    providerId: '52b79933-50ec-4088-beea-ae5482adf647',
    claimantEmail: '48005@sparkledogcare.com',
    providerUpdates: {
      verified: true,
      claimed_by_email: '48005@sparkledogcare.com',
      claimed_at: now,
      description:
        'Sparkle Grooming Co. is a top-rated dog grooming salon in Phoenix\'s Arcadia neighborhood. ' +
        'With a 4.9-star rating across 54 reviews, they\'re known for attentive, stress-free grooming for dogs of all breeds.',
    },
  },
  {
    label: 'Claim 2 — Superior Dog Training',
    claimId: '12655b1b-191e-45ae-b061-8695e2bc3d41',
    providerId: '8b2274d4-f7f9-42ee-afe3-ac46afeadc36',
    claimantEmail: 'Superiordogtraining@gmail.com',
    providerUpdates: {
      verified: true,
      claimed_by_email: 'Superiordogtraining@gmail.com',
      claimed_at: now,
      description:
        'Superior Dog Training offers professional in-home and group dog and puppy training throughout the Atlanta metro area. ' +
        'Their proven methods are designed for real-life results — building calm, obedient dogs without harsh collars or treat dependency.',
      // Clean up the business name
      business_name: 'Superior Dog Training',
    },
  },
  {
    label: 'Claim 3 — Veterinary Emergency Clinic Sarasota',
    claimId: 'd37c352e-2d6a-4ea1-b9d2-271901c75c41',
    providerId: '854fcc99-b518-4ec7-b44a-28c9e2f54306',
    claimantEmail: 'info@vecsarasota.com',
    providerUpdates: {
      verified: true,
      claimed_by_email: 'info@vecsarasota.com',
      claimed_at: now,
      description:
        'Veterinary Emergency Clinic of Sarasota provides urgent and emergency veterinary care for pets in Sarasota and the surrounding area. ' +
        'Open when your regular vet isn\'t, VEC Sarasota is equipped to handle critical cases around the clock.',
      // Fix hours — 24/7 emergency clinic, all days open 00:00–23:59
      hours: buildAllDayHours(),
    },
  },
]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function buildAllDayHours(): WeeklyHours {
  const slot = { open: '00:00', close: '23:59', closed: false }
  return {
    monday: slot,
    tuesday: slot,
    wednesday: slot,
    thursday: slot,
    friday: slot,
    saturday: slot,
    sunday: slot,
  }
}

function ok(msg: string) {
  console.log(`  ✅ ${msg}`)
}

function fail(msg: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error)
  console.error(`  ❌ ${msg}: ${detail}`)
}

// ─────────────────────────────────────────────
// Pre-flight: inspect Claim 3 hours column
// ─────────────────────────────────────────────

async function inspectClaim3Hours() {
  console.log('\n── Pre-flight: checking current hours for VEC Sarasota (provider 854fcc99) ──')
  const { data, error } = await supabaseAdmin
    .from('providers')
    .select('id, business_name, hours')
    .eq('id', '854fcc99-b518-4ec7-b44a-28c9e2f54306')
    .single()

  if (error) {
    fail('Could not fetch provider', error)
    return
  }

  console.log(`  Provider: ${data.business_name}`)
  console.log(`  Current hours value:`)
  console.log(JSON.stringify(data.hours, null, 4))
}

// ─────────────────────────────────────────────
// Process one claim
// ─────────────────────────────────────────────

async function processClaim(claim: typeof CLAIMS[number]) {
  console.log(`\n── ${claim.label} ──`)

  // Step 1: Update claim_requests row
  // Real columns: status, approved_at, approved_by (no reviewed_at column)
  console.log('  [claim_requests] Setting status → approved, approved_at → now()')
  const { error: claimErr } = await supabaseAdmin
    .from('claim_requests')
    .update({
      status: 'approved',
      approved_at: now,
      approved_by: 'petosdirectory@gmail.com',
    })
    .eq('id', claim.claimId)

  if (claimErr) {
    console.error('  ❌ claim_requests update failed:')
    console.error('    code   :', (claimErr as any).code)
    console.error('    message:', (claimErr as any).message)
    console.error('    details:', (claimErr as any).details)
    console.error('    hint   :', (claimErr as any).hint)
  } else {
    ok(`claim_requests updated (id: ${claim.claimId})`)
  }

  // Step 2: Update providers row
  console.log('  [providers] Updating verified, claimed_by_email, claimed_at, description' +
    (claim.providerUpdates.business_name ? ', business_name' : '') +
    ((claim.providerUpdates as any).hours ? ', hours' : ''))

  const { error: providerErr } = await supabaseAdmin
    .from('providers')
    .update(claim.providerUpdates)
    .eq('id', claim.providerId)

  if (providerErr) {
    fail('providers update failed', providerErr)
  } else {
    ok(`providers updated (id: ${claim.providerId})`)
  }

  // Step 3: Verify the write by reading back key fields
  const selectFields = ['id', 'business_name', 'verified', 'claimed_by_email', 'claimed_at', 'description']
  if ((claim.providerUpdates as any).hours) selectFields.push('hours')

  const { data: readback, error: readErr } = await supabaseAdmin
    .from('providers')
    .select(selectFields.join(', '))
    .eq('id', claim.providerId)
    .single()

  if (readErr) {
    fail('Could not verify write', readErr)
  } else {
    console.log('  Verified readback:')
    console.log(`    business_name    : ${readback.business_name}`)
    console.log(`    verified         : ${readback.verified}`)
    console.log(`    claimed_by_email : ${readback.claimed_by_email}`)
    console.log(`    claimed_at       : ${readback.claimed_at}`)
    console.log(`    description      : ${(readback.description ?? '').slice(0, 80)}…`)
    if (readback.hours) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      const hoursSummary = days.map(d => `${d.slice(0,3)}: ${readback.hours[d]?.open ?? 'closed'}–${readback.hours[d]?.close ?? ''}`)
      console.log(`    hours            : ${hoursSummary.join(' | ')}`)
    }
  }
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main() {
  console.log('=== Approve Claims Script ===')
  console.log(`Timestamp: ${now}`)

  await inspectClaim3Hours()

  for (const claim of CLAIMS) {
    await processClaim(claim)
  }

  console.log('\n=== Done ===')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
