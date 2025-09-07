import React, { Suspense } from 'react'
import PrivacyPolicyPage from '../components/legal/PrivacyPolicyPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PrivacyPolicyPage />
      </Suspense>
    </div>
  )
}

export default page