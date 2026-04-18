import { SearchBar } from '@/components/search/SearchBar'
import { Shield, Star, MapPin } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden min-h-[540px] flex items-center">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/50 to-blue-900/65" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow">
          Find Trusted Pet Care Near You
        </h1>
        <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-xl mx-auto">
          Real listings for vets, groomers, boarding, trainers, and emergency care — with verified hours and direct contact info.
        </p>

        <SearchBar variant="hero" />

        {/* Trust stats — specific and verifiable */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 text-sm text-white/90">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-300" />
            50 states covered
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-300" />
            Ratings from real pet owners
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-300" />
            Business-verified listings
          </span>
        </div>
      </div>
    </section>
  )
}