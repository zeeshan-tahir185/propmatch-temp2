'use client';

import React, { useState } from 'react';
import { FaSearchLocation, FaChartLine, FaFileExport, FaGlobeAmericas, FaChevronDown } from 'react-icons/fa';

const CoreFeaturesMobile = () => {
  const [expandedFeature, setExpandedFeature] = useState(null);

  const features = [
    {
      icon: <FaSearchLocation className="w-8 h-8 text-blue-600" />,
      title: "Predict Sellers Before They List",
      shortDescription: "AI identifies homeowners most likely to sell",
      fullDescription: "AI identifies homeowners likely to sell in 6–12 months—so you’re first to the deal.",
      color: "blue"
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-green-600" />,
      title: "Rank Every Home in Your Farm",
      shortDescription: "Rank every property by likelihood to sell",
      fullDescription: "Target only high-potential leads in any territory. No guesswork.",
      color: "green"
    },
    {
      icon: <FaFileExport className="w-8 h-8 text-purple-600" />,
      title: "AI Messaging That Converts",
      shortDescription: "Seamless integration with existing workflow",
      fullDescription: "Get personalized outreach that closes deals, not generic scripts that flop.",
      color: "purple"
    },
    {
      icon: <FaGlobeAmericas className="w-8 h-8 text-indigo-600" />,
      title: "One-Click CRM Export",
      shortDescription: "Comprehensive coverage across Canada",
      fullDescription: " Seamlessly integrate hot leads into your workflow.",
      color: "indigo"
    }
  ];

  const toggleFeature = (index) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      <div className="max-w-sm mx-auto px-4 relative">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            How PropMatch Helps You Win More Listings
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            AI-powered tools to identify and convert your hottest prospects
          </p>
        </div>

        {/* Features List - Accordion Style */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl border-2 transition-all duration-300 ${
                expandedFeature === index 
                  ? `border-${feature.color}-200 shadow-lg` 
                  : 'border-gray-100 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Feature Header - Always Visible */}
              <button
                onClick={() => toggleFeature(index)}
                className="w-full p-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${feature.color}-50 rounded-lg`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.shortDescription}
                    </p>
                  </div>
                </div>
                <FaChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    expandedFeature === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-300 ${
                expandedFeature === index ? 'max-h-48 pb-4' : 'max-h-0'
              }`}>
                <div className="px-4">
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {feature.fullDescription}
                    </p>
                    
                    {/* Action Button */}
                    <div className="mt-3">
                      <button className={`text-${feature.color}-600 text-sm font-medium hover:text-${feature.color}-700 transition-colors`}>
                        Learn more →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ready to get started?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Join hundreds of successful realtors using PropMatch
          </p>
          <button className="bg-[#1A2B6C] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors active:scale-95 transform">
            Secure Your Spot Now – Free 14-Day Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesMobile;
