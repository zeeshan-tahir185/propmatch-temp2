'use client';

import React, { useState } from 'react';
import { FaCheck, FaArrowRight } from 'react-icons/fa';

const PricingSectionMobile = () => {
  const [selectedPlan, setSelectedPlan] = useState(1); // Default to Basic Plan

  const pricingPlans = [
    {
      name: "Trial Plan",
      price: "Free",
      duration: "14 days",
      description: "Perfect for getting started",
      features: [
        "10 free property searches",
        "AI outreach message generation",
        "Professional report generation",
        "5 CRM uploads with up to 15 leads ranking each"
      ],
      buttonText: "Start Free Trial",
      featured: false,
      icon: "🚀",
      planType: "trial",
      color: "gray"
    },
    {
      name: "Basic Plan",
      price: "$99",
      duration: "/month",
      description: "Great for small teams",
      features: [
        "30 property searches with score prediction",
        "Listing prices & AI message generation",
        "10 professional report generations",
        "10 CRM uploads with 30 lead ranking each"
      ],
      buttonText: "Get Started",
      featured: true,
      icon: "⭐",
      planType: "basic",
      color: "blue",
      priceId: "price_1RxCe7Arj4GIV3vuex1mceAy"
    },
    {
      name: "Pro Plan",
      price: "$299",
      duration: "/month",
      description: "For power users and teams",
      features: [
        "Unlimited property searches",
        "Score prediction, listing prices & AI messages",
        "Professional report generation",
        "100 CRM uploads with up to 100 lead rankings"
      ],
      buttonText: "Go Pro",
      featured: false,
      icon: "💎",
      planType: "pro",
      color: "purple",
      priceId: "price_1RxCfSArj4GIV3vuPNqnpUxC"
    }
  ];

  const handlePlanSelect = (index) => {
    setSelectedPlan(index);
  };

  const handleGetStarted = (plan) => {
    if (plan.planType === 'trial') {
      // Handle free trial signup
      window.location.href = '/login?redirect=dashboard';
    } else {
      // Handle paid plan signup
      console.log('Starting checkout for:', plan.planType);
      // Integrate with Stripe checkout here
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-4 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-4 w-40 h-40 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="max-w-sm mx-auto px-4 relative">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-300 text-base">
            Start free, upgrade when you're ready
          </p>
        </div>

        {/* Plan Selector Tabs */}
        <div className="flex bg-gray-800 rounded-xl p-1 mb-8">
          {pricingPlans.map((plan, index) => (
            <button
              key={index}
              onClick={() => handlePlanSelect(index)}
              className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedPlan === index
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg mb-1">{plan.icon}</span>
                <span>{plan.name.split(' ')[0]}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Plan Details */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                selectedPlan === index ? 'block' : 'hidden'
              }`}
            >
              {/* Plan Header */}
              <div className={`bg-gradient-to-r ${
                plan.color === 'blue' ? 'from-blue-600 to-blue-700' :
                plan.color === 'purple' ? 'from-purple-600 to-purple-700' :
                'from-gray-600 to-gray-700'
              } p-6 text-center text-white relative`}>
                {plan.featured && (
                  <div className="absolute top-0 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-b-lg text-xs font-bold">
                    POPULAR
                  </div>
                )}
                
                <div className="text-4xl mb-3">{plan.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-blue-100 mb-4">{plan.description}</p>
                
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.duration && (
                    <span className="text-lg ml-1 opacity-80">{plan.duration}</span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="p-6">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <FaCheck className={`w-5 h-5 mt-0.5 ${
                        plan.color === 'blue' ? 'text-blue-600' :
                        plan.color === 'purple' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleGetStarted(plan)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                    plan.color === 'blue' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' :
                    plan.color === 'purple' 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl' :
                      'bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>{plan.buttonText}</span>
                    <FaArrowRight className="w-4 h-4" />
                  </span>
                </button>

                {/* Additional Info */}
                {plan.planType !== 'trial' && (
                  <p className="text-center text-gray-500 text-xs mt-4">
                    Cancel anytime • No setup fees
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-8 p-4 bg-gray-800 bg-opacity-50 rounded-xl">
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <span className="text-xl">🛡️</span>
            <span className="text-sm">30-day money-back guarantee</span>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-6">
          <button className="text-gray-400 text-sm hover:text-white transition-colors">
            Questions? View our FAQ →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSectionMobile;
