import { createClient } from '@supabase/supabase-js'
import type { Provider } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

// Database type alias
export type ProviderRow = Provider
