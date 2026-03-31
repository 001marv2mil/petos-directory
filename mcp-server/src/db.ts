import { createClient, SupabaseClient } from '@supabase/supabase-js'

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const url = getEnv('SUPABASE_URL')
    const key = getEnv('SUPABASE_ANON_KEY')
    _client = createClient(url, key)
  }
  return _client
}

export interface Provider {
  id: string
  slug: string
  business_name: string
  category: string
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
  hours: Record<string, { open: string; close: string; closed?: boolean }> | null
  description: string | null
  services: string[]
  hero_image: string | null
  emergency: boolean
  verified: boolean
  created_at: string
}
