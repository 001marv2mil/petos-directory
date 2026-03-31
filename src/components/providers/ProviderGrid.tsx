import type { Provider } from '@/types'
import { ProviderCard } from './ProviderCard'
import { assignProviderImages } from '@/lib/images'
import { haversineDistance } from '@/lib/utils'

interface ProviderGridProps {
  providers: Provider[]
  loading?: boolean
  refLat?: number
  refLng?: number
}

export function ProviderGrid({ providers, loading = false, refLat, refLng }: ProviderGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-44 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold text-gray-900 mb-2">No listings found</p>
        <p className="text-sm text-gray-500">Try a different location or category, or check back soon.</p>
      </div>
    )
  }

  const images = assignProviderImages(providers)
  const hasRef = refLat !== undefined && refLng !== undefined

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {providers.map((p, i) => {
        const distanceMiles =
          hasRef && p.lat !== null && p.lng !== null
            ? haversineDistance(refLat!, refLng!, p.lat, p.lng)
            : undefined
        return (
          <ProviderCard
            key={p.id}
            provider={p}
            precomputedImage={images[i]}
            distanceMiles={distanceMiles}
          />
        )
      })}
    </div>
  )
}
