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
        <section className={`py-12 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 md:grid-cols-2 items-center gap-8 ${reverse ? 'md:flex-row-reverse' : ''}`}>
                    <div>
                        <Image
                            src={imageUrl}
                            alt={title || "Feature image"}
                            width={800}
                            height={600}
                            layout="responsive"
                            className="rounded-lg object-cover shadow-lg"
                            priority
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            {title}
                        </h2>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            {description}
                        </p>
                        <div className="mt-6">
                            <button className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20">
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
