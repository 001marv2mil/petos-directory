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
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recently Viewed</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.map(item => {
            const categoryMeta = CATEGORIES.find(c => c.slug === item.category)
            const img = getProviderImage(item.image, item.category as CategorySlug, item.slug)
            return (
              <Link
                key={item.slug}
                to={`/provider/${item.slug}`}
                className="shrink-0 flex items-center gap-3 bg-stone-50 rounded-2xl px-4 py-3 hover:bg-stone-100 hover:shadow-sm transition-all group"
              >
                <img
                  src={img}
                  alt={item.name}
                  className="w-11 h-11 rounded-xl object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80&fit=crop'
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors truncate max-w-[160px]">
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
      </div>
    </section>
  )
}
