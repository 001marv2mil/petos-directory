import { useNavigate } from 'react-router-dom'
import { Star, MapPin, Phone, Shield, AlertCircle, Globe, Lock, Heart } from 'lucide-react'
import type { Provider } from '@/types'
import { getProviderImage } from '@/lib/images'
import { formatPhone, formatRating, isOpenNow } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import { useFavorite } from '@/hooks/useFavorite'

interface ProviderCardProps {
  provider: Provider
  precomputedImage?: string
  distanceMiles?: number
}

export function ProviderCard({ provider, precomputedImage, distanceMiles }: ProviderCardProps) {
  const navigate = useNavigate()
  const { user, openModal } = useAuth()
  const { isFavorited, toggle: toggleFavorite } = useFavorite(provider.id)
  const img = precomputedImage ?? getProviderImage(provider.hero_image, provider.category, provider.slug)
  const categoryMeta = CATEGORIES.find(c => c.slug === provider.category)
  const formattedPhone = formatPhone(provider.phone)
  const openNow = isOpenNow(provider.hours)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/provider/${provider.slug}`)}
      onKeyDown={e => e.key === 'Enter' && navigate(`/provider/${provider.slug}`)}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-200 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={provider.business_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop'
          }}
        />
        {/* Heart / favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
        </button>

        <div className="absolute top-2 left-2 flex gap-1.5">
          {provider.emergency && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" />
              24/7
            </span>
          )}
          {provider.verified && (
            <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}
          {!provider.emergency && provider.hours && (
            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${openNow ? 'bg-emerald-500 text-white' : 'bg-black/50 text-white'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${openNow ? 'bg-white' : 'bg-gray-300'}`} />
              {openNow ? 'Open Now' : 'Closed'}
            </span>
          )}
        </div>
        {categoryMeta && (
          <div className="absolute bottom-2 left-2">
            <span className="text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full border border-white/50">
              {categoryMeta.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight line-clamp-2">
          {provider.business_name}
        </h3>

        {provider.rating !== null && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-900">{formatRating(provider.rating)}</span>
            </div>
            <span className="text-xs text-gray-500">({provider.review_count.toLocaleString()} reviews)</span>
          </div>
        )}

        <div className="flex items-start gap-1.5 text-sm text-gray-500 min-w-0">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
          <span className="truncate flex-1">{provider.address.split(',')[0]}</span>
          {distanceMiles !== undefined && (
            <span className="shrink-0 text-xs text-gray-400 ml-auto">
              {distanceMiles < 0.1 ? '<0.1' : distanceMiles.toFixed(1)} mi
            </span>
          )}
        </div>

        {provider.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {provider.services.slice(0, 3).map(s => (
              <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {s}
              </span>
            ))}
            {provider.services.length > 3 && (
              <span className="text-xs text-gray-400">+{provider.services.length - 3} more</span>
            )}
          </div>
        )}

        {/* Contact row — stop propagation so clicks don't navigate */}
        <div className="flex items-center gap-3 mt-1 border-t border-gray-100 pt-2">
          {formattedPhone && (
            user ? (
              <a
                href={`tel:${provider.phone?.replace(/\D/g, '')}`}
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Phone className="w-3 h-3" />
                {formattedPhone}
              </a>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); openModal('phone') }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span className="blur-[4px] select-none">
                  {formattedPhone}
                </span>
              </button>
            )
          )}
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-green-600 ml-auto hover:text-green-800 transition-colors"
            >
              <Globe className="w-3 h-3" />
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}