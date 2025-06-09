import React, { useState, useEffect } from 'react';
import { CheckCircle2, Edit2, Upload, Database, Code, Layers, Cpu, Zap } from 'lucide-react';

const AIDbRoadmap = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const roadmapSteps = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Describe Your Needs",
      description: "Simply enter a natural language prompt explaining your data requirements.",
      details: "Use plain English to outline tables, columns, data types, and connections between entities.",
      additionalIcon: <Layers className="absolute top-2 right-2 w-5 h-5 opacity-20" />
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "AI Generation",
      description: "Instantly generate a structured database schema and SQL script.",
      details: "Automatic creation of SQL scripts, ORM models, and database migration files.",
      additionalIcon: <Cpu className="absolute top-2 right-2 w-5 h-5 opacity-20" />
    },
    {
      icon: <Edit2 className="w-8 h-8" />,
      title: "Edit & Refine",
      description: "Customize the generated schema with an intuitive visual editor.",
      details: "Modify tables, adjust relationships, add constraints, and fine-tune the generated code.",
      additionalIcon: <Zap className="absolute top-2 right-2 w-5 h-5 opacity-20" />
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Export & Integrate",
      description: "Export your database schema in multiple formats.",
      details: "Support for SQL, JSON, TypeScript interfaces, and various ORM configurations.",
      additionalIcon: <Zap className="absolute top-2 right-2 w-5 h-5 opacity-20" />
    }
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % roadmapSteps.length);
    }, 3000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-white text-black h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Mouse-Tracking Background Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0.05), transparent 50%)`
        }}
      />

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-black overflow-hidden relative z-10">
        <div className="p-6">
          <h1 className="text-3xl md:text-4xl font-black mb-2 text-center tracking-tight leading-tight relative">
            From Idea to Database in Seconds
            <span className="absolute -top-1 -right-1 text-xs bg-black text-white px-2 py-0.5 rounded-full">
              AI
            </span>
          </h1>
          <p className="text-center text-gray-800 text-base md:text-lg mb-8 font-medium">
            Transform your database design with a single prompt
          </p>

          <div className="relative space-y-4">
            {roadmapSteps.map((step, index) => (
              <div 
                key={index} 
                className={`
                  flex items-center p-4 rounded-2xl transition-all duration-700 ease-in-out
                  border-2 border-black/10 hover:border-black/30 relative
                  ${activeStep === index 
                    ? 'scale-[1.02] shadow-xl bg-black/[0.03]' 
                    : 'bg-white opacity-70 hover:opacity-100'}
                  transform origin-center
                `}
              >
                {/* Additional Small Icon */}
                {step.additionalIcon}

                {/* Step Indicator */}
                <div className="mr-4 md:mr-6 relative">
                  <div 
                    className={`
                      w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center 
                      border-2 border-black
                      ${activeStep === index 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black'}
                      transition-all duration-500
                      shadow-md
                      ${activeStep === index ? 'animate-pulse' : ''}
                    `}
                  >
                    {step.icon}
                  </div>
                  {index < roadmapSteps.length - 1 && (
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-8 
                        bg-black/30 mt-2"
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 
                    className={`
                      text-xl md:text-2xl font-bold mb-1
                      ${activeStep === index ? 'text-black' : 'text-black/60'}
                      transition-colors duration-500
                    `}
                  >
                    {step.title}
                  </h3>
                  <p 
                    className={`
                      text-sm md:text-base
                      ${activeStep === index 
                        ? 'text-black' 
                        : 'text-black/50'}
                      transition-colors duration-500
                    `}
                  >
                    {step.description}
                  </p>
                  {activeStep === index && (
                    <p className="text-black/70 mt-2 text-xs md:text-sm opacity-80 italic">
                      {step.details}
                    </p>
                  )}
                </div>

                {/* Checkmark */}
                {activeStep > index && (
                  <CheckCircle2 
                    className="w-8 h-8 text-black animate-pulse" 
                    strokeWidth={3}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDbRoadmap;