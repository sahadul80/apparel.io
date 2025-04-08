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
        <motion.header
            className="header-container"
            initial={{ y: 0 }}
            animate={{ y: isHeaderVisible ? 0 : -100 }}
            transition={{ type: 'smooth', stiffness: 100 }}
        >
            <div className="header-content">
                <div className="header-inner">
                    <Link className="logo-link" href="/">
                        <span className="sr-only">apparel.io</span>
                        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="logo-text">apparel.io</span>
                    </Link>

                    <div className="desktop-nav">
                        <nav aria-label="Global">
                            <ul className="nav-list">
                                {Object.entries(dropdownItems).map(([title, items]) => (
                                    <li key={title} className="nav-item">
                                        <Link
                                            href={`./pages/${title.toLowerCase()}`}
                                            className={`nav-link ${activeCategory === title ? 'active' : ''}`}
                                        >
                                            {title}
                                        </Link>
                                        <motion.div
                                            className="dropdown-menu"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {items.map((item) => (
                                                <Link
                                                    key={item}
                                                    href={`./pages/${title.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className={`dropdown-item ${pathname?.includes(item.toLowerCase().replace(/\s+/g, '-')) ? 'active' : ''}`}
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

                    <div className="desktop-actions">
                        <button
                            onClick={toggleCart}
                            className="cart-button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="cart-icon"
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
                                <span className="cart-badge">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        <Link
                            className="account-button"
                            href="#"
                        >
                            Account
                        </Link>
                    </div>

                    <div className="mobile-actions">
                        <div className="mobile-buttons">
                            <button
                                onClick={toggleCart}
                                className="mobile-cart-button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mobile-cart-icon"
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
                                    <span className="mobile-cart-badge">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={toggleMobileMenu}
                                className="mobile-menu-button"
                            >
                                <svg
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="mobile-menu-icon"
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
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMobileMenu}
                    >
                        <motion.div
                            className="mobile-menu-panel"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 100 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mobile-menu-header">
                                <Link href="/" className="mobile-menu-logo" onClick={toggleMobileMenu}>
                                    <svg className="mobile-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="mobile-logo-text">apparel.io</span>
                                </Link>
                                <button
                                    onClick={toggleMobileMenu}
                                    className="mobile-menu-close"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mobile-close-icon"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <nav className="mobile-menu-content">
                                <ul className="mobile-menu-list">
                                    {Object.entries(dropdownItems).map(([title, items]) => (
                                        <li key={title} className="mobile-menu-item">
                                            <button
                                                className={`mobile-menu-button ${openMenu === title ? 'open' : ''} ${activeCategory === title ? 'active' : ''}`}
                                                onClick={() => setOpenMenu(openMenu === title ? null : title)}
                                            >
                                                {title}
                                                <svg
                                                    className={`mobile-menu-chevron ${openMenu === title ? 'open' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {openMenu === title && (
                                                <ul className="mobile-submenu">
                                                    {items.map((item) => {
                                                        const itemPath = `/${title.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`;
                                                        const isActive = pathname?.includes(item.toLowerCase().replace(/\s+/g, '-'));

                                                        return (
                                                            <li key={item} className="mobile-submenu-item">
                                                                <Link
                                                                    href={itemPath}
                                                                    className={`mobile-submenu-link ${isActive ? 'active' : ''}`}
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
                            <div className="mobile-menu-footer">
                                <Link
                                    href="#"
                                    className="mobile-account-button"
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