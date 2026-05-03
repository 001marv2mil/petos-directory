import { HeroSection } from '@/components/home/HeroSection'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { TrustSection } from '@/components/home/TrustSection'
import { TopRatedProviders } from '@/components/home/TopRatedProviders'
import { FeaturedProviders } from '@/components/home/FeaturedProviders'
import { EmergencyCTA } from '@/components/home/EmergencyCTA'
import { PageMeta } from '@/components/common/PageMeta'
import { WebSiteJsonLd } from '@/components/common/JsonLd'

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
      <CategoryGrid />
      <TrustSection />
      <TopRatedProviders />
      <FeaturedProviders />
      <EmergencyCTA />
    </div>
  )
}
