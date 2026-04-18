import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useRecentlyViewed, type RecentItem } from '@/hooks/useRecentlyViewed'
import { getProviderImage } from '@/lib/images'
import { CATEGORIES } from '@/lib/constants'
import type { CategorySlug } from '@/types'

export function RecentlyViewed() {
  const { getAll } = useRecentlyViewed()
  const [items, setItems] = useState<RecentItem[]>([])

  useEffect(() => {
    setItems(getAll())
  }, [])

  if (items.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recently Viewed</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {items.map(item => {
          const categoryMeta = CATEGORIES.find(c => c.slug === item.category)
          const img = getProviderImage(item.image, item.category as CategorySlug, item.slug)
          return (
            <Link
              key={item.slug}
              to={`/provider/${item.slug}`}
              className="shrink-0 flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <img
                src={img}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80&fit=crop'
                }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors truncate max-w-[140px]">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {categoryMeta?.label ?? item.category} · {item.city}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
