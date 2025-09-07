'use client';

import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaUsers, FaDollarSign, FaClock } from 'react-icons/fa';

const KPIStatsMobile = () => {
  const [animatedValues, setAnimatedValues] = useState({
    conversion: 0,
    leads: 0,
    revenue: 0,
    time: 0
  });

  const stats = [
    {
      value: "91% Accuracy",
      label: "AI that predicts sellers with surgical precision."
    },
    {
      value: "30 Seconds",
      label: "Get deal-ready leads faster than your competition."
    },
    {
      value: "5× More Listings",
      label: "Crush agents stuck guessing with outdated tools."
    },
    {
      value: "$2M+",
      label: "Revenue Generated"
    }
  ];

  // Animation is handled by CSS animations instead of JS for better performance



  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      
      <div className="max-w-sm mx-auto px-4 relative">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Proven Results
          </h2>
          <p className="text-gray-600 text-sm">
            Join successful realtors who've transformed their business
          </p>
        </div>

        {/* Stats Grid - Mobile Layout */}
        <div className="space-y-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center"
            >
              {/* Large Number */}
              <div 
                className="text-4xl font-bold mb-4"
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
                className="text-base font-medium leading-relaxed px-4"
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

export default KPIStatsMobile;
