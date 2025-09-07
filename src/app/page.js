import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import AnimatedTextStrip from './components/home/AnimatedTextStrip'
import MiniFAQ from './components/home/MiniFAQ'
import { 
  ResponsiveLandingHero,
  ResponsiveKPIStats,
  ResponsiveCoreFeatures,
  ResponsiveToolVisualization,
  ResponsiveTestimonials,
  ResponsiveSocialProofStrip,
  ResponsiveUrgencySection
} from './components/home/ResponsiveComponents'
import PainSolution from './components/home/PainSolution'

const page = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50'>
      <Navbar />
      <main>
        {/* Section 1 - Hero (Responsive) */}
        <ResponsiveLandingHero />
        
        {/* Section 1.1 - KPI Statistics (Responsive) */}
        <ResponsiveKPIStats />
        
        {/* Section 1.2 - Animated Text Strip */}
        <AnimatedTextStrip />
        
        {/* Section 2 - Social Proof Strip (Responsive) */}
        <ResponsiveSocialProofStrip />
        <PainSolution />
        
        {/* Section 3 - Core Features (Responsive) */}
        <ResponsiveCoreFeatures />
        
        {/* Section 4 - Tool Visualization (Responsive) */}
        <ResponsiveToolVisualization />
        
        {/* Section 5 - Testimonials (Responsive) */}
        <ResponsiveTestimonials />
        
        {/* Section 6 - Urgency + Second CTA (Responsive) */}
        <ResponsiveUrgencySection />
        
        {/* Section 7 - Mini FAQ */}
        <MiniFAQ />
      </main>
      <Footer />
    </div>
  )
}

export default page