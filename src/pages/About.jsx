import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const headerRef = useRef(null);
    const contentRefs = useRef([]);
    const imageRefs = useRef([]);

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
            );

            // Content text reveal animation
            contentRefs.current.forEach((el, index) => {
                if (!el) return;
                gsap.fromTo(el,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Image parallax / reveal animation
            imageRefs.current.forEach((el, index) => {
                if (!el) return;
                gsap.fromTo(el,
                    { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
                    {
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 1.5,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
        });

        return () => ctx.revert();
    }, []);

    const addToRefs = (el, refArray) => {
        if (el && !refArray.current.includes(el)) {
            refArray.current.push(el);
        }
    };

    return (
        <div className="about-page">
            <SEO
                title="Notre Histoire"
                description="Découvrez la vision derrière Studio Ona : une passion pour le design minimaliste et la lunetterie contemporaine. Ona signifie 'voir' en Swahili. Artisanat de précision, matériaux nobles, montures architecturales."
                keywords="histoire Studio Ona, philosophie design lunettes, artisanat lunetterie, ona signifie voir, montures architecturales, design minimaliste"
            />
            {/* Hero Section */}
            <section className="about-hero container">
                <div className="about-hero-content" ref={headerRef}>
                    <h1 className="heading-xl text-serif">La vision derrière <br /><span>studio ona</span></h1>
                    <p className="text-sans about-subtitle">
                        Fondé sur l'idée que les lunettes ne sont pas qu'un simple outil de correction, mais le reflet de la perspective de chacun.
                    </p>
                </div>
            </section>

            {/* Split Content Section 1 */}
            <section className="about-split container">
                <div className="about-split-grid">
                    <div className="about-split-text" ref={(el) => addToRefs(el, contentRefs)}>
                        <h2 className="heading-md text-serif">Notre Philosophie</h2>
                        <p className="text-sans">
                            Studio Ona est né d'une passion pour le design minimaliste et d'une volonté de repenser la lunetterie contemporaine. Nous croyons que chaque monture doit être à la fois une pièce maîtresse architecturale et une extension naturelle de votre visage.
                        </p>
                        <p className="text-sans">
                            Le mot "Ona" signifie "voir" en Swahili. Ce mantra guide notre approche créative : créer des objets qui non seulement améliorent la vision, mais qui redéfinissent la façon dont vous êtes perçu par le monde.
                        </p>
                    </div>
                    <div className="about-split-image" ref={(el) => addToRefs(el, imageRefs)}>
                        <img src="/assets/images/campaign-image.webp" alt="Studio Ona Philosophy" />
                    </div>
                </div>
            </section>

            {/* Split Content Section 2 (Reversed) */}
            <section className="about-split about-split-reverse container">
                <div className="about-split-grid">
                    <div className="about-split-image" ref={(el) => addToRefs(el, imageRefs)}>
                        <img src="/assets/images/home_placeholder_1.webp" alt="Design Process" />
                    </div>
                    <div className="about-split-text" ref={(el) => addToRefs(el, contentRefs)}>
                        <h2 className="heading-md text-serif">L'Artisanat</h2>
                        <p className="text-sans">
                            Le design brut rencontre l'artisanat de précision. Nos collections sont le résultat de mois de recherche, où les matériaux les plus nobles sont sélectionnés et travaillés avec une attention obsessionnelle aux détails.
                        </p>
                        <p className="text-sans">
                            De l'acétate de cellulose de qualité supérieure à l'acier inoxydable ultra-léger, chaque élément est choisi pour sa durabilité, son confort et son impact esthétique pur.
                        </p>
                    </div>
                </div>
            </section>

            {/* Full Width Image Section */}
            <section className="about-full-image container" ref={(el) => addToRefs(el, imageRefs)}>
                <img src="/assets/images/cover.png" alt="Ona Collection Vision" />
            </section>

            {/* Final CTA Section */}
            <section className="about-cta container" ref={(el) => addToRefs(el, contentRefs)}>
                <h2 className="heading-lg text-serif">Redéfinissez<br />votre regard.</h2>
                <Link to="/shop" className="btn-primary cta-btn">Découvrir les collections</Link>
            </section>
        </div>
    );
};

export default About;
