import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../components/Sections/HeroSection';
import ProductShowcase from '../components/Sections/ProductShowcase';
import CollectionHighlight from '../components/Sections/CollectionHighlight';
import DoubleImageSection from '../components/Sections/DoubleImageSection';
import CollectionGrid from '../components/Sections/CollectionGrid';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    return (
        <div className="home-page">
            <HeroSection />
            <ProductShowcase />
            <DoubleImageSection />
            <CollectionGrid />
            <CollectionHighlight />

        </div>
    );
};

export default Home;
