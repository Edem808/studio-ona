import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './FAQ.css';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqData = [
        {
            category: "Commandes & Livraison",
            questions: [
                {
                    q: "Quels sont les délais de livraison ?",
                    a: "Pour la France métropolitaine, les livraisons standard prennent généralement 3 à 5 jours ouvrés. Les livraisons express sont effectuées en 24h à 48h. Pour l'international, les délais varient entre 5 et 10 jours selon la destination."
                },
                {
                    q: "Où livrez-vous ?",
                    a: "Nous livrons en France métropolitaine, dans les DOM-TOM, ainsi que dans la majorité des pays de l'Union Européenne et à l'international."
                },
                {
                    q: "Comment puis-je suivre ma commande ?",
                    a: "Dès que votre commande est expédiée, vous recevez un e-mail avec un numéro de suivi et un lien vous permettant de suivre l'acheminement de votre colis en temps réel."
                }
            ]
        },
        {
            category: "Retours & Remboursements",
            questions: [
                {
                    q: "Quelle est votre politique de retour ?",
                    a: "Vous disposez de 14 jours à compter de la réception de votre commande pour nous retourner les articles (non portés et dans leur emballage d'origine) si vous changez d'avis. Notez que le droit de rétractation ne s'applique pas aux verres correcteurs réalisés sur mesure."
                },
                {
                    q: "Les frais de retour sont-ils à ma charge ?",
                    a: "Oui, les frais de retour sont à la charge du client, sauf en cas d'erreur de notre part lors de la préparation de votre commande ou si le produit reçu est défectueux."
                },
                {
                    q: "Sous combien de temps serai-je remboursé(e) ?",
                    a: "Une fois votre retour reçu et inspecté par notre équipe, le remboursement est traité dans un délai maximum de 14 jours, directement sur le moyen de paiement utilisé lors de la commande."
                }
            ]
        },
        {
            category: "Montures & Verres",
            questions: [
                {
                    q: "Puis-je commander des lunettes avec verres correcteurs ?",
                    a: "Oui, nous proposons ce service. Une fois votre monture choisie, vous pouvez sélectionner l'option 'Avec correction' et nous envoyer votre ordonnance optique et votre écart pupillaire."
                },
                {
                    q: "Comment connaître ma taille de lunettes ?",
                    a: "Les dimensions de nos montures (largeur du verre, taille du pont, longueur des branches) sont indiquées sur chaque fiche produit. Si vous possédez déjà des lunettes, vous trouverez souvent ces dimensions inscrites à l'intérieur d'une des branches."
                }
            ]
        }
    ];

    return (
        <div className="faq-page container">
            <h1 className="heading-lg text-sans faq-heading" style={{ paddingTop: '150px' }}>
                Foire aux Questions
            </h1>
            <p className="faq-intro text-sans">
                Trouvez rapidement les réponses à vos questions les plus fréquentes. Si vous ne trouvez pas votre bonheur, n'hésitez pas à nous contacter.
            </p>

            <div className="faq-content text-sans">
                {faqData.map((section, secIndex) => (
                    <div key={secIndex} className="faq-section">
                        <h2 className="faq-category-title">{section.category}</h2>
                        <div className="faq-accordion-container">
                            {section.questions.map((item, itemIndex) => {
                                const index = `${secIndex}-${itemIndex}`;
                                const isActive = activeIndex === index;

                                return (
                                    <div
                                        key={itemIndex}
                                        className={`faq-accordion-item ${isActive ? 'active' : ''}`}
                                    >
                                        <button
                                            className="faq-accordion-btn"
                                            onClick={() => toggleAccordion(index)}
                                            aria-expanded={isActive}
                                        >
                                            <span className="faq-accordion-q">{item.q}</span>
                                            <Icon
                                                icon="prime:angle-down"
                                                className={`faq-accordion-icon ${isActive ? 'rotated' : ''}`}
                                            />
                                        </button>
                                        <div
                                            className="faq-accordion-content"
                                            style={{ maxHeight: isActive ? '500px' : '0px' }}
                                        >
                                            <p className="faq-accordion-a">{item.a}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="faq-contact text-sans">
                <h3>Vous avez encore une question ?</h3>
                <p>Notre service client est à votre écoute du lundi au vendredi de 9h à 18h.</p>
                <a href="/contact" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                    Nous contacter
                </a>
            </div>
        </div>
    );
};

export default FAQ;
