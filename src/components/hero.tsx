'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    highlightWord?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title = "Understand user flow and",
    subtitle = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident accusamus impedit minima harum corporis iusto.",
    ctaPrimary = "Get Started",
    ctaSecondary = "Learn More",
    highlightWord = "increase"
}) => {
    return (
        <section className="relative min-h-screen w-full overflow-hidden lg:grid lg:place-content-center">
            {/* Background Image with dark mode adjustment */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <Image
                    src="/Apparel.webp"
                    alt="hero background"
                    fill
                    priority
                    quality={100}
                    className="h-full w-full object-cover object-center dark:brightness-50 dark:contrast-125"
                />

                {/* Gradient Overlay - changes with dark mode */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-gray-900/90 dark:via-gray-900/60 dark:to-gray-900/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
                <div className="max-w-2xl text-left">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                        {title}{" "}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-indigo-400 dark:from-indigo-400 dark:to-purple-400">
                            {highlightWord}{" "}
                        </span>
                        conversions
                    </h1>

                    <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600 dark:text-gray-300">
                        {subtitle}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            href="#"
                            className="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                            {ctaPrimary}
                        </Link>

                        <Link
                            href="#"
                            className="rounded-md bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-lg ring-1 ring-gray-900/10 transition-all hover:bg-gray-50 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 dark:bg-gray-800/50 dark:text-white dark:ring-white/10 dark:hover:bg-gray-800"
                        >
                            {ctaSecondary}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;