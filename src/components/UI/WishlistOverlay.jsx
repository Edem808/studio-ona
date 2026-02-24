import { X } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './WishlistOverlay.css';

const WishlistOverlay = () => {
    const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
    const { user } = useAuth();
    const { addToCart, setIsCartOpen } = useCart();

    const handleAddToCart = (product) => {
        // Use default variant color if available, else null
        const variantColor = product.variants?.[0]?.color || null;
        addToCart(product, variantColor, 1);
        setIsWishlistOpen(false);
        setIsCartOpen(true);
    };

    return (
        <>
            <div className={`wishlist-overlay-backdrop ${isWishlistOpen ? 'open' : ''}`} onClick={() => setIsWishlistOpen(false)} />

            <div className={`wishlist-drawer ${isWishlistOpen ? 'open' : ''}`}>
                <div className="wishlist-drawer-header">
                    <button className="btn-close-drawer" onClick={() => setIsWishlistOpen(false)}>
                        <X size={24} strokeWidth={1} />
                        <span>Fermer</span>
                    </button>
                    {/* The mockup shows icons here but since it's already an overlay, 
                        we can just keep the close button on the left as requested */}
                </div>

                <div className="wishlist-drawer-content">
                    {wishlist.length === 0 ? (
                        <div className="wishlist-drawer-empty">
                            <p className="text-sans" style={{ color: '#666', marginBottom: '1rem' }}>Vos favoris sont actuellement vides.</p>
                        </div>
                    ) : (
                        <>
                            <div className="wishlist-drawer-title-row">
                                <h3 className="text-sans" style={{ fontWeight: 500 }}>Vos favoris</h3>
                                <span className="text-sans" style={{ color: '#999', fontSize: '0.9rem' }}>{wishlist.length} article{wishlist.length > 1 ? 's' : ''}</span>
                            </div>

                            <div className="wishlist-items-list">
                                {wishlist.map(product => {
                                    const imgUrl = product.variants?.[0]?.images?.[0] || product.image || '';
                                    return (
                                        <div key={product.id} className="wishlist-item-row">
                                            <Link to={`/shop/${product.slug || product.id}`} className="wishlist-item-image" onClick={() => setIsWishlistOpen(false)}>
                                                {imgUrl ? (
                                                    <img src={imgUrl.startsWith('/') || imgUrl.startsWith('http') ? imgUrl : `/${imgUrl}`} alt={product.name} />
                                                ) : (
                                                    <div className="wishlist-item-placeholder" />
                                                )}
                                            </Link>

                                            <div className="wishlist-item-details">
                                                <div className="wishlist-item-header">
                                                    <div>
                                                        <h4 className="text-sans">{product.name}</h4>
                                                        {product.variants?.[0] && (
                                                            <p className="text-sans wishlist-item-variant">{product.variants[0].color}</p>
                                                        )}
                                                    </div>
                                                    <p className="wishlist-item-price text-sans">{product.isOnSale ? product.salePrice : product.price}</p>
                                                </div>

                                                <div className="wishlist-item-actions">
                                                    <button className="wishlist-btn-choose" onClick={() => handleAddToCart(product)}>
                                                        Ajouter au panier
                                                    </button>
                                                    <button className="wishlist-btn-remove" onClick={() => removeFromWishlist(product.id)}>
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Login Prompt matches mockup */}
                    {!user && (
                        <div className="wishlist-login-prompt text-sans">
                            <p className="login-prompt-title">Nous vous conseillons de vous connecter pour sauvegarder vos favoris.</p>
                            <p className="login-prompt-desc">Connectez-vous ou créez un compte pour enregistrer des articles et créer plusieurs listes.</p>
                            <Link to="/compte" className="login-prompt-link" onClick={() => setIsWishlistOpen(false)}>
                                Se connecter ou créer un compte
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default WishlistOverlay;
