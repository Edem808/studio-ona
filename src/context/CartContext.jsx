import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('ona_cart');
        if (storedCart) {
            try {
                let parsedCart = JSON.parse(storedCart);
                // Sanitize: if item.color is an object, extract the string value
                parsedCart = parsedCart.map(item => {
                    if (item.color && typeof item.color === 'object') {
                        return { ...item, color: item.color.color || null };
                    }
                    return item;
                });
                setCart(parsedCart);
            } catch (error) {
                console.error("Failed to parse cart from local storage:", error);
                setCart([]);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('ona_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, variantColor = null, quantity = 1) => {
        setCart(prev => {
            // Check if item already exists (same product ID and same variant)
            const existingItemIndex = prev.findIndex(item =>
                item.product.id === product.id && item.color === variantColor
            );

            if (existingItemIndex >= 0) {
                // Update quantity if explicitly requested
                const newCart = [...prev];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                // Add new item
                return [...prev, { product, color: variantColor, quantity }];
            }
        });
    };

    const removeFromCart = (productId, variantColor = null) => {
        setCart(prev => prev.filter(item =>
            !(item.product.id === productId && item.color === variantColor)
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateQuantity = (productId, variantColor = null, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, variantColor);
            return;
        }
        setCart(prev => prev.map(item => {
            if (item.product.id === productId && item.color === variantColor) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            // Price is string like "80€" or "80,00€"
            const priceStr = item.product.isOnSale ? item.product.salePrice : item.product.price;
            const priceNum = parseFloat(priceStr.replace(/[^0-9,-]+/g, "").replace(',', '.'));
            return total + (priceNum * item.quantity);
        }, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};
