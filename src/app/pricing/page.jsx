import React from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import PricingSection from '../components/home/PricingSection'

const PricingPage = () => {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <main className="pt-[100px]">
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}

export default PricingPage