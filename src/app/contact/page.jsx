import React, { Suspense } from 'react'
import ContactPage from '../components/contact/ContactPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ContactPage />
      </Suspense>
    </div>
  )
}

export default page