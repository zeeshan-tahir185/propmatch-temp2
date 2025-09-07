import React from 'react'
import PropertySearchSection from '../components/products/PropertySearchSection'
import AIOutreachSection from '../components/products/AIOutreachSection'
import ProfessionalReport from '../components/products/ProfessionalReport'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'

const page = () => {
  return (
    <div>
        <Navbar />
      <PropertySearchSection />
      <AIOutreachSection />
      <ProfessionalReport />
      <Footer />
    </div>
  )
}

export default page
