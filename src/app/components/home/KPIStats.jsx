'use client';

import React from 'react';

const KPIStats = () => {
  const stats = [
    {
      value: "91%",
      label: "AI accuracy in predicting ready-to-sell homeowners"
    },
    {
      value: "30 sec.",
      label: "Instant property analysis reports with listing probability"
    },
    {
      value: "5x",
      label: "Higher conversion rate from cold leads to signed listings"
    }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center"
            >
              {/* Large Number */}
              <div 
                className="text-6xl lg:text-7xl font-bold mb-4"
                style={{
                  background: 'linear-gradient(135deg, #1A2B6C 0%, #2B4CB8 50%, #4A6CF7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Satoshi, sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                {stat.value}
              </div>
              
              {/* Description */}
              <p 
                className="text-lg lg:text-xl font-medium leading-relaxed"
                style={{
                  color: '#4A5568',
                  fontFamily: 'SF UI Display, sans-serif',
                  letterSpacing: '0.01em'
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KPIStats;