import React from 'react'
import StripeCheckout from '../payment/StripeCheckout'
import FreeTrialButton from '../payment/FreeTrialButton'

const PricingSection = () => {
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
      planType: "trial"
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
      priceId: "price_1RxCe7Arj4GIV3vuex1mceAy" // Stripe Basic Plan price ID
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
      icon: "👑",
      planType: "pro",
      priceId: "price_1RxCe7Arj4GIV3vu6n7LQNjK" // Stripe Pro Plan price ID
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revenue Model & 
            <span className="gradient-text"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your property investment needs. 
            Start with our free trial and scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-custom hover-lift p-8 ${
                plan.featured 
                  ? 'ring-2 ring-blue-500 scale-105 bg-gradient-to-br from-blue-50 to-white' 
                  : ''
              }`}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Icon */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-xl text-gray-600 ml-2">{plan.duration}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg 
                      className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.planType === 'trial' ? (
                <FreeTrialButton buttonText={plan.buttonText} />
              ) : (
                <StripeCheckout
                  planName={plan.planType}
                  priceId={plan.priceId}
                  planPrice={plan.price}
                  planDuration={plan.duration}
                  buttonText={plan.buttonText}
                  featured={plan.featured}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default PricingSection