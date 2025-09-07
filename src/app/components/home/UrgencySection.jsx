'use client';

import React, { useState, useEffect } from 'react';
import FreeTrialButton from '../payment/FreeTrialButton';

const UrgencySection = () => {
  const [animatedStats, setAnimatedStats] = useState({
    activeUsers: 0,
    listingsGenerated: 0,
    successRate: 0
  });

  const finalStats = {
    activeUsers: 1480,
    listingsGenerated: 2960,
    successRate: 94
  };

  useEffect(() => {
    const duration = 44000; // 3 minutes in ms
    const interval = 120; // ms between increments (slow, ~10fps)
    const totalSteps = (duration / interval);

    // Calculate per-step increments for each stat
    const increments = {
      activeUsers: finalStats.activeUsers / totalSteps,
      listingsGenerated: finalStats.listingsGenerated / totalSteps,
      successRate: finalStats.successRate
    };

    // Start from 0 initially on page load
    let current = { activeUsers: 0, listingsGenerated: 0, successRate: 0 };
    let step = 0;

    const timer = setInterval(() => {
      step++;

      // Increase the values
      current = {
        activeUsers: Math.min(finalStats.activeUsers, Math.floor(current.activeUsers + increments.activeUsers)),
        listingsGenerated: Math.min(finalStats.listingsGenerated, Math.floor(current.listingsGenerated + increments.listingsGenerated)),
        successRate: Math.min(finalStats.successRate, Math.floor(current.successRate + increments.successRate))
      };

      setAnimatedStats(current);

      // Check if we've reached the max value
      if (current.activeUsers === finalStats.activeUsers && current.listingsGenerated === finalStats.listingsGenerated) {
        // Reset to starting value (800 and 1500) after reaching max
        current = {
          activeUsers: 800, // Start from 800 for activeUsers
          listingsGenerated: 1500, // Start from 1500 for listingsGenerated
          successRate: 0 // Reset successRate
        };
        step = 0; // Reset step to restart the cycle
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative py-30"
      style={{
        background: '#1A2B6B',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '100%',
        minHeight: '850px',
        paddingTop: '120px',
        paddingBottom: '20px'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{
              color: '#F8FAFC',
              fontFamily: 'Satoshi, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Don’t Let Your Territory Get Locked Out
          </h2>
          <p 
            className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{
              color: 'rgba(248, 250, 252, 0.8)',
              fontFamily: 'SF UI Display, sans-serif'
            }}
          >
            We’re capping access at 50 agents per region. Once your market is full, competitors will use PropMatch to steal your listings.
          </p>
        </div>

        <div className="space-y-6 mb-20">
          <div className="flex justify-center">
            <div className="w-64">
              <FreeTrialButton 
                buttonText="Start Free Trial"
              />
            </div>
          </div>
          
          <p 
            className="text-lg font-medium"
            style={{
              color: 'rgba(248, 250, 252, 0.7)',
              fontFamily: 'SF UI Display, sans-serif'
            }}
          >
            No credit card required • Secure your spot now
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div 
            className="rounded-2xl p-8 backdrop-blur-sm"
            style={{
              background: 'rgba(248, 250, 252, 0.08)',
              border: '1px solid rgba(248, 250, 252, 0.15)'
            }}
          >
            <h4 
              className="font-bold text-xl mb-3"
              style={{
                color: '#F8FAFC',
                fontFamily: 'Satoshi, sans-serif'
              }}
            >
              Territory Protection
            </h4>
            <p 
              className="leading-relaxed"
              style={{
                color: 'rgba(248, 250, 252, 0.7)',
                fontFamily: 'SF UI Display, sans-serif'
              }}
            >
               Lock in exclusive access to dominate your market.
            </p>
          </div>
          <div 
            className="rounded-2xl p-8 backdrop-blur-sm"
            style={{
              background: 'rgba(248, 250, 252, 0.08)',
              border: '1px solid rgba(248, 250, 252, 0.15)'
            }}
          >
            <h4 
              className="font-bold text-xl mb-3"
              style={{
                color: '#F8FAFC',
                fontFamily: 'Satoshi, sans-serif'
              }}
            >
              Instant Access
            </h4>
            <p 
              className="leading-relaxed"
              style={{
                color: 'rgba(248, 250, 252, 0.7)',
                fontFamily: 'SF UI Display, sans-serif'
              }}
            >
              Start closing hot leads in minutes, not months.
            </p>
          </div>
          <div 
            className="rounded-2xl p-8 backdrop-blur-sm"
            style={{
              background: 'rgba(248, 250, 252, 0.08)',
              border: '1px solid rgba(248, 250, 252, 0.15)'
            }}
          >
            <h4 
              className="font-bold text-xl mb-3"
              style={{
                color: '#F8FAFC',
                fontFamily: 'Satoshi, sans-serif'
              }}
            >
              Proven ROI
            </h4>
            <p 
              className="leading-relaxed"
              style={{
                color: 'rgba(248, 250, 252, 0.7)',
                fontFamily: 'SF UI Display, sans-serif'
              }}
            >
              5× more listings or your money back.
            </p>
          </div>
        </div>

        <div 
          className="pt-12" 
          style={{
            borderTop: '1px solid rgba(248, 250, 252, 0.2)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div 
                className="text-5xl font-bold mb-3"
                style={{
                  color: '#F8FAFC',
                  fontFamily: 'Satoshi, sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                {animatedStats.activeUsers.toLocaleString()}
              </div>
              <div 
                className="text-lg font-medium"
                style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  fontFamily: 'SF UI Display, sans-serif'
                }}
              >
                Agents Closing Deals Nationwide
              </div>
            </div>
            <div>
              <div 
                className="text-5xl font-bold mb-3"
                style={{
                  color: '#F8FAFC',
                  fontFamily: 'Satoshi, sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                {animatedStats.listingsGenerated.toLocaleString()}
              </div>
              <div 
                className="text-lg font-medium"
                style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  fontFamily: 'SF UI Display, sans-serif'
                }}
              >
                Listings Secured in 12 Months
              </div>
            </div>
            <div>
              <div 
                className="text-5xl font-bold mb-3"
                style={{
                  color: '#F8FAFC',
                  fontFamily: 'Satoshi, sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                {animatedStats.successRate}%
              </div>
              <div 
                className="text-lg font-medium"
                style={{
                  color: 'rgba(248, 250, 252, 0.7)',
                  fontFamily: 'SF UI Display, sans-serif'
                }}
              >
                Success Rate with Ranked Leads
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrgencySection;
