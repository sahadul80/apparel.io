'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Alert from './alert';

export type AlertType = "error" | "warning" | "success";

// Dynamically import Modal to avoid SSR issues
const Modal = dynamic(() => import('react-modal'), {
    ssr: false,
    loading: () => null,
});

// Define types for the product
type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
    colors: string[];
    description?: string;
    rating?: number;
};

type Filters = {
    availability: string[];
    price: { from: string; to: string };
    colors: string[];
    search: string;
    rating?: number;
};

export type CartItem = {
    id: number;
    name: string;
    price: number;
    image: string;
    color: string[];
    quantity: number;
};

interface ProductCollectionProps {
    addToCart: (product: CartItem) => void;
}

const testProducts: Product[] = [
    {
        id: 1,
        name: 'Premium Cotton Tee',
        price: 24.0,
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        inStock: true,
        colors: ['red', 'blue'],
        description: 'Soft premium cotton t-shirt with comfortable fit and durable quality.',
        rating: 4.5,
    },
    {
        id: 2,
        name: 'Classic Fit Shirt',
        price: 29.0,
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        inStock: false,
        colors: ['green', 'purple'],
        description: 'Classic fit shirt with button-down collar and premium fabric.',
        rating: 4.2,
    },
    {
        id: 3,
        name: 'Slim Fit Jeans',
        price: 34.0,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        inStock: true,
        colors: ['blue', 'black'],
        description: 'Slim fit jeans with stretch technology for maximum comfort.',
        rating: 4.7,
    },
    {
        id: 4,
        name: 'Athletic Shorts',
        price: 22.0,
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        inStock: true,
        colors: ['gray', 'navy'],
        description: 'Breathable athletic shorts with moisture-wicking technology.',
        rating: 4.3,
    },
    {
        id: 5,
        name: 'Wool Blend Sweater',
        price: 45.0,
        image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        inStock: true,
        colors: ['cream', 'charcoal'],
        description: 'Warm wool blend sweater perfect for cold weather.',
        rating: 4.8,
    },
    {
        id: 6,
        name: 'Leather Wallet',
        price: 39.0,
        image: 'https://images.unsplash.com/photo-1591561954555-607968c989ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        inStock: false,
        colors: ['brown', 'black'],
        description: 'Genuine leather wallet with multiple card slots.',
        rating: 4.6,
    },
];

const ProductCollection: React.FC<ProductCollectionProps> = ({ addToCart }) => {
    const [sortBy, setSortBy] = useState<string>('');
    const [filters, setFilters] = useState<Filters>({
        availability: [],
        price: { from: '', to: '' },
        colors: [],
        search: '',
        rating: 0,
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [animatingProductId, setAnimatingProductId] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [selectedColor, setSelectedColor] = useState<string>('');

    const initialProducts = useMemo(() => testProducts, []);

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    type SortBy = 'Title,ASC' | 'Title,DESC' | 'Price,ASC' | 'Price,DESC' | 'Rating,ASC' | 'Rating,DESC' | '';

    const { search, availability, price, colors, rating } = filters;

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        const applySearchFilter = (products: Product[], search?: string): Product[] => {
            if (!search) return products;
            const searchTerm = search.toLowerCase();
            return products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm))
            );
        };

        const applyAvailabilityFilter = (products: Product[], availability: string[]): Product[] => {
            if (availability.length === 0) return products;
            const inStockSelected = availability.includes('In Stock');
            const outOfStockSelected = availability.includes('Out of Stock');

            return products.filter(product => {
                if (inStockSelected && outOfStockSelected) return true;
                if (inStockSelected) return product.inStock;
                if (outOfStockSelected) return !product.inStock;
                return false;
            });
        };

        const applyPriceRangeFilter = (products: Product[], price: Filters['price']): Product[] => {
            const fromPrice = price.from ? Number(price.from) : 0;
            const toPrice = price.to ? Number(price.to) : Infinity;

            return products.filter(product =>
                product.price >= fromPrice && product.price <= toPrice
            );
        };

        const applyColorFilter = (products: Product[], colors: string[]): Product[] => {
            if (colors.length === 0) return products;
            return products.filter(product =>
                product.colors.some(color =>
                    colors.includes(color.toLowerCase())
                )
            );
        };

        const applyRatingFilter = (products: Product[], rating: number): Product[] => {
            if (!rating || rating === 0) return products;
            return products.filter(product => product.rating && product.rating >= rating);
        };

        const applySorting = (products: Product[], sortBy: SortBy): Product[] => {
            if (!sortBy) return products;

            const [key, order] = sortBy.split(',') as ['name' | 'price' | 'rating', 'ASC' | 'DESC'];
            return [...products].sort((a, b) => {
                if (key === "name") {
                    return order === "ASC"
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                }
                if (key === "price") {
                    return order === "ASC"
                        ? a.price - b.price
                        : b.price - a.price;
                }
                if (key === "rating" && a.rating && b.rating) {
                    return order === "ASC"
                        ? a.rating - b.rating
                        : b.rating - a.rating;
                }
                return 0;
            });
        };

        // Apply filters sequentially
        filtered = applySearchFilter(filtered, search);
        filtered = applyAvailabilityFilter(filtered, availability);
        filtered = applyPriceRangeFilter(filtered, price);
        filtered = applyColorFilter(filtered, colors);
        filtered = applyRatingFilter(filtered, rating || 0);
        filtered = applySorting(filtered, sortBy as SortBy);

        return filtered;
    }, [products, search, availability, price, colors, sortBy, rating]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as SortBy);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            availability: checked
                ? [...prev.availability, value]
                : prev.availability.filter(item => item !== value)
        }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFilters(prev => ({
            ...prev,
            price: {
                ...prev.price,
                [id === 'FilterPriceFrom' ? 'from' : 'to']: value
            }
        }));
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            colors: checked
                ? [...prev.colors, value.toLowerCase()]
                : prev.colors.filter(item => item !== value.toLowerCase())
        }));
    };

    const handleRatingChange = (rating: number) => {
        setFilters(prev => ({
            ...prev,
            rating: prev.rating === rating ? 0 : rating
        }));
    };

    const resetFilters = () => {
        setFilters({
            availability: [],
            price: { from: '', to: '' },
            colors: [],
            search: '',
            rating: 0,
        });
        setSortBy('');
        setSelectedColor('');
    };

    const onAnimationComplete = () => {
        setAnimatingProductId(null);
    };

    const cardVariants = {
        initial: { scale: 1, x: 0, y: 0, opacity: 1 },
        animate: {
            scale: [0.9, 0.6, 0.3, 0.1],
            x: 400,
            y: -300,
            opacity: [1, 0.5, 0],
            transition: { duration: 0.3, ease: 'easeInOut' },
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.1 },
        },
    };

    const openProductModal = (product: Product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsModalOpen(true);
        setSelectedColor(product.colors[0] || '');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setSelectedColor('');
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    const modalVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 }
    };

    const renderStars = (rating: number = 0) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="text-xs text-gray-500 ml-1">({rating})</span>
            </div>
        );
    };

    const [alertState, setAlertState] = useState<{
        show: boolean;
        type: AlertType;
        title: string;
        messages: string[];
    }>({
        show: false,
        type: 'success',
        title: '',
        messages: [],
    });

    const handleAddToCart = (product: Product, qty: number = 1) => {
        if (!animatingProductId) {
            setAnimatingProductId(product.id);
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            color: product.colors,
            image: product.image,
            quantity: qty,
        });

        // Show success alert
        setAlertState({
            show: true,
            type: 'success',
            title: 'Item Added to Cart',
            messages: [`${product.name} has been added to your cart.`],
        });
    };

    // Add auto-hide functionality
    useEffect(() => {
        if (alertState.show) {
            const timer = setTimeout(() => {
                setAlertState(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertState.show]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <AnimatePresence>
                {alertState.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 right-4 z-[1000] w-full max-w-md"
                    >
                        <Alert
                            type={alertState.type}
                            title={alertState.title}
                            messages={alertState.messages}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Our Collection</h2>
                    <p className="mt-2 max-w-full text-gray-600 dark:text-gray-300">
                        Discover premium products curated just for you
                    </p>
                </header>

                {/* Search and Filter Controls */}
                <div className="mb-8">
                    <div className="flex justify-between gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                            />
                            <svg
                                className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-600 dark:text-gray-400"
                            >
                                <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>

                    {/* Expanded Filters Panel */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 overflow-hidden"
                        >
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    {/* Sort By */}
                                    <div>
                                        <label htmlFor="SortBy" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                            Sort By
                                        </label>
                                        <select
                                            id="SortBy"
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            value={sortBy}
                                            onChange={handleSortChange}
                                        >
                                            <option value="">Default</option>
                                            <option value="Title,ASC">Name (A-Z)</option>
                                            <option value="Title,DESC">Name (Z-A)</option>
                                            <option value="Price,ASC">Price (Low to High)</option>
                                            <option value="Price,DESC">Price (High to Low)</option>
                                            <option value="Rating,ASC">Rating (Low to High)</option>
                                            <option value="Rating,DESC">Rating (High to Low)</option>
                                        </select>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <p className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Availability</p>
                                        <div className="space-y-2">
                                            {['In Stock', 'Out of Stock'].map((option) => (
                                                <div key={option} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`Filter${option.replace(' ', '')}`}
                                                        value={option}
                                                        checked={filters.availability.includes(option)}
                                                        onChange={handleAvailabilityChange}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                                    />
                                                    <label htmlFor={`Filter${option.replace(' ', '')}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                        {option}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <p className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Price Range</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="FilterPriceFrom" className="sr-only">From</label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <span className="text-gray-500 sm:text-sm">$</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        id="FilterPriceFrom"
                                                        placeholder="From"
                                                        value={filters.price.from}
                                                        onChange={handlePriceChange}
                                                        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-7 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="FilterPriceTo" className="sr-only">To</label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <span className="text-gray-500 sm:text-sm">$</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        id="FilterPriceTo"
                                                        placeholder="To"
                                                        value={filters.price.to}
                                                        onChange={handlePriceChange}
                                                        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-7 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div>
                                        <p className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Colors</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Red', 'Blue', 'Green', 'Purple', 'Teal', 'Black', 'Gray', 'Navy', 'Cream', 'Charcoal', 'Brown'].map((color) => (
                                                <div key={color} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`Filter${color}`}
                                                        value={color.toLowerCase()}
                                                        checked={filters.colors.includes(color.toLowerCase())}
                                                        onChange={handleColorChange}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                                    />
                                                    <label htmlFor={`Filter${color}`} className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                                                        {color}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="md:col-span-2">
                                        <p className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</p>
                                        <div className="flex items-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => handleRatingChange(star)}
                                                    aria-label={`Set minimum rating to ${star} stars`}
                                                    className={`flex items-center ${filters.rating && star <= filters.rating ? 'text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                >
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={resetFilters}
                                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                    >
                                        Reset all filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Product Grid */}
                <div className="mt-4">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you are looking for.</p>
                            <div className="mt-6">
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                            {filteredProducts.map((product) => {
                                const isAnimating = product.id === animatingProductId;

                                return (
                                    <motion.div
                                        key={product.id}
                                        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                        variants={cardVariants}
                                        initial="initial"
                                        animate={isAnimating ? 'animate' : 'initial'}
                                        whileHover="hover"
                                        onAnimationComplete={isAnimating ? onAnimationComplete : undefined}
                                    >
                                        <div
                                            className="aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                                            onClick={() => openProductModal(product)}
                                        >
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={600}
                                                height={600}
                                                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                                                priority
                                            />
                                        </div>

                                        <div className="p-2">
                                            <div className="flex items-center">
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                                    <button
                                                        onClick={() => openProductModal(product)}
                                                        className="focus:outline-none"
                                                    >
                                                        <span aria-hidden="true" className="absolute inset-0" />
                                                        {product.name}
                                                    </button>
                                                </h3>
                                            </div>

                                            <div className="mt-1">
                                                {renderStars(product.rating)}
                                            </div>

                                            <div className="mt-1 flex items-center space-x-1">
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    ${product.price.toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="mt-6">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(product);
                                                    }}
                                                    className={`w-full rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${product.inStock
                                                            ? 'bg-indigo-600 hover:bg-indigo-700'
                                                            : 'bg-gray-400 cursor-not-allowed'
                                                        }`}
                                                    disabled={!product.inStock}
                                                >
                                                    {product.inStock ? 'View Details' : 'Out of Stock'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isModalOpen && selectedProduct && (
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Product Details"
                        className="fixed inset-0 flex items-center justify-center p-2 z-50 focus:outline-none"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity"
                        shouldCloseOnOverlayClick={true}
                        ariaHideApp={false}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-l font-bold text-gray-900 dark:text-white">{selectedProduct.name}</h2>
                                            <div className="mt-1 flex items-center">
                                                {renderStars(selectedProduct.rating)}
                                            </div>
                                        </div>
                                        <p className="text-l font-bold text-gray-900 dark:text-white">${selectedProduct.price.toFixed(2)}</p>
                                    </div>

                                    <p className={`mt-1 text-sm ${selectedProduct.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                                    </p>

                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                        {selectedProduct.description}
                                    </p>

                                    <div className="mt-2">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Colors</h3>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {selectedProduct.colors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`h-8 w-8 rounded-full border-2 ${selectedColor === color ? 'border-indigo-500' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                                    style={{ backgroundColor: color }}
                                                    aria-label={`Select ${color} color`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Quantity
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <button
                                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                id="quantity"
                                                min="1"
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                className="w-16 px-2 py-1 text-center border-t border-b border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                aria-label="Quantity"
                                            />
                                            <button
                                                onClick={() => setQuantity(prev => prev + 1)}
                                                className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            <button
                                                onClick={() => {
                                                    handleAddToCart(selectedProduct, quantity);
                                                    closeModal();
                                                }}
                                                className={`w-full mt-2 rounded-md py-2 px-4 text-sm font-small text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${selectedProduct.inStock
                                                    ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                                                        : 'bg-gray-400 hover:cursor-not-allowed'
                                                    }`}
                                                disabled={!selectedProduct.inStock}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={closeModal}
                                                className="w-full mt-2 rounded-md py-2 px-4 text-sm font-small text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-gray-400 cursor-pointer"
                                                aria-label="Continue Shopping"
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ProductCollection;