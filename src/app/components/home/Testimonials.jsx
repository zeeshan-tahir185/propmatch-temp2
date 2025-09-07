'use client';

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

const testimonialsData = [
  // Reordered testimonials: 5, 3, 6, 4, 1, 2
  {
    quote: "As an independent realtor, I don't have the luxury of a big data team. PropMatch does the heavy lifting for me — I type in an address, and within seconds I get verified details, market trends, and AI-generated price recommendations. It helps me sound confident in front of clients, and I've already used the AI pricing tool to win two listings against bigger brokerages.",
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
    avatar:  "/realtor-headshot/5.webp"
  },
  {
    quote: "As a busy realtor, I don't have hours to chase dead ends. PropMatch gives me instant clarity — which properties are likely to sell and what to say when I reach out. The AI messaging is surprisingly natural and saves me tons of time drafting emails and texts. My clients are impressed that I come prepared with data-backed pricing insights.",
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

const Testimonials = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '0',
        }
      }
    ]
  };

  return (
    <div className="max-w-[1440px] mx-8 md:mx-auto py-0 md:py-12 relative px-4 md:px-12 lg:px-16">
      <div className="relative">
        <Slider {...settings}>
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="px-2">
              <div className="p-6 rounded-[10px] shadow-sm border border-[#EDEDED] relative min-h-[320px] flex flex-col bg-white hover:shadow-md transition-shadow duration-300">
                <img src="/images/home/quote.svg" alt="" className='absolute top-[20px] right-[20px] w-6 h-6 opacity-30'/>
                
                {/* Top section - Rating and Review */}
                <div className="flex-1">
                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm mr-1" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-gray-300 text-sm mr-1" />
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-[#727176] leading-relaxed text-sm mb-6">{testimonial.quote}</p>
                </div>
                
                {/* Bottom section - Reviewer Info */}
                <div className="flex items-center mt-auto">
                  {/* Headshot */}
                  <div className="flex-shrink-0 mr-4">
                    <img 
                      src={testimonial.headshot} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    />
                  </div>
                  
                  {/* Name, Title, Location */}
                  <div className="flex-1">
                    <p className="font-semibold text-[#000000] text-sm mb-1">{testimonial.name}</p>
                    <p className="text-gray-600 text-xs leading-tight mb-1">{testimonial.title}</p>
                    <p className="text-gray-500 text-xs">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " absolute right-[-20px] md:right-[-30px] lg:right-[-40px] top-1/2 transform -translate-y-1/2"}
      style={{ ...style, display: 'block', zIndex: 10 }}
      onClick={onClick}
    >
      <BsChevronRight className="text-black text-2xl" />
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " absolute left-[-20px] md:left-[-30px] lg:left-[-40px] top-1/2 transform -translate-y-1/2"}
      style={{ ...style, display: 'block', zIndex: 10 }}
      onClick={onClick}
    >
      <BsChevronLeft className="text-black text-2xl" />
    </div>
  );
};

export default Testimonials;