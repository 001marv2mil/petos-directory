import { Navigate, useParams, Link } from 'react-router-dom'
import { CITIES, CATEGORIES } from '@/lib/constants'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { PageMeta } from '@/components/common/PageMeta'
import type { CategorySlug } from '@/types'
import {
  Stethoscope, AlertCircle, Scissors, Home, Sun, Award, Pill,
} from 'lucide-react'

const ICON_MAP: Record<CategorySlug, React.ReactNode> = {
  veterinarians:  <Stethoscope className="w-4 h-4" />,
  emergency_vets: <AlertCircle className="w-4 h-4" />,
  groomers:       <Scissors className="w-4 h-4" />,
  boarding:       <Home className="w-4 h-4" />,
  daycare:        <Sun className="w-4 h-4" />,
  trainers:       <Award className="w-4 h-4" />,
  pet_pharmacies: <Pill className="w-4 h-4" />,
}

export default function StatePage() {
  const { state: stateSlug } = useParams<{ state: string }>()

  const citiesInState = CITIES.filter(c => c.stateSlug === stateSlug)
  if (citiesInState.length === 0) return <Navigate to="/not-found" replace />

  const stateName = citiesInState[0].state
  const stateAbbr = citiesInState[0].stateAbbr

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <PageMeta
        title={`Pet Care in ${stateName}`}
        description={`Find veterinarians, groomers, boarding, daycare, and more across ${citiesInState.length} cities in ${stateName}. Browse real pet care listings with ratings and contact info.`}
        path={`/${stateSlug}`}
      />

      <Breadcrumbs items={[
        { label: stateName },
      ]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pet Care in {stateName}
        </h1>
        <p className="text-gray-500">
          Browse pet care providers across {citiesInState.length} cities in {stateName}.
        </p>
      </div>

      {/* Cities grid */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by City</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {citiesInState.map(city => (
            <Link
              key={city.citySlug}
              to={`/${city.stateSlug}/${city.citySlug}`}
              className="flex flex-col gap-1 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-sm transition-all"
            >
              <span className="font-semibold text-gray-800 text-sm">{city.city}</span>
              <span className="text-xs text-gray-400">{stateAbbr}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories quick links */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Service</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/search?category=${cat.slug}&state=${stateAbbr}`}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${cat.color} hover:shadow-sm transition-all text-sm font-medium`}
            >
              {ICON_MAP[cat.slug as CategorySlug]}
              {cat.pluralLabel}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
