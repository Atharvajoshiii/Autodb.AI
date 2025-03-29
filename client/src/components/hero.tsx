
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextEffect } from '@/components/ui/text-effect';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { HeroHeader } from '@/components/hero5-header';

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

const HeroSection: React.FC = () => {
    return (
        <>
            <HeroHeader />
            <main className="bg-white">
                <section className="relative overflow-hidden">
                    {/* Refined gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 opacity-70 pointer-events-none"></div>
                    
                    {/* Subtle grid pattern overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>
                    
                    <div className="relative pt-24 md:pt-36 z-10">
                        <div className="mx-auto max-w-7xl px-6 text-center">
                            {/* Intro Badge with Enhanced Hover Effect */}
                            <AnimatedGroup variants={transitionVariants}>
                                <a
                                    href="#link"
                                    className="hover:bg-zinc-100 group mx-auto flex w-fit items-center gap-4 rounded-full border border-zinc-200 p-1 pl-4 shadow-md shadow-zinc-950/10 transition-all duration-300 hover:shadow-lg">
                                    <span className="text-zinc-800 text-sm font-medium tracking-tight">Introducing AutoDB for DBMS</span>
                                    <span className="block h-4 w-0.5 bg-zinc-300"></span>
                                    <div className="bg-zinc-100 size-6 overflow-hidden rounded-full duration-500">
                                        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3 text-zinc-700" />
                                            </span>
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3 text-zinc-700" />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </AnimatedGroup>
                            
                            {/* Main Headline with Refined Typography */}
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] text-zinc-900 font-bold tracking-tight leading-[1.1] bg-clip-text">
                                Manage Databases Smarter, Not Harder!
                            </TextEffect>
                            
                            {/* Subheadline with Improved Readability */}
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mx-auto mt-8 max-w-2xl text-balance text-lg text-zinc-600 font-light leading-relaxed tracking-tight">
                                Empower your workflow with AI-driven database management. Automate queries, optimize performance, and Effortlessly work with Diagrammatic workflows
                            </TextEffect>
                            
                            {/* CTA Button with Enhanced Interaction */}
                            <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                <div className="bg-zinc-900/10 rounded-xl border border-zinc-200 p-0.5 transition-all duration-300 hover:shadow-md hover:border-zinc-300">
                                    <Button 
                                        size="lg" 
                                        className="rounded-xl px-5 text-base bg-zinc-900 text-white hover:bg-zinc-800 transition-colors group">
                                        <a href="/home" className="text-nowrap flex items-center gap-2">
                                            Start Building
                                            <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Dashboard Image with Enhanced Presentation */}
                        <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                            <div className="bg-gradient-to-b from-transparent to-white absolute inset-0 z-10 from-35%" aria-hidden></div>
                            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-zinc-200 p-4 shadow-2xl shadow-zinc-950/10 transition-all duration-500 hover:shadow-3xl">
                                <img 
                                    src="./image.png" 
                                    alt="AutoDB Dashboard" 
                                    className="rounded-xl grayscale-[20%] hover:grayscale-0 transition-all duration-500 hover:scale-[1.02]"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default HeroSection;