import { Link } from 'react-router-dom'
import { Star, MapPin } from 'lucide-react'
import type { Provider } from '@/types'
import { getProviderImage } from '@/lib/images'
import { formatRating } from '@/lib/utils'

interface NearbyProvidersProps {
  providers: Provider[]
}

export function NearbyProviders({ providers }: NearbyProvidersProps) {
  if (providers.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Nearby Providers</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {providers.map(p => (
          <Link
            key={p.id}
            to={`/provider/${p.slug}`}
            className="group shrink-0 w-48 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-green-200 transition-all"
          >
            <div className="h-28 overflow-hidden bg-gray-100">
              <img
                src={getProviderImage(p.hero_image, p.category, p.slug)}
                alt={p.business_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80&fit=crop'
                }}
              />
            </div>
            <div className="p-2.5">
              <p className="text-xs font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight mb-1">
                {p.business_name}
              </p>
              {p.rating !== null && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-700">{formatRating(p.rating)}</span>
                </div>
              )}
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500 truncate">{p.city}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
