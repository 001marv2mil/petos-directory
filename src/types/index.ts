export type CategorySlug =
  | 'veterinarians'
  | 'emergency_vets'
  | 'groomers'
  | 'boarding'
  | 'daycare'
  | 'trainers'
  | 'pet_pharmacies'

export type ProviderSource = 'google_places' | 'seed' | 'manual'

export interface DayHours {
  open: string | null
  close: string | null
  closed: boolean
}

export type WeeklyHours = {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface Provider {
  id: string
  source: ProviderSource
  source_id: string | null
  slug: string
  business_name: string
  category: CategorySlug
  subcategory: string | null
  address: string
  city: string
  state: string
  zip: string | null
  lat: number | null
  lng: number | null
  phone: string | null
  website: string | null
  rating: number | null
  review_count: number
  hours: WeeklyHours | null
  description: string | null
  services: string[]
  hero_image: string | null
  gallery_images: string[]
  emergency: boolean
  verified: boolean
  special_offer: string | null
  claimed_by_email: string | null
  claimed_at: string | null
  last_synced_at: string | null
  source?: string | null
  created_at: string
  updated_at: string
}

export type SortOption = 'rating' | 'review_count' | 'name'

export interface SearchParams {
  city?: string
  state?: string
  category?: CategorySlug
  query?: string
  zip?: string
  emergency?: boolean
  verified?: boolean
  minRating?: number
  openNow?: boolean
  sort?: SortOption
  page?: number
  limit?: number
}

export type FallbackMode = 'exact' | 'nearby_city' | 'broader'

export interface SearchResult {
  providers: Provider[]
  total: number
  page: number
  hasMore: boolean
  fallbackMode: FallbackMode
}

export interface CategoryMeta {
  slug: CategorySlug
  label: string
  pluralLabel: string
  icon: string
  description: string
  color: string
}

export interface CityMeta {
  city: string
  state: string
  stateAbbr: string
  stateSlug: string
  citySlug: string
  heroImage: string
  lat?: number
  lng?: number
}
