import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import './SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100); // Small delay for animation
        } else {
            document.body.style.overflow = 'unset';
            setSearchTerm('');
            setResults([]);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle live search
    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsSearching(true);

            // Search by name (case insensitive)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .ilike('name', `%${searchTerm}%`)
                .limit(8); // Limit to 8 results for the overlay

            if (error) {
                console.error("Search error:", error);
                setResults([]);
            } else {
                setResults(data || []);
            }

            setIsSearching(false);
        };

        // Debounce search slightly to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleProductClick = (slug) => {
        onClose(); // Close overlay first
        navigate(`/shop/${slug}`); // Then navigate
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay">
            <div className="search-overlay-header">
                <button className="search-close-btn" onClick={onClose} aria-label="Fermer la recherche">
                    <X size={32} strokeWidth={1} />
                </button>
            </div>

            <div className="search-overlay-content container">
                <div className="search-input-wrapper">
                    <Search size={32} strokeWidth={1} className="search-icon-large" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input text-serif"
                        placeholder="Rechercher un modèle…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="search-results-area">
                    {isSearching ? (
                        <p className="search-message text-sans">Recherche en cours...</p>
                    ) : searchTerm.trim().length > 0 && searchTerm.trim().length < 2 ? (
                        <p className="search-message text-sans text-muted">Tapez au moins 2 caractères.</p>
                    ) : searchTerm.trim().length >= 2 && results.length === 0 ? (
                        <p className="search-message text-sans text-muted">Aucun résultat trouvé pour "{searchTerm}".</p>
                    ) : (
                        <div className="search-results-grid">
                            {results.map((product) => {
                                // Find the default image from variants (similar to ProductCard)
                                let displayImage = '/assets/images/placeholder.jpg';
                                if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
                                    displayImage = product.variants[0].images[0];
                                }

                                return (
                                    <div
                                        key={product.id}
                                        className="search-result-item"
                                        onClick={() => handleProductClick(product.slug || product.id)}
                                    >
                                        <div className="search-result-img-wrapper">
                                            <img src={displayImage} alt={product.name} />
                                        </div>
                                        <div className="search-result-info">
                                            <h4 className="text-sans">{product.name}</h4>
                                            <p className="text-sans text-muted">{product.price}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
