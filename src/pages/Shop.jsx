import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/UI/ProductCard';
import './Shop.css';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [mobileGrid, setMobileGrid] = useState('double');

    // Main Category State
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

    // Main Gender State
    const [activeGender, setActiveGender] = useState(searchParams.get('gender') || 'all');

    // Sync state when URL changes (e.g. clicking a link in Header while already on Shop page)
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setActiveCategory(cat);
        else setActiveCategory('all');

        const gen = searchParams.get('gender');
        if (gen) setActiveGender(gen);
        else setActiveGender('all');
    }, [searchParams]);

    const handleCategoryClick = (cat) => {
        const params = new URLSearchParams(searchParams);
        if (cat === 'all') params.delete('category');
        else params.set('category', cat);
        setSearchParams(params);
    };

    const handleGenderClick = (gen) => {
        const params = new URLSearchParams(searchParams);
        if (gen === 'all') params.delete('gender');
        else params.set('gender', gen);
        setSearchParams(params);
    };

    // Filter States
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [sortBy, setSortBy] = useState('selection'); // selection, price-asc, price-desc, recent

    // Extracted Filter Options from DB
    const [availableColors, setAvailableColors] = useState([]);
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [availableShapes, setAvailableShapes] = useState([]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeMobilePanel, setActiveMobilePanel] = useState('filters'); // 'filters' | 'collection'

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (!error && data) {
            setProducts(data);
            extractFilters(data);
        }
        setLoading(false);
    };

    const extractFilters = (data) => {
        const colors = new Set();
        const materials = new Set();
        const shapes = new Set();

        data.forEach(p => {
            if (p.material) materials.add(p.material);
            if (p.shape) shapes.add(p.shape);
            if (p.variants) {
                p.variants.forEach(v => {
                    if (v.color) colors.add(v.color.trim());
                });
            }
        });

        setAvailableColors(Array.from(colors).filter(Boolean).sort());
        setAvailableMaterials(Array.from(materials).filter(Boolean).sort());
        setAvailableShapes(Array.from(shapes).filter(Boolean).sort());
    };

    // --- Filter Handlers ---
    const handleCheckboxFilter = (setState, value) => {
        setState(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    // --- Filtering Logic ---
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // 1. Category
        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }

        // 2. Gender
        if (activeGender !== 'all') {
            result = result.filter(p => p.gender === activeGender);
        }

        // 3. Shapes
        if (selectedShapes.length > 0) {
            result = result.filter(p => selectedShapes.includes(p.shape));
        }

        // 4. Materials
        if (selectedMaterials.length > 0) {
            result = result.filter(p => selectedMaterials.includes(p.material));
        }

        // 5. Colors (If any variant matches)
        if (selectedColors.length > 0) {
            result = result.filter(p => {
                if (!p.variants) return false;
                return p.variants.some(v => selectedColors.includes(v.color.trim()));
            });
        }

        // 6. Sort
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'recent':
                // Assuming larger ID is more recent
                result.sort((a, b) => b.id - a.id);
                break;
            case 'selection':
            default:
                // could be default DB order or something manual
                break;
        }

        return result;
    }, [products, activeCategory, activeGender, selectedShapes, selectedMaterials, selectedColors, sortBy]);


    const subtitleParts = [];
    if (activeCategory !== 'all') subtitleParts.push(activeCategory);
    if (activeGender !== 'all') subtitleParts.push(activeGender);
    const subtitle = subtitleParts.join(' - ');

    const isSpecialCategory = activeCategory === 'Solaires' || activeCategory === 'Optiques';

    return (
        <div className="shop-page container">
            {isSpecialCategory ? (
                <>
                    <h1 className="heading-lg shop-title-solaires text-serif">{activeCategory}</h1>
                    <div className="shop-banner-images">
                        {activeGender === 'Homme' ? (
                            <img src="/assets/images/solairem.webp" alt={`Bannière ${activeCategory} Homme`} />
                        ) : activeGender === 'Femme' ? (
                            <img src="/assets/images/solairef.webp" alt={`Bannière ${activeCategory} Femme`} />
                        ) : (
                            <img src="/assets/images/mix-sol.webp" alt={`Bannière ${activeCategory} Mixte`} />
                        )}
                    </div>

                    <div className="shop-solaires-bar text-sans">
                        <div className="solaires-genders">
                            <button className={activeGender === 'Femme' ? 'active' : ''} onClick={() => handleGenderClick('Femme')}>Femme</button>
                            <button className={activeGender === 'Homme' ? 'active' : ''} onClick={() => handleGenderClick('Homme')}>Homme</button>
                            <button className={activeGender === 'all' ? 'active' : ''} onClick={() => handleGenderClick('all')}>Toute la collection</button>
                        </div>
                        <div className="solaires-filter-toggle" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="mobile-filter-btns" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-filter mobile-btn-collection" onClick={() => { isFilterOpen && activeMobilePanel === 'collection' ? setIsFilterOpen(false) : (setActiveMobilePanel('collection'), setIsFilterOpen(true)); }}>
                                    Collection
                                </button>
                                <button className="btn-filter" onClick={() => { isFilterOpen && activeMobilePanel === 'filters' ? setIsFilterOpen(false) : (setActiveMobilePanel('filters'), setIsFilterOpen(true)); }}>
                                    Filtres
                                </button>
                            </div>
                            <div className="mobile-grid-toggle">
                                <button className={`grid-btn ${mobileGrid === 'single' ? 'active' : ''}`} onClick={() => setMobileGrid('single')} aria-label="Affichage 1 colonne">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                                </button>
                                <button className={`grid-btn ${mobileGrid === 'double' ? 'active' : ''}`} onClick={() => setMobileGrid('double')} aria-label="Affichage 2 colonnes">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="heading-lg shop-title text-serif" style={{ marginBottom: subtitle ? '0.5rem' : '2rem' }}>Boutique</h1>
                    {subtitle && (
                        <h2 className="text-sans" style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '2rem', fontWeight: 400, textTransform: 'capitalize' }}>
                            {subtitle}
                        </h2>
                    )}

                    <div className="shop-top-bar">
                        <div className="shop-categories text-sans">
                            <button className={activeCategory === 'all' ? 'active' : ''} onClick={() => handleCategoryClick('all')}>Tout</button>
                            <button className={activeCategory === 'Solaires' ? 'active' : ''} onClick={() => handleCategoryClick('Solaires')}>Solaires</button>
                            <button className={activeCategory === 'Optiques' ? 'active' : ''} onClick={() => handleCategoryClick('Optiques')}>Optiques</button>
                            <button className={activeCategory === 'Accessoires' ? 'active' : ''} onClick={() => handleCategoryClick('Accessoires')}>Accessoires</button>
                        </div>

                        <div className="shop-genders text-sans">
                            <button className={activeGender === 'all' ? 'active' : ''} onClick={() => handleGenderClick('all')}>Tous</button>
                            <button className={activeGender === 'Femme' ? 'active' : ''} onClick={() => handleGenderClick('Femme')}>Femme</button>
                            <button className={activeGender === 'Homme' ? 'active' : ''} onClick={() => handleGenderClick('Homme')}>Homme</button>
                            <button className={activeGender === 'Unisexe' ? 'active' : ''} onClick={() => handleGenderClick('Unisexe')}>Unisexe</button>
                        </div>

                        <div className="shop-filter-toggle" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="mobile-filter-btns" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-filter mobile-btn-collection" onClick={() => { isFilterOpen && activeMobilePanel === 'collection' ? setIsFilterOpen(false) : (setActiveMobilePanel('collection'), setIsFilterOpen(true)); }}>
                                    Collection
                                </button>
                                <button className="btn-filter" onClick={() => { isFilterOpen && activeMobilePanel === 'filters' ? setIsFilterOpen(false) : (setActiveMobilePanel('filters'), setIsFilterOpen(true)); }}>
                                    Filtres +
                                </button>
                            </div>
                            <div className="mobile-grid-toggle">
                                <button className={`grid-btn ${mobileGrid === 'single' ? 'active' : ''}`} onClick={() => setMobileGrid('single')} aria-label="Affichage 1 colonne">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                                </button>
                                <button className={`grid-btn ${mobileGrid === 'double' ? 'active' : ''}`} onClick={() => setMobileGrid('double')} aria-label="Affichage 2 colonnes">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* MOBILE FILTER OVERLAY */}
            {isFilterOpen && <div className="shop-filter-overlay" onClick={() => setIsFilterOpen(false)}></div>}

            {/* EXPANDABLE MEGA FILTER BAR */}
            {isFilterOpen && (
                <div className={`shop-mega-filter text-sans active-panel-${activeMobilePanel}`}>
                    <div className="mobile-filter-header">
                        <h3>{activeMobilePanel === 'collection' ? 'Collections' : 'Filtres'}</h3>
                        <button className="btn-close-filter" onClick={() => setIsFilterOpen(false)} aria-label="Fermer">✕</button>
                    </div>

                    <div className="filter-column mobile-only-genders">
                        <div className="vertical-genders">
                            {isSpecialCategory ? (
                                <>
                                    <button className={activeGender === 'Femme' ? 'active' : ''} onClick={() => { handleGenderClick('Femme'); setIsFilterOpen(false) }}>Femme</button>
                                    <button className={activeGender === 'Homme' ? 'active' : ''} onClick={() => { handleGenderClick('Homme'); setIsFilterOpen(false) }}>Homme</button>
                                    <button className={activeGender === 'all' ? 'active' : ''} onClick={() => { handleGenderClick('all'); setIsFilterOpen(false) }}>Toute la collection</button>
                                </>
                            ) : (
                                <>
                                    <button className={activeGender === 'all' ? 'active' : ''} onClick={() => { handleGenderClick('all'); setIsFilterOpen(false) }}>Tous</button>
                                    <button className={activeGender === 'Femme' ? 'active' : ''} onClick={() => { handleGenderClick('Femme'); setIsFilterOpen(false) }}>Femme</button>
                                    <button className={activeGender === 'Homme' ? 'active' : ''} onClick={() => { handleGenderClick('Homme'); setIsFilterOpen(false) }}>Homme</button>
                                    <button className={activeGender === 'Unisexe' ? 'active' : ''} onClick={() => { handleGenderClick('Unisexe'); setIsFilterOpen(false) }}>Unisexe</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="filter-column">
                        <h4>Couleur</h4>
                        {availableColors.length === 0 ? <span className="text-small text-muted">Aucune</span> : availableColors.map(color => (
                            <label key={color} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedColors.includes(color)}
                                    onChange={() => handleCheckboxFilter(setSelectedColors, color)}
                                />
                                <span>{color}</span>
                            </label>
                        ))}
                    </div>

                    <div className="filter-column">
                        <h4>Matériel</h4>
                        {availableMaterials.length === 0 ? <span className="text-small text-muted">Aucun</span> : availableMaterials.map(mat => (
                            <label key={mat} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedMaterials.includes(mat)}
                                    onChange={() => handleCheckboxFilter(setSelectedMaterials, mat)}
                                />
                                <span>{mat}</span>
                            </label>
                        ))}
                    </div>

                    <div className="filter-column">
                        <h4>Forme</h4>
                        {availableShapes.length === 0 ? <span className="text-small text-muted">Aucune</span> : availableShapes.map(shape => (
                            <label key={shape} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedShapes.includes(shape)}
                                    onChange={() => handleCheckboxFilter(setSelectedShapes, shape)}
                                />
                                <span>{shape}</span>
                            </label>
                        ))}
                    </div>

                    <div className="filter-column">
                        <h4>Trier par</h4>
                        <label className="filter-radio">
                            <input type="radio" name="sort" checked={sortBy === 'selection'} onChange={() => setSortBy('selection')} />
                            <span>Notre sélection</span>
                        </label>
                        <label className="filter-radio">
                            <input type="radio" name="sort" checked={sortBy === 'price-asc'} onChange={() => setSortBy('price-asc')} />
                            <span>Prix: croissant</span>
                        </label>
                        <label className="filter-radio">
                            <input type="radio" name="sort" checked={sortBy === 'price-desc'} onChange={() => setSortBy('price-desc')} />
                            <span>Prix: décroissant</span>
                        </label>
                        <label className="filter-radio">
                            <input type="radio" name="sort" checked={sortBy === 'recent'} onChange={() => setSortBy('recent')} />
                            <span>Le plus récent</span>
                        </label>
                    </div>
                </div>
            )}

            <div className="shop-active-filters">
                {/* Show active tags if desired */}
            </div>

            {loading ? (
                <div className="loading-state">Chargement de la collection...</div>
            ) : filteredProducts.length > 0 ? (
                <div className={`shop-grid mobile-${mobileGrid}`}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    Aucun produit ne correspond à vos critères.
                    <button className="btn-reset" onClick={() => {
                        setSelectedColors([]); setSelectedMaterials([]); setSelectedShapes([]); setActiveCategory('all'); setActiveGender('all');
                    }}>
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
};

export default Shop;
