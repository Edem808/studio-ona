import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import SEO from '../components/SEO';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle the form submission (e.g., API call)
        console.log('Form submitted:', formData);
        setIsSubmitted(true);

        // Reset form after a few seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 5000);
    };

    return (
        <div className="contact-page container">
            <SEO
                title="Contact"
                description="Contactez l'équipe Studio Ona pour toute question sur nos montures, vos verres ou votre commande. E-mail : hello@studio-ona.fr — Téléphone : +33 (0)1 23 45 67 89. Réponse sous 24h à 48h."
                keywords="contacter Studio Ona, service client lunettes, contact opticien Paris, suivi commande lunettes"
            />
            <h1 className="heading-lg text-sans contact-heading" style={{ paddingTop: '150px' }}>
                Contactez-nous
            </h1>
            <p className="contact-intro text-sans">
                Une question sur nos montures, vos verres ou votre commande ?
                N'hésitez pas à nous écrire, notre équipe vous répondra dans les plus brefs délais.
            </p>

            <div className="contact-grid text-sans">
                {/* Contact Information */}
                <div className="contact-info">
                    <div className="info-block">
                        <Icon icon="prime:envelope" className="info-icon" />
                        <div>
                            <h3>Par E-mail</h3>
                            <p>hello@studio-ona.fr</p>
                            <p className="info-subtext">Nous répondons sous 24h à 48h ouvrées.</p>
                        </div>
                    </div>

                    <div className="info-block">
                        <Icon icon="prime:phone" className="info-icon" />
                        <div>
                            <h3>Par Téléphone</h3>
                            <p>+33 (0)1 23 45 67 89</p>
                            <p className="info-subtext">Du lundi au vendredi, de 9h à 18h.</p>
                        </div>
                    </div>

                    <div className="info-block">
                        <Icon icon="prime:map-marker" className="info-icon" />
                        <div>
                            <h3>Notre Boutique</h3>
                            <p>12 Rue des Lunetiers</p>
                            <p>75003 Paris, France</p>
                            <p className="info-subtext">Ouvert du mardi au samedi, de 10h à 19h.</p>
                        </div>
                    </div>

                    <div className="contact-social-links">
                        <p>Suivez-nous :</p>
                        <div className="social-icons">
                            <a href="#" aria-label="Instagram"><Icon icon="prime:instagram" width="24" height="24" /></a>
                            <a href="#" aria-label="TikTok"><Icon icon="prime:tiktok" width="24" height="24" /></a>
                            <a href="#" aria-label="Pinterest"><Icon icon="prime:pinterest" width="24" height="24" /></a>
                            <a href="#" aria-label="X"><Icon icon="prime:twitter" width="20" height="20" /></a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="contact-form-container">
                    {isSubmitted ? (
                        <div className="contact-success-message">
                            <Icon icon="prime:check-circle" className="success-icon" />
                            <h3>Message envoyé !</h3>
                            <p>Merci de nous avoir contactés. Nous revenons vers vous très vite.</p>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nom complet *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Jean Dupont"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Adresse e-mail *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: jean.dupont@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Sujet de votre demande</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                >
                                    <option value="">Sélectionnez un sujet (optionnel)</option>
                                    <option value="Suivi de commande">Suivi de commande</option>
                                    <option value="Conseil monture/verre">Conseil monture / verre</option>
                                    <option value="Service après-vente">Service après-vente / Retour</option>
                                    <option value="Autre">Autre demande</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Votre message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Comment pouvons-nous vous aider ?"
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary contact-submit-btn">
                                Envoyer le message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
