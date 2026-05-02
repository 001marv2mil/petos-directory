import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Star, MapPin, CheckCircle } from 'lucide-react'
import type { Provider } from '@/types'
import { getProviderImage } from '@/lib/images'
import { CATEGORIES } from '@/lib/constants'

async function fetchTopRated(): Promise<Provider[]> {
  const { data: verified } = await supabase
    .from('providers')
    .select('*')
    .eq('verified', true)
    .gte('review_count', 10)
    .order('review_count', { ascending: false })
    .limit(6)

  if (verified && verified.length >= 6) return verified as Provider[]

  const verifiedIds = new Set((verified || []).map(p => p.id))
  const needed = 6 - (verified?.length ?? 0)
  const { data: extra } = await supabase
    .from('providers')
    .select('*')
    .in('category', ['veterinarians', 'groomers', 'trainers', 'boarding', 'daycare'])
    .gte('rating', 4.5)
    .gte('review_count', 100)
    .order('review_count', { ascending: false })
    .limit(needed + 10)

  const filtered = (extra || []).filter(p => !verifiedIds.has(p.id)).slice(0, needed)
  return [...(verified || []), ...filtered] as Provider[]
}

export function TopRatedProviders() {
  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['top-rated-home'],
    queryFn: fetchTopRated,
    staleTime: 1000 * 60 * 30,
  })

  if (!isLoading && providers.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Rated Near You</h2>
            <p className="text-sm text-gray-500 mt-1">
              Highest-reviewed pet services across our directory
            </p>
          </div>
          <Link
            to="/search"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors hidden sm:block"
          >
            View all listings →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map(provider => {
              const img = getProviderImage(provider.hero_image, provider.category, provider.slug)
              const categoryMeta = CATEGORIES.find(c => c.slug === provider.category)
              return (
                <Link
                  key={provider.id}
                  to={`/provider/${provider.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all"
                >
                  <div className="h-44 overflow-hidden bg-gray-100 relative">
                    <img
                      src={img}
                      alt={provider.business_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop'
                      }}
                    />
                    {provider.verified && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors">
                      {provider.business_name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i <= Math.round(provider.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {provider.rating} ({provider.review_count.toLocaleString()})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {provider.city}, {provider.state}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>{categoryMeta?.label ?? provider.category}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/search"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            View all listings →
          </Link>
        </div>
      </div>
    </section>
  )
}
