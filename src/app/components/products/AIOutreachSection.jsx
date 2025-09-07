"use client"
import React, { useState } from 'react';
import { FaBrain, FaChevronRight } from 'react-icons/fa';

const AIOutreachSection = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  return (
    <div className='max-w-7xl mx-auto'>
      <section className="mx-6 my-6 p-10 bg-white rounded-xl shadow-sm ">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0a2c53] mb-[50px]">
            Proven Results with AI Outreach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl border">
              <div className="w-16 h-16 bg-[#0a2c53] rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-[#0a2c53] mb-2">
                Precision Personalization
              </h3>
              <p className="text-4xl font-bold text-[#1e5ea5] mb-2">87%</p>
              <p className="text-gray-600">Response Rate vs 23% industry average</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border">
              <div className="w-16 h-16 bg-[#0a2c53] rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-[#0a2c53] mb-2">
                Convert Dead Leads
              </h3>
              <p className="text-4xl font-bold text-[#1e5ea5] mb-2">68%</p>
              <p className="text-gray-600">Dead Leads Revived re-engaged successfully</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border">
              <div className="w-16 h-16 bg-[#0a2c53] rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-[#0a2c53] mb-2">
                Advanced AI Reasoning
              </h3>
              <p className="text-4xl font-bold text-[#1e5ea5] mb-2">400+</p>
              <p className="text-gray-600">Property indicators analyzed per property</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-6 my-6 p-10 bg-gradient-to-r from-[#1A2B6C] to-[#1e5ea5] rounded-xl shadow-sm border border-blue-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Realtors Love Our AI Outreach
          </h2>
          <p className="text-white max-w-2xl mx-auto">
            See how AI-powered messaging transforms your prospecting approach
            with data-driven insights and proven results
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div
              className="flex items-start gap-4 cursor-pointer"
              onClick={() =>
                setExpandedCard(expandedCard === "ai" ? null : "ai")
              }
            >
              <div className="w-12 h-12 bg-[#1A2B6C] rounded-full flex items-center justify-center flex-shrink-0">
                <FaBrain className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#0a2c53]">
                    Advanced AI Reasoning
                  </h3>
                  <FaChevronRight
                    className={`text-gray-400 transition-transform duration-200 ${
                      expandedCard === "ai" ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            {expandedCard === "ai" && (
              <div className="mt-4 pl-16 animate-in slide-in-from-top-2 duration-300">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Processes MLS trends and neighbourhood statistics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Analyzes in-depth property details for insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Crafts messages that resonate with homeowners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Establishes your expertise automatically</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div
              className="flex items-start gap-4 cursor-pointer"
              onClick={() =>
                setExpandedCard(expandedCard === "precision" ? null : "precision")
              }
            >
              <div className="w-12 h-12 bg-[#1A2B6C] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="text-white text-2xl">🎯</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#0a2c53]">
                    Precision Personalization
                  </h3>
                  <FaChevronRight
                    className={`text-gray-400 transition-transform duration-200 ${
                      expandedCard === "precision" ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            {expandedCard === "precision" && (
              <div className="mt-4 pl-16 animate-in slide-in-from-top-2 duration-300">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Tailored to specific property insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Adapts to current market conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Uses homeowner psychology principles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Maximizes engagement and response rates</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div
              className="flex items-start gap-4 cursor-pointer"
              onClick={() =>
                setExpandedCard(expandedCard === "convert" ? null : "convert")
              }
            >
              <div className="w-12 h-12 bg-[#1A2B6C] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="text-white text-2xl">🚀</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#0a2c53]">
                    Convert Dead Leads
                  </h3>
                  <FaChevronRight
                    className={`text-gray-400 transition-transform duration-200 ${
                      expandedCard === "convert" ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            {expandedCard === "convert" && (
              <div className="mt-4 pl-16 animate-in slide-in-from-top-2 duration-300">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Revives dormant prospects effectively</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Uses compelling, data-backed messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Reignites interest with market insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1e5ea5] mt-1">•</span>
                    <span>Positions you as the knowledgeable expert</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIOutreachSection;