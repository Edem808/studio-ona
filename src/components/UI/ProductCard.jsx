import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Check if variant 0 exists to find ID, fallback to product.id
    const variantId = product.variants && product.variants.length > 0 ? product.variants[0].id : product.id;
    const isWishlisted = wishlist.some(item => item.id === product.id);

    const toggleWishlist = (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Keep it from bubbling

        if (isWishlisted) {
            // Remove directly by product id
            removeFromWishlist(product.id);
        } else {
            // Add directly
            addToWishlist(product);
        }
    };

    let images = [];
    if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
        images = product.variants[0].images;
    } else if (product.image) {
        images = [product.image];
    }

    // Process URLs
    images = images.map(img => (img && !img.startsWith('/') && !img.startsWith('http') ? '/' + img : img));
    const hasMultipleImages = images.length > 1;

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Link to={`/shop/${product.slug || product.id}`} className="product-card">
            <div
                className="product-image-wrap"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {images.length > 0 ? (
                    images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`${product.name} - Vue ${idx + 1}`}
                            className={`product-image ${idx === currentImageIndex ? 'active' : ''}`}
                            style={{
                                opacity: idx === currentImageIndex ? 1 : 0,
                                position: idx === 0 ? 'relative' : 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                                transition: 'opacity 0.4s ease-in-out'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    ))
                ) : (
                    <div className="product-image-placeholder" style={{ display: 'flex' }}>
                        <span className="text-small">Image</span>
                    </div>
                )}

                {hasMultipleImages && isHovered && (
                    <>
                        <button className="card-carousel-arrow left" onClick={prevImage} aria-label="Image précédente">
                            <ChevronLeft size={18} color="#000" />
                        </button>
                        <button className="card-carousel-arrow right" onClick={nextImage} aria-label="Image suivante">
                            <ChevronRight size={18} color="#000" />
                        </button>
                        <div className="card-carousel-indicator">
                            {images.map((_, idx) => (
                                <div key={idx} className={`card-dot ${idx === currentImageIndex ? 'active' : ''}`} />
                            ))}
                        </div>
                    </>
                )}

                <button
                    className="quick-wishlist-btn"
                    onClick={toggleWishlist}
                    aria-label="Ajouter aux favoris"
                >
                    <Heart size={20} strokeWidth={1.5} fill={isWishlisted ? "black" : "none"} color="black" />
                </button>

                {product.isNew && !product.isOnSale && <span className="product-badge">Nouveau</span>}
                {product.isOnSale && <span className="product-badge sale-badge" style={{ backgroundColor: '#d9363e' }}>Soldes</span>}
            </div>
            <div className="product-info">
                <h3 className="product-name text-sans">{product.name}</h3>
                <p className="product-price text-sans">
                    {product.isOnSale ? (
                        <>
                            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '0.5rem' }}>{product.price}</span>
                            <span style={{ color: '#d9363e', fontWeight: 'bold' }}>{product.salePrice}</span>
                        </>
                    ) : (
                        product.price
                    )}
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;
