'use client';
import Head from 'next/head';
import Link from 'next/link';

const NotFound = () => {
    return (
        <html className="h-full scroll-pt-20 scroll-smooth" lang="en" dir="ltr">
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="noindex" />
                <title>404 | HyperUI</title>
                <meta name="description" content="Uh-oh! It appears this page doesn't exist." />

                {/* Open Graph / Facebook */}
                <meta property="og:title" content="404 | HyperUI" />
                <meta property="og:description" content="Uh-oh! It appears this page doesn't exist." />
                <meta property="og:url" content="https://www.hyperui.dev" />
                <meta property="og:site_name" content="HyperUI" />
                <meta property="og:image" content="https://www.hyperui.dev/og.jpg" />
                <meta property="og:image:width" content="2400" />
                <meta property="og:image:height" content="1260" />
                <meta property="og:image:alt" content="HyperUI" />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="404 | HyperUI" />
                <meta name="twitter:description" content="Uh-oh! It appears this page doesn't exist." />
                <meta name="twitter:image" content="https://www.hyperui.dev/og.jpg" />
                <meta name="twitter:image:width" content="2400" />
                <meta name="twitter:image:height" content="1260" />
                <meta name="twitter:image:alt" content="HyperUI" />

                <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="200x200" />
            </Head>

            <body className="__variable_d65c78 font-sans antialiased">
                <a href="#mainContent" className="absolute left-1/2 z-999 -translate-x-1/2 -translate-y-full bg-black px-6 py-3 text-white transition-transform focus:translate-y-0">
                    Skip to Main Content
                </a>

                <header className="sticky inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
                    <div className="mx-auto max-w-screen-xl px-4 relative flex h-16 items-center justify-between gap-4 sm:gap-8">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <div className="inline-flex gap-1.5 text-sm">
                                    <span className="font-medium text-gray-900">HyperUI</span>
                                    <span aria-hidden="true" role="img">??</span>
                                </div>
                            </Link>

                            <nav className="hidden md:block">
                                <ul className="gap-4 flex">
                                    <li>
                                        <Link className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:opacity-75" href="/components/application">
                                            Application
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:opacity-75" href="/components/marketing">
                                            Marketing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:opacity-75" href="/blog">
                                            Blog
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                            <a href="https://github.com/markmead/hyperui" rel="noreferrer" target="_blank" className="inline-flex items-center gap-2 text-gray-900 hover:opacity-75">
                                <span className="sr-only">GitHub</span>
                                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">11k</span>
                            </a>
                        </div>
                    </div>
                </header>

                <section className="-mt-px border-y border-gray-200 bg-gray-100">
                    <div className="mx-auto max-w-screen-xl px-4 py-2">
                        <a href="https://github.com/markmead/hyperui" rel="noreferrer" target="_blank" className="flex items-center justify-center gap-1.5 transition hover:opacity-75">
                            <span className="text-sm/none font-medium">Enjoy HyperUI? Give it a star on GitHub</span>
                            <span aria-hidden="true" role="img">??</span>
                        </a>
                    </div>
                </section>

                <main className="bg-white">
                    <div className="grid h-[600px] place-content-center bg-white px-4">
                        <h1 className="tracking-widest text-gray-700 uppercase">404 | Not Found</h1>
                    </div>
                </main>

                <footer className="border-t border-gray-200 bg-white">
                    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:py-12">
                        <Link href="/">
                            <div className="inline-flex gap-1.5 text-lg">
                                <span className="font-medium text-gray-900">HyperUI</span>
                                <span aria-hidden="true" role="img">??</span>
                            </div>
                        </Link>

                        <div className="mt-6">
                            <p className="max-w-md leading-relaxed text-pretty text-gray-700">
                                Free open source Tailwind CSS components for marketing and eCommerce websites, as well as application interfaces.
                            </p>

                            <div className="mt-4 lg:flex lg:items-end lg:justify-between">
                                <ul className="flex gap-4">
                                    <li>
                                        <Link className="block text-sm font-medium text-gray-900 hover:opacity-75" href="/about/faqs">
                                            FAQs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="block text-sm font-medium text-gray-900 hover:opacity-75" href="/about/acknowledgements">
                                            Acknowledgements
                                        </Link>
                                    </li>
                                </ul>

                                <p className="mt-4 text-sm text-gray-700 lg:mt-0">
                                    Created by{' '}
                                    <a href="https://github.com/markmead" rel="noreferrer" target="_blank" className="inline-block font-medium hover:text-gray-900">
                                        Mark Mead
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
};

export default NotFound;