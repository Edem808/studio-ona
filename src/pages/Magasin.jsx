import React from 'react';
import { Icon } from '@iconify/react';
import './Magasin.css';

const Magasin = () => {
    return (
        <div className="magasin-page">
            {/* Hero Section */}
            <section className="magasin-hero">
                <div className="magasin-hero-content container">
                    <h1 className="heading-lg text-sans">Bienvenue chez Studio Ona</h1>
                    <p className="text-sans magasin-hero-subtitle">
                        Plus qu'une boutique d'optique, un véritable lieu de vie dédié à la santé visuelle et au style.
                    </p>
                    <a href="#practical-info" className="btn-primary magasin-hero-btn text-sans" style={{ textDecoration: 'none' }}>
                        Planifier ma visite
                    </a>
                </div>
            </section>

            {/* Experience Section */}
            <section className="magasin-experience container">
                <div className="magasin-experience-grid">
                    <div className="magasin-experience-text">
                        <h2 className="heading-md text-sans">L'Expérience Ona</h2>
                        <p className="text-sans paragraph">
                            Pousser les portes de notre concept store parisien, c'est entrer dans un univers où le design
                            sublime l'expertise médicale. Nous avons conçu cet espace avec une approche minimaliste :
                            des matériaux nobles, une lumière chaleureuse et une ambiance propice à l'échange.
                        </p>
                        <p className="text-sans paragraph">
                            Loin des opticiens traditionnels, Studio Ona vous propose un écrin apaisant où chaque monture
                            est sélectionnée avec soin, et où prendre soin de votre vue redevient un moment de pur plaisir.
                        </p>
                    </div>
                    <div className="magasin-experience-image">
                        <img
                            src="/assets/images/about-image.jpg"
                            alt="Intérieur de la boutique Studio Ona"
                            style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                        />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="magasin-services bg-light">
                <div className="container">
                    <h2 className="heading-md text-sans text-center" style={{ marginBottom: '3rem' }}>Nos Services Exclusifs</h2>
                    <div className="magasin-services-grid text-sans">

                        <div className="magasin-service-card">
                            <div className="magasin-service-icon-wrapper">
                                <Icon icon="prime:eye" className="magasin-service-icon" />
                            </div>
                            <h3>Examen de la Vue</h3>
                            <p>Bilan visuel complet réalisé par nos optométristes diplômés dans notre salle d'examen dernière génération.</p>
                        </div>

                        <div className="magasin-service-card">
                            <div className="magasin-service-icon-wrapper">
                                <Icon icon="prime:user" className="magasin-service-icon" />
                            </div>
                            <h3>Stylisme Personnalisé</h3>
                            <p>Morphologie de votre visage, colorimétrie, style de vie... Nos experts vous guident vers la monture parfaite.</p>
                        </div>

                        <div className="magasin-service-card">
                            <div className="magasin-service-icon-wrapper">
                                <Icon icon="prime:cog" className="magasin-service-icon" />
                            </div>
                            <h3>Atelier sur Place</h3>
                            <p>Montage précis de vos verres, ajustements sur-mesure et petites réparations effectués directement dans notre atelier.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Practical Info Section */}
            <section id="practical-info" className="magasin-practical container">
                <div className="magasin-practical-grid text-sans">
                    <div className="magasin-practical-image">
                        {/* Placeholder for facade or map */}
                        <div className="magasin-map-placeholder">
                            <Icon icon="prime:map" className="magasin-image-icon" />
                            <span>Carte ou Façade</span>
                        </div>
                    </div>

                    <div className="magasin-practical-details">
                        <h2 className="heading-md">Infos Pratiques</h2>

                        <div className="practical-item">
                            <Icon icon="prime:map-marker" className="practical-icon" />
                            <div>
                                <strong>Adresse</strong>
                                <p>12 Rue des Lunetiers<br />75003 Paris, France</p>
                            </div>
                        </div>

                        <div className="practical-item">
                            <Icon icon="prime:clock" className="practical-icon" />
                            <div>
                                <strong>Horaires d'Ouverture</strong>
                                <ul>
                                    <li><span>Mardi - Vendredi :</span> 10h00 - 19h00</li>
                                    <li><span>Samedi :</span> 10h00 - 19h30</li>
                                    <li><span>Dimanche & Lundi :</span> Fermé</li>
                                </ul>
                            </div>
                        </div>

                        <div className="practical-item">
                            <Icon icon="prime:directions" className="practical-icon" />
                            <div>
                                <strong>Accès</strong>
                                <p>Métro 3 : Temple<br />Métro 3, 5, 8, 9, 11 : République</p>
                            </div>
                        </div>

                        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-outline magasin-itinerary-btn">
                            Voir l'itinéraire
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Magasin;
