import { Link } from 'react-router-dom'
import { Stethoscope, AlertCircle, Scissors, Home, Sun, Award, Pill } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import type { CategorySlug } from '@/types'

const CATEGORY_ICONS: Record<CategorySlug, React.ReactNode> = {
  veterinarians: <Stethoscope className="w-6 h-6" />,
  emergency_vets: <AlertCircle className="w-6 h-6" />,
  groomers: <Scissors className="w-6 h-6" />,
  boarding: <Home className="w-6 h-6" />,
  daycare: <Sun className="w-6 h-6" />,
  trainers: <Award className="w-6 h-6" />,
  pet_pharmacies: <Pill className="w-6 h-6" />,
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

export function CategoryGrid() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Routine care or an emergency?
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            Two questions, two answers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/search?category=${cat.slug}`}
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${CATEGORY_COLORS[cat.slug]}`}>
                {CATEGORY_ICONS[cat.slug]}
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 leading-tight">
                  {cat.pluralLabel}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {cat.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
