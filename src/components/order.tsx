'use client';

import React, { useEffect, useState } from 'react';
import Stepper from './stepper';
import OrderStep from './orderSteps';
import Cart from './cart';
import Alert from './alert';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertType, CartItem } from './products';
import ApparelCarousel from './carousel';

const Order: React.FC = () => {
    const steps = [
        'Product Selection',
        'Details',
        'Shipping',
        'Payment',
        'Confirmation',
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setCartOpen(true);
            setAlertState({
                show: true,
                type: 'success',
                title: 'Order Complete',
                messages: ['Your order has been successfully placed.'],
            });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleAddToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existingItem = prev.find(i => i.id === item.id && i.color === item.color);
            if (existingItem) {
                return prev.map(i =>
                    i.id === item.id && i.color === item.color
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });

        setAlertState({
            show: true,
            type: 'success',
            title: 'Item Added to Cart',
            messages: [`${item.name} has been added to your cart.`],
        });
    };

    useEffect(() => {
        if (alertState.show) {
            const timer = setTimeout(() => {
                setAlertState(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertState.show]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8 relative transition-colors duration-300">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Place Your Order
            </h1>
            <Stepper steps={steps} currentStep={currentStep} />

            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-4xl"
                >
                    <OrderStep step={currentStep} onNext={handleNext} onBack={handleBack} />
                </motion.div>
            </AnimatePresence>

            {currentStep === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl mt-8"
                >
                    <ApparelCarousel addToCart={handleAddToCart} />
                </motion.div>
            )}

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

            <AnimatePresence>
                {cartOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween' }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg z-[1000] transition-colors duration-300"
                    >
                        <Cart
                            isOpen={cartOpen}
                            closeCart={() => setCartOpen(false)}
                            cartItems={cartItems}
                            updateQuantity={(id, qty) => {
                                setCartItems((prev) =>
                                    prev.map((item) =>
                                        item.id === id ? { ...item, quantity: qty } : item
                                    )
                                );
                            }}
                            removeItem={(id) => {
                                setCartItems((prev) => prev.filter((item) => item.id !== id));
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Order;