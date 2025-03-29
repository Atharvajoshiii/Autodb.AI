import React from 'react'
import HeroSection from '@/components/hero'
import Footer from '@/components/footer'
import { FeatureStepsDemo } from './featuresection'
import { FAQDemo } from './faq'
import AIDbRoadmap from './roadmap'
function landingpage() {
  return (
    <>
      <HeroSection/>
      <FeatureStepsDemo/>
      <AIDbRoadmap/>
      <FAQDemo/>
      
      <Footer/>
      
    </>
  )
}

export default landingpage
