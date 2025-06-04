import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ResearchTools from '@/components/ResearchTools'
import FeaturedContent from '@/components/FeaturedContent'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="font-kufi min-h-screen">
      <Navigation />
      <HeroSection />
      <ResearchTools />
      <FeaturedContent />
      <Footer />
    </main>
  );
}