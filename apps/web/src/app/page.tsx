import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/features/landing/hero-section"
import { Categories } from "@/components/features/landing/categories"
import { FeaturedJobs } from "@/components/features/landing/featured-jobs"
import { WhyChooseUs } from "@/components/features/landing/why-choose-us"
import { StatsSection } from "@/components/features/landing/stats-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <Categories />
        <FeaturedJobs />
        <WhyChooseUs />
        {/* Testimonials could go here */}
      </main>
    </div>
  )
}
