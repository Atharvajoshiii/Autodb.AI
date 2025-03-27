import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
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
            <main className="overflow-hidden">
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <div className="mx-auto max-w-7xl px-6 text-center">
                            <AnimatedGroup variants={transitionVariants}>
                                <a
                                    href="#link"
                                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                    <span className="text-foreground text-sm">Introducing AutoDB for DBMS</span>
                                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3" />
                                            </span>
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3" />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </AnimatedGroup>
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                Manage Databases Smarter, Not Harder!
                            </TextEffect>
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                Empower your workflow with AI-driven database management. Automate queries, optimize performance, and Effortlessly work with Diagramtic workflows
                            </TextEffect>
                            <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                <div className="bg-foreground/10 rounded-xl border p-0.5">
                                    <Button size="lg" className="rounded-xl px-5 text-base">
                                        <a href="/home" className="text-nowrap">Start Building</a>
                                    </Button>
                                </div>
                                
                            </div>
                        </div>
                        <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                            <div className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%" aria-hidden></div>
                            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg ring-1">
                                <img src="./image.png" alt="image" />
                                
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default HeroSection;
