import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Icon } from '@iconify/react';
import ProductShowcase from '../components/Sections/ProductShowcase';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const total = getCartTotal();
    const formattedTotal = total.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' €';

    return (
        <>
            <div className="cart-page container">
                <h1 className="heading-lg text-sans" style={{ paddingTop: '150px', marginBottom: '2rem' }}>Mon panier</h1>

                {cart.length === 0 ? (
                    <div className="cart-page-empty">
                        <p className="text-sans" style={{ color: '#666', marginBottom: '2rem' }}>Votre panier est actuellement vide.</p>
                        <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                            Découvrir la collection
                        </Link>
                    </div>
                ) : (
                    <div className="cart-page-content">
                        <div className="cart-page-items">
                            <div className="cart-page-table-header">
                                <div>Produit</div>
                                <div>Prix</div>
                                <div>Quantité</div>
                                <div>Total</div>
                            </div>

                            {cart.map((item, index) => {
                                const product = item.product;
                                const variant = product.variants?.find(v => v.color === item.color) || product.variants?.[0];
                                const imgUrl = variant?.images?.[0] || product.image || '';
                                const priceStr = product.isOnSale ? product.salePrice : product.price;
                                const priceNum = parseFloat(priceStr.replace(/[^0-9,-]+/g, "").replace(',', '.'));
                                const itemTotal = priceNum * item.quantity;
                                const formattedItemTotal = itemTotal.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' €';

                                return (
                                    <div key={`${product.id}-${item.color}-${index}`} className="cart-page-item">
                                        <div className="cart-page-item-product">
                                            <Link to={`/shop/${product.slug || product.id}`} className="cart-page-item-img">
                                                {imgUrl ? (
                                                    <img src={imgUrl.startsWith('/') || imgUrl.startsWith('http') ? imgUrl : `/${imgUrl}`} alt={product.name} />
                                                ) : (
                                                    <div className="cart-item-placeholder" />
                                                )}
                                            </Link>
                                            <div className="cart-page-item-details">
                                                <h3 className="cart-page-item-name">{product.name}</h3>
                                                <p className="cart-page-item-variant">Couleur : {item.color || 'Standard'}</p>
                                                <button className="cart-page-btn-remove" onClick={() => removeFromCart(product.id, item.color)}>
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>

                                        <div className="cart-page-item-price">
                                            {priceStr}
                                        </div>

                                        <div className="cart-page-item-quantity">
                                            <div className="qty-selector">
                                                <button onClick={() => updateQuantity(product.id, item.color, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(product.id, item.color, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>

                                        <div className="cart-page-item-total">
                                            {formattedItemTotal}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-page-summary">
                            <h2 className="summary-title">Récapitulatif de la commande</h2>

                            <div className="summary-promo-box">
                                <Icon icon="mdi:gift-outline" width="20" height="20" />
                                <span>Étuis offert avec votre commande</span>
                            </div>

                            <div className="summary-row">
                                <span>Sous-total</span>
                                <span>{formattedTotal}</span>
                            </div>
                            <div className="summary-row text-small" style={{ color: '#666', borderBottom: '1px solid #eaeaea', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                                <span>Frais de livraison estimés</span>
                                <span>Calculés à l'étape suivante</span>
                            </div>

                            <div className="summary-total-row">
                                <span>Total</span>
                                <span>{formattedTotal}</span>
                            </div>

                            <Link to="/checkout" className="cart-page-checkout-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Finaliser la commande</Link>

                            <div className="payment-icons">
                                {/* Visual placeholders for payment methods */}
                                <span className="payment-method">Visa</span>
                                <span className="payment-method">Mastercard</span>
                                <span className="payment-method">Amex</span>
                                <span className="payment-method">Apple Pay</span>
                                <span className="payment-method">Alma</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ProductShowcase title="Une autre envie :" linkText="Voir toute la collection" />
        </>
    );
};

export default Cart;
