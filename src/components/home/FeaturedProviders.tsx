import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Star, CheckCircle } from 'lucide-react'
import type { Provider } from '@/types'
import { getProviderImage } from '@/lib/images'
import { CATEGORIES } from '@/lib/constants'

const FEATURED_CATEGORIES = ['veterinarians', 'groomers', 'boarding'] as const

async function fetchFeatured(): Promise<Provider[]> {
  // Fetch top-rated provider for each of the 3 featured categories
  const results = await Promise.all(
    FEATURED_CATEGORIES.map(cat =>
      supabase
        .from('providers')
        .select('*')
        .eq('category', cat)
        .order('rating', { ascending: false, nullsFirst: false })
        .order('review_count', { ascending: false })
        .limit(1)
        .single()
    )
  )
  return results
    .filter(r => r.data && !r.error)
    .map(r => r.data as Provider)
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

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Top-Rated Pet Services</h2>
          <p className="text-sm text-gray-500 mt-2">Trusted by pet owners across the country</p>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-3" />
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
        ) : providers.length === 0 ? null : (
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
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {categoryMeta?.label ?? provider.category} · {provider.city}, {provider.state}
                    </p>
                    {provider.rating !== null && (
                      <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={provider.rating} />
                        <span className="text-sm text-gray-500">({provider.review_count.toLocaleString()} Reviews)</span>
                      </div>
                    )}
                    <Link
                      to={`/provider/${provider.slug}`}
                      className="block w-full text-center py-2.5 bg-blue-800 text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-colors"
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
