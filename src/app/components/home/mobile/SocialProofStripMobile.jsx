'use client';

import React from 'react';
import Image from 'next/image';

const SocialProofStripMobile = () => {
  const companies = [
    { name: "Keller Williams", logo: "/images/kw-logo.svg", width: 120 },
    { name: "RE/MAX", logo: "/images/remax-logo.svg", width: 100 },
    { name: "Century 21", logo: "/images/c21-logo.svg", width: 110 },
    { name: "Coldwell Banker", logo: "/images/cb-logo.svg", width: 130 },
    { name: "Sutton Group", logo: "/images/sutton-logo.svg", width: 105 }
  ];

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
            `
          }}
        />
      </div>
      
      <div className="max-w-sm mx-auto px-4 relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Top Agents Use PropMatch to Dominate Their Markets
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>

        {/* Company Logos - Horizontal Scroll for Mobile */}
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-4 min-w-max px-2">
            {companies.map((company, index) => (
              <div 
                key={index}
                className="flex items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 min-w-[100px] h-16 flex-shrink-0"
              >
                <div className="text-center">
                  {/* Placeholder for company logos - replace with actual logos */}
                  <div className="text-gray-400 text-xs font-semibold whitespace-nowrap">
                    {company.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="text-center mt-2">
          <p className="text-gray-400 text-xs">← Swipe to see more →</p>
        </div>


      </div>
    </section>
  );
};

export default SocialProofStripMobile;
