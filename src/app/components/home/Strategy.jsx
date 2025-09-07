import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { MdOutlineRocketLaunch } from "react-icons/md";

const Strategy = () => {
    return (
        <div className='bg-white '>
            <div className='max-w-[1440px] mx-auto px-2 min-h-[400px] strategy_bg_custom rounded-[10px] flex flex-col md:flex-row justify-between items-center gap-[30px] py-[30px] md:py-0'>
                <Image src="/images/home/strategy2.svg" alt='strategy image' width={400} height={326} className='mt-[30px] hidden lg:flex' />
                <div className='flex flex-col justify-center items-center text-center gap-7 order-2 md:order-1'>
                    <h3 className='text-3xl md:text-[46px] font-bold text-white'>Ready to Transform Your
                        Real Estate Strategy?</h3>
                    <button className='w-[220px] cursor-pointer hover:bg-transparent hover:border border-white hover:text-white h-[48px] rounded-[5px] bg-white text-sm font-semibold '>
                        <Link href="/login?redirect=dashboard" className='flex justify-center items-center gap-2'>
                            <MdOutlineRocketLaunch className='text-[22px]' />
                            Get Started Now
                        </Link>
                    </button>
                </div>
                <Image src="/images/home/strategy1.svg" alt='strategy image' width={400} height={326} className='ml-[-40px] md:ml-0 mt-[30px] order-1 md:order-2' />
            </div>
        </div>
    )
}

export default Strategy
