import { SlugRegistry } from './slug.js'
import type { CityCenter } from './categories.js'
import type { CategorySlug } from '../../src/types/index.js'

// Singleton registry — used across all ingestion to prevent slug collisions
export const slugRegistry = new SlugRegistry()

// ── Places API (New) types ──────────────────────────────────────────────────

interface NewPlaceResult {
  id: string
  displayName: { text: string; languageCode?: string }
  formattedAddress?: string
  shortFormattedAddress?: string
  location?: { latitude: number; longitude: number }
  rating?: number
  userRatingCount?: number
}

interface NewPeriodTime {
  day: number
  hour: number
  minute: number
}

interface NewPlaceDetails {
  nationalPhoneNumber?: string
  websiteUri?: string
  regularOpeningHours?: {
    periods?: Array<{
      open: NewPeriodTime
      close?: NewPeriodTime
    }>
  }
}

// ── Legacy Places API types (kept for reference) ────────────────────────────

interface PlaceResult {
  place_id: string
  name: string
  vicinity?: string
  formatted_address?: string
  geometry?: { location: { lat: number; lng: number } }
  rating?: number
  user_ratings_total?: number
}

interface PlaceDetails {
  formatted_phone_number?: string
  website?: string
  opening_hours?: {
    periods?: Array<{
      open: { day: number; time: string }
      close?: { day: number; time: string }
    }>
  }
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

// ── Hours normalizers ───────────────────────────────────────────────────────

type NewPeriod = { open: NewPeriodTime; close?: NewPeriodTime }

function normalizeNewHours(periods: NewPeriod[] | undefined) {
  if (!periods || periods.length === 0) return null
  const result: Record<string, { open: string | null; close: string | null; closed: boolean }> = {}
  for (const day of DAYS) {
    result[day] = { open: null, close: null, closed: true }
  }
  for (const period of periods) {
    const dayName = DAYS[period.open.day]
    if (!dayName) continue
    result[dayName] = {
      open: formatTimeParts(period.open.hour, period.open.minute),
      close: period.close ? formatTimeParts(period.close.hour, period.close.minute) : null,
      closed: false,
    }
  }
  return result
}

function formatTimeParts(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

type Period = { open: { day: number; time: string }; close?: { day: number; time: string } }

function normalizeHours(periods: Period[] | undefined) {
  if (!periods || periods.length === 0) return null
  const result: Record<string, { open: string | null; close: string | null; closed: boolean }> = {}
  for (const day of DAYS) {
    result[day] = { open: null, close: null, closed: true }
  }
  for (const period of periods) {
    const dayName = DAYS[period.open.day]
    result[dayName] = {
      open: formatTime(period.open.time),
      close: period.close ? formatTime(period.close.time) : null,
      closed: false,
    }
  }
  return result
}

function formatTime(t: string): string {
  return `${t.slice(0, 2)}:${t.slice(2)}`
}

// ── Normalizers ─────────────────────────────────────────────────────────────

export function normalizeNewPlace(
  place: NewPlaceResult,
  details: NewPlaceDetails | null,
  city: CityCenter,
  category: CategorySlug,
  heroImage: string | null = null,
) {
  const slug = slugRegistry.generate(city.stateSlug, city.citySlug, category, place.displayName.text)
  const hours = normalizeNewHours(details?.regularOpeningHours?.periods)

  return {
    source: 'google_places',
    source_id: place.id,
    slug,
    business_name: place.displayName.text,
    category,
    subcategory: null,
    address: place.shortFormattedAddress ?? place.formattedAddress ?? '',
    city: city.city,
    state: city.stateAbbr,
    zip: null,
    lat: place.location?.latitude ?? null,
    lng: place.location?.longitude ?? null,
    phone: details?.nationalPhoneNumber ?? null,
    website: details?.websiteUri ?? null,
    rating: place.rating ?? null,
    review_count: place.userRatingCount ?? 0,
    hours,
    description: null,
    services: [],
    hero_image: heroImage,
    gallery_images: [],
    emergency: category === 'emergency_vets',
    verified: false,
    last_synced_at: new Date().toISOString(),
  }
}

export function normalizePlace(
  place: PlaceResult,
  details: PlaceDetails | null,
  city: CityCenter,
  category: CategorySlug,
) {
  const slug = slugRegistry.generate(city.stateSlug, city.citySlug, category, place.name)
  const hours = normalizeHours(details?.opening_hours?.periods)

  return {
    source: 'google_places',
    source_id: place.place_id,
    slug,
    business_name: place.name,
    category,
    subcategory: null,
    address: place.vicinity ?? place.formatted_address ?? '',
    city: city.city,
    state: city.stateAbbr,
    zip: null,
    lat: place.geometry?.location.lat ?? null,
    lng: place.geometry?.location.lng ?? null,
    phone: details?.formatted_phone_number ?? null,
    website: details?.website ?? null,
    rating: place.rating ?? null,
    review_count: place.user_ratings_total ?? 0,
    hours,
    description: null,
    services: [],
    hero_image: null,
    gallery_images: [],
    emergency: category === 'emergency_vets',
    verified: false,
    last_synced_at: new Date().toISOString(),
  }
}
