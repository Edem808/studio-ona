import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { supabase } from '../../lib/supabaseClient';
import './HeroSection.css';

const HeroSection = () => {
    const [settings, setSettings] = useState({
        mediaType: 'image',
        mediaUrl: '',
        title: 'Collection Printemps Été 26',
        buttonText: 'Voir la collection',
        buttonLink: '/shop'
    });

    const textRef = useRef(null);
    const subtitleRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'hero_config').single();
            if (!error && data?.value) {
                setSettings(prev => ({ ...prev, ...data.value }));
            }
        };
        fetchSettings();
    }, []);

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
                {settings.mediaType === 'video' && settings.mediaUrl ? (
                    <video 
                        className="hero-image-bg" 
                        src={settings.mediaUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div 
                        className="hero-image-bg"
                        style={settings.mediaUrl ? { backgroundImage: `url(${settings.mediaUrl})` } : {}}
                    ></div>
                )}
            </div>
            <div className="hero-content">
                <div className="hero-bottom-left" ref={subtitleRef}>
                    <h1 className="hero-title text-serif" ref={textRef}>{settings.title}</h1>
                    <Link to={settings.buttonLink || '/shop'} className="btn-hero-primary">{settings.buttonText}</Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
