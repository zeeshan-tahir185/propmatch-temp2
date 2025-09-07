import React, { Suspense } from 'react'
import TermsOfServicePage from '../components/legal/TermsOfServicePage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TermsOfServicePage />
      </Suspense>
    </div>
  )
}

export default page