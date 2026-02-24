import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './NewsletterPopup.css';

const NewsletterPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [email, setEmail] = useState('');

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
        // Here you would typically send the email to your backend/newsletter service
        console.log('Newsletter subscription for:', email);
        handleClose();
    };

    if (!isVisible) return null;

    return (
        <div className={`newsletter-popup ${isClosing ? 'closing' : ''}`}>
            <button className="newsletter-close" onClick={handleClose} aria-label="Fermer">
                <X size={24} strokeWidth={1.5} />
            </button>

            <div className="newsletter-content">
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
            </div>
        </div>
    );
};

export default NewsletterPopup;
