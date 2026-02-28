import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Search, User } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import SearchOverlay from '../UI/SearchOverlay';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const { setIsWishlistOpen, wishlist } = useWishlist();
    const { setIsCartOpen, cart } = useCart();

    useEffect(() => {
        // If not on home page, header is always solid
        if (!isHome) {
            setScrolled(true);
            return;
        }

        // Only apply scroll event listener on home page
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        // Set initial state for home
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    return (
        <header className={`header-ona ${scrolled || mobileMenuOpen ? 'scrolled' : ''}`}>
            <div className="header-ona-inner container">

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                </button>

                <nav className="header-ona-nav-left">
                    <Link to="/shop?category=Solaires" className="nav-link text-small">Solaires</Link>
                    <Link to="/shop?category=Optiques" className="nav-link text-small">Optiques</Link>
                </nav>

                <div className="header-ona-logo">
                    <Link to="/">
                        <h2 style={{ fontFamily: 'var(--font-walkway)', fontWeight: 'normal', letterSpacing: 'normal' }}>studio ona</h2>
                    </Link>
                </div>

                <nav className="header-ona-nav-right">
                    <button className="nav-link icon-link" aria-label="Recherche" onClick={() => setIsSearchOpen(true)}>
                        <Search size={20} strokeWidth={1.5} />
                    </button>
                    <Link to="/compte" className="nav-link icon-link" aria-label="Compte">
                        <User size={20} strokeWidth={1.5} />
                    </Link>
                    <button className="nav-link icon-link" aria-label="Favoris" onClick={() => setIsWishlistOpen(true)} style={{ position: 'relative' }}>
                        <Heart size={20} strokeWidth={1.5} />
                        {wishlist.length > 0 && (
                            <span className="badge-notification">{wishlist.length}</span>
                        )}
                    </button>
                    <button className="nav-link icon-link" aria-label="Panier" onClick={() => setIsCartOpen(true)} style={{ position: 'relative' }}>
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cart?.length > 0 && (
                            <span className="badge-notification">{cart.length}</span>
                        )}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav-links">
                    <Link to="/shop?category=Solaires" className="mobile-nav-link text-serif">Solaires</Link>
                    <Link to="/shop?category=Optiques" className="mobile-nav-link text-serif">Optiques</Link>
                    <Link to="/shop" className="mobile-nav-link text-serif">Boutique</Link>
                    <Link to="/about" className="mobile-nav-link text-serif">À propos</Link>
                    <Link to="/compte" className="mobile-nav-link text-serif">Mon Compte</Link>
                </nav>
            </div>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
};

export default Header;
