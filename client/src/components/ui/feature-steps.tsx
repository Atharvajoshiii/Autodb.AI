import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Feature {
  step: string
  title?: string
  content: string
  image: string
}

interface FeatureStepsProps {
  features: Feature[]
  className?: string
  title?: string
  autoPlayInterval?: number
  imageHeight?: string
}

export function FeatureSteps({
  features,
  className,
  title = "Features",
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // Only set interval if not hovering
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setCurrentFeature((prevFeature) => (prevFeature + 1) % features.length)
      }, autoPlayInterval)
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovering, features.length, autoPlayInterval])

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index)
    
    // Reset the interval when manually clicking
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setCurrentFeature((prevFeature) => (prevFeature + 1) % features.length)
      }, autoPlayInterval)
    }
  }

  return (
    <div className={cn(
      "relative p-4 md:p-6 lg:p-12 bg-white text-black min-h-screen flex items-center justify-center", 
      className
    )}>
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.05)_0%,_rgba(255,255,255,0)_50%)]" />
      </div>
      
      {/* Animated light streaks */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          style={{ top: '20%', left: '-10%' }}
          animate={{ 
            left: ['0%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            repeatType: 'loop',
            ease: 'linear',
            times: [0, 0.5, 1]
          }}
        />
        <motion.div 
          className="absolute h-px w-1/4 bg-gradient-to-r from-transparent via-gray-200 to-transparent"
          style={{ top: '45%', right: '-10%' }}
          animate={{ 
            right: ['0%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            repeatType: 'loop',
            ease: 'linear',
            delay: 2,
            times: [0, 0.5, 1]
          }}
        />
        <motion.div 
          className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-gray-100 to-transparent"
          style={{ top: '70%', left: '-10%' }}
          animate={{ 
            left: ['0%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            repeatType: 'loop',
            ease: 'linear',
            delay: 1,
            times: [0, 0.5, 1]
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center px-4"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
            {title}
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
          {/* Mobile tabs for feature selection - NOW IN 2x2 GRID */}
          <div className="lg:hidden grid grid-cols-2 gap-3 px-4 pb-4 mb-4">
            {features.map((feature, index) => (
              <button
                key={index}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all text-center",
                  index === currentFeature 
                    ? "bg-gray-800 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
                onClick={() => handleFeatureClick(index)}
              >
                <span className="text-sm font-medium">{feature.title || feature.step}</span>
              </button>
            ))}
          </div>

          {/* Side panel with feature indicators - hidden on mobile, 3 columns on desktop */}
          <motion.div 
            className="hidden lg:flex lg:col-span-3 flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "relative mb-4 px-4 py-6 rounded-xl cursor-pointer transition-all duration-300",
                  index === currentFeature 
                    ? "bg-gray-100 border-l-4 border-gray-800" 
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                )}
                whileHover={{ x: 5 }}
                onClick={() => handleFeatureClick(index)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-1">
                    <motion.div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                        index === currentFeature
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-700"
                      )}
                      whileHover={{ scale: 1.1 }}
                      animate={index === currentFeature ? {
                        scale: [1, 1.1, 1],
                        transition: { duration: 0.7, repeat: 1 }
                      } : {}}
                    >
                      <span className="text-base font-bold">{index + 1}</span>
                    </motion.div>
                    
                    <h3 className={cn(
                      "text-lg font-bold transition-colors",
                      index === currentFeature ? "text-black" : "text-gray-600"
                    )}>
                      {feature.title || feature.step}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main feature showcase - full width on mobile, 9 columns on desktop */}
          <motion.div
            className="col-span-1 lg:col-span-9 relative px-4 lg:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div 
              className={cn(
                "relative overflow-hidden rounded-2xl shadow-lg border border-gray-200", 
                imageHeight
              )}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Animated glow effect */}
              <motion.div 
                className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-300   z-0"
                animate={{ 
                  background: [
                    "linear-gradient(90deg, rgba(240,240,240,0.5) 0%, rgba(220,220,220,0.5) 100%)",
                    "linear-gradient(90deg, rgba(220,220,220,0.5) 0%, rgba(240,240,240,0.5) 100%)",
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
              />
              
              <div className="absolute inset-0 bg-white rounded-2xl z-10" />
              
              <AnimatePresence mode="wait">
                {features.map(
                  (feature, index) =>
                    index === currentFeature && (
                      <motion.div
                        key={index}
                        className="absolute inset-0 z-20 flex flex-col lg:flex-row items-center overflow-hidden rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Image section - INCREASED HEIGHT ON MOBILE */}
                        <motion.div 
                          className="w-full h-64 sm:h-72 lg:h-full lg:w-1/2 relative overflow-hidden"
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-20" />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-20 lg:opacity-100" />
                          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent z-20 lg:opacity-0" /> */}
                          
                          <img
                            src={feature.image}
                            alt={feature.title || feature.step}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Accent circle - smaller on mobile */}
                          <div className="absolute top-3 right-3 lg:top-6 lg:right-6 w-16 lg:w-24 h-16 lg:h-24 rounded-full bg-gray-200/50 backdrop-blur-md flex items-center justify-center z-30">
                            <div className="text-3xl lg:text-5xl font-bold text-gray-800/80">{index + 1}</div>
                          </div>
                        </motion.div>
                        
                        {/* Content section - bottom half on mobile, right half on desktop */}
                        <motion.div 
                          className="w-full lg:w-1/2 h-full flex flex-col justify-center p-5 sm:p-6 lg:p-12"
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <div className="mb-2 lg:mb-4 flex items-center">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
                              {feature.step}
                            </span>
                          </div>
                          
                          <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-3 lg:mb-6 text-black">
                            {feature.title}
                          </h3>
                          
                          <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 lg:mb-8">
                            {feature.content}
                          </p>
                          
                          {/* Decorative elements */}
                          <div className="grid grid-cols-3 gap-2 lg:gap-4 mt-2 lg:mt-4">
                            {[1, 2, 3].map((i) => (
                              <motion.div 
                                key={i}
                                className="h-1 lg:h-2 rounded-full bg-gradient-to-r from-gray-600 to-gray-900"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ 
                                  duration: 0.8, 
                                  delay: 0.5 + (i * 0.2)
                                }}
                              />
                            ))}
                          </div>
                          
                          {/* Learn more button - smaller on mobile */}
                          <div className="mt-4 lg:mt-8">
                            <motion.button
                              className="px-4 py-2 lg:px-6 lg:py-3 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-sm lg:text-base font-medium flex items-center gap-2 group transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Learn more
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              >
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                              </svg>
                            </motion.button>
                          </div>
                        </motion.div>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
              
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 z-30">
                <motion.div 
                  className="h-full bg-gradient-to-r from-gray-600 to-gray-900"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: autoPlayInterval / 1000, 
                    ease: "linear",
                    repeat: 0
                  }}
                  key={currentFeature}
                />
              </div>
            </div>
            
            {/* Mobile navigation dots */}
            <div className="flex justify-center mt-4 gap-2 lg:hidden">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentFeature ? "bg-gray-800 w-6" : "bg-gray-300"
                  )}
                  onClick={() => handleFeatureClick(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}