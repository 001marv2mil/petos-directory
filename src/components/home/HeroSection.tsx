import { SearchBar } from '@/components/search/SearchBar'
import { Star, MapPin, Building2 } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden min-h-[480px] flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/55 to-blue-900/70" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight drop-shadow">
          Find Trusted Pet Care Near You
        </h1>
        <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          Real listings for vets, groomers, boarding, trainers, and emergency care with verified hours and direct contact info.
        </p>

        <SearchBar variant="hero" />

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 text-sm text-white/90">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-300" />
            <strong className="text-white">9,400+</strong> verified listings
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-300" />
            <strong className="text-white">286K+</strong> real reviews
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-300" />
            <strong className="text-white">113</strong> cities across 50 states
          </span>
        </div>
      </div>
    </section>
  )
}