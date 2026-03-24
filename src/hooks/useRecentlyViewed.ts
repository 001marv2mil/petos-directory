import { useCallback } from 'react'

const KEY = 'petos_recently_viewed'
const MAX = 5

export interface RecentItem {
  slug: string
  name: string
  category: string
  city: string
  image: string | null
}

function readStorage(): RecentItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useRecentlyViewed() {
  const add = useCallback((item: RecentItem) => {
    const current = readStorage().filter(r => r.slug !== item.slug)
    const updated = [item, ...current].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }, [])

  return { add, getAll: readStorage }
}
