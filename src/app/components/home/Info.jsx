import React from 'react'

const Info = () => {
    return (
        <div className='bg-white'>
            <div className='max-w-[1440px] mx-auto mb-0 mt-[70px] md:my-[70px] px-3 w-full md:w-[90%] xl:w-[75%] flex justify-between items-center flex-col md:flex-row md:border-b md:pb-[50px] border-[#EDEDED]'>
                <div className='flex items-center gap-3 flex-col md:flex-row  mb-[50px] md:mb-0 border-b border-[#EDEDED] md:border-0 w-[90%] md:w-[30%] pb-[50px] md:pb-0'>
                    <h2 className='text-4xl font-semibold text-[#1A2B6C]'>83%</h2>
                    <h3 className='text-xl text-center md:text-left leading-[28px]'>average seller-score <br /> accuracy</h3>
                </div>
                <div className='flex items-center gap-3 flex-col md:flex-row  mb-[50px] md:mb-0 border-b border-[#EDEDED] md:border-0 w-[90%] md:w-[30%] pb-[50px] md:pb-0'>
                    <h2 className='text-4xl font-semibold text-[#1A2B6C]'>15 sec.</h2>
                    <h3 className='text-xl text-center md:text-left leading-[28px]'>avg. time to<br /> generate report</h3>
                </div>
                <div className='flex items-center gap-3 flex-col md:flex-row  mb-[50px] md:mb-0 border-b border-[#EDEDED] md:border-0 w-[90%] md:w-[30%] pb-[50px] md:pb-0'>
                    <h2 className='text-4xl font-semibold text-[#1A2B6C]'>29%</h2>
                    <h3 className='text-xl text-center md:text-left leading-[28px]'>lead-to-listing <br /> conversion increase</h3>
                </div>
            </div>
        </div>
    )
}

export default Info
