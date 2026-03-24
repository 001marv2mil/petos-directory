import { Navigate, useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getCityMeta, CATEGORIES } from '@/lib/constants'
import { ProviderCard } from '@/components/providers/ProviderCard'
import { assignProviderImages } from '@/lib/images'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { PageMeta } from '@/components/common/PageMeta'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/common/JsonLd'
import { CitySeoCopy } from '@/components/seo/CitySeoCopy'
import { CityAlertBanner } from '@/components/common/CityAlertBanner'
import type { Provider, CategorySlug } from '@/types'
import {
  Stethoscope, AlertCircle, Scissors, Home, Sun, Award, Pill, ChevronRight,
} from 'lucide-react'

const ICON_MAP: Record<CategorySlug, React.ReactNode> = {
  veterinarians:  <Stethoscope className="w-5 h-5" />,
  emergency_vets: <AlertCircle className="w-5 h-5" />,
  groomers:       <Scissors className="w-5 h-5" />,
  boarding:       <Home className="w-5 h-5" />,
  daycare:        <Sun className="w-5 h-5" />,
  trainers:       <Award className="w-5 h-5" />,
  pet_pharmacies: <Pill className="w-5 h-5" />,
}

export default function CityPage() {
  const { state: stateParam, city: cityParam } = useParams<{ state: string; city: string }>()
  const cityMeta = getCityMeta(stateParam ?? '', cityParam ?? '')

  // meta handled by PageMeta below

  const { data: topProviders = [], isLoading } = useQuery({
    queryKey: ['city-top-providers', cityMeta?.city, cityMeta?.stateAbbr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .ilike('city', cityMeta!.city)
        .ilike('state', cityMeta!.stateAbbr)
        .order('rating', { ascending: false, nullsFirst: false })
        .order('review_count', { ascending: false })
        .limit(6)
      if (error) throw error
      return (data ?? []) as Provider[]
    },
    enabled: !!cityMeta,
    staleTime: 1000 * 60 * 10,
  })

  if (!cityMeta) return <Navigate to="/not-found" replace />

  return (
    <div>
      <PageMeta
        title={`Pet Care in ${cityMeta.city}, ${cityMeta.stateAbbr}`}
        description={`Find trusted veterinarians, groomers, pet boarding, dog daycare, trainers, and emergency vets in ${cityMeta.city}, ${cityMeta.state}. Browse real listings with ratings and reviews.`}
        path={`/${cityMeta.stateSlug}/${cityMeta.citySlug}`}
        image={cityMeta.heroImage}
      />
      <BreadcrumbJsonLd items={[
        { label: 'Home', href: '/' },
        { label: cityMeta.state, href: `/${cityMeta.stateSlug}` },
        { label: cityMeta.city },
      ]} />
      <FaqJsonLd faqs={[
        { q: `Where can I find a veterinarian in ${cityMeta.city}?`, a: `PetOS Directory lists verified veterinarians in ${cityMeta.city}, ${cityMeta.state} with ratings, hours, phone numbers, and addresses. Browse all vets at petosdirectory.com/${cityMeta.stateSlug}/${cityMeta.citySlug}/veterinarians.` },
        { q: `Are there emergency vets open 24/7 in ${cityMeta.city}?`, a: `Yes. PetOS Directory lists 24/7 emergency animal hospitals in ${cityMeta.city}, ${cityMeta.state}. Find them at petosdirectory.com/${cityMeta.stateSlug}/${cityMeta.citySlug}/emergency_vets.` },
        { q: `What pet grooming salons are in ${cityMeta.city}?`, a: `PetOS Directory has a complete list of pet groomers in ${cityMeta.city}, ${cityMeta.state} including hours, services offered, and customer ratings.` },
        { q: `Is there dog boarding or daycare in ${cityMeta.city}?`, a: `Yes. ${cityMeta.city} has multiple pet boarding facilities and dog daycare centers listed on PetOS Directory, each with verified contact information and reviews.` },
        { q: `How do I find the best-rated pet care in ${cityMeta.city}?`, a: `Filter by rating on PetOS Directory to see the top-rated vets, groomers, and boarding facilities in ${cityMeta.city}, ${cityMeta.state}.` },
      ]} />
      {/* City hero */}
      <div className="relative h-52 sm:h-64 overflow-hidden">
        <img
          src={cityMeta.heroImage}
          alt={cityMeta.city}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80&fit=crop'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Pet Care in {cityMeta.city}
          </h1>
          <p className="text-gray-200 mt-1">
            Find vets, groomers, boarding, and more in {cityMeta.city}, {cityMeta.stateAbbr}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: cityMeta.state, href: `/search?state=${cityMeta.stateAbbr}` },
          { label: cityMeta.city },
        ]} />

        {/* Alert signup banner */}
        <CityAlertBanner city={cityMeta.city} />

        {/* Category links */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Service</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/${cityMeta.stateSlug}/${cityMeta.citySlug}/${cat.slug}`}
                className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  {ICON_MAP[cat.slug as CategorySlug]}
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-green-700 transition-colors leading-tight">
                  {cat.pluralLabel}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Top providers */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top Rated in {cityMeta.city}</h2>
              <p className="text-gray-500 text-sm mt-0.5">Highest-rated pet care providers</p>
            </div>
            <Link
              to={`/search?city=${encodeURIComponent(cityMeta.city)}&state=${cityMeta.stateAbbr}`}
              className="flex items-center gap-1 text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : topProviders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const imgs = assignProviderImages(topProviders)
                return topProviders.map((provider, i) => (
                  <ProviderCard key={provider.id} provider={provider} precomputedImage={imgs[i]} />
                ))
              })()}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No providers listed in {cityMeta.city} yet.</p>
              <Link to="/search" className="text-green-600 text-sm font-medium hover:text-green-700 mt-2 inline-block">
                Browse all cities →
              </Link>
            </div>
          )}
        </section>
        <CitySeoCopy
          city={cityMeta.city}
          state={cityMeta.state}
          stateAbbr={cityMeta.stateAbbr}
          totalProviders={topProviders.length > 0 ? undefined : undefined}
        />
      </div>
    </div>
  )
}
