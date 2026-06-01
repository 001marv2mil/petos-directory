import { CITIES } from '@/lib/constants'
import { CITY_COORDS } from '@/lib/cityCoords'
import { haversineDistance } from '@/lib/utils'
import type { CityMeta } from '@/types'

export interface NearbyCity {
  cityMeta: CityMeta
  miles: number
}

const MAX_RADIUS_MILES = 150
const cache = new Map<string, NearbyCity[]>()

export function getNearbyCities(citySlug: string, limit = 6): NearbyCity[] {
  const cached = cache.get(citySlug)
  if (cached) return cached.slice(0, limit)

  const source = CITY_COORDS[citySlug]
  if (!source) {
    cache.set(citySlug, [])
    return []
  }

  const sourceCity = CITIES.find(c => c.citySlug === citySlug)

  const ranked = CITIES
    .filter(c => c.citySlug !== citySlug)
    .filter(c => !sourceCity || c.city !== sourceCity.city)
    .map(c => {
      const coords = CITY_COORDS[c.citySlug]
      if (!coords) return null
      const miles = haversineDistance(source.lat, source.lng, coords.lat, coords.lng)
      if (miles > MAX_RADIUS_MILES) return null
      return { cityMeta: c, miles }
    })
    .filter((x): x is NearbyCity => x !== null)
    .sort((a, b) => a.miles - b.miles)

  cache.set(citySlug, ranked)
  return ranked.slice(0, limit)
}
