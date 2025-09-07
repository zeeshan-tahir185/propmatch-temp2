'use client';

import React, { useState, useEffect } from 'react';

// Desktop Components
import LandingHero from './LandingHero';
import KPIStats from './KPIStats';
import CoreFeatures from './CoreFeatures';
import ToolVisualization from './ToolVisualization';
import TestimonialsSlider from './TestimonialsSlider';
import SocialProofStrip from './SocialProofStrip';
import UrgencySection from './UrgencySection';

// Mobile Components
import LandingHeroMobile from './mobile/LandingHeroMobile';
import KPIStatsMobile from './mobile/KPIStatsMobile';
import CoreFeaturesMobile from './mobile/CoreFeaturesMobile';
import ToolVisualizationMobile from './mobile/ToolVisualizationMobile';
import TestimonialsMobile from './mobile/TestimonialsMobile';
import SocialProofStripMobile from './mobile/SocialProofStripMobile';
import UrgencySectionMobile from './mobile/UrgencySectionMobile';

// Hook for responsive detection
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    setIsLoaded(true);

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isLoaded };
};

// Loading component
const ResponsiveLoader = () => (
  <div className="min-h-screen bg-[#1A2B6C] flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-sm">Loading...</p>
    </div>
  </div>
);

// Individual Responsive Components
export const ResponsiveLandingHero = () => {
  const { isMobile, isLoaded } = useResponsive();
  
  if (!isLoaded) return <ResponsiveLoader />;
  return isMobile ? <LandingHeroMobile /> : <LandingHero />;
};

export const ResponsiveKPIStats = () => {
  const { isMobile, isLoaded } = useResponsive();
  
  if (!isLoaded) return null;
  return isMobile ? <KPIStatsMobile /> : <KPIStats />;
};

export const ResponsiveCoreFeatures = () => {
  const { isMobile, isLoaded } = useResponsive();
  
  if (!isLoaded) return null;
  return isMobile ? <CoreFeaturesMobile /> : <CoreFeatures />;
};

export const ResponsiveToolVisualization = () => {
  const { isMobile, isLoaded } = useResponsive();
  
  if (!isLoaded) return null;
  return isMobile ? <ToolVisualizationMobile /> : <ToolVisualization />;
};

export const ResponsiveTestimonials = () => {
  const { isMobile, isLoaded } = useResponsive();
  
  if (!isLoaded) return null;
  return isMobile ? <TestimonialsMobile /> : <TestimonialsSlider />;
};

export const ResponsiveSocialProofStrip = () => {
  const { isMobile, isLoaded } = useResponsive();
  
  if (!isLoaded) return null;
  return isMobile ? <SocialProofStripMobile /> : <SocialProofStrip />;
};

export const ResponsiveUrgencySection = () => {
  const { isMobile, isLoaded } = useResponsive();
  
  if (!isLoaded) return null;
  return isMobile ? <UrgencySectionMobile /> : <UrgencySection />;
};
