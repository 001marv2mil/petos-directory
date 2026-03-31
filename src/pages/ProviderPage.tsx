import { useParams, Navigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useProvider } from '@/hooks/useProvider'
import { useNearbyProviders } from '@/hooks/useNearbyProviders'
import { ProviderMap } from '@/components/providers/ProviderMap'
import { ProviderHours } from '@/components/providers/ProviderHours'
import { NearbyProviders } from '@/components/providers/NearbyProviders'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { PageMeta } from '@/components/common/PageMeta'
import { BreadcrumbJsonLd } from '@/components/common/JsonLd'
import { getProviderImage } from '@/lib/images'
import { formatPhone } from '@/lib/utils'
import { CATEGORIES, CITIES } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import { useFavorite } from '@/hooks/useFavorite'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import type { CategorySlug } from '@/types'
import {
  Star, Phone, Globe, MapPin, Shield, AlertCircle,
  Clock, ChevronRight, ExternalLink, Share2, Lock, Heart, Navigation, Check, Copy,
} from 'lucide-react'

function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.931-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${cls} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  )
}

export default function ProviderPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: provider, isLoading, isError } = useProvider(slug ?? '')
  const { data: nearby = [] } = useNearbyProviders(provider)
  const { user, openModal } = useAuth()
  const { isFavorited, toggle: toggleFavorite } = useFavorite(provider?.id ?? '')
  const [igCopied, setIgCopied] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const { add: addRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    if (!provider) return
    addRecentlyViewed({
      slug: provider.slug,
      name: provider.business_name,
      category: provider.category,
      city: provider.city,
      image: provider.hero_image,
    })
  }, [provider?.slug])

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-64" />
        <div className="h-72 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (isError || !provider) return <Navigate to="/not-found" replace />

  const img = getProviderImage(provider.hero_image, provider.category, provider.slug)
  const categoryMeta = CATEGORIES.find(c => c.slug === provider.category)
  const cityMeta = CITIES.find(c =>
    c.city.toLowerCase() === provider.city.toLowerCase() &&
    c.stateAbbr.toLowerCase() === provider.state.toLowerCase()
  )
  const isGoogleListed = provider.source === 'google_places'

  const pageUrl = `https://petоs.directory/provider/${provider.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: provider.business_name,
    description: provider.description ?? undefined,
    image: img,
    url: provider.website ?? undefined,
    telephone: provider.phone ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: provider.address,
      addressLocality: provider.city,
      addressRegion: provider.state,
      postalCode: provider.zip ?? undefined,
      addressCountry: 'US',
    },
    ...(provider.rating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: provider.rating,
        reviewCount: provider.review_count,
        bestRating: 5,
      },
    }),
    ...(provider.lat && provider.lng && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: provider.lat,
        longitude: provider.lng,
      },
    }),
  }

  const shareText = `${provider.business_name} — ${provider.city}, ${provider.state} | PetOS Directory`

  const viralCardText = `⭐ I found ${provider.business_name} on PetOS Directory\n📍 ${provider.city}, ${provider.state}\n🐾 ${categoryMeta?.label ?? provider.category}\nFind trusted pet services → petosdirectory.com`

  const handleViralShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${provider.business_name} on PetOS Directory`,
          text: viralCardText,
          url: pageUrl,
        })
        return
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(viralCardText)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2500)
    } catch {
      // ignore clipboard errors
    }
  }

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: shareText, url: pageUrl })
    } else {
      navigator.clipboard.writeText(pageUrl)
    }
  }

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(pageUrl)
    setIgCopied(true)
    setTimeout(() => setIgCopied(false), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageMeta
        title={`${provider.business_name} — ${provider.city}, ${provider.state}`}
        description={provider.description ?? `Find hours, phone number, address, and reviews for ${provider.business_name} in ${provider.city}, ${provider.state}.`}
        image={img}
        path={`/provider/${provider.slug}`}
        type="website"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd items={[
        { label: 'Home', href: '/' },
        ...(cityMeta ? [{ label: cityMeta.state, href: `/${cityMeta.stateSlug}` }] : []),
        ...(cityMeta ? [{ label: provider.city, href: `/${cityMeta.stateSlug}/${cityMeta.citySlug}` }] : []),
        ...(categoryMeta && cityMeta ? [{ label: categoryMeta.pluralLabel, href: `/${cityMeta.stateSlug}/${cityMeta.citySlug}/${provider.category}` }] : []),
        { label: provider.business_name },
      ]} />

      <Breadcrumbs items={[
        cityMeta
          ? { label: provider.city, href: `/${cityMeta.stateSlug}/${cityMeta.citySlug}` }
          : { label: provider.city },
        categoryMeta && cityMeta
          ? { label: categoryMeta.pluralLabel, href: `/${cityMeta.stateSlug}/${cityMeta.citySlug}/${provider.category}` }
          : { label: categoryMeta?.pluralLabel ?? 'Provider' },
        { label: provider.business_name },
      ]} />

      {/* Hero image */}
      <div className="relative h-56 sm:h-80 rounded-2xl overflow-hidden bg-gray-200">
        <img
          src={img}
          alt={provider.business_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80&fit=crop'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {categoryMeta && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
              {categoryMeta.label}
            </span>
          )}
          {provider.emergency && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" />
              24/7 Emergency
            </span>
          )}
          {isGoogleListed && (
            <span className="flex items-center gap-1 bg-blue-700 text-white text-sm font-semibold px-3 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              Google Listed
            </span>
          )}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: main info */}
        <div className="lg:col-span-2 space-y-8">

          {/* Name + rating */}
          <div className="pb-6 border-b border-gray-100">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {provider.business_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {provider.rating !== null && (
                <div className="flex items-center gap-1.5">
                  <StarRating rating={provider.rating} />
                  <span className="font-semibold text-gray-900">{provider.rating.toFixed(1)}</span>
                  <span>({provider.review_count.toLocaleString()} reviews)</span>
                </div>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {provider.city}, {provider.state}
              </span>
            </div>
          </div>

          {/* About */}
          {provider.description && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-gray-600 leading-relaxed">{provider.description}</p>
            </div>
          )}

          {/* Services */}
          {provider.services.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {provider.services.map(service => (
                  <span
                    key={service}
                    className="bg-blue-50 text-blue-800 border border-blue-100 text-sm px-3 py-1 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hours */}
          {provider.hours && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Hours of Operation
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <ProviderHours hours={provider.hours} />
              </div>
            </div>
          )}

          {/* Map */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Location
            </h2>
            <ProviderMap address={provider.address} name={provider.business_name} />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">{provider.address}, {provider.city}, {provider.state} {provider.zip ?? ''}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${provider.address}, ${provider.city}, ${provider.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 ml-3 flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>
          </div>

          <NearbyProviders providers={nearby} />

          {/* Share this business */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Share this business</h2>

            {/* Viral card preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3 font-mono text-xs text-gray-600 leading-relaxed whitespace-pre-line select-all">
              {viralCardText}
            </div>

            {/* Primary: copy/share card */}
            <button
              onClick={handleViralShare}
              className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors mb-3"
            >
              {shareCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy &amp; Share
                </>
              )}
            </button>

            {/* Secondary: social links */}
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-700 transition-colors"
              >
                <FacebookLogo className="w-4 h-4" />
                Meta
              </a>
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <XLogo className="w-4 h-4" />
                X
              </a>
              <button
                onClick={handleInstagramShare}
                className="flex items-center gap-2 px-4 py-2 bg-pink-50 hover:bg-pink-100 rounded-lg text-sm font-medium text-pink-700 transition-colors"
              >
                <InstagramLogo className="w-4 h-4" />
                {igCopied ? 'Copied!' : 'Instagram'}
              </button>
            </div>
          </div>

          {/* Claim listing */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">Own this business?</h2>
                <p className="text-sm text-gray-500 mb-3">
                  Claim your listing to add photos, update your hours, respond to reviews, and get a verified badge.
                </p>
                <Link
                  to={`/claim/${provider.slug}?name=${encodeURIComponent(provider.business_name)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Claim Your Listing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: contact card */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl sticky top-20 shadow-sm overflow-hidden">

            {/* Header — always visible */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">Contact Information</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleViralShare}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={toggleFavorite}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorited ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {user ? (
              /* ── Signed-in: full contact card ── */
              <div className="p-5 space-y-3">
                {/* Address + Directions */}
                <div className="flex items-start gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 font-medium">{provider.address}</p>
                    <p className="text-gray-500">{provider.city}, {provider.state} {provider.zip ?? ''}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${provider.address}, ${provider.city}, ${provider.state}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Directions
                  </a>
                </div>

                {provider.phone && (
                  <a
                    href={`tel:${provider.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-3 text-sm p-3 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-blue-700 shrink-0" />
                    <span className="font-semibold text-blue-800">{formatPhone(provider.phone)}</span>
                  </a>
                )}

                {provider.website && (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-700 font-medium truncate">Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 ml-auto shrink-0" />
                  </a>
                )}

                {provider.rating !== null && (
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={provider.rating} size="sm" />
                        <span className="font-bold text-gray-900">{provider.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-gray-500">{provider.review_count.toLocaleString()} reviews</span>
                    </div>
                  </div>
                )}

                {categoryMeta && cityMeta && (
                  <Link
                    to={`/${cityMeta.stateSlug}/${cityMeta.citySlug}/${provider.category as CategorySlug}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                  >
                    More {categoryMeta.pluralLabel} in {provider.city}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}

                {isGoogleListed && provider.last_synced_at && (
                  <p className="text-xs text-gray-400 text-center">
                    Data from Google Places · Updated {new Date(provider.last_synced_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              /* ── Guest: blurred card + unlock CTA ── */
              <div className="relative">
                {/* Blurred preview */}
                <div className="p-5 space-y-3 select-none pointer-events-none blur-sm">
                  <div className="flex items-start gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-700 font-medium">{provider.address.split(',')[0]}</p>
                      <p className="text-gray-500">{provider.city}, {provider.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <Phone className="w-4 h-4 text-blue-700 shrink-0" />
                    <span className="font-semibold text-blue-800">({provider.city.slice(0,3).toUpperCase()}) •••-••••</span>
                  </div>
                  {provider.website && (
                    <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-gray-700 font-medium">Visit Website</span>
                    </div>
                  )}
                </div>

                {/* Overlay CTA */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-b-2xl px-5 py-6 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5 text-green-700" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-1">Unlock contact info</p>
                  <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                    Create a free account to view phone numbers, addresses, and website links.
                  </p>
                  <button
                    onClick={() => openModal('phone')}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    Sign up free — it's instant
                  </button>
                  <button
                    onClick={() => openModal('phone')}
                    className="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </div>
            )}

            {/* PetOS Health upsell — always visible */}
            <div className="border-t border-gray-100 px-5 py-4">
              <a
                href="https://petoshealth.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-blue-50 border border-blue-100 hover:border-blue-300 hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">PetOS Health</span>
                  <svg className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <p className="text-xs text-blue-600 leading-snug">
                  Found your vet? Track visits &amp; health records →
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copy toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl shadow-xl transition-all duration-300 ${
          shareCopied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        aria-live="polite"
      >
        <Check className="w-4 h-4 text-green-400" />
        Copied to clipboard!
      </div>
    </div>
  )
}
