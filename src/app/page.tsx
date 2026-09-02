import { HeroSection } from '@/components/home/HeroSection'
import { RecommendationsSection } from '@/components/home/RecommendationsSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <HeroSection />
      <RecommendationsSection />
      <CategoriesSection />
    </div>
  )
}