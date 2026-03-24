import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Provider } from '@/types'

export function useProvider(slug: string) {
  return useQuery({
    queryKey: ['provider', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) throw error
      return data as Provider
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  })
}
