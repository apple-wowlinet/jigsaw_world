import { HeroSection } from '@/components/home/HeroSection'
import { RecommendationsSection } from '@/components/home/RecommendationsSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fbfcff] dark:bg-[#080b14]">
      <HeroSection />
      <RecommendationsSection />
      <CategoriesSection />
    </div>
  )
}