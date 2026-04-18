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
      const provider = data as Provider

      // Attach `featured` flag from featured_payments so the upgrade CTA
      // and visual callouts know whether this provider is on the paid plan.
      const { data: fp } = await supabase
        .from('featured_payments')
        .select('id')
        .eq('provider_id', provider.id)
        .eq('status', 'active')
        .maybeSingle()

      return { ...provider, featured: !!fp } as Provider
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  })
}
