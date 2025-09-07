import React from 'react';
import Image from 'next/image';

const Features = () => {
  return (
    <div className="py-12 bg-white">
      <div className="text-center w-full">
        <h2 className="text-[#FF6978] text-base font-semibold tracking-wide uppercase ">KEY FEATURES</h2>
        <h1 className="text-3xl md:text-[46px] font-bold text-[rgb(42,42,42)] mt-2 ">Advanced AI Tools for <br /> Modern Agents</h1>
      </div>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-[10px] border border-[#EDEDED] text-center min-h-[200px] flex flex-col items-center justify-center">
          <Image src="/images/home/icon1.png" alt="Sale Likelihood" width={32} height={32} className="mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">AI-Powered Sale Likelihood Prediction</h3>
          <p className="mt-2 text-gray-600">Instantly identify homes most likely to sell next.</p>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-[#EDEDED] text-center min-h-[200px] flex flex-col items-center justify-center">
          <Image src="/images/home/icon2.png" alt="Sale Likelihood" width={32} height={32} className="mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">3-Tier Listing Price Generator</h3>
          <p className="mt-2 text-gray-600">Accurate AI pricing for 30, 60, or 90-day sales cycles.</p>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-[#EDEDED] text-center min-h-[200px] flex flex-col items-center justify-center">
         <Image src="/images/home/icon3.png" alt="Sale Likelihood" width={32} height={32} className="mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Statistical Property Reports</h3>
          <p className="mt-2 text-gray-600">Generate client-ready property reports instantly.</p>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-[#EDEDED] text-center min-h-[200px] flex flex-col items-center justify-center">
          <Image src="/images/home/icon4.png" alt="Sale Likelihood" width={32} height={32} className="mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Personalized Outreach Messages</h3>
          <p className="mt-2 text-gray-600">AI-crafted cold outreach proven to boost replies.</p>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-[#EDEDED] text-center min-h-[200px] flex flex-col items-center justify-center">
          <Image src="/images/home/icon5.png" alt="Sale Likelihood" width={32} height={32} className="mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">CRM Lead Scoring & Upload</h3>
          <p className="mt-2 text-gray-600">Auto-prioritize your CRM leads based on AI insights.</p>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-[#EDEDED] text-center min-h-[200px] flex flex-col items-center justify-center">
          <Image src="/images/home/icon6.png" alt="Sale Likelihood" width={32} height={32} className="mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Ownership & Market Data Engine</h3>
          <p className="mt-2 text-gray-600">Real-time homeowner and market data at your fingertips.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;