import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import './BrandStory.css';

const BrandStory = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.brand-text-content > *',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    }
                }
            );

            gsap.fromTo('.brand-image-main',
                { scale: 1.1, opacity: 0.5 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="brand-story container" ref={sectionRef}>
            <div className="brand-grid">
                <div className="brand-text-col">
                    <div className="brand-text-content">
                        <h2 className="text-small title" style={{ textTransform: 'none', fontSize: '1.5rem', fontWeight: '400', letterSpacing: 'normal', marginBottom: '2rem' }}>
                            Ona signifie "voir" en Swahili
                        </h2>
                        <p className="text-sans description" style={{ fontSize: '1rem', fontStyle: 'normal', textAlign: 'left', width: '100%' }}>
                            Pour nous, la vue est un instinct et le design une évidence.
                            <br /><br />
                            Nous créons des montures pensées pour révéler votre regard et affirmer votre perspective.
                            <br /><br />
                            Une vision claire, un design brut.
                        </p>
                        <div style={{ width: '100%', textAlign: 'left', marginTop: '1rem', marginBottom: '4rem' }}>
                            <Link to="/about" className="btn-primary">En savoir plus</Link>
                        </div>
                        <div style={{ fontFamily: 'var(--font-walkway)', fontSize: '2rem', color: 'var(--color-text-white)', width: '100%', textAlign: 'center' }}>
                            studio ona
                        </div>
                    </div>
                </div>
                <div className="brand-image-col">
                    <div className="brand-image-main">
                        <img src="/assets/images/campaign-image.webp" alt="Campaign Image" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
