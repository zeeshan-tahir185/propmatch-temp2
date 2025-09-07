import Link from 'next/link';
import React from 'react'
import { BsMouse } from "react-icons/bs";

const HomeHero = () => {
    return (
        <div className='max-w-[1440px] mx-auto home_hero_bg min-h-[500px] rounded-[10px] z-20'>
            <div className=' text-white flex flex-col justify-between items-center w-full lg:w-[55%] p-5 md:p-0 mx-auto text-center min-h-[500px] '>
                <h1 className='text-[22px] md:text-[46px] font-bold mt-[70px] leading-[110%]'>Turn Cold Leads into Listings with
                    AI-Powered Real Estate Tools
                </h1>
                <p className='text-[15px]'>
                    Instantly predict which homes will list next.
                </p>
                <div className='flex justify-center items-center gap-[25px] flex-col md:flex-row mb-[70px] md:mb-0'>
                    <button className='text-[15px] font-semibold w-[200px] h-[48px] rounded-[5px] bg-[#1A2B6C] cursor-pointer hover:bg-blue-900 border border-[#1A2B6C]'><Link href="/login?redirect=property-search">Analyze Property</Link></button>
                    <button className='text-[15px] font-semibold w-[200px] h-[48px] rounded-[5px] border border-white cursor-pointer hover:bg-[#1A2B6C] hover:border-0 bg-transparent'><Link href="/login?redirect=lead-ranking">Rank Leads</Link></button>
                </div>
                <div className='md:flex flex-col justify-center items-center hidden mb-[30px] gap-2'>
                    <BsMouse className='w-[24px] h-[24px]' />
                    <p className='text-sm'>Scroll down to explore</p>
                </div>
            </div>
        </div>
    )
}

export default HomeHero
