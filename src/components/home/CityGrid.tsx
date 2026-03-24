import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { CITIES } from '@/lib/constants'

export function CityGrid() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Browse by City</h2>
          </div>
          <span className="text-sm text-gray-400">{CITIES.length} cities</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CITIES.map(city => (
            <Link
              key={city.citySlug}
              to={`/${city.stateSlug}/${city.citySlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              {city.city}
              <span className="text-gray-400 text-xs">{city.stateAbbr}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
