import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';
import HeroSection from '../components/Sections/HeroSection';
import ProductShowcase from '../components/Sections/ProductShowcase';
import CollectionHighlight from '../components/Sections/CollectionHighlight';
import BrandStory from '../components/Sections/BrandStory';
import DoubleImageSection from '../components/Sections/DoubleImageSection';
import CollectionHighlightSun from '../components/Sections/CollectionHighlightSun';
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    return (
        <div className="home-page">
            <SEO
                title={null}
                description="Studio Ona, marque de lunettes de créateur à Paris. Découvrez nos collections de lunettes solaires et optiques au design minimaliste, fabriquées avec des matériaux nobles. Essayage virtuel en ligne."
                keywords="collection printemps été 2026, lunettes créateur Paris, lunettes solaires design, montures artisanales"
            />
            <HeroSection />
            <ProductShowcase />
            <DoubleImageSection />
            <CollectionHighlight />
            <CollectionHighlightSun />
            <BrandStory />

        </div>
    );
};

export default Home;
