import React from 'react';

const CTA = () => {
    return (
        <section
            className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage:
                    'url(https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2670&auto=format&fit=crop)',
            }}
            aria-label="Call to Action - Latest Shirts"
        >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 p-8 md:p-12 lg:px-16 lg:py-24">
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl">
                        Latest Shirts
                    </h2>
                    <p className="hidden max-w-lg md:mt-6 md:block md:text-lg md:leading-relaxed text-gray-200">
                        Discover the finest selection of shirts crafted with care and designed for every occasion.
                        Comfort and style, all in one.
                    </p>
                    <div className="mt-4 sm:mt-8">
                        <a
                            href="#"
                            className="inline-block rounded-full bg-indigo-600 px-12 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                        >
                            Get Yours Today
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
