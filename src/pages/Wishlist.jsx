import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import SEO from '../components/SEO';
import ProductShowcase from '../components/Sections/ProductShowcase';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart, setIsCartOpen } = useCart();

    const handleAddToCart = (product) => {
        const variantColor = product.variants?.[0]?.color || null;
        addToCart(product, variantColor, 1);
        setIsCartOpen(true);
    };

    const getValidImageUrl = (url) => {
        if (!url) return '';
        let processed = url.replace(/^https?:\/\/localhost(:\d+)?/i, '');
        if (!processed.startsWith('/') && !processed.startsWith('http')) {
            processed = '/' + processed;
        }
        return processed;
    };

    return (
        <>
            <SEO title="Mes Favoris" noindex={true} />
            <div className="wishlist-page container">
                <div className="wishlist-header-section">
                    <h1 className="heading-lg text-serif">Mes Favoris</h1>
                    {wishlist.length > 0 && <span className="wishlist-count">{wishlist.length} article{wishlist.length > 1 ? 's' : ''}</span>}
                </div>

                {wishlist.length === 0 ? (
                    <div className="wishlist-empty">
                        <p className="text-sans" style={{ color: '#666', marginBottom: '2rem' }}>Votre liste d'envies est actuellement vide.</p>
                        <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                            Découvrir la collection
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid-detailed">
                        {wishlist.map(product => {
                            const rawImg = product.variants?.[0]?.images?.[0] || product.image;
                            const imgUrl = getValidImageUrl(rawImg);

                            return (
                                <div key={product.id} className="wishlist-card-detailed">
                                    <Link to={`/shop/${product.slug || product.id}`} className="wishlist-card-image-wrap">
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={product.name} className="wishlist-card-image" />
                                        ) : (
                                            <div className="wishlist-placeholder">Pas d'image</div>
                                        )}
                                    </Link>

                                    <div className="wishlist-card-info">
                                        <h3 className="wishlist-card-title text-sans">{product.name}</h3>
                                        <p className="wishlist-card-price text-sans">
                                            {product.isOnSale ? (
                                                <>
                                                    <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '0.5rem' }}>{product.price}</span>
                                                    <span style={{ color: '#d9363e', fontWeight: 'bold' }}>{product.salePrice}</span>
                                                </>
                                            ) : (
                                                product.price
                                            )}
                                        </p>

                                        <div className="wishlist-card-actions">
                                            <button className="btn-add-to-cart-wishlist" onClick={() => handleAddToCart(product)} aria-label={`Ajouter ${product.name} au panier`}>
                                                <ShoppingBag size={18} /> Ajouter
                                            </button>
                                            <button className="btn-remove-wishlist" onClick={() => removeFromWishlist(product.id)} aria-label={`Supprimer ${product.name} des favoris`}>
                                                <Trash2 size={20} color="#999" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <ProductShowcase title="Vous aimerez peut-être" linkText="Voir toute la collection" />
        </>
    );
};

export default Wishlist;
