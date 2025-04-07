'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title = "Understand user flow and",
    subtitle = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident accusamus impedit minima harum corporis iusto.",
    ctaPrimary = "Get Started",
    ctaSecondary = "Learn More"
}) => {
    return (
        <section className="relative bg-white/25 lg:grid lg:h-screen lg:place-content-center">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
                <Image
                    src="/Apparel.webp"
                    alt="hero"
                    width={outerHeight}
                    height={outerHeight}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[350px]"
                />
                {/* Reduced Opacity Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-white/25" />
            </div>

            {/* Content */}
            <div className="relative mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                <div className="max-w-prose text-left">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        {title}
                        <strong className="text-indigo-600"> increase </strong>
                        conversions
                    </h1>

                    <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                        {subtitle}
                    </p>

                    <div className="mt-4 flex gap-4 sm:mt-6">
                        <Link
                            href="#"
                            className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                        >
                            {ctaPrimary}
                        </Link>

                        <Link
                            href="#"
                            className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
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