import { Link } from 'react-router-dom'
import { Stethoscope, AlertCircle, Scissors, Home, Sun, Award, Pill } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import type { CategorySlug, CityMeta } from '@/types'

const CATEGORY_ICONS: Record<CategorySlug, React.ReactNode> = {
  veterinarians: <Stethoscope className="w-5 h-5" />,
  emergency_vets: <AlertCircle className="w-5 h-5" />,
  groomers: <Scissors className="w-5 h-5" />,
  boarding: <Home className="w-5 h-5" />,
  daycare: <Sun className="w-5 h-5" />,
  trainers: <Award className="w-5 h-5" />,
  pet_pharmacies: <Pill className="w-5 h-5" />,
}

const CATEGORY_COLORS: Record<CategorySlug, string> = {
  veterinarians: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100',
  emergency_vets: 'bg-red-50 text-red-600 group-hover:bg-red-100',
  groomers: 'bg-pink-50 text-pink-600 group-hover:bg-pink-100',
  boarding: 'bg-amber-50 text-amber-700 group-hover:bg-amber-100',
  daycare: 'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
  trainers: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100',
  pet_pharmacies: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100',
}

interface Props {
  cityMeta: CityMeta
  currentCategorySlug: CategorySlug
}

export function OtherServicesInCity({ cityMeta, currentCategorySlug }: Props) {
  const others = CATEGORIES.filter(c => c.slug !== currentCategorySlug)

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        More pet services in {cityMeta.city}
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Trusted local providers across every category.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {others.map(cat => (
          <Link
            key={cat.slug}
            to={`/${cityMeta.stateSlug}/${cityMeta.citySlug}/best/${cat.slug}`}
            className="group flex items-center gap-3 bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm rounded-xl p-4 transition-all"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${CATEGORY_COLORS[cat.slug]}`}>
              {CATEGORY_ICONS[cat.slug]}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                Best {cat.pluralLabel}
              </div>
              <div className="text-xs text-gray-500 truncate">
                in {cityMeta.city}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
