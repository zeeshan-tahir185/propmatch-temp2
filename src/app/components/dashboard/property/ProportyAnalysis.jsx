"use client";
import React, { useState } from 'react';
import SingleAddressSearch from './SingleSearch';
import LeadListAnalysis from './LeadListAnalysis';

const PropertyAnalysis = () => {
  const [isActive, setIsActive] = useState('Single Address');
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (step) => {
    setCurrentStep(step);
    if (isActive === 'Single Address' && step > 0) {
      setShowSteps(true); // Show steps only for Single Address when step > 0
    } else {
      setShowSteps(false); // Hide steps for Lead List or step 0
    }
  };

  return (
    <div className="p-3 md:p-6">
      <div className="flex items-start justify-between mb-4 flex-col md:flex-row">
        <div className='mb-3 md:mb-0'>
          <h1 className="text-base lg:text-xl font-bold text-[#1E2029]">Property Analysis</h1>
          <p className="text-xs lg:text-base text-[#9A9DA4] mt-1 md:mt-2">Simple property analysis tool with AI insights</p>
        </div>
        {showSteps && (
          <div className="flex items-center space-x-2 flex-col gap-2 w-full md:w-auto">
            <div className="w-full md:w-[200px] h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A2B6C] transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-[#1A2B6C] font-medium">Step {currentStep}/4</span>
          </div>
        )}
      </div>
      <div className="mt-5 md:mt-8">
        <h2 className="text-sm lg:text-lg font-semibold text-[#1E2029]">Choose Analysis Type</h2>
        <div className="flex space-x-6 mt-2 justify-between bg-[#F0F2F5] md:bg-transparent p-1 md:p-0 rounded-[5px]">
          <button
            className={`cursor-pointer ${isActive === "Single Address" ? "bg-[#1A2B6C] hover:bg-blue-900 text-white" : "bg-transparent md:bg-[#F0F2F5] hover:bg-gray-200 text-black"}  w-full lg:w-[49%] h-[42px] md:h-[48px] rounded-[5px] text-sm lg:text-[15px] font-medium`}
            onClick={() => setIsActive('Single Address')}
          >
            Single Address
          </button>
          <button
            className={`cursor-pointer ${isActive === "Lead List" ? "bg-[#1A2B6C] hover:bg-blue-900 text-white" : "bg-transparent md:bg-[#F0F2F5] hover:bg-gray-200 text-black"} w-full lg:w-[49%] h-[42px] md:h-[48px] rounded-[5px] text-sm lg:text-[15px] font-medium`}
            onClick={() => {
              setIsActive('Lead List')
              setShowSteps(false)
            }
            }
          >
            Lead List
          </button>
        </div>
      </div>
      {isActive === 'Single Address' && (
        <SingleAddressSearch onStepChange={handleStepChange} />
      )}
      {isActive === 'Lead List' && (
        <LeadListAnalysis onStepChange={handleStepChange} />
      )}
    </div>
  );
};

export default PropertyAnalysis;