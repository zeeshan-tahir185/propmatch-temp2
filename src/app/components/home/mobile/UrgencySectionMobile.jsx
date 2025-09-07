'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const UrgencySectionMobile = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer when it reaches 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: '#1A2B6B' }}>
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-4 w-20 h-20 bg-orange-200 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute bottom-10 right-4 w-24 h-24 bg-red-200 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-2xl"></div>
      </div>
      
      <div className="max-w-sm mx-auto px-4 relative">
        
        {/* Urgency Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-200 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
            <span className="text-red-700 text-sm font-semibold">Limited Time Offer</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-8">
          <h2 
            className="text-3xl font-bold mb-4 leading-tight"
            style={{
              color: '#F8FAFC',
              fontFamily: 'Satoshi, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Don’t Let Your Territory Get Locked Out
          </h2>
          <p 
            className="text-base leading-relaxed"
            style={{
              color: 'rgba(248, 250, 252, 0.8)',
              fontFamily: 'SF UI Display, sans-serif'
            }}
          >
            We’re capping access at 50 agents per region. Once your market is full, competitors will use PropMatch to steal your listings.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white border-opacity-20">
          <div className="text-center mb-4">
            <h3 
              className="text-lg font-bold mb-2"
              style={{
                color: '#F8FAFC',
                fontFamily: 'Satoshi, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              Free Trial Ends In:
            </h3>
          </div>
          
          <div className="flex justify-center space-x-4">
            {/* Hours */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-3 shadow-lg">
                <div className="text-2xl font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
              </div>
              <div className="text-xs mt-2 font-medium" style={{ color: 'rgba(248, 250, 252, 0.8)', fontFamily: 'SF UI Display, sans-serif' }}>Hours</div>
            </div>
            
            {/* Separator */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-400">:</div>
            </div>
            
            {/* Minutes */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-3 shadow-lg">
                <div className="text-2xl font-bold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
              </div>
              <div className="text-xs mt-2 font-medium" style={{ color: 'rgba(248, 250, 252, 0.8)', fontFamily: 'SF UI Display, sans-serif' }}>Minutes</div>
            </div>
            
            {/* Separator */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-400">:</div>
            </div>
            
            {/* Seconds */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-3 shadow-lg">
                <div className="text-2xl font-bold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
              <div className="text-xs mt-2 font-medium" style={{ color: 'rgba(248, 250, 252, 0.8)', fontFamily: 'SF UI Display, sans-serif' }}>Seconds</div>
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-3 mb-8">
          {[
            "✅ 14-day free trial - no credit card required",
            "🚀 Get results in your first week",
            "💰 Average $150K+ revenue increase per agent",
            "🎯 5× higher conversion rates vs cold calling",
            "🔒 Cancel anytime - no long-term commitment"
          ].map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
              <span className="text-base text-white">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link 
            href="/login?redirect=dashboard"
            className="block w-full bg-white text-[#1A2B6B] font-bold text-lg py-4 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 active:scale-95 transform"
          >
            Start Your Free Trial Now
          </Link>
          
          <p className="text-gray-600 text-xs mt-4">
            Join 500+ successful realtors • No setup fees • Instant access
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-8 text-center p-4 bg-white bg-opacity-50 rounded-xl">
          <div className="flex justify-center items-center space-x-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-700 text-sm">
            <strong>4.9/5 stars</strong> from 200+ verified reviews
          </p>
        </div>
      </div>
    </section>
  );
};

export default UrgencySectionMobile;
