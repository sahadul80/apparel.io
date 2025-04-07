'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    toggleCart: () => void;
    cartItemCount: number;
}

const Header = ({ toggleCart, cartItemCount }: HeaderProps) => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsHeaderVisible(false);
            } else {
                setIsHeaderVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Memoize dropdownItems to prevent unnecessary recreations
    const dropdownItems = useMemo(() => ({
        Shop: ['New Arrivals', 'Bestsellers', 'Sale'],
        Women: ['Dresses', 'Tops', 'Bottoms', 'Outerwear'],
        Men: ['Shirts', 'Pants', 'Jackets', 'Activewear'],
        Kids: ['Baby (0-24m)', 'Toddlers (2-5)', 'Kids (6-12)'],
        Accessories: ['Bags', 'Hats', 'Jewelry', 'Shoes'],
        Collections: ['Summer', 'Winter Essentials', 'Limited Edition'],
    }), []); // Empty dependency array means this object is created once

    // Determine active main category based on pathname
    const activeCategory = useMemo(() => {
        if (!pathname) return null;

        const lowerPath = pathname.toLowerCase();

        for (const [category, items] of Object.entries(dropdownItems)) {
            if (lowerPath.includes(category.toLowerCase())) {
                return category;
            }

            for (const item of items) {
                if (lowerPath.includes(item.toLowerCase())) {
                    return category;
                }
            }
        }

        return null;
    }, [dropdownItems, pathname]);

    return (
        <motion.header
            className="bg-white fixed w-full z-50 shadow-sm"
            initial={{ y: 0 }}
            animate={{ y: isHeaderVisible ? 0 : -100 }}
            transition={{ type: 'smooth', stiffness: 100 }}
        >
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link className="flex items-center gap-2" href="/">
                        <span className="sr-only">apparel.io</span>
                        <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-xl font-bold text-indigo-600">apparel.io</span>
                    </Link>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-sm">
                                {Object.entries(dropdownItems).map(([title, items]) => (
                                    <li key={title} className="relative group">
                                        <Link
                                            href={`./pages/${title.toLowerCase()}`}
                                            className={`text-gray-700 transition font-medium ${activeCategory === title ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-indigo-600'}`}
                                        >
                                            {title}
                                        </Link>
                                        <motion.div
                                            className="absolute left-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {items.map((item) => (
                                                <Link
                                                    key={item}
                                                    href={`./pages/${title.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className={`block px-4 py-2 text-sm ${pathname?.includes(item.toLowerCase().replace(/\s+/g, '-')) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                                >
                                                    {item}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search apparel..."
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                        <button
                            onClick={toggleCart}
                            className="relative rounded-full bg-gray-100 p-2 text-gray-600 transition hover:text-indigo-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        <Link
                            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700"
                            href="#"
                        >
                            Account
                        </Link>
                    </div>

                    <div className="block md:hidden">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleCart}
                                className="relative rounded-full bg-gray-100 p-2 text-gray-600 transition hover:text-indigo-600"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={toggleMobileMenu}
                                className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:text-indigo-600"
                            >
                                <svg
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                >
                                    <path
                                        fill="#000000"
                                        fillRule="evenodd"
                                        d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMobileMenu}
                    >
                        <motion.div
                            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 100 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 flex justify-between items-center border-b">
                                <Link href="/" className="flex items-center gap-2" onClick={toggleMobileMenu}>
                                    <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-lg font-bold text-indigo-600">apparel.io</span>
                                </Link>
                                <button
                                    onClick={toggleMobileMenu}
                                    className="text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4 border-b">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search apparel..."
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <nav className="overflow-y-auto h-[calc(100%-180px)]">
                                <ul className="space-y-1 p-4">
                                    {Object.entries(dropdownItems).map(([title, items]) => (
                                        <li key={title}>
                                            <button
                                                className={`w-full text-left py-3 px-4 font-medium flex justify-between items-center ${activeCategory === title ? 'text-indigo-600 bg-indigo-50 rounded-md' : 'text-gray-700'}`}
                                                onClick={() => setOpenMenu(openMenu === title ? null : title)}
                                            >
                                                {title}
                                                <svg
                                                    className={`h-4 w-4 transition-transform ${openMenu === title ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {openMenu === title && (
                                                <ul className="pl-6 pb-2">
                                                    {items.map((item) => {
                                                        const itemPath = `/${title.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`;
                                                        const isActive = pathname?.includes(item.toLowerCase().replace(/\s+/g, '-'));

                                                        return (
                                                            <li key={item}>
                                                                <Link
                                                                    href={itemPath}
                                                                    className={`block py-2 px-4 rounded-md ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                                    onClick={toggleMobileMenu}
                                                                >
                                                                    {item}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                                <Link
                                    href="#"
                                    className="block w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white text-center hover:bg-indigo-700"
                                    onClick={toggleMobileMenu}
                                >
                                    My Account
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;