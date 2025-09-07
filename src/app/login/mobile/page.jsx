import React, { Suspense } from 'react'
import MobileLoginPage from '../../components/login/MobileLoginPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MobileLoginPage />
      </Suspense>
    </div>
  )
}

export default page