import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'
import { CITIES, CATEGORIES } from '@/lib/constants'

export function Footer() {
  const col1Cities = CITIES.slice(0, 12)
  const col2Cities = CITIES.slice(12, 24)

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">PetOS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Find trusted veterinarians, groomers, boarding, and more for your pets across the US.
            </p>
            <p className="text-xs text-gray-500">
              {CITIES.length} cities · 7 categories
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Services</h3>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link
                    to={`/search?category=${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.pluralLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities col 1 */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Popular Cities</h3>
            <ul className="space-y-2">
              {col1Cities.map(city => (
                <li key={city.citySlug}>
                  <Link
                    to={`/${city.stateSlug}/${city.citySlug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {city.city}, {city.stateAbbr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities col 2 */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">More Cities</h3>
            <ul className="space-y-2">
              {col2Cities.map(city => (
                <li key={city.citySlug}>
                  <Link
                    to={`/${city.stateSlug}/${city.citySlug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {city.city}, {city.stateAbbr}
                  </Link>
                </li>
              ))}
              {CITIES.length > 24 && (
                <li>
                  <Link to="/search" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    + {CITIES.length - 24} more cities →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PetOS Directory. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
