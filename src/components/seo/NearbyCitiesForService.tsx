import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { getNearbyCities } from '@/lib/nearbyCities'
import type { CategoryMeta, CityMeta } from '@/types'

interface Props {
  cityMeta: CityMeta
  categoryMeta: CategoryMeta
}

export function NearbyCitiesForService({ cityMeta, categoryMeta }: Props) {
  const nearby = getNearbyCities(cityMeta.citySlug, 6)
  if (nearby.length === 0) return null

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        {categoryMeta.pluralLabel} near {cityMeta.city}
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Expand your search to nearby cities in {cityMeta.state}.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearby.map(({ cityMeta: nearbyCity, miles }) => (
          <Link
            key={`${nearbyCity.stateSlug}-${nearbyCity.citySlug}`}
            to={`/${nearbyCity.stateSlug}/${nearbyCity.citySlug}/best/${categoryMeta.slug}`}
            className="group block bg-white border border-gray-200 hover:border-green-300 hover:shadow-md rounded-xl overflow-hidden transition-all"
          >
            <div className="relative h-28 bg-gray-100 overflow-hidden">
              <img
                src={nearbyCity.heroImage}
                alt={`${nearbyCity.city} skyline`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm">
                <MapPin className="w-3 h-3" />
                {Math.round(miles)} mi
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                Best {categoryMeta.pluralLabel}
              </div>
              <div className="text-sm text-gray-500">
                {nearbyCity.city}, {nearbyCity.stateAbbr}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
