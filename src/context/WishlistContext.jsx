import { createContext, useState, useEffect, useContext } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    // Load wishlist from local storage on mount
    useEffect(() => {
        const storedWishlist = localStorage.getItem('ona_wishlist');
        if (storedWishlist) {
            try {
                setWishlist(JSON.parse(storedWishlist));
            } catch (error) {
                console.error("Failed to parse wishlist from local storage:", error);
                setWishlist([]);
            }
        }
    }, []);

    // Save wishlist to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('ona_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (!prev.find(item => item.id === product.id)) {
                return [...prev, product];
            }
            return prev;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId));
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            isWishlistOpen,
            setIsWishlistOpen
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
