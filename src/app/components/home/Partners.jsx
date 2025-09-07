import Image from 'next/image'
import React from 'react'

const Partners = () => {
  return (
    <div className='bg-transparent my-[30px]'>
      <div className='max-w-[1440px] mx-auto px-4 md:px-[20px] flex flex-wrap lg:justify-between items-center gap-[50px] justify-center flex-col sm:flex-row'>
        <Image src="/images/home/logo1.svg" width={152} height={40} alt='company logo' />
        <Image src="/images/home/logo2.svg" width={131} height={68} alt='company logo' />
        <Image src="/images/home/logo3.svg" width={130} height={58} alt='company logo' />
        <Image src="/images/home/logo4.svg" width={227} height={48} alt='company logo' />
        <Image src="/images/home/logo5.svg" width={61} height={78} alt='company logo' />
        <Image src="/images/home/logo6.svg" width={148} height={68} alt='company logo' />
      </div>
    </div>
  )
}

export default Partners
