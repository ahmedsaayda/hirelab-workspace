"use server"
import LandingpagePage from '../../../pages/Landingpage'
import React from 'react'

function Page({params}: {params: {slug: string}}) {
  return (
<LandingpagePage paramsId={params.slug} 
setFullscreen={null}
/>
  )
}

export default Page
