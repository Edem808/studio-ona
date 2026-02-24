import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import './Checkout.css';

// Stripe Elements
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

// WARNING: EXPOSED KEYS FOR STUDENT PROJECT PURPOSES ONLY
// Never do this in a real production application.
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''; // Must be configured in .env.local
const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY || ''; // Must be configured in .env.local

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zip: ''
    });

    const totalAmount = getCartTotal();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || cart.length === 0) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // --- 1. Client-Side Payment Intent Creation (HACK FOR PROJECT) ---
            // Normally this is completely forbidden on the frontend.
            // We are calling the Stripe API directly from React using the secret key.
            const totalInCents = Math.round(totalAmount * 100);

            const params = new URLSearchParams({
                amount: totalInCents.toString(),
                currency: 'eur',
                'automatic_payment_methods[enabled]': 'true'
            });

            const intentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            const intentData = await intentResponse.json();

            if (intentData.error) {
                throw new Error(intentData.error.message);
            }

            const clientSecret = intentData.client_secret;

            // --- 2. Confirm Payment with CardElement ---
            const cardElement = elements.getElement(CardElement);

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent.status === 'succeeded') {
                // --- 3. Save Order to Supabase ---
                const orderData = {
                    user_email: formData.email,
                    user_details: formData,
                    items: cart,
                    total_price: totalAmount,
                    status: 'paid',
                    stripe_session_id: paymentIntent.id
                };

                const { error: dbError } = await supabase
                    .from('orders')
                    .insert([orderData]);

                if (dbError) {
                    // Even if DB fails, payment succeeded, but we should log it
                    console.error("Order save failed:", dbError);
                }

                // --- 4. Success Routine ---
                clearCart();
                navigate('/checkout/success');
            }

        } catch (err) {
            console.error(err);
            setErrorMessage(err.message || "Une erreur est survenue lors du paiement.");
        } finally {
            setIsProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: '"Wix Madefor Display", sans-serif',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '10px 12px',
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h3 className="section-title text-sans">Contact</h3>
            <div className="form-group full-width">
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
            </div>

            <h3 className="section-title text-sans" style={{ marginTop: '2rem' }}>Livraison</h3>
            <div className="form-row">
                <div className="form-group">
                    <input type="text" name="firstName" placeholder="Prénom" required value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="lastName" placeholder="Nom" required value={formData.lastName} onChange={handleChange} />
                </div>
            </div>
            <div className="form-group full-width">
                <input type="text" name="address" placeholder="Adresse" required value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <input type="text" name="zip" placeholder="Code postal" required value={formData.zip} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="city" placeholder="Ville" required value={formData.city} onChange={handleChange} />
                </div>
            </div>

            <h3 className="section-title text-sans" style={{ marginTop: '2rem' }}>Paiement</h3>
            <div className="stripe-card-container">
                <CardElement options={cardElementOptions} />
            </div>

            {errorMessage && <div className="checkout-error">{errorMessage}</div>}

            <button
                type="submit"
                className="btn-pay-now"
                disabled={!stripe || isProcessing || cart.length === 0}
            >
                {isProcessing ? 'Traitement en cours...' : `Payer ${totalAmount.toFixed(2)}€`}
            </button>
        </form>
    );
};

const Checkout = () => {
    const { cart, getCartTotal } = useCart();

    // Auto-scroll to top on mount
    useState(() => {
        window.scrollTo(0, 0);
    }, []);

    if (cart.length === 0) {
        return (
            <div className="checkout-page empty-checkout">
                <h2 className="heading-md text-serif">Votre panier est vide</h2>
                <button className="btn-primary" onClick={() => window.location.href = '/shop'}>Retour à la boutique</button>
            </div>
        );
    }

    return (
        <div className="checkout-page container">
            <div className="checkout-grid">

                {/* Left Side - Form wrapped in Stripe Elements */}
                <div className="checkout-left">
                    <h1 className="heading-md text-serif checkout-title">Paiement Sécurisé</h1>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>

                {/* Right Side - Summary */}
                <div className="checkout-right">
                    <div className="order-summary-box">
                        <h3 className="summary-title text-sans">Résumé de la commande</h3>

                        <div className="summary-items-list">
                            {cart.map((item, index) => {
                                const variant = item.product.variants?.find(v => v.color === item.color) || item.product.variants?.[0];
                                const imageSrc = variant?.images?.[0] || item.product.image;
                                const displayPrice = item.product.isOnSale ? item.product.salePrice : item.product.price;

                                return (
                                    <div key={index} className="summary-item">
                                        <div className="summary-item-img">
                                            <span className="summary-item-qty">{item.quantity}</span>
                                            {imageSrc ? <img src={imageSrc} alt={item.product.name} /> : <div className="img-placeholder"></div>}
                                        </div>
                                        <div className="summary-item-details">
                                            <span className="item-name text-sans">{item.product.name}</span>
                                            {item.color && <span className="item-color text-small">{item.color}</span>}
                                        </div>
                                        <div className="summary-item-price">
                                            {displayPrice}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Sous-total</span>
                                <span>{getCartTotal().toFixed(2)}€</span>
                            </div>
                            <div className="summary-row">
                                <span>Expédition</span>
                                <span>Gratuit</span>
                            </div>
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span>{getCartTotal().toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
