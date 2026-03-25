import { createClient } from '@supabase/supabase-js'
import type { Provider } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Check your .env.local file.')
}

// During SSR/prerender the env vars may be absent; use placeholders so the
// module initialises without throwing. renderToString is synchronous and
// React Query never actually invokes Supabase during a server render.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
)

// Database type alias
export type ProviderRow = Provider
