import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProviders } from '@/hooks/useProviders'
import { ProviderGrid } from '@/components/providers/ProviderGrid'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResultsMeta } from '@/components/search/SearchResultsMeta'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { PageMeta } from '@/components/common/PageMeta'
import { CITIES, CATEGORIES } from '@/lib/constants'
import { isOpenNow } from '@/lib/utils'
import type { CategorySlug, SortOption } from '@/types'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState<SortOption>('rating')
  const [openNowFilter, setOpenNowFilter] = useState(false)

  const cityParam = searchParams.get('city') ?? undefined
  const stateParam = searchParams.get('state') ?? undefined
  const categoryParam = (searchParams.get('category') as CategorySlug | null) ?? undefined
  const queryParam = searchParams.get('q') ?? undefined
  const zipParam = searchParams.get('zip') ?? undefined
  const pageParam = Number(searchParams.get('page') ?? 1)

  const hasSearch = !!(cityParam || stateParam || categoryParam || queryParam || zipParam)

  const { data, isLoading, isError } = useProviders({
    city: cityParam,
    state: stateParam,
    category: categoryParam,
    query: queryParam,
    zip: zipParam,
    sort,
    page: pageParam,
  })

  const cityMeta = CITIES.find(c => c.city === cityParam)
  const categoryMeta = CATEGORIES.find(c => c.slug === categoryParam)

  const pageTitle = categoryMeta && cityParam
    ? `${categoryMeta.pluralLabel} in ${cityParam}`
    : categoryMeta
    ? categoryMeta.pluralLabel
    : queryParam
    ? `Results for "${queryParam}"`
    : 'Find Pet Services'

  const filteredProviders = openNowFilter
    ? (data?.providers ?? []).filter(p => isOpenNow(p.hours))
    : (data?.providers ?? [])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageMeta
        title={pageTitle}
        description={`Search for ${categoryMeta?.pluralLabel.toLowerCase() ?? 'pet services'}${cityParam ? ` in ${cityParam}` : ''} — browse real listings with ratings, hours, and contact info.`}
        path="/search"
      />

      <Breadcrumbs items={[{ label: 'Search' }]} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
        <SearchBar
          variant="inline"
          initialCity={cityParam ?? ''}
          initialCategory={categoryParam ?? ''}
          initialQuery={queryParam ?? ''}
        />
      </div>

      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          Failed to load results. Please try again.
        </div>
      )}

      {/* Empty state */}
      {!hasSearch && (
        <div className="pt-4 space-y-8">
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-3">Browse by Service</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/search?category=${cat.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  {cat.pluralLabel}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-3">Popular Cities</h2>
            <div className="flex flex-wrap gap-2">
              {CITIES.slice(0, 20).map(city => (
                <Link
                  key={city.citySlug + city.stateSlug}
                  to={`/${city.stateSlug}/${city.citySlug}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                >
                  {city.city}
                  <span className="text-gray-400 text-xs">{city.stateAbbr}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearch && (
        <>
          {/* Sort + Open Now bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpenNowFilter(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                openNowFilter
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-green-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${openNowFilter ? 'bg-white' : 'bg-green-500'}`} />
              Open Now
            </button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Top Rated</option>
                <option value="review_count">Most Reviewed</option>
                <option value="name">A–Z</option>
              </select>
            </div>
          </div>

          {data && (
            <SearchResultsMeta
              total={openNowFilter ? filteredProviders.length : data.total}
              fallbackMode={data.fallbackMode}
              cityName={cityParam}
              stateName={cityMeta?.state ?? stateParam}
              categoryLabel={categoryMeta?.pluralLabel}
            />
          )}

          <ProviderGrid providers={filteredProviders} loading={isLoading} />

          {data && data.total > 24 && !openNowFilter && (
            <div className="flex justify-center gap-2 pt-4">
              {pageParam > 1 && (
                <button
                  onClick={() => handlePageChange(pageParam - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              <span className="px-4 py-2 text-sm text-gray-500 flex items-center">
                Page {pageParam} of {Math.ceil(data.total / 24)}
              </span>
              {data.hasMore && (
                <button
                  onClick={() => handlePageChange(pageParam + 1)}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg text-sm hover:bg-blue-900 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
