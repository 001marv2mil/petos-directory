import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Provider } from '@/types'

export function useNearbyProviders(provider: Provider | undefined, limit = 6) {
  return useQuery({
    queryKey: ['nearby', provider?.id],
    queryFn: async () => {
      if (!provider) return []

      // Use bounding box if we have coordinates
      if (provider.lat && provider.lng) {
        const delta = 0.2 // ~14 miles
        const { data } = await supabase
          .from('providers')
          .select('*')
          .eq('category', provider.category)
          .gte('lat', provider.lat - delta)
          .lte('lat', provider.lat + delta)
          .gte('lng', provider.lng - delta)
          .lte('lng', provider.lng + delta)
          .neq('id', provider.id)
          .order('rating', { ascending: false, nullsFirst: false })
          .limit(limit)
        return (data ?? []) as Provider[]
      }

      // Fallback: same city + category
      const { data } = await supabase
        .from('providers')
        .select('*')
        .eq('category', provider.category)
        .ilike('city', provider.city)
        .neq('id', provider.id)
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(limit)
      return (data ?? []) as Provider[]
    },
    enabled: !!provider,
    staleTime: 1000 * 60 * 10,
  })
}
