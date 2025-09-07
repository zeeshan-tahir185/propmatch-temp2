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
              



           {/* MacBook – Left (In Front, 30% Larger, 20% Overlap) */}
<div
  className="absolute z-20"
  style={{
    left: '-290px',
    top: '130px',
  }}
>
  {/* Laptop wrapper: adjust height to allow hinge and slimmer base */}
  <div className="relative" style={{ width: '420px', height: '360px' }}>
    {/* Lid and bezel (outer frame) */}
    <div
      className="absolute w-full"
      style={{
        height: '300px',
        background: 'linear-gradient(180deg, #F8F9FA 0%, #EDEFF2 100%)',
        borderRadius: '16px 16px 10px 10px',
        border: '1px solid #E3E4E7',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Bezel around the screen */}
      <div
        className="absolute inset-2"
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #F0F1F3',
          position: 'relative',
        }}
      >
        {/* Notch */}
        <div
          style={{
            width: '80px',
            height: '12px',
            background: '#161D29',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        ></div>

        {/* Screen content (unchanged) */}
        <div className="absolute inset-3 bg-black rounded-md overflow-hidden">
          <Image
            src="/header-section/Property_Analysis_Screen_1.png"
            alt="Property Analysis Report"
            width={494}
            height={300}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </div>

    {/* Hinge */}
    <div
      className="absolute w-full"
      style={{
        top: '300px',
        height: '22px',
        background: 'linear-gradient(180deg, #E7E8EC 0%, #F3F4F7 100%)',
        borderRadius: '0 0 6px 6px',
      }}
    ></div>

    {/* Base / deck */}
      {/* <div
        className="absolute bottom-0 w-full"
        style={{
          height: '48px',
          background: 'linear-gradient(180deg, #F6F7F9 0%, #E8EAED 100%)',
          borderRadius: '0 0 16px 16px',
          boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.08)',
        }}
      >
        
      </div> */}
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