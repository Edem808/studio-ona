import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { supabase } from '../../lib/supabaseClient';
import ProductCard from '../UI/ProductCard';
// Recycled CSS from ProductShowcase
import './ProductShowcase.css';

const CollectionGrid = () => {
    const sectionRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                // Let's just fetch all or filter by category if we wanted
                .order('id', { ascending: false })
                .limit(4);

            if (error) {
                console.error("Error fetching collection products:", error);
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
        <section className="product-showcase container" ref={sectionRef}>
            <div className="showcase-header">
                <h2 className="text-small">SAHARA COLLECTION</h2>
            </div>

            <div className="product-grid">
                {loading ? (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Chargement des collections...</p>
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

export default CollectionGrid;
