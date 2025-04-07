'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Modal to avoid SSR issues
const Modal = dynamic(() => import('react-modal'), {
    ssr: false,
    loading: () => null
});

// Define types for the product
type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
    colors: string[];
};

type Filters = {
    availability: string[];
    price: { from: string; to: string };
    colors: string[];
    search: string;
};

type CartItem = {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

interface ProductCollectionProps {
    addToCart: (product: CartItem) => void;
}

const testProducts: Product[] = [
    {
        id: 1,
        name: 'Basic Tee',
        price: 24.0,
        image:
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        inStock: true,
        colors: ['red', 'blue'],
    },
    {
        id: 2,
        name: 'Classic Tee',
        price: 29.0,
        image:
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        inStock: false,
        colors: ['green', 'purple'],
    },
    {
        id: 3,
        name: 'Premium Tee',
        price: 34.0,
        image:
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        inStock: true,
        colors: ['blue', 'teal'],
    },
    {
        id: 4,
        name: 'Basic Tee',
        price: 24.0,
        image:
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        inStock: true,
        colors: ['red', 'blue'],
    },
    {
        id: 5,
        name: 'Classic Tee',
        price: 29.0,
        image:
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        inStock: false,
        colors: ['green', 'purple'],
    },
    {
        id: 6,
        name: 'Premium Tee',
        price: 34.0,
        image:
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        inStock: true,
        colors: ['blue', 'teal'],
    },
];

const ProductCollection: React.FC<ProductCollectionProps> = ({ addToCart }) => {
    const [sortBy, setSortBy] = useState<string>('');
    const [filters, setFilters] = useState<Filters>({
        availability: [],
        price: { from: '', to: '' },
        colors: [],
        search: '',
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [animatingProductId, setAnimatingProductId] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const initialProducts = useMemo(() => testProducts, []);

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    type SortBy = 'Title,ASC' | 'Title,DESC' | 'Price,ASC' | 'Price,DESC' | '';

    const { search, availability, price, colors } = filters;

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        const applySearchFilter = (products: Product[], search?: string): Product[] => {
            if (!search) return products;
            const searchTerm = search.toLowerCase();
            return products.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
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

        const applySorting = (products: Product[], sortBy: SortBy): Product[] => {
            if (!sortBy) return products;

            const [key, order] = sortBy.split(',') as ['name' | 'price', 'ASC' | 'DESC'];
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
                return 0;
            });
        };

        // Apply filters sequentially
        filtered = applySearchFilter(filtered, search);
        filtered = applyAvailabilityFilter(filtered, availability);
        filtered = applyPriceRangeFilter(filtered, price);
        filtered = applyColorFilter(filtered, colors);
        filtered = applySorting(filtered, sortBy as SortBy);

        return filtered;
    }, [products, search, availability, price, colors, sortBy]);


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

    const resetFilters = () => {
        setFilters({
            availability: [],
            price: { from: '', to: '' },
            colors: [],
            search: '',
        });
        setSortBy('');
    };

    const handleAddToCart = (product: Product, qty: number = 1) => {
        if (!animatingProductId) {
            setAnimatingProductId(product.id);
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: qty,
        });
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
            opacity: [1, 0.5, 1],
            transition: { duration: 0.4, ease: 'easeInOut' },
        },
    };

    const openProductModal = (product: Product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
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

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Product Collection</h2>
                    <p className="mt-4 max-w-md text-gray-500">
                        Browse our collection of premium products with advanced filtering options.
                    </p>
                </header>

                <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={handleSearchChange}
                            className="w-full rounded-sm border-gray-300 text-sm p-2 pl-8"
                        />
                        <svg
                            className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-sm border border-gray-300 px-3 py-2 rounded-sm hover:bg-gray-50"
                    >
                        <span>Filters & Sorting</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={`size-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                </div>

                {showFilters && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-sm bg-white shadow-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="SortBy" className="block text-xs font-medium text-gray-700 mb-1">
                                    Sort By
                                </label>
                                <select
                                    id="SortBy"
                                    className="w-full rounded-sm border-gray-300 text-sm p-2"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="">Sort By</option>
                                    <option value="Title, DESC">Title, DESC</option>
                                    <option value="Title, ASC">Title, ASC</option>
                                    <option value="Price, DESC">Price, DESC</option>
                                    <option value="Price, ASC">Price, ASC</option>
                                </select>
                            </div>

                            <div>
                                <p className="block text-xs font-medium text-gray-700 mb-1">Availability</p>
                                <div className="space-y-1">
                                    {['In Stock', 'Out of Stock'].map((option) => (
                                        <div key={option} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`Filter${option.replace(' ', '')}`}
                                                value={option}
                                                checked={filters.availability.includes(option)}
                                                onChange={handleAvailabilityChange}
                                                className="size-4 rounded-sm border-gray-300"
                                            />
                                            <label htmlFor={`Filter${option.replace(' ', '')}`} className="ml-2 text-sm text-gray-700">
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="block text-xs font-medium text-gray-700 mb-1">Price Range</p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label htmlFor="FilterPriceFrom" className="sr-only">From</label>
                                        <input
                                            type="number"
                                            id="FilterPriceFrom"
                                            placeholder="From"
                                            value={filters.price.from}
                                            onChange={handlePriceChange}
                                            className="w-full rounded-sm border-gray-300 text-sm p-2"
                                            min="0"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="FilterPriceTo" className="sr-only">To</label>
                                        <input
                                            type="number"
                                            id="FilterPriceTo"
                                            placeholder="To"
                                            value={filters.price.to}
                                            onChange={handlePriceChange}
                                            className="w-full rounded-sm border-gray-300 text-sm p-2"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <p className="block text-xs font-medium text-gray-700 mb-1">Colors</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Red', 'Blue', 'Green', 'Purple', 'Teal'].map((color) => (
                                        <div key={color} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`Filter${color}`}
                                                value={color.toLowerCase()}
                                                checked={filters.colors.includes(color.toLowerCase())}
                                                onChange={handleColorChange}
                                                className="size-4 rounded-sm border-gray-300"
                                            />
                                            <label htmlFor={`Filter${color}`} className="ml-1 text-sm text-gray-700">
                                                {color}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={resetFilters}
                                className="text-sm text-gray-700 underline underline-offset-2 hover:text-gray-900"
                            >
                                Reset all filters
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <div className="relative">
                        <div className="overflow-x-auto pb-4">
                            <ul className="flex gap-4 w-max sm:w-full sm:grid sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProducts.map((product) => {
                                    const isAnimating = product.id === animatingProductId;

                                    return (
                                        <motion.li
                                            key={product.id}
                                            className="group relative w-64 sm:w-full"
                                            variants={cardVariants}
                                            initial="initial"
                                            animate={isAnimating ? 'animate' : 'initial'}
                                            onAnimationComplete={isAnimating ? onAnimationComplete : undefined}
                                        >
                                            <div
                                                className="block overflow-hidden cursor-pointer"
                                                onClick={() => openProductModal(product)}
                                            >
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={350}
                                                    height={450}
                                                    className="h-[250px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[350px]"
                                                />
                                                <div className="relative bg-white pt-3">
                                                    <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                                                        {product.name}
                                                    </h3>
                                                    <p className="mt-2">
                                                        <span className="tracking-wider text-gray-900">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddToCart(product);
                                                        }}
                                                        className="mt-4 w-full bg-gray-100 py-2 text-sm font-medium transition hover:bg-gray-200"
                                                        disabled={!product.inStock}
                                                    >
                                                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && selectedProduct && (
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Product Details"
                        className="fixed inset-0 flex items-center justify-center p-4 z-50"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
                        shouldCloseOnOverlayClick={true}
                    >
                        <motion.div
                            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="relative h-64 md:h-96">
                                    <Image
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        fill
                                        className="object-cover rounded-lg"
                                        priority
                                    />
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
                                    <p className="text-md md:text-lg mt-1 text-gray-900">${selectedProduct.price.toFixed(2)}</p>
                                    <p className={`mt-1 text-sm ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                                    </p>

                                    <div className="mt-3">
                                        <h3 className="text-xs font-medium text-gray-900">Colors</h3>
                                        <div className="flex mt-1 space-x-2">
                                            {selectedProduct.colors.map((color) => (
                                                <span
                                                    key={color}
                                                    className="w-5 h-5 rounded-full border border-gray-200"
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor="quantity" className="block text-xs font-medium text-gray-700">
                                            Quantity
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <button
                                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                className="px-2 py-1 text-sm border border-gray-300 rounded-l-md bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                id="quantity"
                                                min="1"
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                className="w-12 px-2 py-1 text-sm border-t border-b border-gray-300 text-center"
                                            />
                                            <button
                                                onClick={() => setQuantity(prev => prev + 1)}
                                                className="px-2 py-1 text-sm border border-gray-300 rounded-r-md bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => {
                                                handleAddToCart(selectedProduct, quantity);
                                                closeModal();
                                            }}
                                            className="flex-1 bg-indigo-600 py-2 px-4 text-sm border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            disabled={!selectedProduct.inStock}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 bg-white py-2 px-4 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Continue Shopping
                                        </button>
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