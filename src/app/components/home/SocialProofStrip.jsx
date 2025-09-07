'use client';

import React from 'react';
import Image from 'next/image';

const SocialProofStrip = () => {
  const brokerageLogos = [
    { name: "RE/MAX", logo: "/images/home/logo1.svg" },
    { name: "Royal LePage", logo: "/images/home/logo2.svg" },
    { name: "eXp Realty", logo: "/images/home/logo3.svg" },
    { name: "Century 21", logo: "/images/home/logo4.svg" },
    { name: "Keller Williams", logo: "/images/home/logo5.svg" },
    { name: "Sutton Group", logo: "/images/home/logo6.svg" },
    { name: "Coldwell Banker", logo: "/images/home/logo1.svg" },
    { name: "Zoocasa", logo: "/images/home/logo2.svg" },
    { name: "Right at Home Realty", logo: "/images/home/logo3.svg" },
    { name: "Engel & Völkers", logo: "/images/home/logo4.svg" },
    { name: "Harvey Kalles", logo: "/images/home/logo5.svg" },
    { name: "Bosley Real Estate", logo: "/images/home/logo6.svg" },
    { name: "Redline Realty", logo: "/images/home/logo1.svg" },
    { name: "The Agency", logo: "/images/home/logo2.svg" },
    { name: "PropertyGuys", logo: "/images/home/logo3.svg" }
  ];

  return (
    <section className="bg-white py-16 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Top Agents Use PropMatch to Dominate Their Markets
          </h2>
          <p className="text-gray-600">
            Builds instant credibility. Reinforces positioning. Visually silent but psychologically strong.
          </p>
        </div>
        
        {/* Animated Logo Strip */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {/* First set of logos */}
            <div className="flex items-center justify-center min-w-full">
              {brokerageLogos.slice(0, 8).map((brokerage, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={brokerage.logo}
                    alt={brokerage.name}
                    width={120}
                    height={60}
                    className="h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
            {/* Second set for seamless loop */}
            <div className="flex items-center justify-center min-w-full">
              {brokerageLogos.slice(8, 15).map((brokerage, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={brokerage.logo}
                    alt={brokerage.name}
                    width={120}
                    height={60}
                    className="h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default SocialProofStrip;
