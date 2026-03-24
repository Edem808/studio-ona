import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setNotification('Merci pour votre inscription à la newsletter !');
            setEmail('');
            setTimeout(() => setNotification(''), 5000);
        }
    };

    return (
        <footer className="footer-ona">
            <div className="container footer-ona-grid">
                <div className="footer-ona-left">
                    <h2 className="footer-ona-logo" style={{ fontFamily: 'var(--font-walkway)', fontWeight: 'normal', letterSpacing: 'normal' }}>studio ona</h2>
                    <form className="footer-ona-newsletter" onSubmit={handleSubmit}>
                        <p>Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et offres spéciales.</p>
                        <div className="footer-ona-newsletter-input">
                            <input
                                type="email"
                                placeholder="VOTRE EMAIL"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit">S'INSCRIRE</button>
                        </div>
                        {notification && <p className="footer-ona-notification">{notification}</p>}
                    </form>
                    <div className="footer-ona-socials">
                        <a href="#" aria-label="Instagram">
                            <Icon icon="prime:instagram" width="24" height="24" />
                        </a>
                        <a href="#" aria-label="TikTok">
                            <Icon icon="prime:tiktok" width="24" height="24" />
                        </a>
                        <a href="#" aria-label="Pinterest">
                            <Icon icon="prime:pinterest" width="24" height="24" />
                        </a>
                        <a href="#" aria-label="X">
                            <Icon icon="prime:twitter" width="20" height="20" />
                        </a>
                    </div>
                </div>

                <div className="footer-ona-right">
                    <div className="footer-ona-col">
                        <h3 className="footer-ona-title">Informations</h3>
                        <ul>
                            <li><Link to="/cgv">Conditions générales de vente</Link></li>
                            <li><Link to="/cgu">Conditions générales d'utilisation</Link></li>
                            <li><Link to="/cookies">Politique de cookies</Link></li>
                            <li><Link to="/mentions-legales">Mentions Légales</Link></li>
                            <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
                        </ul>
                    </div>
                    <div className="footer-ona-col">
                        <h3 className="footer-ona-title">Service Client</h3>
                        <ul>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-ona-col">
                        <h3 className="footer-ona-title">À propos</h3>
                        <ul>
                            <li><Link to="/about">Notre histoire</Link></li>
                            <li><Link to="/magasin">Notre magasin</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-ona-bottom container">
                <p>© 2026 <span style={{ fontFamily: 'var(--font-walkway)' }}>studio ona</span> - Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;
