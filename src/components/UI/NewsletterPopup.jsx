import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './NewsletterPopup.css';

const NewsletterPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Check if we should show the popup
        // We use sessionStorage so it only shows once per tab session for testing,
        // but can be changed to localStorage to only show once ever.
        const hasClosed = sessionStorage.getItem('newsletterClosed');

        if (!hasClosed) {
            // Show popup after 3 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        sessionStorage.setItem('newsletterClosed', 'true');
        setTimeout(() => {
            setIsVisible(false);
        }, 500); // Wait for the animation to finish (match CSS duration)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        localStorage.setItem('newsletterClosed', 'true');
        // Auto-close after 3 seconds
        setTimeout(() => {
            handleClose();
        }, 3000);
    };

    if (!isVisible) return null;

    return (
        <div className={`newsletter-popup ${isClosing ? 'closing' : ''}`}>
            <button className="newsletter-close" onClick={handleClose} aria-label="Fermer">
                <X size={24} strokeWidth={1.5} />
            </button>

            <div className="newsletter-content">
                {submitted ? (
                    <div className="newsletter-confirmation">
                        <div className="newsletter-check">✓</div>
                        <h3 className="newsletter-title text-sans">Merci !</h3>
                        <p className="newsletter-subtitle text-sans">
                            Votre inscription est confirmée.<br />Bienvenue dans la communauté Studio Ona.
                        </p>
                    </div>
                ) : (
                    <>
                        <h3 className="newsletter-title text-sans">
                            10% de réduction<br />sur votre première commande
                        </h3>
                        <p className="newsletter-subtitle text-sans">
                            Nouveautés, exclusivités et inspirations.<br />Directement dans votre boîte mail.
                        </p>
                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="VOTRE EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="newsletter-input text-sans"
                            />
                            <button type="submit" className="newsletter-submit text-sans">
                                S'INSCRIRE
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsletterPopup;
