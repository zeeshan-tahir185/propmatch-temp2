'use client';

import React, { useState, useEffect } from 'react';
import { FaStar } from "react-icons/fa";
import Image from 'next/image';

const testimonialsData = [
  {
    quote: "As an independent realtor, I don't have the luxury of a big data team. PropMatch does the heavy lifting for me — I type in an address, and within seconds I get verified details, market trends, and AI-generated price recommendations.",
      name: "Amina Okafor",
      title: "Solo Agent",
      location: "Toronto, ON (GTA – Etobicoke)",
      brokerage: "Okafor Homes & Investments",
      headshot: "/realtor-headshot/9.jpg",
      rating: 5
  },
  {
    quote: "The lead ranking feature is a game-changer. I can now focus my time on the most promising prospects and my conversion rate has doubled.",
    name: "David Thompson",
    title: "Real Estate Broker",
    location: "Ottawa, Ontario",
    rating: 5,
    brokerage: "Keller Williams",
    headshot: "/realtor-headshot/5.webp"
  },
  {
    quote: "As a busy realtor, I don't have hours to chase dead ends. PropMatch gives me instant clarity — which properties are likely to sell and what to say when I reach out. The AI messaging is surprisingly natural and saves me tons of time drafting emails and texts. My clients are impressed that I come prepared with data-backed pricing insights.",
      name: "Harpreet Singh",
      title: "Independent Realtor",
      location: "Surrey, BC",
      brokerage: "Singhsta Realty Group",
      headshot: "/realtor-headshot/6.png",
      rating: 5
  },
  {
    quote: "I was skeptical at first, but PropMatch quickly proved itself. I uploaded a list of over 50 old leads, and within minutes it ranked them and recommended me what to do with them. Within two weeks, I booked three listing appointments from people I had completely written off.",
    name: "Daniel Wong",
    title: "Realtor",
    location: "Vancouver, BC",
    brokerage: "Sutton Group – West Coast Realty",
    headshot: "/realtor-headshot/7.png",
    rating: 5
  },
  {
    quote: "I used PropMatch to sort through 200 CRM leads. Within 4 days, I booked two listing appointments from the AI-ranked CRM list.",
      name: "Sarah Mitchell",
      title: "Senior Real Estate Agent",
      location: "Toronto, ON",
      brokerage: "Century 21",
      headshot: "/realtor-headshot/1.webp",
      rating: 5
  },
  {
    quote: "PropMatch's predictive score helped me identify sellers 6 months before they listed. It's pure gold!",
    name: "Abhishek Basu",
    title: "Residential Sales Expert", 
    location: "Calgary, AB",
    brokerage: "Sutton Group",
    headshot: "/realtor-headshot/3.webp",
    rating: 4
  }
];

const TestimonialsMobile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleSwipe = (direction) => {
    setIsAutoPlaying(false);
    
    if (direction === 'left') {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
      );
    }
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Touch event handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleSwipe('left');
    } else if (isRightSwipe) {
      handleSwipe('right');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-sm mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Realtors Say
          </h2>
          <p className="text-gray-600 text-base">
            Join hundreds of successful agents using PropMatch
          </p>
        </div>

        {/* Mobile Testimonial Carousel */}
        <div className="relative">
          
          {/* Testimonial Cards Container */}
          <div 
            className="flex transition-transform duration-500 ease-in-out touch-pan-y"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {testimonialsData.map((testimonial, index) => (
              <div 
                key={index}
                className="w-full flex-shrink-0 px-2"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
                  
                  {/* Stars */}
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                    ))}
                  </div>

                  {/* Quote - Full testimonial on mobile */}
                  <blockquote className="text-gray-700 text-sm leading-relaxed mb-6 text-center italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-blue-100">
                      <Image
                        src={testimonial.headshot}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 text-base">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows for Desktop/Tablet */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 md:opacity-100 hover:bg-white transition-all z-20"
            onClick={() => handleSwipe('right')}
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 md:opacity-100 hover:bg-white transition-all z-20"
            onClick={() => handleSwipe('left')}
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Swipe Indicator */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-xs flex items-center justify-center space-x-2">
            <span>←</span>
            <span>Swipe for more</span>
            <span>→</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMobile;
