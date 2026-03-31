import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'
import { CITIES, CATEGORIES } from '@/lib/constants'

const TOP_CITIES = [
  { city: 'Tampa', stateAbbr: 'FL', path: '/florida/tampa' },
  { city: 'Austin', stateAbbr: 'TX', path: '/texas/austin' },
  { city: 'Denver', stateAbbr: 'CO', path: '/colorado/denver' },
  { city: 'Atlanta', stateAbbr: 'GA', path: '/georgia/atlanta' },
  { city: 'Seattle', stateAbbr: 'WA', path: '/washington/seattle' },
  { city: 'Miami', stateAbbr: 'FL', path: '/florida/miami' },
  { city: 'Phoenix', stateAbbr: 'AZ', path: '/arizona/phoenix' },
  { city: 'Chicago', stateAbbr: 'IL', path: '/illinois/chicago' },
  { city: 'Los Angeles', stateAbbr: 'CA', path: '/california/los-angeles' },
  { city: 'Nashville', stateAbbr: 'TN', path: '/tennessee/nashville' },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">PetOS Directory</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Find trusted veterinarians, groomers, boarding, and more for your pets. Real listings across {CITIES.length}+ cities nationwide.
            </p>
            <p className="text-xs text-gray-500">{CITIES.length} cities · 7 service categories</p>
          </div>

          {/* Services */}
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
              <li>
                <Link
                  to="/calculator"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Pet Cost Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Popular Cities</h3>
            <ul className="space-y-2">
              {TOP_CITIES.map(city => (
                <li key={city.path}>
                  <Link
                    to={city.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {city.city}, {city.stateAbbr}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/search" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Browse all cities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About PetOS
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Browse Directory
                </Link>
              </li>
              <li>
                <a
                  href="https://petoshealth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  PetOS Health ↗
                </a>
              </li>
            </ul>
            <div className="mt-5 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-2">Own a pet business?</p>
              <Link
                to="/search"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                List your business →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} PetOS Directory. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
            <Link to="/about" className="hover:text-gray-300 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
