import { Navigate, useParams } from 'react-router-dom'
import { useProviders } from '@/hooks/useProviders'
import { ProviderGrid } from '@/components/providers/ProviderGrid'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResultsMeta } from '@/components/search/SearchResultsMeta'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { CategoryTabs } from '@/components/navigation/CategoryTabs'
import { getCityMeta, getCategoryMeta } from '@/lib/constants'
import { getCategoryBannerImage } from '@/lib/images'
import { PageMeta } from '@/components/common/PageMeta'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/common/JsonLd'
import { CategorySeoCopy } from '@/components/seo/CategorySeoCopy'
import { CityAlertBanner } from '@/components/common/CityAlertBanner'
import { isOpenNow } from '@/lib/utils'
import type { CategorySlug, SortOption } from '@/types'
import { useState } from 'react'

export default function CategoryPage() {
  const { state: stateParam, city: cityParam, category: categoryParam } = useParams<{
    state: string
    city: string
    category: string
  }>()

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortOption>('rating')
  const [openNowFilter, setOpenNowFilter] = useState(false)

  const cityMeta = getCityMeta(stateParam ?? '', cityParam ?? '')
  const categoryMeta = getCategoryMeta(categoryParam ?? '')

  // 404 on unknown route params
  if (!cityMeta || !categoryMeta) {
    return <Navigate to="/not-found" replace />
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading } = useProviders({
    city: cityMeta.city,
    state: cityMeta.stateAbbr,
    category: categoryMeta.slug as CategorySlug,
    sort,
    page,
  })

  const filteredProviders = openNowFilter
    ? (data?.providers ?? []).filter(p => isOpenNow(p.hours))
    : (data?.providers ?? [])

  const bannerImage = getCategoryBannerImage(categoryMeta.slug as CategorySlug)

  return (
    <div>
      <PageMeta
        title={`${categoryMeta.pluralLabel} in ${cityMeta.city}, ${cityMeta.stateAbbr}`}
        description={`Find the best ${categoryMeta.pluralLabel.toLowerCase()} in ${cityMeta.city}, ${cityMeta.state}. Browse ${data?.total ?? 'local'} listings with real ratings, hours, and contact info.`}
        path={`/${cityMeta.stateSlug}/${cityMeta.citySlug}/${categoryMeta.slug}`}
      />
      <BreadcrumbJsonLd items={[
        { label: 'Home', href: '/' },
        { label: cityMeta.state, href: `/${cityMeta.stateSlug}` },
        { label: cityMeta.city, href: `/${cityMeta.stateSlug}/${cityMeta.citySlug}` },
        { label: categoryMeta.pluralLabel },
      ]} />
      {filteredProviders.length > 0 && (
        <ItemListJsonLd items={filteredProviders.slice(0, 10).map(p => ({
          name: p.business_name,
          url: `/provider/${p.slug}`,
          description: p.description ?? `${categoryMeta.label} in ${cityMeta.city}, ${cityMeta.state}`,
          image: p.hero_image ?? undefined,
        }))} />
      )}
      {/* Banner */}
      <div
        className="relative bg-gray-800 h-40 sm:h-48 flex items-end"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {categoryMeta.pluralLabel} in {cityMeta.city}, {cityMeta.stateAbbr}
          </h1>
          <p className="text-gray-200 text-sm mt-1">{categoryMeta.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: cityMeta.state, href: `/search?state=${cityMeta.stateAbbr}` },
          { label: cityMeta.city, href: `/${cityMeta.stateSlug}/${cityMeta.citySlug}` },
          { label: categoryMeta.pluralLabel },
        ]} />

        {/* Category tabs */}
        <CategoryTabs
          stateSlug={cityMeta.stateSlug}
          citySlug={cityMeta.citySlug}
          activeCategory={categoryMeta.slug}
        />

        {/* Quick search */}
        <SearchBar
          variant="inline"
          initialCity={cityMeta.city}
          initialCategory={categoryMeta.slug}
        />

        {/* Alert signup banner */}
        <CityAlertBanner city={cityMeta.city} category={categoryMeta.pluralLabel} />

        {/* Sort + Filter bar */}
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
              onChange={e => { setSort(e.target.value as SortOption); setPage(1) }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Top Rated</option>
              <option value="review_count">Most Reviewed</option>
              <option value="name">A–Z</option>
            </select>
          </div>
        </div>

        {/* Results meta */}
        {data && (
          <SearchResultsMeta
            total={openNowFilter ? filteredProviders.length : data.total}
            fallbackMode={data.fallbackMode}
            cityName={cityMeta.city}
            stateName={cityMeta.state}
            categoryLabel={categoryMeta.pluralLabel}
          />
        )}

        {/* Grid */}
        <ProviderGrid providers={filteredProviders} loading={isLoading} />

        {/* Pagination */}
        {data && data.total > 24 && (
          <div className="flex justify-center gap-2 pt-2">
            {page > 1 && (
              <button
                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            <span className="px-4 py-2 text-sm text-gray-500 flex items-center">
              Page {page} of {Math.ceil(data.total / 24)}
            </span>
            {data.hasMore && (
              <button
                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        )}

        <CategorySeoCopy
          categoryLabel={categoryMeta.label}
          categoryPluralLabel={categoryMeta.pluralLabel}
          categoryDescription={categoryMeta.description}
          city={cityMeta.city}
          state={cityMeta.state}
          stateAbbr={cityMeta.stateAbbr}
          total={data?.total}
        />
      </div>
    </div>
  )
}
