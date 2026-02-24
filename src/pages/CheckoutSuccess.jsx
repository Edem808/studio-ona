import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess = () => {

    // Auto-scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="checkout-page empty-checkout container" style={{ minHeight: '60vh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '150px' }}>
            <CheckCircle size={80} color="#10b981" style={{ marginBottom: '2rem' }} />
            <h1 className="heading-md text-serif" style={{ marginBottom: '1rem' }}>Merci pour votre commande !</h1>
            <p className="text-sans" style={{ maxWidth: '600px', margin: '0 auto 3rem auto', color: '#555', lineHeight: '1.6' }}>
                Votre paiement a été validé avec succès. Vous allez recevoir un email de confirmation contenant les détails de votre commande.
            </p>
            <Link to="/shop" className="btn-primary">
                Continuer mes achats
            </Link>
        </div>
    );
};

export default CheckoutSuccess;
