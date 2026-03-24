import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Provider, SearchParams, SearchResult } from '@/types'

const PAGE_SIZE = 24

async function fetchProviders(params: SearchParams): Promise<SearchResult> {
  const { city, state, category, query, zip, emergency, verified, minRating, sort = 'rating', page = 1 } = params
  const offset = (page - 1) * PAGE_SIZE

  let qb = supabase
    .from('providers')
    .select('*', { count: 'exact' })

  if (state) qb = qb.ilike('state', state)
  if (city) qb = qb.ilike('city', city)
  if (category) qb = qb.eq('category', category)
  if (zip) qb = qb.eq('zip', zip)
  if (emergency) qb = qb.eq('emergency', true)
  if (verified) qb = qb.eq('verified', true)
  if (minRating) qb = qb.gte('rating', minRating)
  if (query) qb = qb.ilike('business_name', `%${query}%`)

  if (sort === 'name') {
    qb = qb.order('business_name', { ascending: true })
  } else if (sort === 'review_count') {
    qb = qb.order('review_count', { ascending: false, nullsFirst: false })
  } else {
    qb = qb
      .order('rating', { ascending: false, nullsFirst: false })
      .order('review_count', { ascending: false })
  }

  qb = qb.range(offset, offset + PAGE_SIZE - 1)

  const { data, count, error } = await qb
  if (error) throw error

  const providers = (data ?? []) as Provider[]
  const total = count ?? 0

  // Fallback: fewer than 5 exact results → show nearby city results
  if (total < 5 && city && state && category && !query && !zip) {
    return fetchFallback(params, providers, total)
  }

  return { providers, total, page, hasMore: total > offset + PAGE_SIZE, fallbackMode: 'exact' }
}

async function fetchFallback(
  params: SearchParams,
  exactResults: Provider[],
  exactCount: number,
): Promise<SearchResult> {
  const { state, category, page = 1 } = params
  const offset = (page - 1) * PAGE_SIZE

  const { data, count } = await supabase
    .from('providers')
    .select('*', { count: 'exact' })
    .ilike('state', state!)
    .eq('category', category!)
    .order('rating', { ascending: false, nullsFirst: false })
    .range(offset, offset + PAGE_SIZE - 1)

  const broader = (data ?? []) as Provider[]
  const exactIds = new Set(exactResults.map(p => p.id))
  const merged = [...exactResults, ...broader.filter(p => !exactIds.has(p.id))]

  return {
    providers: merged.slice(0, PAGE_SIZE),
    total: count ?? 0,
    page,
    hasMore: (count ?? 0) > offset + PAGE_SIZE,
    fallbackMode: exactCount === 0 ? 'broader' : 'nearby_city',
  }
}

export function useProviders(params: SearchParams) {
  const enabled = !!(params.city || params.query || params.zip || params.state || params.category)
  return useQuery({
    queryKey: ['providers', params],
    queryFn: () => fetchProviders(params),
    enabled,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })
}
