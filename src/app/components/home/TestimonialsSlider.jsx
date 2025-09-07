'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import Image from 'next/image';

const TestimonialsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      quote: "As an independent realtor, I don't have the luxury of a big data team. PropMatch does the heavy lifting for me — I type in an address, and within seconds I get verified details, market trends. I've already used the AI pricing tool to win two listings against bigger brokerages.",
      name: "Amina Okafor",
      title: "Solo Agent",
      location: "Toronto, ON (GTA – Etobicoke)",
      brokerage: "Okafor Homes & Investments",
      avatar: "/realtor-headshot/9.jpg",
      rating: 5
    },
    {
      quote: "The lead ranking feature is a game-changer. I can now focus my time on the most promising prospects and my conversion rate has doubled.",
      name: "David Thompson",
      title: "Real Estate Broker",
      location: "Ottawa, Ontario",
      rating: 5,
      brokerage: "Keller Williams",
      avatar: "/realtor-headshot/5.webp"
    },
    {
      quote: "As a busy realtor, I don't have hours to chase dead ends. PropMatch gives me instant clarity — which properties are likely to sell and what to say when I reach out. My clients are impressed that I come prepared with data-backed pricing insights.",
      name: "Harpreet Singh",
      title: "Independent Realtor",
      location: "Surrey, BC",
      brokerage: "Singhsta Realty Group",
      avatar: "/realtor-headshot/6.png",
      rating: 5
    },
    {
      quote: "I was skeptical at first, but PropMatch quickly proved itself. I uploaded a list of over 50 old leads, and within minutes it ranked them and recommended me what to do with them. Within two weeks, I booked three listing appointments from people I had completely written off.",
      name: "Daniel Wong",
      title: "Realtor",
      location: "Vancouver, BC",
      brokerage: "Sutton Group – West Coast Realty",
      avatar: "/realtor-headshot/7.png",
      rating: 5
    },
    {
      quote: "I used PropMatch to sort through 200 CRM leads. Within 4 days, I booked two listing appointments from the AI-ranked CRM list.",
      name: "Sarah Mitchell",
      title: "Senior Real Estate Agent",
      location: "Toronto, ON",
      brokerage: "Century 21",
      avatar: "/realtor-headshot/1.webp",
      rating: 5
    },
    {
      quote: "PropMatch's predictive score helped me identify sellers 6 months before they listed. It's pure gold!",
      name: "Abhishek Basu",
      title: "Residential Sales Expert", 
      location: "Calgary, AB",
      brokerage: "Sutton Group",
      avatar: "/realtor-headshot/3.webp",
      rating: 4
    }
  ];

  // Automatically advance the testimonial slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-32 relative">
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `, 
            backgroundSize: '50px 200px'
          }}
        />
      </div>

      <div className="max-w-screen-3xl mx-auto px-4 sm:px-8 lg:px-16 relative">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            We Help You Grow
          </h2>
          <p className="text-2xl text-gray-500 mt-3 mb-16">
            Trusted by top agents using AI to close more deals, faster.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto h-[600px]">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 h-full">
            <div className="flex h-full">
              {/* Left side - Avatar and rating */}
              <div className="w-3/5 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-20">
                <div className="text-center">
                  <div className="w-96 h-[28rem] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mx-auto mb-5 overflow-hidden shadow-2xl border-8 border-white">
                    <Image
                      src={testimonials[currentSlide].avatar}
                      alt={testimonials[currentSlide].name}
                      width={500}
                      height={320}
                      className="w-96 h-[28rem] object-cover scale-100"
                    />
                  </div>
                  <div className="flex justify-center items-center mb-6">
                    {[...Array(Math.floor(testimonials[currentSlide].rating))].map((_, i) => (
                      <FaStar key={i} className="w-7 h-7 text-yellow-400" />
                    ))}
                    <span className="ml-3 text-gray-600 font-medium text-xl">
                      {testimonials[currentSlide].rating}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Testimonial quote and agent info */}
              <div className="w-2/5 p-12 flex flex-col justify-center">
                <blockquote className="text-2xl text-gray-800 mb-12 leading-relaxed italic font-medium pr-8">
                  "{testimonials[currentSlide].quote}"
                </blockquote>
                <div className="border-l-4 border-blue-500 pl-8">
                  <div className="font-bold text-gray-900 text-2xl mb-2">
                    {testimonials[currentSlide].name}
                  </div>
                  <div className="text-gray-600 text-xl mb-2">
                    {testimonials[currentSlide].title}
                  </div>
                  <div className="text-gray-500 text-lg">
                    {testimonials[currentSlide].location} - {testimonials[currentSlide].brokerage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute -left-16 top-1/2 transform -translate-y-1/2 bg-white/60 hover:bg-white/80 text-gray-700 p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200/50"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute -right-16 top-1/2 transform -translate-y-1/2 bg-white/60 hover:bg-white/80 text-gray-700 p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200/50"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center mt-12 space-x-5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  currentSlide === index
                    ? 'bg-blue-600 shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
