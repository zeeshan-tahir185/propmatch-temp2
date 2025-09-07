'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LandingHero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen pt-[100px] pb-[80px]">
      {/* Hero Container - Enhanced for Professional Devices */}
      <div className="container-responsive">
        <div 
          className="relative rounded-[10px] shadow-[0px_20px_40px_rgba(0,0,0,0.1)] overflow-hidden"
          style={{
            width: '1392px',
            height: '1200px',
            maxWidth: '100%',
            background: '#1A2B6C',
            borderRadius: '10px'
          }}
        >
          {/* Background Pattern - Figma Specifications */}
          <div 
            className="absolute"
            style={{
              width: '1815px',
              height: '292px',
              left: '-152px',
              top: '508px',
              backgroundImage: 'url(/header-section/559037.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: '0.3'
            }}
          />

          {/* Main Headline - Positioned Above Devices */}
          <div className="absolute top-0 left-0 right-0 flex flex-col justify-center items-center px-4 md:px-8 lg:px-16" style={{ height: '480px' }}>
            <h1 
              className="text-white font-bold text-center"
              style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '46px',
                lineHeight: '110%',
                letterSpacing: '0.005em',
                width: '944px',
                maxWidth: '90%',
                marginBottom: '40px'
              }}
            >
              Convert Cold Leads into Listings — Identify Homeowners 5× More Likely to List
            </h1>

            {/* Subtitle - Figma Specifications */}
            <p 
              className="text-white text-center mb-8"
              style={{
                fontFamily: 'SF UI Display, sans-serif',
                fontSize: '15px',
                lineHeight: '22px',
                letterSpacing: '0.03em',
                width: '529px',
                maxWidth: '80%'
              }}
            >
              AI ranks your farm so you hit the hottest prospects first. No more guesswork.
            </p>

            {/* CTA Button - Figma Specifications */}
            <Link 
              href="/login?redirect=dashboard"
              className="inline-flex items-center justify-center font-semibold text-center bg-white text-[#1A2B6C] border border-white rounded-[5px] px-6 py-3 transition-all hover:bg-gray-100"
              style={{
                fontFamily: 'SF UI Display, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
                width: '200px',
                height: '48px'
              }}
            >
              Start Free Trial
            </Link>
          </div>

          {/* Stacked Device Mockups - Overlapping Design */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block" style={{ top: '520px' }}>
            <div className="relative flex justify-center items-center">
              
              {/* MacBook - Left (In Front, 30% Larger, 20% Overlap) */}
              <div className="absolute z-20" style={{ 
                left: '-290px',  // Distance from left edge of container
                top: '130px'     // Distance from top of container
              }}>
                <div className="relative" style={{ 
                  width: '420px',   // Total width of MacBook container
                  height: '364px'   // Total height of MacBook container
                }}>
                  {/* MacBook Screen */}
                  <div 
                    className="absolute w-full"
                    style={{
                      height: '312px',  // Screen height (85% of total height)
                      background: 'linear-gradient(180deg, #F1F1F1 88.02%, #E4E4E4 100%)',  // Metallic gradient for screen bezel
                      borderRadius: '16px 16px 0 0',  // Rounded top corners only
                      border: '4px solid #E7E7E7',  // Light border for screen definition
                      boxShadow: '0 20px 50px rgba(0,0,0,0.25)'  // Drop shadow for depth
                    }}
                  >
                    {/* Screen Content */}
                    <div 
                      className="absolute inset-3 bg-black rounded-xl overflow-hidden"  // Screen inset with rounded corners
                    >
                      <Image
                        src="/header-section/Property_Analysis_Screen_1.png"  // App screenshot for MacBook display
                        alt="Property Analysis Report"  // Accessibility description
                        width={494}  // Image display width
                        height={312}  // Image display height
                        className="w-full h-full object-cover"  // Fill container while maintaining aspect ratio
                        priority  // High priority loading for above-the-fold content
                      />
                    </div>
                    
                    {/* Camera */}
                    <div 
                      className="absolute rounded-full bg-gray-700"  // Webcam lens
                      style={{
                        width: '5px',  // Camera lens width
                        height: '5px',  // Camera lens height
                        left: '50%',  // Center horizontally
                        top: '10px',  // Distance from top of screen
                        transform: 'translateX(-50%)'  // Perfect horizontal centering
                      }}
                    ></div>
                  </div>
                  
                  {/* MacBook Base */}
                  <div 
                    className="absolute bottom-0 w-full"
                    style={{
                      height: '68px',  // Taller base for realistic deck + trackpad
                      background: 'linear-gradient(180deg,#F7F8FA 0%, #F0F1F3 60%, #EAEBEE 100%)',  // Aluminum gradient
                      borderRadius: '0 0 20px 20px',  // Rounded bottom corners only
                      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.06)'  // Soft inner highlights
                    }}
                  >
                    {/* Hinge slot */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2"
                      style={{ top: '-6px', width: '90px', height: '6px', background: 'linear-gradient(180deg,#7E7E86,#3A3A40)', borderRadius: '3px', opacity: 0.35 }}
                    ></div>

                    {/* MacBook Branding */}
                    <div 
                      className="absolute top-2 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs font-medium"
                      style={{ fontSize: '8px', letterSpacing: '0.5px' }}
                    >
                      MacBook
                    </div>

                    {/* Figma-inspired metallic overlays for realistic base finish */}
                    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                      {/* Rectangle 1 */}
                      <div 
                        className="absolute"
                        style={{
                          left: '0%',  // fill full width
                          right: '0%',
                          top: '0%',
                          bottom: '0%',
                          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0%, rgba(255, 255, 255, 0.04) 100%), #FFFFFF',
                          backgroundBlendMode: 'multiply, normal',
                          boxShadow: 'inset 0px 1.5px 0px rgba(0, 0, 0, 0.02)',
                          borderRadius: '0 0 20px 20px',
                          opacity: 0.8
                        }}
                      ></div>

                      {/* Right soft gradient */}
                      <div
                        className="absolute"
                        style={{
                          left: '48%',
                          right: '0%',
                          top: '0%',
                          bottom: '0%',
                          background: 'linear-gradient(270deg, #000000 -24.72%, #FFFFFF 100%)',
                          mixBlendMode: 'multiply',
                          opacity: 0.10,
                          borderRadius: '0 0 20px 0'
                        }}
                      ></div>

                      {/* Left soft gradient */}
                      <div
                        className="absolute"
                        style={{
                          left: '0%',
                          right: '74%',
                          top: '0%',
                          bottom: '0%',
                          background: 'linear-gradient(90deg, #000000 0%, #FFFFFF 100%)',
                          mixBlendMode: 'multiply',
                          opacity: 0.10,
                          borderRadius: '0 0 0 20px'
                        }}
                      ></div>

                      {/* Complex multi-gradient sheen */}
                      <div 
                        className="absolute"
                        style={{
                          left: '0%',
                          right: '0%',
                          top: '3%',
                          bottom: '0%',
                          background: 'linear-gradient(151.66deg, #EBEBEB 17.52%, rgba(88, 88, 88, 0) 124.27%), linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.07) 0%, rgba(255, 255, 255, 0.07) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0.07) 0%, rgba(234, 234, 234, 0.07) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0.07) 0%, rgba(234, 234, 234, 0.07) 100%), #FFFFFF',
                          backgroundBlendMode: 'normal, multiply, multiply, multiply, multiply, normal',
                          borderRadius: '0 0 20px 20px',
                          opacity: 0.35
                        }}
                      ></div>

                      {/* Central combined shape under branding */}
                      <div 
                        className="absolute"
                        style={{
                          left: '40%',
                          right: '40%',
                          top: '6px',
                          height: '12px',
                          background: '#FFFFFF',
                          boxShadow: 'inset 0px 1.5px 0px rgba(0, 0, 0, 0.03)',
                          borderRadius: '3px'
                        }}
                      ></div>
                      {/* Central shape side gradients */}
                      <div
                        className="absolute"
                        style={{ left: '36%', right: '60%', top: '6px', height: '12px', background: 'linear-gradient(90deg, #000000 0%, #FFFFFF 100%)', mixBlendMode: 'multiply', opacity: 0.07, borderRadius: '3px' }}
                      ></div>
                      <div
                        className="absolute"
                        style={{ left: '40%', right: '56%', top: '6px', height: '12px', background: 'linear-gradient(270deg, #000000 0%, #FFFFFF 100%)', mixBlendMode: 'multiply', opacity: 0.07, borderRadius: '3px' }}
                      ></div>
                    </div>

                    {/* Keyboard deck */}
                    <div 
                      className="absolute"
                      style={{
                        left: '12px',   // Deck inset from left
                        right: '12px',  // Deck inset from right
                        top: '14px',    // Deck offset from top of base
                        height: '40px', // Deck height for keys
                        background: 'linear-gradient(180deg,#F2F3F5 0%, #E7E8EB 100%)', // Subtle deck gradient
                        borderRadius: '10px',  // Rounded deck corners
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05), inset 0 -1px 0 rgba(255,255,255,0.75)'
                      }}
                    >
                      {/* Speaker grilles - left */}
                      <div 
                        className="absolute"
                        style={{ left: '6px', top: '6px', bottom: '6px', width: '8px', background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px)', borderRadius: '4px', opacity: 0.25 }}
                      ></div>

                      {/* Speaker grilles - right */}
                      <div 
                        className="absolute"
                        style={{ right: '6px', top: '6px', bottom: '6px', width: '8px', background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px)', borderRadius: '4px', opacity: 0.25 }}
                      ></div>

                      {/* Keys grid */}
                      <div 
                        className="absolute"
                        style={{ left: '28px', right: '28px', top: '6px', bottom: '6px', display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: '3px' }}
                      >
                        {Array.from({ length: 56 }).map((_, i) => (
                          <div 
                            key={`k-${i}`}
                            style={{ background: '#EBECEF', borderRadius: '3px', boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)' }}
                        ></div>
                      ))}
                      </div>
                    </div>
                    
                    {/* Trackpad */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2"
                      style={{ 
                        bottom: '8px',                         // Spacing from base bottom
                        width: '140px',                         // MacBook Pro large trackpad width
                        height: '24px',                         // Trackpad height
                        background: 'linear-gradient(180deg,#F7F8FA 0%, #E9EAED 100%)',
                        border: '1px solid #E0E3E7',           // Subtle edge
                        borderRadius: '6px',                    // Rounded corners
                        boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.75), inset 0 -1px 2px rgba(0,0,0,0.05)'
                      }}
                    ></div>

                    {/* Bottom lip shadow */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2"
                      style={{ bottom: '-6px', width: '70%', height: '6px', background: 'rgba(0,0,0,0.02)', boxShadow: '0 10px 20px rgba(0,0,0,0.25)', borderRadius: '999px' }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* iMac - Center (At Back, 30% Larger) */}
              <div className="relative z-10">
                <div className="relative" style={{ width: '598px', height: '442px' }}>
                  {/* iMac Screen */}
                  <div 
                    className="absolute w-full"
                    style={{
                      height: '377px',
                      background: '#F1F1F1',
                      borderRadius: '24px',
                      border: '4px solid #E1E1E1',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* Screen Content */}
                    <div 
                      className="absolute inset-4 bg-black rounded-3xl overflow-hidden"
                    >
                      <Image
                        src="/header-section/Property_Analysis_Screen_6.png"
                        alt="Property Analysis Dashboard"
                        width={598}
                        height={377}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    
                    {/* Apple Logo */}
                    <div 
                      className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: '19px',
                        height: '23px',
                        background: '#C8C8C8',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        opacity: '0.6'
                      }}
                    ></div>
                  </div>
                  
                  {/* iMac Stand */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '159px',
                      height: '57px',
                      background: 'linear-gradient(180deg, #D7D7D7 0%, rgba(255, 255, 255, 0) 69.99%), linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 54.14%, rgba(255, 255, 255, 0) 100%), radial-gradient(171.58% 71.57% at 50% 77.1%, #DBDBDB 0%, rgba(255, 255, 255, 0) 100%), #F5F5F5',
                      borderRadius: '0 0 24px 24px'
                    }}
                  >
                    {/* Stand Base */}
                    <div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: '160px',
                        height: '7px',
                        background: 'linear-gradient(180deg, #D4D4D4 85.8%, #B4B4B4 107.05%)',
                        borderRadius: '4px',
                        boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.38)'
                      }}
                    ></div>
                  </div>
                  
                  {/* iMac Shadow */}
                  <div 
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '520px',
                      height: '4px',
                      background: 'rgba(196, 196, 196, 0.001)',
                      boxShadow: '0px 0px 120px rgba(0, 0, 0, 0.5)',
                      borderRadius: '50%'
                    }}
                  ></div>
                </div>
              </div>

              {/* 
                iPad - Right (In Front, 30% Larger, 20% Overlap)
                This iPad is positioned to the right of the iMac and slightly in front,
                creating a layered effect with the other devices
              */}
              <div 
                className="absolute z-30" 
                style={{ 
                  right: '-10px',  /* Distance from right edge of container */
                  top: '150px'     /* Distance from top of container */
                }}
              >
                <div 
                  className="relative" 
                  style={{ 
                    width: '211px',   /* Total width of iPad container */
                    height: '321px'   /* Total height of iPad container */
                  }}
                >

                  {/* 
                    iPad Body - Main physical device representation
                    This creates the actual iPad device shape with proper styling
                  */}
                  <div 
                    className="absolute"
                    style={{
                      width: '249px',                    /* Physical width of iPad device */
                      height: '341px',                   /* Physical height of iPad device */
                      left: '61px',                      /* Horizontal offset to create overlap effect */
                      background: '#F9FAFA',             /* Light gray background for iPad body */
                      borderRadius: '34px',              /* Rounded corners for modern iPad design */
                      border: '1px solid #E7E7E7',       /* Subtle border for device definition */
                      boxShadow: '0 50px 40px rgba(0,0,0,0.25)'  /* Drop shadow for 3D depth effect */
                    }}
                  >

                    {/* 
                      Screen Content - Displays the actual app interface
                      This shows the PropMatch AI application running on the iPad
                    */}
                    <div 
                      className="absolute inset-4 bg-black rounded-2xl overflow-hidden"
                      style={{ 
                        marginTop: '2px',      /* Small top margin for screen inset */
                        marginBottom: '7px',   /* Bottom margin to accommodate home button */
                        borderRadius: '29px'   /* Rounded corners matching iPad screen */
                      }}
                    >
                      <Image
                        src="/header-section/Property_Analysis_Screen_4.png"  /* App screenshot showing mobile interface */
                        alt="Mobile Analysis"                                 /* Accessibility description */
                        width={349}                                          /* Image display width */
                        height={341}                                         /* Image display height */
                        className="w-full h-full object-fill"                /* Fill container while maintaining aspect ratio */
                        priority                                             /* High priority loading for above-the-fold content */
                      />
                    </div>
                    
                    {/* 
                      Home Button - Physical button on iPad
                      Represents the home button/indicator on the iPad device
                    */}
                    <div 
                      className="absolute rounded-full"
                      style={{
                        width: '10px',                                    /* Physical width of home button */
                        height: '10px',                                   /* Physical height of home button */
                        left: '50%',                                      /* Center horizontally within iPad */
                        bottom: '10px',                                   /* Distance from bottom edge of iPad */
                        transform: 'translateX(-50%)',                    /* Perfect horizontal centering */
                        background: 'linear-gradient(360deg, #EBEBEB 0%, #C8C8C8 100%)'  /* Metallic gradient for realistic button appearance */
                      }}
                    ></div>
                  </div>
                  
                  
                  {/* 
                    iPad Shadow - Creates depth and realism
                    Adds a subtle shadow beneath the iPad for 3D effect
                  */}
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '211px',                                     /* Shadow width matching iPad container */
                      height: '15px',                                     /* Shadow height for realistic depth */
                      bottom: '-10px',                                    /* Position shadow below the iPad */
                      background: 'rgba(196, 196, 196, 0.001)',          /* Nearly transparent background */
                      boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.15)',     /* Soft, spread shadow effect */
                      borderRadius: '50%'                                 /* Oval shadow shape for natural look */
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 
            Mobile-Friendly Device Mockup
            This section shows a simplified device mockup for mobile devices
            Only visible on screens smaller than medium breakpoint
          */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 md:hidden">
            <div className="flex justify-center">
              {/* 
                Mobile iMac - Simplified version for mobile screens
                Uses hover effects and responsive sizing
              */}
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <div className="relative" style={{ 
                  width: '280px',   /* Container width for mobile iMac */
                  height: '200px'   /* Container height for mobile iMac */
                }}>
                  {/* 
                    iMac Screen - Main display area
                    Represents the screen portion of the iMac device
                  */}
                  <div 
                    className="absolute w-full"
                    style={{
                      height: '170px',                                    /* Screen height within container */
                      background: '#FAFBFC',                             /* Light background color for screen frame */
                      borderRadius: '12px',                              /* Rounded corners for modern design */
                      border: '3px solid #E1E3E5',                       /* Border around screen for definition */
                      boxShadow: '0 15px 30px rgba(0,0,0,0.25)'         /* Drop shadow for depth effect */
                    }}
                  >
                    {/* 
                      Screen Content - App interface display
                      Shows the PropMatch AI application running on mobile
                    */}
                    <div 
                      className="absolute inset-2 bg-black rounded-lg overflow-hidden"
                      style={{ 
                        marginBottom: '8px'                              /* Bottom margin for screen inset */
                      }}
                    >
                      <Image
                        src="/header-section/Property_Analysis_Screen_6.png"  /* App screenshot for mobile display */
                        alt="Property Analysis Report"                        /* Accessibility description */
                        width={280}                                          /* Image display width */
                        height={170}                                         /* Image display height */
                        className="w-full h-full object-cover"                /* Cover container while maintaining aspect ratio */
                        priority                                             /* High priority loading for mobile performance */
                      />
                    </div>
                  </div>
                  
                  {/* iMac Stand - Mobile */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '80px',
                      height: '30px',
                      background: 'linear-gradient(135deg, #E8E9EA 0%, #F1F2F3 50%, #E0E1E2 100%)',
                      borderRadius: '0 0 12px 12px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Stand Base */}
                    <div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: '120px',
                        height: '8px',
                        background: 'linear-gradient(90deg, #D1D2D3 0%, #F1F2F3 50%, #D1D2D3 100%)',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    ></div>
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

export default LandingHero;