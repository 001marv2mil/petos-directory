import { SearchBar } from '@/components/search/SearchBar'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/50" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Find trusted pet care near you.
          </h1>
          <p className="mt-5 text-lg text-gray-300 max-w-lg leading-relaxed">
            Search 9,400+ verified vets, groomers, boarding, and emergency care providers across 50 states.
          </p>
        </div>

        <div className="mt-10 max-w-3xl">
          <SearchBar variant="hero" />
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Trusted by pet owners in 113 cities with 286,000+ verified reviews
        </p>
      </div>
    </section>
  )
}
