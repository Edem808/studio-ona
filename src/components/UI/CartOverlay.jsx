import { X, Gift } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartOverlay.css';
import ProductCard from './ProductCard'; // For recommendations
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const CartOverlay = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, getCartTotal } = useCart();
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // Fetch a couple of products for "Vous aimerez aussi :"
        const fetchRecommendations = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .limit(2); // Just 2 for the mockup
            if (data) setRecommendations(data);
        };
        fetchRecommendations();
    }, []);

    const total = getCartTotal();
    const formattedTotal = total.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' €';

    return (
        <>
            <div className={`cart-overlay-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />

            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-drawer-header">
                    <button className="btn-close-drawer" onClick={() => setIsCartOpen(false)}>
                        <X size={24} strokeWidth={1} />
                        <span>Fermer</span>
                    </button>
                </div>

                <div className="cart-drawer-content">
                    {cart.length === 0 ? (
                        <div className="cart-drawer-empty">
                            <p className="text-sans" style={{ color: '#666', marginBottom: '1rem', textAlign: 'center' }}>Votre panier est vide.</p>
                            <Link to="/shop" className="btn-primary" style={{ display: 'inline-block' }} onClick={() => setIsCartOpen(false)}>
                                Découvrir la collection
                            </Link>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cart.map((item, index) => {
                                const product = item.product;
                                // Find image for variant or fallback to main product image
                                const variant = product.variants?.find(v => v.color === item.color) || product.variants?.[0];
                                const imgUrl = variant?.images?.[0] || product.image || '';

                                return (
                                    <div key={`${product.id}-${item.color}-${index}`} className="cart-item-card">
                                        <Link to={`/shop/${product.slug || product.id}`} className="cart-item-image" onClick={() => setIsCartOpen(false)}>
                                            {imgUrl ? (
                                                <img src={imgUrl.startsWith('/') || imgUrl.startsWith('http') ? imgUrl : `/${imgUrl}`} alt={product.name} />
                                            ) : (
                                                <div className="cart-item-placeholder" />
                                            )}
                                        </Link>

                                        <div className="cart-item-details">
                                            <div className="cart-item-info-top">
                                                <div>
                                                    <h3 className="cart-item-name">{product.name}</h3>
                                                    <p className="cart-item-price">{product.isOnSale ? product.salePrice : product.price}</p>
                                                    <div className="cart-item-attributes">
                                                        <p>Couleur : {item.color || 'Standard'}</p>
                                                        <p>Quantité : {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="cart-item-promo-box">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M12 22V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M12 7H7.5V6C7.5 4.89543 8.39543 4 9.5 4C10.6046 4 11.5 4.89543 11.5 6V7H12ZM12 7H16.5V6C16.5 4.89543 15.6046 4 14.5 4C13.3954 4 12.5 4.89543 12.5 6V7H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>Étuis offert avec votre commande</span>
                                                </div>
                                            </div>

                                            <div className="cart-item-actions">
                                                <button className="cart-btn-remove" onClick={() => removeFromCart(product.id, item.color)}>
                                                    Supprimer du panier
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Recommendations Section */}
                    {cart.length > 0 && recommendations.length > 0 && (
                        <div className="cart-recommendations">
                            <h4 className="cart-rec-title">Nos clients ont aussi acheté :</h4>
                            <div className="cart-rec-grid">
                                {recommendations.map(prod => (
                                    <div key={`rec-${prod.id}`} onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer' }}>
                                        <ProductCard product={prod} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Totals & Buttons */}
                {cart.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="cart-total-row">
                            <span className="cart-total-label">Total :</span>
                            <span className="cart-total-value">{formattedTotal}</span>
                        </div>
                        <Link to="/checkout" className="cart-btn-checkout" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }} onClick={() => setIsCartOpen(false)}>Procéder au paiement</Link>
                        <Link to="/panier" className="cart-btn-view" onClick={() => setIsCartOpen(false)}>Voir le panier</Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartOverlay;
