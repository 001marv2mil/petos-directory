import { Navigate, useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getCityMeta, getCategoryMeta, CATEGORIES } from '@/lib/constants'
import { PageMeta } from '@/components/common/PageMeta'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/common/JsonLd'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { getProviderImage } from '@/lib/images'
import type { Provider } from '@/types'
import { Star, MapPin, Phone, ExternalLink, Clock, ChevronRight } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{rating}</span>
      <span className="text-sm text-gray-500">({count} reviews)</span>
    </div>
  )
}

export default function BestOfPage() {
  const {
    state: stateParam,
    city: cityParam,
    category: catParam,
  } = useParams<{ state: string; city: string; category: string }>()

  const cityMeta = getCityMeta(stateParam ?? '', cityParam ?? '')
  const catMeta = getCategoryMeta(catParam ?? '')

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['best-of', cityMeta?.city, cityMeta?.stateAbbr, catParam],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .ilike('city', cityMeta!.city)
        .ilike('state', cityMeta!.stateAbbr)
        .eq('category', catParam!)
        .not('description', 'is', null)
        .order('rating', { ascending: false, nullsFirst: false })
        .order('review_count', { ascending: false, nullsFirst: false })
        .limit(10)
      if (error) throw error
      return (data ?? []) as Provider[]
    },
    enabled: !!cityMeta && !!catParam,
    staleTime: 1000 * 60 * 10,
  })

  if (!cityMeta || !catMeta) return <Navigate to="/not-found" replace />

  const title = `Best ${catMeta.pluralLabel} in ${cityMeta.city}, ${cityMeta.stateAbbr} (${CURRENT_YEAR})`
  const path = `/${cityMeta.stateSlug}/${cityMeta.citySlug}/best/${catMeta.slug}`
  const catPagePath = `/${cityMeta.stateSlug}/${cityMeta.citySlug}/${catMeta.slug}`

  // Other categories in this city for internal linking
  const otherCategories = CATEGORIES.filter(c => c.slug !== catMeta.slug)

  return (
    <div>
      <PageMeta
        title={title}
        description={`Looking for the best ${catMeta.pluralLabel.toLowerCase()} in ${cityMeta.city}? We ranked the top ${Math.min(providers.length, 10)} ${catMeta.pluralLabel.toLowerCase()} based on ratings, reviews, and trust signals. Updated for ${CURRENT_YEAR}.`}
        path={path}
      />
      <BreadcrumbJsonLd items={[
        { label: 'Home', href: '/' },
        { label: cityMeta.state, href: `/${cityMeta.stateSlug}` },
        { label: cityMeta.city, href: `/${cityMeta.stateSlug}/${cityMeta.citySlug}` },
        { label: catMeta.pluralLabel, href: catPagePath },
        { label: `Best ${catMeta.pluralLabel}` },
      ]} />
      {providers.length > 0 && (
        <ItemListJsonLd
          items={providers.map(p => ({
            name: p.business_name,
            url: `https://petosdirectory.com/provider/${p.slug}`,
            image: getProviderImage(p.hero_image, p.category, p.slug),
            address: `${p.address}, ${p.city}, ${p.state}`,
            rating: p.rating ?? undefined,
            reviewCount: p.review_count ?? undefined,
            telephone: p.phone ?? undefined,
          }))}
        />
      )}

      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: cityMeta.state, href: `/${cityMeta.stateSlug}` },
        { label: cityMeta.city, href: `/${cityMeta.stateSlug}/${cityMeta.citySlug}` },
        { label: catMeta.pluralLabel, href: catPagePath },
        { label: `Best ${catMeta.pluralLabel}` },
      ]} />

      {/* Article header */}
      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8">
          <p className="text-sm font-medium text-green-600 mb-2">
            {cityMeta.city} Guide &middot; Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {providers.length > 0 ? providers.length : 10} Best {catMeta.pluralLabel} in {cityMeta.city}, {cityMeta.stateAbbr} ({CURRENT_YEAR})
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Finding the right {catMeta.label.toLowerCase()} for your pet matters.
            We reviewed every {catMeta.label.toLowerCase()} in {cityMeta.city} and ranked
            them by Google ratings, review volume, and verified business information.
            Here are the top picks trusted by pet owners in {cityMeta.city}.
          </p>
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-48" />
            ))}
          </div>
        )}

        {/* Provider list */}
        {!isLoading && providers.length > 0 && (
          <div className="space-y-6">
            {providers.map((p, i) => {
              const img = getProviderImage(p.hero_image, p.category, p.slug)
              return (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                      <img
                        src={img}
                        alt={p.business_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                            {i + 1}
                          </span>
                          <Link
                            to={`/provider/${p.slug}`}
                            className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors"
                          >
                            {p.business_name}
                          </Link>
                        </div>
                      </div>

                      {p.rating !== null && p.review_count !== null && (
                        <div className="mb-3">
                          <StarRating rating={p.rating} count={p.review_count} />
                        </div>
                      )}

                      {p.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {p.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {p.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {p.address}, {p.city}
                          </span>
                        )}
                        {p.phone && (
                          <a href={`tel:${p.phone}`} className="flex items-center gap-1 hover:text-green-600">
                            <Phone className="w-3.5 h-3.5" />
                            {p.phone}
                          </a>
                        )}
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/provider/${p.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          View full listing <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && providers.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-4">
              We're still building our list of {catMeta.pluralLabel.toLowerCase()} in {cityMeta.city}.
            </p>
            <Link to={catPagePath} className="text-green-600 font-medium hover:underline">
              Browse all {catMeta.pluralLabel.toLowerCase()} in {cityMeta.city} &rarr;
            </Link>
          </div>
        )}

        {/* How we ranked section */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How we ranked the best {catMeta.pluralLabel.toLowerCase()} in {cityMeta.city}
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Every {catMeta.label.toLowerCase()} on this list is a real, verified business
            in {cityMeta.city}, {cityMeta.stateAbbr}. We don't accept paid placements
            in our rankings. Our ranking factors include:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span><strong>Google rating</strong> - Average star rating from real customer reviews</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span><strong>Review volume</strong> - More reviews signal more pet owners trust them</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span><strong>Complete information</strong> - Businesses with full profiles (hours, phone, photos) rank higher</span>
            </li>
          </ul>
        </section>

        {/* Related categories */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            More pet services in {cityMeta.city}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherCategories.map(cat => (
              <Link
                key={cat.slug}
                to={`/${cityMeta.stateSlug}/${cityMeta.citySlug}/best/${cat.slug}`}
                className="bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-lg p-3 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors"
              >
                Best {cat.pluralLabel}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Own a {catMeta.label.toLowerCase()} in {cityMeta.city}?
          </h2>
          <p className="text-gray-600 mb-4">
            Claim your free listing to update your hours, add photos, and reach more pet owners.
          </p>
          <Link
            to={catPagePath}
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Find your listing
          </Link>
        </section>
      </article>
    </div>
  )
}
