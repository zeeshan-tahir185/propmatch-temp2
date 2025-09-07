'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LandingHeroMobile = () => {
  return (
    <section className="relative overflow-hidden min-h-screen pt-16 pb-8 px-4">
      {/* Mobile Hero Container */}
      <div className="relative  mx-auto">
        <div 
          className="relative rounded-lg shadow-lg overflow-hidden w-[100%] mx-auto"
          style={{
            background: '#1A2B6C',
            borderRadius: '12px',
            minHeight: '85vh'
          }}
        >
          {/* Background Pattern - Mobile Optimized */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url(/header-section/559037.png)',
              backgroundSize: '150% auto',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[85vh] p-6">
            
            {/* Top Section - Headline & CTA */}
            <div className="text-center pt-8 pb-6">
              <h1 
                className="text-white font-bold text-center mb-6"
                style={{
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '28px',
                  lineHeight: '110%',
                  letterSpacing: '0.005em'
                }}
              >
                Stop Chasing Dead Leads — Win Listings with Homeowners Ready to Sell

              </h1>

              {/* Subtitle */}
              <p 
                className="text-white text-center mb-8 opacity-90"
                style={{
                  fontFamily: 'SF UI Display, sans-serif',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.02em'
                }}
              >
                PropMatch identifies the 20% of Canadian homeowners ready to list, so you close deals before competitors even know where to look.

              </p>

              {/* CTA Button - Mobile Optimized */}
              <Link 
                href="/login?redirect=dashboard"
                className="inline-flex items-center justify-center font-semibold text-center bg-white text-[#1A2B6C] border border-white rounded-lg px-8 py-4 transition-all hover:bg-gray-100 active:scale-95 touch-manipulation"
                style={{
                  fontFamily: 'SF UI Display, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600',
                  minWidth: '300px',
                  height: '52px'
                }}
              >
                Start Your Free Trial Now
              </Link>
            </div>

            {/* Device Mockup Section - Scaled Down Desktop Devices */}
            <div className="flex-1 flex items-center justify-center py-8">
              <div className="relative" style={{ transform: 'scale(0.45)', transformOrigin: 'center' }}>
                
                {/* MacBook Pro – Left (In Front) */}
                <div
                  className="absolute z-20"
                  style={{
                    left: '-150px',
                    top: '50px'
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      width: '280px',
                      height: '240px'
                    }}
                  >
                    {/* MacBook Screen */}
                    <div
                      className="absolute w-full"
                      style={{
                        height: '210px',
                        background: 'linear-gradient(180deg, #F5F7FA 0%, #E7E7E7 100%)',
                        borderRadius: '12px',
                        border: '0px solid #E1E1E1',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.25)'
                      }}
                    >
                      {/* Screen content */}
                      <div className="absolute bg-black rounded-md overflow-hidden"
                        style={{
                          left: '3px',
                          right: '3px',
                          top: '15px',
                          bottom: '3px'
                        }}>
                        <Image
                          src="/header-section/hero/report.jpg"
                          alt="Property Analysis Report"
                          width={280}
                          height={210}
                          className="w-full h-full object-cover"
                          style={{ 
                            transform: 'scale(1.2) translateY(15px)',
                            objectPosition: 'center 0%'
                          }}
                          priority
                        />
                      </div>
                    </div>

                    {/* MacBook base */}
                    <div
                      className="absolute bottom-5"
                      style={{
                        width: '110%',
                        left: '-5%',
                        height: '10px',
                        background: 'linear-gradient(90deg, #F5F7FA 0%, #E8E9EB 100%)',
                        borderRadius: '0 0 12px 12px',
                        boxShadow: '0 -1px 0 rgba(0,0,0,0.1) inset'
                      }}
                    />
                  </div>
                </div>

                {/* iMac - Center (At Back) */}
                <div className="relative z-10">
                  <div className="relative" style={{ width: '400px', height: '300px' }}>
                    {/* iMac Screen */}
                    <div 
                      className="absolute w-full"
                      style={{
                        height: '250px',
                        background: '#F1F1F1',
                        borderRadius: '16px',
                        border: '2px solid #E1E1E1',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                      }}
                    >
                      {/* Bottom Bezel */}
                      <div 
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                          height: '35px',
                          background: '#E1E1E1',
                          borderBottomLeftRadius: '16px',
                          borderBottomRightRadius: '16px'
                        }}
                      />

                      {/* Screen Content */}
                      <div 
                        className="absolute bg-black rounded-xl overflow-hidden"
                        style={{
                          top: '12px',
                          left: '12px',
                          right: '12px',
                          bottom: '32px'
                        }}
                      >
                        <Image
                          src="/header-section/hero/score.png"
                          alt="Property Analysis Dashboard"
                          width={400}
                          height={250}
                          className="w-full h-full object-cover"
                          style={{ 
                            transform: 'scale(1.15) translateY(12px)',
                            objectPosition: '-15% center'
                          }}
                          priority
                        />
                      </div>
                    </div>
                    
                    {/* iMac Stand */}
                    <div 
                      className="absolute bottom-1 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: '85px',
                        height: '40px',
                        background: 'linear-gradient(180deg, #E8E8E8 0%, #D1D1D1 30%, #C8C8C8 60%, #B8B8B8 100%)',
                        borderRadius: '0 0 16px 16px'
                      }}
                    >
                      {/* Stand Base */}
                      <div 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                        style={{
                          width: '105px',
                          height: '5px',
                          background: 'linear-gradient(180deg, #C0C0C0 0%, #A8A8A8 50%, #909090 100%)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* iPad - Right (In Front) */}
                <div 
                  className="absolute z-30" 
                  style={{ 
                    right: '-20px',
                    top: '75px'
                  }}
                >
                  <div 
                    className="relative" 
                    style={{ 
                      width: '140px',
                      height: '210px'
                    }}
                  >
                    {/* iPad Body */}
                    <div 
                      className="absolute"
                      style={{
                        width: '200px',
                        height: '230px',
                        left: '55px',
                        background: '#F9FAFA',
                        borderRadius: '24px',
                        border: '0px solid #E7E7E7',
                        boxShadow: '0 35px 30px rgba(0,0,0,0.25)'
                      }}
                    >
                      {/* Screen Content */}
                      <div 
                        className="absolute inset-3 bg-black rounded-xl overflow-hidden"
                        style={{ 
                          marginTop: '2px',
                          marginBottom: '5px',
                          borderRadius: '0px'
                        }}
                      >
                        <Image
                          src="/header-section/hero/outreach.png"
                          alt="Property CRM Ranked Leads"
                          width={200}
                          height={230}
                          className="w-full h-full object-cover"
                          style={{ 
                            transform: 'scale(1.05) translate(-1px, -10px)',
                            objectPosition: '22% 60%'
                          }}
                          priority
                        />
                      </div>
                      
                      {/* Home Button */}
                      <div 
                        className="absolute rounded-full"
                        style={{
                          width: '7px',
                          height: '7px',
                          left: '50%',
                          bottom: '7px',
                          transform: 'translateX(-50%)',
                          background: 'linear-gradient(360deg, #EBEBEB 0%, #C8C8C8 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHeroMobile;
