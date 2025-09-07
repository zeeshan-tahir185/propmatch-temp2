import React from 'react'

const PropertySearchSection = () => {
  return (
    <div className='max-w-7xl mx-auto mt-[100px]'>
        <section className="mx-6 my-6 p-12  rounded-2xl">
  <h2 className="text-center text-4xl font-extrabold text-[#0a2c53] mb-12 tracking-wide">
    Why PropMatch AI Works
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="text-center p-6 bg-white rounded-xl border hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="text-5xl mb-6">🎯</div>
      <h3 className="text-2xl font-semibold mb-4">
        Precision Targeting
      </h3>
      <p className="text-gray-600">
        AI analyzes 400+ factors to identify sellers with 92% accuracy
        before they list
      </p>
    </div>
    <div className="text-center p-6 bg-white rounded-xl border hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="text-5xl mb-6">💰</div>
      <h3 className="text-2xl font-semibold mb-4">
        Proven ROI
      </h3>
      <p className="text-gray-600">
        3x conversion rate vs traditional prospecting with data-driven
        insights
      </p>
    </div>
    <div className="text-center p-6 bg-white rounded-xl border hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="text-5xl mb-6">⏱️</div>
      <h3 className="text-2xl font-semibold mb-4">
        Time Efficiency
      </h3>
      <p className="text-gray-600">
        From address to actionable insight in under 20 seconds with
        comprehensive analysis
      </p>
    </div>
  </div>
</section>
    </div>
  )
}

export default PropertySearchSection
