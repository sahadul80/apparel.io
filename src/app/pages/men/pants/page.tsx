'use client';
import { useState } from 'react';
import Header from '../../../../components/header';
import CTA from '../../../../components/CTA';
import Cart from '../../../../components/cart';
import Footer from '../../../../components/footer';
import ProductCollection from '../../../../components/products';
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

const PantsPage = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);

    // Add item to cart
    const addToCart = (product: CartItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    // Update item quantity
    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Remove item from cart
    const removeFromCart = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    return (
        <div>
            <Header toggleCart={toggleCart} cartItemCount={cartItems.length} />

            <Cart
                isOpen={isCartOpen}
                closeCart={closeCart}
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeItem={removeFromCart}
            />
            <div>Best Seller page will be updated soon...</div>
            <ProductCollection addToCart={addToCart} />
            <CTA />
            <Footer />
        </div>
    );
};

export default PantsPage;