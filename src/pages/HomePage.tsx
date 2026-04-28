import { HeroSection } from '@/components/home/HeroSection'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProviders } from '@/components/home/FeaturedProviders'
import { PetOSHealthBanner } from '@/components/home/PetOSHealthBanner'
import { EmergencyCTA } from '@/components/home/EmergencyCTA'
import { PageMeta } from '@/components/common/PageMeta'
import { WebSiteJsonLd } from '@/components/common/JsonLd'
import { RecentlyViewed } from '@/components/common/RecentlyViewed'
import { PetPersonalityQuiz } from '@/components/quiz/PetPersonalityQuiz'

export default function HomePage() {
  return (
    <div>
      <PageMeta
        title="Find Trusted Pet Care Near You"
        description="PetOS Directory — find veterinarians, groomers, pet boarding, dog daycare, trainers, and emergency vets across 50 states. Real listings, real reviews."
        path="/"
      />
      <WebSiteJsonLd />
      <HeroSection />
      {/* Category discovery — core value prop, first thing after hero */}
      <CategoryGrid />
      {/* Top-rated listings — give users something concrete to click */}
      <FeaturedProviders />
      {/* Quiz lead magnet — wraps in container for spacing */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PetPersonalityQuiz />
      </div>
      {/* Emergency CTA — high urgency, high conversion */}
      <EmergencyCTA />
      {/* Recently viewed — only renders if user has history */}
      <RecentlyViewed />
      {/* Cross-sell to PetOS Health — after core value delivered */}
      <PetOSHealthBanner />
    </div>
  )
}