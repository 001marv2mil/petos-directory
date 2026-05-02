import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Star, BadgeCheck } from 'lucide-react'
import type { Provider } from '@/types'
import { getProviderImage } from '@/lib/images'
import { CATEGORIES } from '@/lib/constants'

async function fetchFeatured(): Promise<Provider[]> {
  const { data: payments } = await supabase
    .from('featured_payments')
    .select('provider_id')
    .eq('status', 'active')

  if (!payments || payments.length === 0) return []

  const providerIds = payments.map(p => p.provider_id)
  const { data } = await supabase
    .from('providers')
    .select('*')
    .in('id', providerIds)
    .limit(6)

  return (data || []) as Provider[]
}

export function FeaturedProviders() {
  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['featured-providers'],
    queryFn: fetchFeatured,
    staleTime: 1000 * 60 * 10,
  })

  if (!isLoading && providers.length === 0) return null

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Featured providers
          </h2>
          <p className="mt-3 text-gray-500 text-lg">Promoted by local pet businesses</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {providers.map(provider => {
              const img = getProviderImage(provider.hero_image, provider.category, provider.slug)
              const categoryMeta = CATEGORIES.find(c => c.slug === provider.category)
              return (
                <Link
                  key={provider.id}
                  to={`/provider/${provider.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="h-52 overflow-hidden bg-gray-100">
                    <img
                      src={img}
                      alt={provider.business_name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop'
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Featured</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                      {provider.business_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {categoryMeta?.label ?? provider.category} in {provider.city}, {provider.state}
                    </p>
                    {provider.rating !== null && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i <= Math.round(provider.rating!) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({provider.review_count.toLocaleString()})
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
