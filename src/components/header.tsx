'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AccountModal from './accountModal';

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
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

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

    const dropdownItems = useMemo(() => ({
        Shop: ['New Arrivals', 'Bestsellers', 'Sale'],
        Women: ['Dresses', 'Tops', 'Bottoms', 'Outerwear'],
        Men: ['Shirts', 'Pants', 'Jackets', 'Activewear'],
        Kids: ['Baby (0-24m)', 'Toddlers (2-5)', 'Kids (6-12)'],
        Accessories: ['Bags', 'Hats', 'Jewelry', 'Shoes'],
        Collections: ['Summer', 'Winter Essentials', 'Limited Edition'],
    }), []);

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
        <>
            <motion.header
                className="px-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm transition-colors duration-300 fixed w-full z-50"
                initial={{ y: 0 }}
                animate={{ y: isHeaderVisible ? 0 : -100 }}
                transition={{ type: 'smooth', stiffness: 100 }}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 sm:justify-center transition duration-500 hover:scale-110" href="/">
                            <span className="sr-only">apparel.io</span>
                            <svg className="h-8 w-8 text-gray-900 dark:text-gray-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-xl font-bold">apparel.io</span>
                        </Link>

                        <div className="hidden lg:flex items-center">
                            <nav>
                                <ul className="flex space-x-6">
                                    {Object.entries(dropdownItems).map(([title, items]) => (
                                        <li key={title} className="relative group">
                                            <Link
                                                href={`/pages/${title.toLowerCase()}`}
                                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeCategory === title ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                            >
                                                {title}
                                            </Link>
                                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                <div className="py-1">
                                                    {items.map((item) => (
                                                        <Link
                                                            key={item}
                                                            href={`/pages/${title.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className={`block px-4 py-2 text-sm transition-colors duration-200 ${pathname?.includes(item.toLowerCase().replace(/\s+/g, '-')) ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                        >
                                                            {item}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden lg:flex items-center space-x-4">
                            <button
                                onClick={toggleCart}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors duration-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                            <button
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                onClick={() => setIsAccountModalOpen(true)}
                            >
                                Account
                            </button>
                        </div>
                        <div className="flex lg:hidden items-center space-x-4">
                            <button
                                onClick={toggleCart}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors duration-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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
                                        fillRule="evenodd"
                                        d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMobileMenu}
                    >
                        <motion.div
                            className="absolute right-0 top-0 w-full max-w-xs h-full bg-white dark:bg-gray-900 shadow-xl"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 100 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <Link href="/" className="flex items-center space-x-2" onClick={toggleMobileMenu}>
                                    <svg className="h-8 w-8 text-gray-900 dark:text-gray-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-xl font-bold">apparel.io</span>
                                </Link>
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <nav className="p-4">
                                <ul className="space-y-2">
                                    {Object.entries(dropdownItems).map(([title, items]) => (
                                        <li key={title}>
                                            <button
                                                className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${openMenu === title ? 'bg-gray-100 dark:bg-gray-800' : ''} ${activeCategory === title ? 'text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                onClick={() => setOpenMenu(openMenu === title ? null : title)}
                                            >
                                                {title}
                                                <svg
                                                    className={`h-4 w-4 transform transition-transform duration-200 ${openMenu === title ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {openMenu === title && (
                                                <ul className="pl-4 mt-1 space-y-1">
                                                    {items.map((item) => {
                                                        const itemPath = `/pages/${title.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`;
                                                        const isActive = pathname?.includes(item.toLowerCase().replace(/\s+/g, '-'));

                                                        return (
                                                            <li key={item}>
                                                                <Link
                                                                    href={itemPath}
                                                                    className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
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
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    className="block w-full px-4 py-2 text-center rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors duration-200"
                                    onClick={() => {
                                        setIsAccountModalOpen(true);
                                        toggleMobileMenu();
                                    }}
                                >
                                    My Account
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AccountModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
            />
        </>
    );
};

export default Header;