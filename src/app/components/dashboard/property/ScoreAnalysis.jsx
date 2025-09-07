import React from 'react'
import { GoArrowDownRight, GoArrowUpRight } from 'react-icons/go'

const ScoreAnalysis = ({scoreData}) => {
    return (
        <div>
            <h2 className="text-lg font-bold text-[#1E2029] mb-6">
                AI-Optimized Pricing Strategy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#F4F6F8] p-4 rounded-[16px] border border-[#EDEDED] flex justify-between items-center">
                    <div className="">
                        <h3 className="text-sm font-semibold text-[#000000]">Quick Sale (2 months)</h3>
                        <p className="text-xl md:text-[32px] text-[#1A2B6C] font-semibold">${scoreData.listing_prices.quick_sale_2_months.toLocaleString()} </p>
                    </div>
                    <button className='flex justify-center items-center gap-2  bg-[#DC2626] rounded-[3px] text-white w-[89px] h-[32px] texe-base font-semibold'><GoArrowDownRight /> -6.4%</button>
                </div>
                <div className="bg-[#F4F6F8] p-4 rounded-[16px] border border-[#EDEDED] flex justify-between items-center">
                    <div className="">
                        <h3 className="text-sm font-semibold text-[#000000]">Market Pace (6 months)</h3>
                        <p className="text-xl md:text-[32px] text-[#1A2B6C] font-semibold">${scoreData.listing_prices.market_pace_6_months.toLocaleString()}</p>
                    </div>
                    <button className='flex justify-center items-center gap-2 bg-[#E5E7EB] rounded-[3px] text-black w-[89px] h-[32px] texe-base font-semibold'>Baseline</button>
                </div>
                <div className="bg-[#F4F6F8] p-4 rounded-[16px] border border-[#EDEDED] flex justify-between items-center">
                    <div className="">
                        <h3 className="text-sm font-semibold text-[#000000]">Patient Sale (12 month)</h3>
                        <p className="text-xl md:text-[32px] text-[#1A2B6C] font-semibold">${scoreData.listing_prices.patient_sale_12_months.toLocaleString()}</p>
                    </div>
                    <button className='flex justify-center rounded-[3px] items-center gap-2 bg-[#16A34A] text-white w-[89px] h-[32px] texe-base font-semibold'><GoArrowUpRight /> +5.1%</button>
                </div>
            </div>
            <h2 className="text-lg font-bold text-[#1E2029] mb-2 md:mb-6 mt-6 md:mt-0">
                Statistical Analysis
            </h2>
            <div className="p-2 md:p-0 bg-[#F8F9FB] min-h-[48px] border border-[#EDEDED] rounded-[12px] mb-4 flex px-3 items-center">
                <p className="text-base p-3">{scoreData.statistical_reasoning}</p>
            </div>
        </div>
    )
}

export default ScoreAnalysis
