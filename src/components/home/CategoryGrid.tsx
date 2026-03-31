import { Link } from 'react-router-dom'
import { CATEGORIES } from '@/lib/constants'
import type { CategorySlug } from '@/types'

const CATEGORY_IMAGES: Record<CategorySlug, string> = {
  veterinarians: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&fit=crop',
  emergency_vets: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80&fit=crop',
  groomers: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80&fit=crop',
  boarding: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop',
  daycare: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400&q=80&fit=crop',
  trainers: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&q=80&fit=crop',
  pet_pharmacies: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80&fit=crop',
}

const CATEGORY_LABELS: Record<CategorySlug, string> = {
  veterinarians: 'Veterinarians',
  emergency_vets: 'Emergency Vets',
  groomers: 'Groomers',
  boarding: 'Pet Boarding',
  daycare: 'Pet Daycare',
  trainers: 'Pet Trainers',
  pet_pharmacies: 'Pet Pharmacies',
}

export function CategoryGrid() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find What You Need</h2>
          <p className="text-sm text-gray-500">Local vets, groomers, boarding, and more</p>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/search?category=${cat.slug}`}
              className="group flex flex-col items-center bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 text-center"
            >
              <div className="w-full h-36 overflow-hidden bg-gray-100">
                <img
                  src={CATEGORY_IMAGES[cat.slug]}
                  alt={CATEGORY_LABELS[cat.slug]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="py-4 px-2">
                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {CATEGORY_LABELS[cat.slug]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
