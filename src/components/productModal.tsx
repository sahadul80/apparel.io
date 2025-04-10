'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Product } from './carousel';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    addToCart: (product: Product, quantity: number) => void;
}

const ProductModal = ({ isOpen, onClose, product, addToCart }: ProductModalProps) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const modalVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
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

    if (!mounted || !product) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50">
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* Modal content */}
                    <div className="fixed inset-0 flex items-center justify-center p-2 focus:outline-none">
                        <motion.div
                            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                {/* Image section */}
                                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>

                                {/* Product details */}
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
                                            <div className="mt-1 flex items-center">
                                                {renderStars(product.rating)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                ${product.discountedPrice ? (
                                                    <>
                                                        <span className="line-through text-gray-400 mr-2">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                        ${product.discountedPrice.toFixed(2)}
                                                    </>
                                                ) : (
                                                    `$${product.price.toFixed(2)}`
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <p className={`mt-1 text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'} dark:text-green-400`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </p>

                                    {product.description && (
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                                            {product.description}
                                        </p>
                                    )}

                                    {/* Color selection */}
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Colors</h3>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {product.colors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`h-8 w-8 rounded-full border-2 ${selectedColor === color
                                                            ? 'border-indigo-500 ring-2 ring-indigo-200'
                                                            : 'border-gray-200'
                                                        } transition-all duration-200`}
                                                    style={{ backgroundColor: color }}
                                                    aria-label={`Select ${color} color`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity and actions */}
                                    <div className="mt-6">
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Quantity
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    id="quantity"
                                                    value={quantity}
                                                    min="1"
                                                    onChange={handleQuantityChange}
                                                    className="w-12 text-center border rounded-md py-1 dark:bg-gray-700 dark:border-gray-600"
                                                    aria-label="Quantity"
                                                />
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-2">
                                            <button
                                                onClick={() => {
                                                    addToCart(product, quantity);
                                                    onClose();
                                                }}
                                                disabled={!product.inStock}
                                                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${product.inStock
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="w-full py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ProductModal;