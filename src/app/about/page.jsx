import React, { Suspense } from 'react'
import AboutUsPage from '../components/about/AboutUsPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AboutUsPage />
      </Suspense>
    </div>
  )
}

export default page