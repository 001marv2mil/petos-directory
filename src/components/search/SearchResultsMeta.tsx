import { AlertCircle } from 'lucide-react'
import type { FallbackMode } from '@/types'

interface SearchResultsMetaProps {
  total: number
  fallbackMode: FallbackMode
  cityName?: string
  stateName?: string
  categoryLabel?: string
}

export function SearchResultsMeta({
  total,
  fallbackMode,
  cityName,
  stateName,
  categoryLabel,
}: SearchResultsMetaProps) {
  if (fallbackMode === 'nearby_city' || fallbackMode === 'broader') {
    return (
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          {fallbackMode === 'nearby_city'
            ? `Limited results in ${cityName ?? 'this city'}. Showing nearby providers in ${stateName ?? 'the area'}.`
            : `No exact results found. Showing top-rated ${categoryLabel ?? 'providers'} in ${stateName ?? 'the area'}.`
          }
        </span>
      </div>
    )
  }

  return (
    <p className="text-sm text-gray-500">
      {total} provider{total !== 1 ? 's' : ''} found
      {cityName ? ` in ${cityName}` : ''}
      {stateName && !cityName ? ` in ${stateName}` : ''}
    </p>
  )
}
