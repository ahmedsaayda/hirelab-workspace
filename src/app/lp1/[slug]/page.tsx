import LandingpagePage from '../../../pages/Landingpage'
import React from 'react'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  
  return (
    <LandingpagePage 
      paramsId={slug} 
      setFullscreen={null}
    />
  )
}
