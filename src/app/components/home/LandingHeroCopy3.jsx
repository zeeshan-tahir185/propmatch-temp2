'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LandingHero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen 2xl:!min-h-[50vh] pt-[100px] pb-[80px]">
      {/* Hero Container - Enhanced for Professional Devices */}
      <div className="relative  custom_bg_img">
        {/* <div 
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
          /> */}
        <div 
          className="relative rounded-[10px] overflow-hidden mx-auto"
          style={{
            width: '2392px', // width of the hero container
            height: '1200px',
            maxWidth: '115vw', // max width of the hero container
            borderRadius: '10px'
          }}
        >
          {/* Background Pattern - Figma Specifications */}
          

          {/* Main Headline - Positioned Above Devices */}
          <div className="absolute top-0 left-0 right-0 flex flex-col justify-center items-center px-4 md:px-8 lg:px-16" style={{ height: '480px' }}>
            <h1 
              className="text-white font-bold text-center"
              style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '46px',
                lineHeight: '110%',
                letterSpacing: '0.005em',
                width: '984px',
                maxWidth: '90%',
                marginBottom: '40px'
              }}
            >
              Stop Chasing Dead Leads — Win Listings with Homeowners Ready to Sell
            </h1>

            {/* Subtitle - Figma Specifications */}
            <p 
              className="text-white text-center mb-8"
              style={{
                fontFamily: 'SF UI Display, sans-serif',
                fontSize: '15px',
                lineHeight: '22px',
                letterSpacing: '0.03em',
                width: '549px',
                maxWidth: '80%'
              }}
            >
              PropMatch identifies the 20% of Canadian homeowners ready to list, so you close deals before competitors even know where to look.

            </p>

            {/* CTA Button - Figma Specifications */}
            <Link 
              href="/login?redirect=dashboard"
              className="inline-flex items-center justify-center font-semibold text-center bg-white text-[#1A2B6C] border border-white rounded-[5px] px-6 py-3 transition-all hover:bg-gray-100"
              style={{
                fontFamily: 'SF UI Display, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
                width: '300px',
                height: '48px'
              }}
            >
              Start Your Free Trial Now
            </Link>
          </div>

          {/* Stacked Device Mockups - Overlapping Design */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block" style={{ top: '520px', marginLeft: '20px' }}>
            <div className="relative flex justify-center items-center">
              



           {/* MacBook Pro – Left (In Front, 30% Larger, 20% Overlap) */}
           <div
                className="absolute z-20"
                style={{
                  left: '-290px',    // distance from left edge of hero container
                  top: '130px',      // distance from top edge of hero container
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: '420px',
                    height: '364px', // total height including base
                  }}
                >
                  {/* MacBook Screen and Bezel */}
                  <div
                    className="absolute w-full"
                    style={{
                      height: '310px', // height of the display portion
                      background: 'linear-gradient(180deg, #F5F7FA 0%, #E7E7E7 100%)',
                      borderRadius: '16px',    // rounded corners all around
                      border: '0px solid #E1E1E1',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                    }}
                  >
                    {/* Notch (camera) */}
                    <div
                      className="absolute"
                      style={{
                        width: '80px',
                        height: '12px',
                        background: '#111827',
                        borderBottomLeftRadius: '6px',
                        borderBottomRightRadius: '6px',
                        top: '-2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    ></div>

                    {/* Screen content */}
                    <div className="absolute bg-black rounded-md overflow-hidden"
                      style={{
                        left: '4px',
                        right: '4px',
                        top: '20px', // back to original position
                        bottom: '4px', // keep a little space at the bottom
                      }}>
                      <Image
                        // src="/header-section/Property_Analysis_Screen_1.png"
                        src="/header-section/hero/report.jpg"
                        alt="Property Analysis Report"
                        width={594}
                        height={412}
                        className="w-full h-full object-cover"
                        style={{ 
                          transform: 'scale(1.42) translateY(27px)',
                          objectPosition: 'center 0%'
                        }}
                        priority
                      />
                    </div>
                  </div>

                  {/* MacBook base (no keyboard, simplified, with slight tilt for depth) */}
                  <div
                    className="absolute bottom-10"
                    style={{
                      width: '115%', // Increased width for the base
                      left: '-7.5%', // Center the wider base
                      height: '14px',
                      background: 'linear-gradient(90deg, #F5F7FA 0%, #E8E9EB 100%)',
                      borderRadius: '0 0 16px 16px',
                      boxShadow: '0 -1px 0 rgba(0,0,0,0.1) inset',
                      transform: 'perspective(300px) rotateX(-40deg)', // subtle tilt for depth
                      transformOrigin: 'top center',
                    }}
                  >
                    {/* Branding / laptop label */}
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 text-gray-500"
                      style={{ 
                        fontSize: '7px', 
                        fontWeight: '500',
                        top: '-13px' // Move branding up a bit
                      }}
                    >
                      MacBook&nbsp;Pro
                    </div>
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
                      border: '2px solid #E1E1E1',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* Bottom Bezel/Chin */}
                    <div 
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: '50px',
                        background: '#E1E1E1',
                        borderBottomLeftRadius: '4px',
                        borderBottomRightRadius: '24px'
                      }}
                    >
                      {/* Darker bottom edge band */}
                      <div 
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                          height: '4px',
                          background: '#C8C8C8',
                          borderBottomLeftRadius: '24px',
                          borderBottomRightRadius: '24px'
                        }}
                      ></div>
                    </div>

                    
                    {/* Screen content new */}
                    {/* <div className="absolute bg-black rounded-md overflow-hidden"
                      style={{
                        left: '4px',
                        right: '4px',
                        top: '20px', // back to original position
                        bottom: '4px', // keep a little space at the bottom
                      }}>
                      <Image
                        // src="/header-section/Property_Analysis_Screen_1.png"
                        src="/header-section/hero/report.jpg"
                        alt="Property Analysis Report"
                        width={594}
                        height={412}
                        className="w-full h-full object-cover"
                        style={{ 
                          transform: 'scale(1.42) translateY(27px)',
                          objectPosition: 'center 0%'
                        }}
                        priority
                      />
                    </div> */}
                  

                    {/* Screen Content old */}
                    <div 
                      className="absolute bg-black rounded-3xl overflow-hidden"
                      style={{
                        top: '16px',
                        left: '16px',
                        right: '16px',
                        bottom: '46px' // Account for the 50px bezel + 16px spacing
                      }}
                    >
                                              <Image
                          src="/header-section/hero/score.png"
                          alt="Property Analysis Dashboard"
                          width={598}
                          height={377}
                          className="w-full h-full object-cover"
                          style={{ 
                            transform: 'scale(1.25) translateY(20px)',
                            objectPosition: '-23% center'
                          }}
                          priority
                        />
                    </div>
                    
                    {/* Apple Logo */}
                    <div 
                      className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: '34px',
                        height: '750px',
                        position: 'relative'
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          width: '100%',
                          height: '100%',
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                        }}
                      >
                        <path
                          d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                          fill="#8E8E93"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* iMac Stand */}
                  <div 
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '129px',
                      height: '57px',
                      background: 'linear-gradient(180deg, #E8E8E8 0%, #D1D1D1 30%, #C8C8C8 60%, #B8B8B8 100%)',
                      borderRadius: '0 0 24px 24px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Stand Base */}
                    <div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: '160px',
                        height: '7px',
                        background: 'linear-gradient(180deg, #C0C0C0 0%, #A8A8A8 50%, #909090 100%)',
                        borderRadius: '4px',
                        boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255,255,255,0.2)'
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
                  right: '-30px',  /* Distance from right edge of container */
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
                      width: '299px',                    /* Physical width of iPad device */
                      height: '341px',                   /* Physical height of iPad device */
                      left: '81px',                      /* Horizontal offset to create overlap effect */
                      background: '#F9FAFA',             /* Light gray background for iPad body */
                      borderRadius: '34px',              /* Rounded corners for modern iPad design */
                      border: '0px solid #E7E7E7',       /* Subtle border for device definition */
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
                        borderRadius: '0px'   /* Rounded corners matching iPad screen */
                      }}
                    >
                      <Image
                        src="/header-section/hero/outreach.png"  /* App screenshot showing mobile interface */
                        alt="Property CRM Ranked Leads"                                 /* Accessibility description */
                        width={349}                                          /* Image display width */
                        height={341}                                         /* Image display height */
                        className="w-full h-full object-cover"  
                        style={{ 
                          transform: 'scale(1.1) translate(-1px, -14px)',
                          objectPosition: '22% 60%'
                        }}
                        /* Fill container while maintaining aspect ratio */
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
                        src="/header-section/hero/rank1.png"  /* App screenshot for mobile display */
                        alt="Property CRM Ranked Leads"                        /* Accessibility description */
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


          <img src="/images/home/main.svg" alt="" />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;