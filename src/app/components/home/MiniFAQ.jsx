'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MiniFAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(0);

  const faqs = [
    {
      question: "How accurate is PropMatch’s AI ranking?",
      answer: "Our AI achieves 91% accuracy by analyzing 200+ data points, from property history to homeowner behavior, ensuring you focus only on leads that convert."
    },
    {
      question: "How does the likelihood-to-sell score work?",
      answer: "PropMatch scores every homeowner using predictive signals like market trends and life events, so you know exactly who’s ready to list in 6–12 months."
    },
    {
      question: "What’s included in the free trial?",
      answer: "Full access to PropMatch’s AI, lead ranking, messaging tools, and CRM export for 14 days—no credit card required, so you can start closing deals risk-free."
    },
    {
      question: "Can I export results to my CRM?",
      answer: "Yes, with one-click exports to any major CRM, your hottest leads are instantly ready for your workflow, saving you hours."
    },
    {
      question: "Will PropMatch work in my small market?",
      answer: "Absolutely. PropMatch delivers hyper-local insights across Canada, from urban hubs to rural towns, so you always find the best leads in your area."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? -1 : index);
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Got Questions?
          </h2>
          <p className="text-xl text-gray-600">
            Everything You Need to Know to Start Winning Listings
          </p>
        </div>

        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openQuestion === index ? (
                    <FaChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <FaChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support (Commented out as in original code) */}
        {/* <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you get the most out of PropMatch
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@propmatch.ca"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Email Support
              </a>
              <a
                href="tel:+1-800-PROPMATCH"
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
              >
                Call Us: 1-800-PROPMATCH
              </a>
            </div>
          </div>
        </div> */}

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="relative rounded-2xl p-8 text-white overflow-hidden w-full" style={{
            background: '#1A2B6C'
          }}>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                Stop Guessing. Start Winning Listings with PropMatch.
              </h3>
              <p className="text-blue-100 text-lg mb-6">
                Join thousands of agents already using PropMatch to identify the hottest prospects
              </p>
              <a
                href="/login?redirect=dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-[#1A2B6C] font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Claim Your Free Trial Now – Spots Are Limited
              </a>
              <p className="text-blue-200 text-sm mt-3">
                No credit card required • Cancel anytime • Full access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiniFAQ;