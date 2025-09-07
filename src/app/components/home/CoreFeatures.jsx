'use client';

import React from 'react';
import { FaSearchLocation, FaChartLine, FaFileExport, FaGlobeAmericas } from 'react-icons/fa';

const CoreFeatures = () => {
  const features = [
    {
      icon: <FaSearchLocation className="w-12 h-12 text-blue-600" />,
      title: "Predict Sellers Before They List",
      description: "AI identifies homeowners likely to sell in 6–12 months—so you’re first to the deal."
    },
    {
      icon: <FaChartLine className="w-12 h-12 text-green-600" />,
      title: "Rank Every Home in Your Farm",
      description: "Target only high-potential leads in any territory. No guesswork."
    },
    {
      icon: <FaFileExport className="w-12 h-12 text-purple-600" />,
      title: "AI Messaging That Converts",
      description: "Get personalized outreach that closes deals, not generic scripts that flop."
    },
    {
      icon: <FaGlobeAmericas className="w-12 h-12 text-indigo-600" />,
      title: "One-Click CRM Export",
      description: " Seamlessly integrate hot leads into your workflow."
    }
  ];

  return (
    <section className="bg-white/70 backdrop-blur-sm py-24 relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            How PropMatch Helps You Win More Listings
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Stop chasing cold leads. Start targeting homeowners who are actually ready to sell.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100/50"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Value Props
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-3xl p-12 shadow-xl border border-gray-200/50">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Built for high-volume agents who don't have time to waste
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                </div>
                <span className="text-gray-700 font-semibold text-lg">200+ data points analyzed</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                </div>
                <span className="text-gray-700 font-semibold text-lg">Updated daily</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                </div>
                <span className="text-gray-700 font-semibold text-lg">5× more accurate</span>
              </div> */}
            {/* </div> */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </section>
  );
};

export default CoreFeatures;
