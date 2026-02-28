import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { supabase } from '../../lib/supabaseClient';
import ProductCard from '../UI/ProductCard';
import './CollectionHighlight.css';

const CollectionHighlight = () => {
    const sectionRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('category', 'Optiques')
                .limit(4);

            if (error) {
                console.error("Error fetching products:", error);
            } else {
                setProducts(data);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (loading || products.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.product-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [products, loading]);

    return (
        <section className="collection-highlight container" ref={sectionRef}>
            <div className="highlight-header">
                <h2>Collection Optiques</h2>
                <Link to="/shop?category=Optiques" className="shop-all-link text-small">Découvrir &rarr;</Link>
            </div>

            <div className="highlight-grid">
                {loading ? (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Chargement des produits...</p>
                ) : products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Aucun produit disponible.</p>
                )}
            </div>
        </section>
    );
};

export default CollectionHighlight;
