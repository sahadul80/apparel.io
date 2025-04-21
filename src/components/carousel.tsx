'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertType, CartItem } from './products';
import Alert from './alert';

// Define the Product and Category types
export type Category =
    | 'new-arrivals'
    | 'bestsellers'
    | 'sale'
    | 'dresses'
    | 'tops'
    | 'bottoms'
    | 'outerwear'
    | 'shirts'
    | 'pants'
    | 'jackets'
    | 'activewear'
    | 'baby-(0-24m)'
    | 'toddlers-(2-5)'
    | 'kids-(6-12)'
    | 'bags'
    | 'hats'
    | 'jewelry'
    | 'shoes'
    | 'summer'
    | 'winter-essentials'
    | 'limited-edition';

export type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    discountedPrice?: number;
    category: Category;
    image: string;
    inStock: boolean;
    colors: string[];
    description?: string;
    rating?: number;
};

interface ApparelCarouselProps {
    addToCart: (product: CartItem) => void;
}

const ApparelCarousel: React.FC<ApparelCarouselProps> = ({ addToCart }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);

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

    // Animation variants for the modal using Framer Motion
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
    };

    // Helper function to render star ratings
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

    const handleAddToCart = (product: Product, qty: number = 1) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            color: product.colors,
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

    // API call to fetch apparel products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/carousel');
                if (!res.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products: ', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (alertState.show) {
            const timer = setTimeout(() => {
                setAlertState(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertState.show]);

    // Open modal with selected product details
    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setSelectedColor(product.colors[0]);
        setQuantity(1);
        setIsModalOpen(true);
    };

    // Close modal and reset selected product
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    // Handle quantity input changes
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        }
    };

    

    return (
        <div className="relative w-full min-h-[400px] py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm transition-colors duration-300"> {/* Added background and minimum height */}
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
            <Marquee gradient={false} speed={50} pauseOnHover className="mt-15">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="carousel-slide inline-block mx-2 cursor-pointer group" // Changed margin
                        onClick={() => openModal(product)}
                    >
                        <div className="relative h-96 w-72 overflow-hidden rounded-xl shadow-lg"> {/* Updated dimensions */}
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                priority
                            />
                            {/* Updated overlay styling */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="text-white">
                                    <h3 className="text-xl font-bold">{product.name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-lg font-semibold">
                                            ${product.discountedPrice || product.price}
                                        </span>
                                        {product.discountedPrice && (
                                            <span className="text-sm line-through text-gray-300">
                                                ${product.price}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Marquee>

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
        </div>
    );
};

export default ApparelCarousel;
