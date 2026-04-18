import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Star, Shield } from 'lucide-react'
import type { Provider } from '@/types'
import { getProviderImage } from '@/lib/images'
import { CATEGORIES } from '@/lib/constants'

async function fetchFeatured(): Promise<Provider[]> {
  // Only show businesses that have paid for featured listing — level playing field for everyone else
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  )
}

export function FeaturedProviders() {
  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['featured-providers'],
    queryFn: fetchFeatured,
    staleTime: 1000 * 60 * 10,
  })

  // Hide section entirely when there are no paid featured listings — level playing field
  if (!isLoading && providers.length === 0) return null

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Pet Services</h2>
            <p className="text-sm text-gray-500 mt-1">Promoted by local pet businesses</p>
          </div>
          <Link
            to="/search"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors hidden sm:block"
          >
            Browse all →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-full mt-4" />
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
                <div key={provider.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-52 overflow-hidden bg-gray-100">
                    <img
                      src={img}
                      alt={provider.business_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop'
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{provider.business_name}</h3>
                      <Shield className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" title="Featured listing" />
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {categoryMeta?.label ?? provider.category} · {provider.city}, {provider.state}
                    </p>
                    {provider.rating !== null && (
                      <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={provider.rating} />
                        <span className="text-sm text-gray-500">({provider.review_count.toLocaleString()} reviews)</span>
                      </div>
                    )}
                    <Link
                      to={`/provider/${provider.slug}`}
                      className="block w-full text-center py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
