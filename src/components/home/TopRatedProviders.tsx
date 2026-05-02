import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react'
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
    <section className="py-20 sm:py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              Top rated providers
            </h2>
            <p className="mt-3 text-gray-500 text-lg">
              Highest-reviewed pet services across our directory
            </p>
          </div>
          <Link
            to="/search"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map(provider => {
              const img = getProviderImage(provider.hero_image, provider.category, provider.slug)
              const categoryMeta = CATEGORIES.find(c => c.slug === provider.category)
              return (
                <Link
                  key={provider.id}
                  to={`/provider/${provider.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
                >
                  <div className="h-48 overflow-hidden bg-gray-100 relative">
                    <img
                      src={img}
                      alt={provider.business_name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop'
                      }}
                    />
                    {provider.verified && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {categoryMeta?.label ?? provider.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                      {provider.business_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i <= Math.round(provider.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {provider.rating} ({provider.review_count.toLocaleString()})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {provider.city}, {provider.state}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700"
          >
            View all listings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
