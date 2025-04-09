'use client';
import React from 'react';
import Image from 'next/image';

interface FeatureSectionProps {
    title?: string;
    description?: string;
    imageUrl?: string;
    reverse?: boolean;
    className?: string;
}

const Content = ({
    title = "Transform Your Digital Experience",
    description = "Discover innovative solutions that redefine user interactions and elevate your online presence. Our cutting-edge technology ensures seamless integration and outstanding performance.",
    imageUrl = "https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reverse = false,
    className = ""
}: FeatureSectionProps) => {
    return (
        <section className={`py-16 dark:bg-gray-900 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 md:grid-cols-2 items-center gap-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`${reverse ? 'md:order-2' : 'md:order-1'}`}>
                        <Image
                            src={imageUrl}
                            alt={title || "Feature image"}
                            width={800}
                            height={600}
                            layout="responsive"
                            className="rounded-lg object-cover shadow-lg dark:brightness-90 transition-all duration-300"
                            priority
                        />
                    </div>
                    <div className={`${reverse ? 'md:order-1' : 'md:order-2'} space-y-6`}>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
                            {title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                            {description}
                        </p>
                        <div className="mt-6">
                            <button className="inline-block rounded-lg bg-indigo-600 px-8 py-3.5 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all duration-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-500/30">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Content;