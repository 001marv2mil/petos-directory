import { SearchBar } from '@/components/search/SearchBar'
import { CheckCircle, MapPin, Star, Heart } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden min-h-[540px] flex items-center">
      {/* Background photo — bright blue sky with pet */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/55 via-blue-800/40 to-blue-900/60" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow">
          Find a Vet You Can Actually Trust
        </h1>
        <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-xl mx-auto">
          Real pet services. Real ratings. Real pet owners in your area.
        </p>

        <SearchBar variant="hero" />

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8 text-sm text-white/90">
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-300" />
            Real Reviews & Ratings
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-yellow-300" />
            Local Pet Care Professionals
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Verified Hours & Phone
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-red-400" />
            24/7 Emergency Vets Available
          </span>
        </div>
      </div>
    </section>
  )
}