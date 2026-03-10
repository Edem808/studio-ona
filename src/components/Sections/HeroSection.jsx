import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import './HeroSection.css';

const HeroSection = () => {
    const textRef = useRef(null);
    const subtitleRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(textRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out', delay: 0.2 }
            );

            gsap.fromTo(subtitleRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
            );

            // Simple parallax on image
            gsap.to('.hero-image-bg', {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="hero-section" ref={containerRef}>
            <div className="hero-image-container">
                <div className="hero-image-bg"></div>
            </div>
            <div className="hero-content">
                <div className="hero-bottom-left" ref={subtitleRef}>
                    <h1 className="hero-title text-serif" ref={textRef}>Collection Printemps Été 26</h1>
                    <Link to="/shop" className="btn-hero-primary">Voir la collection</Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
