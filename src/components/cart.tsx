'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartProps {
    isOpen: boolean;
    closeCart: () => void;
    cartItems: CartItem[];
    updateQuantity: (id: number, newQuantity: number) => void;
    removeItem: (id: number) => void;
}

const Cart = ({ isOpen, closeCart, cartItems, updateQuantity, removeItem }: CartProps) => {
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 1 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        onClick={closeCart}
                    />

                    {/* Cart Panel */}
                    <motion.div
                        key="cart"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', ease: 'easeInOut' }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg flex flex-col z-50"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">Your Cart</h2>
                            <button
                                onClick={closeCart}
                                className="text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1">
                            {cartItems.length === 0 ? (
                                <p className="text-center py-8">Your cart is empty</p>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map(item => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex gap-4 border-b pb-4"
                                        >
                                            <div className="w-20 h-20 relative flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded"
                                                    sizes="(max-width: 80px) 100vw"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center border rounded">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="px-3 py-1 hover:bg-gray-100"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="px-3 py-1 hover:bg-gray-100"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-600 hover:text-red-700 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-t p-4"
                            >
                                <div className="flex justify-between text-lg font-bold mb-4">
                                    <span>Total:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <button className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors">
                                    Checkout
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart;