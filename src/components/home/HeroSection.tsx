import { useCallback, useRef, useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'

const HERO_VIDEOS = [
  'https://videos.pexels.com/video-files/6235178/6235178-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/6235740/6235740-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/6235750/6235750-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/6235739/6235739-uhd_2560_1440_25fps.mp4',
]

export function HeroSection() {
  const [index, setIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleEnded = useCallback(() => {
    const next = (index + 1) % HERO_VIDEOS.length
    setIndex(next)
    if (videoRef.current) {
      videoRef.current.src = HERO_VIDEOS[next]
      videoRef.current.play()
    }
  }, [index])

  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleEnded}
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1600&q=80&fit=crop"
          src={HERO_VIDEOS[0]}
        />
        <div className="absolute inset-0 bg-gray-900/60" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mx-auto max-w-3xl">
          Find trusted pet care near you.
        </h1>
        <p className="mt-5 text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
          Search 9,400+ verified vets, groomers, boarding, and emergency care providers across 50 states.
        </p>

        <div className="mt-10 max-w-3xl mx-auto">
          <SearchBar variant="hero" />
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Trusted by pet owners in 113 cities with 286,000+ verified reviews
        </p>
      </div>
    </section>
  )
}
