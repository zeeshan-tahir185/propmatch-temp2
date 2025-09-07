'use client';

import React, { useState, useEffect } from 'react';
import LandingHero from './LandingHero';
import LandingHeroMobile from './mobile/LandingHeroMobile';

const LandingHeroResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Initial check
    checkScreenSize();
    setIsLoaded(true);

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#1A2B6C] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isMobile ? <LandingHeroMobile /> : <LandingHero />;
};

export default LandingHeroResponsive;
