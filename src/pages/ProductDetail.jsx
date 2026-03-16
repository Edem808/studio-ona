import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronRight, ChevronLeft, Plus, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/UI/ProductCard';
import ProductReviews from '../components/UI/ProductReviews';
import VirtualTryOn from '../components/UI/VirtualTryOn';
import './ProductDetail.css';

const getValidImageUrl = (url) => {
    if (!url) return '';
    let processed = url.replace(/^https?:\/\/localhost(:\d+)?/i, '');
    if (!processed.startsWith('/') && !processed.startsWith('http')) {
        processed = '/' + processed;
    }
    return processed;
};

const ProductDetail = () => {
    const { slug } = useParams(); // Using slug from URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    // Which variant (color) is selected
    const [selectedColor, setSelectedColor] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVTOOpen, setIsVTOOpen] = useState(false);

    const { toggleWishlist, isInWishlist, setIsWishlistOpen } = useWishlist();
    const { cart, addToCart, setIsCartOpen } = useCart();

    const isSaved = product ? isInWishlist(product.id) : false;

    // Check if the current variant is already in the cart
    const isAdded = product ? cart.some(item => item.product.id === product.id && item.color === selectedColor) : false;

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top when product changes
        const fetchProduct = async () => {
            setLoading(true);
            try {
                // Determine if the 'slug' param is actually an old numeric ID
                const isNumericId = /^\d+$/.test(slug);
                let query = supabase.from('products').select('*');

                if (isNumericId) {
                    query = query.eq('id', slug);
                } else {
                    query = query.eq('slug', slug);
                }

                // Use .limit(1) and array indexing instead of .single() to prevent 406 errors on duplicates
                const { data: results, error } = await query.limit(1);
                const data = results && results.length > 0 ? results[0] : null;

                if (error) {
                    console.error("Error fetching product:", error);
                } else if (data) {
                    setProduct(data);
                    // Si on a des variants, on sélectionne le premier par défaut
                    if (data.variants && data.variants.length > 0) {
                        setSelectedColor(data.variants[0].color);
                        setCurrentImageIndex(0);
                    }

                    // Fetch recommendations (exclude current product id)
                    const { data: recData } = await supabase
                        .from('products')
                        .select('*')
                        .neq('id', data.id)
                        .limit(4);
                    if (recData) {
                        setRecommendations(recData);
                    }
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    // Accordion State Management
    const [openAccordions, setOpenAccordions] = useState({
        details: false,
        delivery: false,
        availability: false
    });

    const toggleAccordion = (key) => {
        setOpenAccordions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    if (loading) {
        return (
            <div className="product-detail-page container" style={{ display: 'block', paddingTop: '150px', textAlign: 'center' }}>
                <h1 className="heading-md">Chargement du produit...</h1>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page container" style={{ display: 'block', paddingTop: '150px', textAlign: 'center' }}>
                <h1 className="heading-md">Produit introuvable</h1>
                <p style={{ marginTop: '2rem' }}>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
                <Link to="/shop" className="btn-buy-now" style={{ display: 'inline-block', marginTop: '3rem', padding: '1rem 2rem', textDecoration: 'none' }}>Retour à la boutique</Link>
            </div>
        );
    }

    const currentVariant = product.variants?.find(v => v.color === selectedColor) || product.variants?.[0];

    // Navigation du carrousel
    const nextImage = () => {
        if (!currentVariant || !currentVariant.images) return;
        setCurrentImageIndex((prev) => (prev + 1) % currentVariant.images.length);
    };

    const handleAddToCart = () => {
        addToCart(product, selectedColor, 1);
        setIsCartOpen(true);
    };

    const prevImage = () => {
        if (!currentVariant || !currentVariant.images) return;
        setCurrentImageIndex((prev) => (prev - 1 + currentVariant.images.length) % currentVariant.images.length);
    };

    const hasMultipleImages = currentVariant?.images?.length > 1;
    let currentImageUrl = getValidImageUrl(currentVariant?.images?.[currentImageIndex]);

    return (
        <div className="product-detail-wrapper">
            <div className="product-detail-page">
                <div className="product-image-section">
                    {hasMultipleImages && (
                        <>
                            <button className="nav-arrow left" onClick={prevImage}><ChevronLeft size={30} strokeWidth={1} /></button>
                            <button className="nav-arrow right" onClick={nextImage}><ChevronRight size={30} strokeWidth={1} /></button>
                            <div className="carousel-dots-overlay">
                                {currentVariant.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                                        aria-label={`Aller à l'image ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Main images */}
                    {hasMultipleImages && currentVariant.images ? (
                        currentVariant.images.map((img, idx) => {
                            const imgUrl = getValidImageUrl(img);
                            return (
                                <img
                                    key={idx}
                                    src={imgUrl}
                                    alt={`${product.name} - ${selectedColor} - Vue ${idx + 1}`}
                                    className="product-main-image"
                                    style={{
                                        objectFit: 'cover',
                                        opacity: idx === currentImageIndex ? 1 : 0,
                                        transition: 'opacity 0.4s ease-in-out'
                                    }}
                                />
                            );
                        })
                    ) : currentImageUrl ? (
                        <img src={currentImageUrl} alt={`${product.name} - ${selectedColor}`} className="product-main-image" style={{ objectFit: 'cover' }} />
                    ) : (
                        <div className="product-main-image placeholder-prada">
                            <span className="text-small">Pas d'image</span>
                        </div>
                    )}

                    <button className="btn-virtual-tryon" onClick={() => setIsVTOOpen(true)}>
                        Essayage virtuel
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 10c-.24 0-.45.09-.59.25c-.14.15-.2.37-.17.61l.5 2.99C2.82 14.5 3.4 15 4 15h3c.64 0 1.36-.56 1.5-1.18l1.06-3.19c.04-.13.01-.32-.06-.44c-.11-.12-.28-.19-.5-.19zm4 7H4C2.38 17 .96 15.74.76 14.14l-.5-2.99C.15 10.3.39 9.5.91 8.92S2.19 8 3 8h6c.83 0 1.58.35 2.06.96c.11.15.21.31.29.49c.43-.09.87-.09 1.29 0c.08-.18.18-.34.3-.49C13.41 8.35 14.16 8 15 8h6c.81 0 1.57.34 2.09.92c.51.58.75 1.38.65 2.19l-.51 3.07C23.04 15.74 21.61 17 20 17h-3c-1.56 0-3.08-1.19-3.46-2.7l-.9-2.71c-.38-.28-.91-.28-1.29 0l-.92 2.78C10.07 15.82 8.56 17 7 17m8-7c-.22 0-.39.07-.5.19c-.08.12-.1.31-.05.51l1.01 3.05c.18.69.9 1.25 1.54 1.25h3c.59 0 1.18-.5 1.25-1.11l.51-3.07c.03-.2-.03-.42-.17-.57A.77.77 0 0 0 21 10z" /></svg>
                    </button>
                </div>

                <div className="product-info-section">
                    <div className="product-info-inner">
                        <h1 className="product-title text-sans">{product.name}</h1>

                        {product.rating != null && product.reviewCount != null && (
                            <div className="product-reviews">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        if (product.rating >= star) {
                                            return <span key={star} className="star filled">★</span>;
                                        } else if (product.rating >= star - 0.5) {
                                            return <span key={star} className="star half-filled">★</span>;
                                        } else {
                                            return <span key={star} className="star empty">★</span>;
                                        }
                                    })}
                                </div>
                                <a href="#reviews" className="review-count">{product.reviewCount} Avis</a>
                            </div>
                        )}

                        <div className="product-price-block">
                            <h2 className="price">
                                {product.isOnSale ? (
                                    <>
                                        <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '1rem', fontSize: '1rem' }}>{product.price}</span>
                                        <span style={{ color: '#d9363e' }}>{product.salePrice}</span>
                                    </>
                                ) : (
                                    product.price
                                )}
                            </h2>
                            <p className="payment-options">Payez maintenant, dans 30 jours ou en 3 versements avec <u>Alma</u></p>
                        </div>

                        <p className="product-description">
                            {product.description}
                        </p>

                        {product.variants && product.variants.length > 0 && (
                            <div className="product-colors-selector">
                                <div className="color-label-row">
                                    <span className="color-label-title">Couleur</span>
                                    <span className="color-label-value">{selectedColor}</span>
                                </div>
                                <div className="color-options">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.color}
                                            className={`color-btn ${selectedColor === variant.color ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedColor(variant.color);
                                                setCurrentImageIndex(0); // Reset l'image quand on change de couleur
                                            }}
                                            aria-label={`Sélectionner la couleur ${variant.color}`}
                                        >
                                            <div className={`color-thumbnail thumbnail-${variant.color.toLowerCase().replace('é', 'e').replace(' ', '-')}`} style={
                                                variant.images && variant.images.length > 0
                                                    ? { backgroundImage: `url(${getValidImageUrl(variant.images[0])})` }
                                                    : { backgroundColor: '#e5e5e5' }
                                            }></div>
                                        </button>
                                    ))}
                                </div>

                                {/* Optionnel: Les points du carrousel ont été déplacés sur l'image */}
                            </div>
                        )}

                        <div className="product-actions" style={{ display: 'flex', gap: '1rem' }}>


                            {isAdded ? (
                                <div className="btn-add-cart success-state" style={{
                                    flex: 1,
                                    backgroundColor: '#111',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid #111',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }} onClick={() => setIsCartOpen(true)}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: '1.5px solid #fff',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                </div>
                            ) : (
                                <button className="btn-add-cart" style={{ flex: 1 }} onClick={handleAddToCart}>Ajouter au panier</button>
                            )}
                            <button
                                className={`btn-wishlist ${isSaved ? 'saved' : ''}`}
                                onClick={() => {
                                    toggleWishlist(product);
                                    if (!isSaved) setIsWishlistOpen(true);
                                }}
                                aria-label={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
                            >
                                <Heart size={20} strokeWidth={1.5} fill={isSaved ? "#fff" : "none"} color="#fff" />
                            </button>
                        </div>

                        <div className="product-accordions">
                            <div className={`accordion-item ${openAccordions.details ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion('details')}>
                                    Détail du produit
                                    <Plus size={16} strokeWidth={1.5} style={{ transform: openAccordions.details ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
                                </button>
                                {openAccordions.details && (
                                    <div className="accordion-content text-sans" style={{ paddingBottom: '1rem', color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        {product.details ? (
                                            <p style={{ whiteSpace: 'pre-wrap' }}>{product.details}</p>
                                        ) : (
                                            <p>{product.description}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={`accordion-item ${openAccordions.delivery ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion('delivery')}>
                                    Livraison et retours gratuits
                                    <Plus size={16} strokeWidth={1.5} style={{ transform: openAccordions.delivery ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
                                </button>
                                {openAccordions.delivery && (
                                    <div className="accordion-content text-sans" style={{ paddingBottom: '1rem', color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        <p>Profitez de la livraison standard gratuite sur toutes les commandes. Les retours sont acceptés dans un délai de 30 jours suivant la réception de votre article. Les articles doivent être retournés dans leur état et emballage d'origine.</p>
                                    </div>
                                )}
                            </div>

                            <div className={`accordion-item ${openAccordions.availability ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion('availability')}>
                                    Disponibilité en boutique
                                    <Plus size={16} strokeWidth={1.5} style={{ transform: openAccordions.availability ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
                                </button>
                                {openAccordions.availability && (
                                    <div className="accordion-content text-sans" style={{ paddingBottom: '1rem', color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        <p>Cet article est actuellement disponible en ligne. Vous pouvez vérifier sa disponibilité dans l'une de nos boutiques partenaires en les contactant directement. Retrouvez la liste de nos revendeurs sur la page contact.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="product-badges">
                            <div className="badge">
                                <Check size={16} strokeWidth={1.5} />
                                <span>Montures certifiées</span>
                            </div>
                            <div className="badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="4" y="8" width="16" height="12" rx="2" />
                                    <path d="M8 8V6a4 4 0 018 0v2" />
                                </svg>
                                <span>Étuis offert</span>
                            </div>
                        </div>

                        {/* Avis Clients Component */}
                        <ProductReviews productId={product.id} />
                    </div>
                </div>
            </div>

            {recommendations.length > 0 && (
                <div className="product-recommendations container" style={{ marginTop: '6rem', marginBottom: '6rem' }}>
                    <h2 className="heading-md" style={{ marginBottom: '3rem', fontSize: '1.5rem', fontWeight: 500 }}>Nos clients ont aussi acheté</h2>
                    <div className="shop-grid">
                        {recommendations.map(prod => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>
            )}

            <VirtualTryOn
                isOpen={isVTOOpen}
                onClose={() => setIsVTOOpen(false)}
                product={product}
            />
        </div>
    );
};

export default ProductDetail;
