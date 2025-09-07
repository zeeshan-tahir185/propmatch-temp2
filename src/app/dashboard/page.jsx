'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlay, FaSearch, FaEnvelope, FaUsers, FaClock, FaChartBar, FaSearchLocation, FaChartLine, FaFileExport, FaGlobeAmericas, FaPause, FaUpload, FaMap, FaStar, FaArrowRight } from 'react-icons/fa';
// Video player removed for simplicity

const DashboardHome = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 text-gray-800 pt-[2px]">
      {/* Convert Cold Leads Section - Mobile Optimized */}
      

      {/* ENHANCED GET STARTED SECTION - Mobile Optimized */}
      <section className=" mx-3 sm:mx-6 my-4 sm:my-8 p-6 sm:p-12 rounded-2xl shadow-xl relative overflow-hidden bg-white border-2 border-gray-200">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full translate-y-12 -translate-x-12 opacity-60"></div>
        
        <div className="text-center mb-8 sm:mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-slate-700 to-gray-800 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-lg">
            <span className="w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full"></span>
            🎯 START HERE - CHOOSE YOUR TOOL
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Get Started</h2>
          <p className="text-gray-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Choose the tool you need to accelerate your real estate business with AI-powered insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 relative z-10">
          {/* Property Search - Mobile Optimized */}
          <button
            onClick={() => router.push('/dashboard/property-search')}
            className="group p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[#193cc9] to-[#1075e9] border-3 border-blue-200 hover:border-blue-400 rounded-2xl hover:shadow-2xl transition-all duration-300 text-left hover:transform hover:-translate-y-1 sm:hover:-translate-y-2 relative overflow-hidden cursor-pointer touch-manipulation"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 sm:px-4 py-1 sm:py-2 rounded-bl-xl font-bold shadow-lg">
              ⭐ START HERE
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <FaSearchLocation className="text-lg sm:text-2xl text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white mb-2 text-lg sm:text-xl">Property Search</div>
                <div className="text-sm text-white mb-3 font-medium">Analyze individual properties and get seller likelihood scores</div>
                <div className="text-sm text-white leading-relaxed mb-4 hidden sm:block">
                  Find properties ready to sell BEFORE they hit the market. Get instant seller probability scores and listing price predictions to secure listings while your competition is still cold calling.
                </div>
                <div className="text-sm text-white leading-relaxed mb-4 sm:hidden">
                  Find properties ready to sell before they hit the market. Get instant seller scores to secure listings first.
                </div>
                <div className="text-sm text-white font-semibold">Click to start →</div>
              </div>
            </div>
          </button>
          
          {/* Lead Ranking - Mobile Optimized */}
          <button
            onClick={() => router.push('/dashboard/lead-ranking')}
            className="group p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[#193cc9] to-[#1075e9] border-3 border-blue-200 hover:border-blue-400 rounded-2xl hover:shadow-2xl transition-all duration-300 text-left hover:transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer touch-manipulation"
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <FaUsers className="text-lg sm:text-2xl text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white mb-2 text-lg sm:text-xl">CRM Lead Ranking</div>
                <div className="text-sm text-white mb-3 font-medium">Rank and prioritize your lead lists with AI insights</div>
                <div className="text-sm text-white leading-relaxed mb-4 hidden sm:block">
                  Transform your CRM from a data graveyard into a conversion machine. AI ranks every lead by sale probability, enriches with property insights, and tells you exactly what to say next.
                </div>
                <div className="text-sm text-white leading-relaxed mb-4 sm:hidden">
                  Transform your CRM into a conversion machine. AI ranks leads and tells you exactly what to say next.
                </div>
                <div className="text-sm text-white font-semibold">Click to start →</div>
              </div>
            </div>
          </button>
          
          {/* AI Outreach - Mobile Optimized */}
          <button
            onClick={() => router.push('/dashboard/outreach-messages')}
            className="group p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[#193cc9] to-[#1075e9] border-3 border-blue-200 hover:border-blue-400 rounded-2xl hover:shadow-2xl transition-all duration-300 text-left hover:transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer touch-manipulation"
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <FaChartLine className="text-lg sm:text-2xl text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white mb-2 text-lg sm:text-xl">AI Outreach</div>
                <div className="text-sm text-white mb-3 font-medium">Generate personalized messages for your prospects</div>
                <div className="text-sm text-white leading-relaxed mb-4 hidden sm:block">
                  Stop sending generic messages that get ignored. Generate hyper-personalized outreach backed by property data and market insights that homeowners actually respond to.
                </div>
                <div className="text-sm text-white leading-relaxed mb-4 sm:hidden">
                  Generate hyper-personalized outreach backed by property data and market insights.
                </div>
                <div className="text-sm text-white font-semibold">Click to start →</div>
              </div>
            </div>
          </button>
          
          {/* Reports - Mobile Optimized */}
          <button
            onClick={() => router.push('/dashboard/reports')}
            className="group p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[#193cc9] to-[#1075e9] border-3 border-blue-200 hover:border-blue-400 rounded-2xl hover:shadow-2xl transition-all duration-300 text-left hover:transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer touch-manipulation"
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <FaFileExport className="text-lg sm:text-2xl text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white mb-2 text-lg sm:text-xl">Personalized Property Reports</div>
                <div className="text-sm text-white mb-3 font-medium">Create professional reports for client presentations</div>
                <div className="text-sm text-white leading-relaxed mb-4 hidden sm:block">
                  Wow clients with stunning, AI-generated market reports that position you as the expert. Professional PDFs in seconds that close more listings and referrals.
                </div>
                <div className="text-sm text-white leading-relaxed mb-4 sm:hidden">
                  Wow clients with stunning, AI-generated market reports. Professional PDFs in seconds.
                </div>
                <div className="text-sm text-white font-semibold">Click to start →</div>
              </div>
            </div>
          </button>
        </div>
      </section>




      {/* Tool Overview Section */}
      {/* <section className="mx-6 my-6 p-12 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stop Guessing. Start Prospecting with Precision.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PropMatch transforms your cold leads into hot prospects with AI-powered insights and personalized outreach.
          </p>
        </div> */}

        {/* Tool Overview */}
        {/* <div className="text-center mt-8 max-w-2xl mx-auto">
          <p className="text-gray-600 text-lg leading-relaxed">
            Upload your leads, get AI-powered rankings, and generate personalized outreach messages - all in under a minute.
          </p>
        </div>
      </section> */}

      {/* Testimonials Section - Mobile Optimized */}
      {/* <section className="mx-3 sm:mx-6 my-4 sm:my-6 p-6 sm:p-10 bg-gray-50 rounded-xl shadow-sm">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Top-Performing Agents
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            See how real estate professionals are transforming their business with PropMatch AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 w-5 h-5" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 italic">
              "I used PropMatch to sort through 200 CRM leads. Within 4 days, I booked two listing appointments from the AI-ranked CRM list."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                SM
              </div>
              <div>
                <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                <div className="text-sm text-gray-600">Senior Real Estate Agent, Toronto</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 w-5 h-5" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 italic">
              "I was skeptical at first, but PropMatch quickly proved itself. I uploaded a list of over 50 old leads, and within minutes it ranked them and recommended me what to do with them. Within two weeks, I booked three listing appointments."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                DW
              </div>
              <div>
                <div className="font-semibold text-gray-900">Daniel Wong</div>
                <div className="text-sm text-gray-600">Realtor, Vancouver</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 w-5 h-5" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 italic">
              "As a busy realtor, I don't have hours to chase dead ends. PropMatch gives me instant clarity — which properties are likely to sell and what to say when I reach out. The AI messaging is surprisingly natural and saves me tons of time."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                HS
              </div>
              <div>
                <div className="font-semibold text-gray-900">Harpreet Singh</div>
                <div className="text-sm text-gray-600">Independent Realtor, Surrey</div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Urgency Section */}
      <section className="mx-6 my-6 p-10 bg-gradient-to-r from-[#1A2B6C] to-[#1e5ea5] border border-white/10 rounded-xl shadow-sm">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't Let Your Competition Get Ahead
          </h2>
          <p className="text-xl text-white mb-8">
            While you're still using traditional methods, your competitors are already using AI to find the hottest leads.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-gray-600 mb-2">5×</div>
              <div className="text-gray-700">More likely to find listings</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-gray-600 mb-2">60s</div>
              <div className="text-gray-700">To analyze any property</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-gray-600 mb-2">92%</div>
              <div className="text-gray-700">Prediction accuracy</div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/dashboard/property-search')}
            className="bg-white text-[#0a2c53] px-10 py-4 hover:bg-gray-100 rounded-full font-semibold transition-all duration-200 hover:transform hover:-translate-y-1 shadow-lg text-lg flex items-center gap-2 mx-auto"
          >
            Start Your Free Trial <FaArrowRight />
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-6 my-6 p-10 bg-white rounded-xl shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Got Questions?
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about PropMatch
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            {
              question: "How accurate is PropMatch's AI ranking?",
              answer: "PropMatch uses advanced AI to analyze 400+ data points per property, achieving 5× higher accuracy than traditional prospecting. Our system evaluates market trends, property history, renovation indicators, demographic data, phone validation, and behavioral patterns to identify homeowners most likely to sell within 6-12 months."
            },
            {
              question: "How does PropMatch calculate the likelihood-to-sell score?",
              answer: "Our AI analyzes individual properties using a database of 17 million+ data sources to extract comprehensive property details. The advanced algorithm evaluates renovation history, market timing, demographic shifts, property age, neighborhood trends, and owner behavior patterns to generate a realistic 0-10 likelihood score. This single-address analysis provides precise insights for targeted prospecting."
            },
            {
              question: "What services does PropMatch offer?",
              answer: "PropMatch provides 4 core services: Property Search - Analyze individual properties and get seller likelihood scores with instant probability scores and listing price predictions. CRM Lead Ranking - Rank and prioritize your lead lists with AI insights, transforming your CRM into a conversion machine. AI Outreach - Generate hyper-personalized outreach messages backed by property data and market insights. Personalized Property Reports - Create professional AI-generated market reports and PDFs for client presentations."
            },
            {
              question: "What's included in the free trial?",
              answer: "Your free trial includes: 10 property searches, 10 AI message generations, 5 professional report generations, upload up to 15 leads per list, AI-powered lead ranking with scores (0-10), phone validation, 3-tier pricing suggestions, personalized action plans, CSV export of ranked results, and access to all core features. No credit card required, full access for 14 days."
            },
            {
              question: "How does the lead ranking work?",
              answer: "Upload your CRM lead list (CSV, XLSX, or PDF) and our AI processes each lead in under 60 seconds. We analyze property data, market conditions, owner activity, and 400+ indicators to generate a likelihood-to-sell score. Results include ranked leads, phone validation status, pricing recommendations, and personalized outreach strategies."
            },
            {
              question: "Can I export results to my CRM?",
              answer: "Yes! Download your ranked leads as a CSV file that includes all original data plus AI scores, phone validation status, pricing recommendations, and action plans. The file is formatted to import directly into popular CRMs like Chime, Follow Up Boss, Top Producer, and others."
            },
            {
              question: "What areas does PropMatch cover?",
              answer: "PropMatch provides comprehensive coverage across all Canadian cities and neighborhoods. We have detailed data for major markets including Toronto, Vancouver, Calgary, Montreal, Ottawa, Edmonton, and hundreds of smaller communities throughout Canada."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
