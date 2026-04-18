import { Link, useParams } from 'react-router-dom'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CategoryTabsProps {
  stateSlug: string
  citySlug: string
  activeCategory: string
}

export function CategoryTabs({ stateSlug, citySlug, activeCategory }: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 min-w-max pb-1">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            to={`/${stateSlug}/${citySlug}/${cat.slug}`}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeCategory === cat.slug
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:text-blue-700 hover:bg-blue-50'
            )}
          >
            {cat.pluralLabel}
          </Link>
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function _useParamsForCategoryTabs() {
  // Helper hook used by CategoryPage to pass props to CategoryTabs
  return useParams<{ state: string; city: string; category: string }>()
}
