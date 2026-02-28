import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Gift } from 'lucide-react';

const CheckoutSuccess = () => {
    const location = useLocation();
    const orderData = location.state?.orderData;

    // Auto-scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="checkout-page container" style={{ minHeight: '60vh', paddingBottom: '100px', paddingTop: '150px' }}>

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <CheckCircle size={80} color="#10b981" style={{ marginBottom: '2rem', display: 'inline-block' }} />
                <h1 className="heading-md text-serif" style={{ marginBottom: '1rem' }}>Merci pour votre commande !</h1>
                <p className="text-sans" style={{ maxWidth: '600px', margin: '0 auto', color: '#555', lineHeight: '1.6' }}>
                    Votre paiement a été validé avec succès. Vous allez recevoir un email de confirmation contenant les détails de votre commande.
                </p>
            </div>

            {orderData && (
                <div style={{ maxWidth: '600px', margin: '0 auto', background: '#f9f9f9', padding: '2.5rem', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                    <h2 className="text-sans" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem' }}>Récapitulatif de votre commande</h2>

                    <div style={{ marginBottom: '2.5rem' }}>
                        {orderData.items.map((item, index) => {
                            const variant = item.product.variants?.find(v => v.color === item.color) || item.product.variants?.[0];
                            const imageSrc = variant?.images?.[0] || item.product.image;
                            const displayPrice = item.product.isOnSale ? item.product.salePrice : item.product.price;

                            // Handle local image paths
                            let imgUrl = imageSrc;
                            if (imgUrl) {
                                imgUrl = imgUrl.replace(/^https?:\/\/localhost(:\d+)?/i, '');
                                if (!imgUrl.startsWith('/') && !imgUrl.startsWith('http')) {
                                    imgUrl = '/' + imgUrl;
                                }
                            }

                            return (
                                <div key={index} style={{ display: 'grid', gridTemplateColumns: '70px 1fr auto', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <div style={{ position: 'relative', width: '70px', height: '70px', background: '#eaeaea', borderRadius: '8px' }}>
                                        <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>{item.quantity}</span>
                                        {imgUrl ? <img src={imgUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <div style={{ width: '100%', height: '100%' }}></div>}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="text-sans" style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#111' }}>{item.product.name}</span>
                                        {item.color && <span className="text-sans" style={{ color: '#666', fontSize: '0.9rem' }}>{item.color}</span>}
                                    </div>
                                    <div className="text-sans" style={{ fontWeight: 600, color: '#111' }}>
                                        {displayPrice}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem',
                        border: '0.5px solid #111',
                        fontSize: '0.85rem',
                        color: '#111',
                        background: '#fff',
                        marginBottom: '2.5rem',
                        fontFamily: 'var(--font-sans)'
                    }}>
                        <Gift size={20} />
                        <span>Étuis offert avec votre commande</span>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-sans)', color: '#555' }}>
                            <span>Sous-total</span>
                            <span>{orderData.total_price.toFixed(2)}€</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', color: '#555' }}>
                            <span>Expédition</span>
                            <span>Gratuit</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px dashed #ccc', fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 600, color: '#000' }}>
                            <span>Total Payé</span>
                            <span>{orderData.total_price.toFixed(2)}€</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #eaeaea' }}>
                        <h3 className="text-sans" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111' }}>Livraison prévue à cette adresse :</h3>
                        <p className="text-sans" style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            {orderData.user_details.firstName} {orderData.user_details.lastName}<br />
                            {orderData.user_details.address}<br />
                            {orderData.user_details.zip} {orderData.user_details.city}<br />
                            {orderData.user_email}
                        </p>
                    </div>

                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link to="/shop" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    Continuer mes achats
                </Link>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
