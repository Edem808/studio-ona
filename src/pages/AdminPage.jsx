import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
    CheckCircle2, XCircle, X,
    LayoutDashboard, Package, ShoppingBag, LogOut,
    TrendingUp, Star, Tag, ChevronLeft, ChevronRight, Plus,
    Pencil, Trash2, Menu,
    RefreshCw, Eye, AlertCircle, ArrowLeft, MapPin, CreditCard, User, Package2,
    Mail, Shield, Clock, Copy, UserX, CheckCheck, Search, Users, Settings
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import './AdminPage.css';

/* ─────────────────────────────────────────────────────────────
   SPARKLINE SVG — mini graphe en barres
   ───────────────────────────────────────────────────────────── */
const Sparkline = ({ data = [], color = '#000', height = 48 }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const w = 100 / data.length;
    return (
        <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="sparkline-svg">
            {data.map((v, i) => {
                const barH = (v / max) * height;
                return (
                    <rect
                        key={i}
                        x={i * w + w * 0.15}
                        y={height - barH}
                        width={w * 0.7}
                        height={barH}
                        fill={color}
                        rx="2"
                        opacity={i === data.length - 1 ? 1 : 0.35 + (i / data.length) * 0.55}
                    />
                );
            })}
        </svg>
    );
};

/* ─────────────────────────────────────────────────────────────
   KPI CARD
   ───────────────────────────────────────────────────────────── */
const KpiCard = ({ icon: Icon, label, value, sub, sparkData, accentColor = '#000', onClick }) => (
    <div
        className={`kpi-card ${onClick ? 'clickable' : ''}`}
        onClick={onClick}
        style={onClick ? { cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' } : {}}
        role={onClick ? 'button' : undefined}
    >
        <div className="kpi-top">
            <div className="kpi-icon" style={{ background: `${accentColor}15`, color: accentColor }}>
                <Icon size={18} />
            </div>
            <span className="kpi-label">{label}</span>
        </div>
        <div className="kpi-value">{value}</div>
        {sub && <div className="kpi-sub">{sub}</div>}
        {sparkData && <Sparkline data={sparkData} color={accentColor} />}
    </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────
   STATUS HELPER — gère les accents (payéx, expédié, etc.)
   ───────────────────────────────────────────────────────────── */
const STATUS_STYLES = {
    'payéx': { bg: '#10b98115', color: '#10b981' },
    'payé': { bg: '#10b98115', color: '#10b981' },
    'paid': { bg: '#10b98115', color: '#10b981' },
    'success': { bg: '#10b98115', color: '#10b981' },
    'livré': { bg: '#6366f115', color: '#6366f1' },
    'expédié': { bg: '#3b82f615', color: '#3b82f6' },
    'pending': { bg: '#f59e0b15', color: '#f59e0b' },
    'annulé': { bg: '#d9363e15', color: '#d9363e' },
    'cancelled': { bg: '#d9363e15', color: '#d9363e' },
    'remboursé': { bg: '#d9363e15', color: '#d9363e' },
    'failed': { bg: '#d9363e15', color: '#d9363e' },
};
const getStatusStyle = (status) => {
    const s = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES['pending'];
    return { background: s.bg, color: s.color };
};

const AdminPage = () => {
    const navigate = useNavigate();

    /* ── UI state ── */
    const [activeView, setActiveView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Data ── */
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSearch, setUserSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);

    /* ── Form state ── */
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', slug: '', price: '', category: 'Solaires', gender: 'Unisexe',
        shape: '', material: '', description: '', details: '',
        isNew: false, isOnSale: false, salePrice: '', rating: '', reviewCount: ''
    });
    const [variants, setVariants] = useState([{ color: '', images: '', imageFiles: [] }]);
    const [draggedItem, setDraggedItem] = useState(null);

    /* ── Hero Settings state ── */
    const [heroSettings, setHeroSettings] = useState({
        mediaType: 'image',
        mediaUrl: '',
        title: 'Collection Printemps Été 26',
        buttonText: 'Voir la collection',
        buttonLink: '/shop',
        uploading: false
    });

    /* ── Toasts ── */
    useEffect(() => {
        if (message) {
            const t = setTimeout(() => setMessage(''), 3500);
            return () => clearTimeout(t);
        }
    }, [message]);

    /* ── Fetch ── */
    const fetchProducts = useCallback(async () => {
        const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
        if (!error) setProducts(data);
    }, []);

    const fetchOrders = useCallback(async () => {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50);
        if (!error && data) setOrders(data);
    }, []);

    const fetchUsers = useCallback(async () => {
        // Utilise une RPC pour accéder à auth.users (voir SQL dans la doc)
        const { data, error } = await supabase.rpc('get_admin_users');
        if (!error && data) {
            setUsers(data);
        } else {
            // Fallback: table profiles si RPC absente
            const { data: pData, error: pErr } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);
            if (!pErr && pData) setUsers(pData);
        }
    }, []);

    const fetchHeroSettings = useCallback(async () => {
        const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'hero_config').single();
        if (!error && data?.value) {
            setHeroSettings(prev => ({ ...prev, ...data.value, uploading: false }));
        }
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('⚠️ Supprimer cet utilisateur ? Cette action est irréversible et supprimera son compte et ses données.')) return;
        setDeletingUserId(userId);
        try {
            // Supprime via RPC admin (nécessite la fonction SQL)
            const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId });
            if (error) throw error;
            setMessage('✅ Utilisateur supprimé !');
            if (selectedUser?.id === userId) setSelectedUser(null);
            await fetchUsers();
        } catch (err) {
            setMessage('❌ Erreur suppression: ' + (err.message || 'Vérifiez les droits admin.'));
        } finally {
            setDeletingUserId(null);
        }
    };

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch { }
    };

    const getUserInitials = (user) => {
        const name = user.full_name || user.first_name || user.email || '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
    };

    const getUserDisplayName = (user) => {
        if (user.full_name) return user.full_name;
        if (user.first_name || user.last_name) return `${user.first_name || ''} ${user.last_name || ''}`.trim();
        return null;
    };

    useEffect(() => {
        fetchProducts();
        fetchOrders().catch(() => { }); // orders table may not exist yet
        fetchUsers().catch(() => { }); // profiles table may not exist yet
        fetchHeroSettings().catch(() => { });
    }, [fetchProducts, fetchOrders, fetchUsers, fetchHeroSettings]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchProducts();
        await fetchOrders().catch(() => { });
        await fetchUsers().catch(() => { });
        await fetchHeroSettings().catch(() => { });
        setTimeout(() => setRefreshing(false), 600);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) { setMessage('❌ Erreur mise à jour statut'); return; }
        setMessage('✅ Statut mis à jour !');
        await fetchOrders().catch(() => { });
        setSelectedOrder(prev => prev?.id === orderId ? { ...prev, status: newStatus } : prev);
    };


    /* ── KPI derivations ── */
    const kpiNew = products.filter(p => p.isNew).length;
    const kpiSale = products.filter(p => p.isOnSale).length;
    const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);
    // Fake weekly distribution for sparkline (last 7 products per day bucket)
    const sparkData = [3, 5, 4, 7, 6, products.length > 5 ? products.length - 4 : products.length, products.length];

    /* ── Form helpers ── */
    const generateSlug = (text) =>
        text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let val = type === 'checkbox' ? checked : value;
        if ((name === 'price' || name === 'salePrice') && val) val = val.replace(/[^\d.,€]/g, '');
        setFormData(prev => {
            const updated = { ...prev, [name]: val };
            if (name === 'name' && !editingId && !prev.slugModified) updated.slug = generateSlug(value);
            if (name === 'slug') updated.slugModified = true;
            return updated;
        });
    };

    const handlePriceBlur = (e) => {
        const { name, value } = e.target;
        if (value && !value.endsWith('€')) setFormData(prev => ({ ...prev, [name]: value.trim() + '€' }));
    };

    const handleVariantChange = (i, field, value) => {
        const nv = [...variants]; nv[i][field] = value; setVariants(nv);
    };

    const handleVariantFiles = (i, files) => {
        const nv = [...variants];
        const newFiles = Array.from(files).map((f, idx) => ({
            id: `file-${Date.now()}-${idx}`,
            type: 'file',
            file: f,
            url: URL.createObjectURL(f)
        }));
        nv[i].imageList = [...(nv[i].imageList || []), ...newFiles];
        setVariants(nv);
    };

    const removeImage = (variantIndex, imageId) => {
        const nv = [...variants];
        const img = nv[variantIndex].imageList.find(img => img.id === imageId);
        if (img && img.type === 'file') {
            URL.revokeObjectURL(img.url);
        }
        nv[variantIndex].imageList = nv[variantIndex].imageList.filter(img => img.id !== imageId);
        setVariants(nv);
    };

    const handleDragStart = (variantIndex, imageIndex) => {
        setDraggedItem({ variantIndex, imageIndex });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetVariantIndex, targetImageIndex) => {
        e.preventDefault();
        if (!draggedItem) return;

        const { variantIndex: sourceVariantIndex, imageIndex: sourceImageIndex } = draggedItem;

        if (sourceVariantIndex !== targetVariantIndex) return;
        if (sourceImageIndex === targetImageIndex) return;

        const nv = [...variants];
        const list = [...(nv[sourceVariantIndex].imageList || [])];

        const [removed] = list.splice(sourceImageIndex, 1);
        list.splice(targetImageIndex, 0, removed);

        nv[sourceVariantIndex].imageList = list;
        setVariants(nv);
        setDraggedItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const addVariantRow = () => setVariants([...variants, { color: '', imageList: [] }]);
    const removeVariantRow = (i) => setVariants(variants.filter((_, idx) => idx !== i));

    const resetForm = (clearMsg = true) => {
        // Nettoyer les URL des prévisualisations pour éviter les fuites mémoire
        variants.forEach(v => {
            if (v.imageList) {
                v.imageList.forEach(img => {
                    if (img.type === 'file') URL.revokeObjectURL(img.url);
                });
            }
        });
        setEditingId(null);
        setFormData({ name: '', slug: '', price: '', category: 'Solaires', gender: 'Unisexe', shape: '', material: '', description: '', details: '', isNew: false, isOnSale: false, salePrice: '', rating: '', reviewCount: '' });
        setVariants([{ color: '', imageList: [] }]);
        if (clearMsg) setMessage('');
    };

    const handleEdit = (product) => {
        // Nettoyer les anciennes prévisualisations
        variants.forEach(v => {
            if (v.imageList) {
                v.imageList.forEach(img => {
                    if (img.type === 'file') URL.revokeObjectURL(img.url);
                });
            }
        });
        setEditingId(product.id);
        setFormData({
            name: product.name, slug: product.slug || '', price: product.price,
            category: product.category || 'Solaires', gender: product.gender || 'Unisexe',
            shape: product.shape || '', material: product.material || '',
            description: product.description || '', details: product.details || '',
            isNew: product.isNew || false, isOnSale: product.isOnSale || false,
            salePrice: product.salePrice || '', rating: product.rating || '', reviewCount: product.reviewCount || ''
        });
        if (product.variants?.length > 0) {
            setVariants(product.variants.map(v => ({
                color: v.color,
                imageList: (v.images || []).map((url, idx) => ({
                    id: `url-${Date.now()}-${idx}`,
                    type: 'url',
                    url: url
                }))
            })));
        } else {
            setVariants([{ color: '', imageList: [] }]);
        }
        setActiveView('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce produit ? Action irréversible.')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) { setMessage('❌ Erreur: Impossible de supprimer'); return; }
        setMessage('✅ Produit supprimé !');
        fetchProducts();
        if (editingId === id) resetForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage('');
        try {
            const processedVariants = [];
            for (const v of variants) {
                const colorTrimmed = v.color.trim();
                if (!colorTrimmed) continue;
                let imageUrls = [];
                for (const img of (v.imageList || [])) {
                    if (img.type === 'file') {
                        const opts = { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true, fileType: 'image/webp' };
                        const blob = await imageCompression(img.file, opts);
                        const filePath = `${Math.random()}-${Date.now()}.webp`;
                        const { error: upErr } = await supabase.storage.from('product-images').upload(filePath, blob, { contentType: 'image/webp' });
                        if (upErr) throw new Error("Upload images échoué");
                        const { data: pub } = supabase.storage.from('product-images').getPublicUrl(filePath);
                        imageUrls.push(pub.publicUrl);
                    } else if (img.type === 'url') {
                        imageUrls.push(img.url);
                    }
                }
                processedVariants.push({ color: colorTrimmed, images: imageUrls });
            }
            if (!processedVariants.length) throw new Error("Ajoutez au moins une variante avec couleur et image.");
            let fp = formData.price; let fsp = formData.salePrice;
            if (fp && !fp.endsWith('€')) fp += '€';
            if (fsp && !fsp.endsWith('€')) fsp += '€';
            const payload = {
                name: formData.name, slug: formData.slug || generateSlug(formData.name),
                price: fp, category: formData.category, gender: formData.gender,
                shape: formData.shape, material: formData.material,
                description: formData.description, details: formData.details,
                isNew: formData.isNew, isOnSale: formData.isOnSale,
                salePrice: formData.isOnSale ? fsp : null,
                variants: processedVariants,
                rating: formData.rating ? parseFloat(formData.rating) : null,
                reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : null
            };
            if (editingId) {
                const { error } = await supabase.from('products').update(payload).eq('id', editingId);
                if (error) throw error;
                setMessage('Produit mis à jour !');
            } else {
                const { error } = await supabase.from('products').insert([payload]);
                if (error) throw error;
                setMessage('Produit ajouté !');
            }
            resetForm(false);
            fetchProducts();
        } catch (err) {
            setMessage(`❌ Erreur: ${err.message || 'Impossible d\'enregistrer'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleHeroMediaUpload = async (file) => {
        if (!file) return;
        setHeroSettings(prev => ({ ...prev, uploading: true }));
        try {
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            const { error: uploadError } = await supabase.storage
                .from('site_media')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('site_media').getPublicUrl(fileName);
            if (data?.publicUrl) {
                setHeroSettings(prev => ({ ...prev, mediaUrl: data.publicUrl, uploading: false }));
                setMessage('✅ Média téléversé avec succès !');
            }
        } catch (err) {
            setHeroSettings(prev => ({ ...prev, uploading: false }));
            setMessage(`❌ Erreur téléversement: ${err.message}`);
        }
    };

    const handleSaveHeroSettings = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                mediaType: heroSettings.mediaType,
                mediaUrl: heroSettings.mediaUrl,
                title: heroSettings.title,
                buttonText: heroSettings.buttonText,
                buttonLink: heroSettings.buttonLink
            };

            const { error } = await supabase.from('site_settings').upsert(
                { key: 'hero_config', value: payload },
                { onConflict: 'key' }
            );

            if (error) throw error;
            setMessage('✅ Configuration sauvegardée !');
        } catch (error) {
            setMessage(`❌ Erreur sauvegarde: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    /* ─────────────────────────────────────────────────────────
       RENDER
       ───────────────────────────────────────────────────────── */

    const navItems = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
        { id: 'products', label: 'Produits', icon: Package },
        { id: 'orders', label: 'Commandes', icon: ShoppingBag },
        { id: 'users', label: 'Utilisateurs', icon: User },
        { id: 'settings', label: 'Configuration', icon: Settings },
    ];

    return (
        <div className="admin-shell">
            {/* ── SIDEBAR ── */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <span className="sidebar-logo-text">studio ona</span>
                    <span className="sidebar-logo-badge">Admin</span>
                </div>

                <nav className="sidebar-nav">
                    <span className="sidebar-nav-label">Navigation</span>
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            className={`sidebar-nav-item ${activeView === id ? 'active' : ''}`}
                            onClick={() => { setActiveView(id); setSidebarOpen(false); }}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                            {activeView === id && <ChevronRight size={14} className="sidebar-active-arrow" />}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-view-site">
                        <Eye size={15} />
                        <span>Voir le site</span>
                    </a>
                    <button className="sidebar-logout" onClick={handleLogout}>
                        <LogOut size={15} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* ── MAIN ── */}
            <div className="admin-main">
                {/* Top bar */}
                <header className="admin-topbar">
                    <button className="topbar-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
                        <Menu size={20} />
                    </button>
                    <div className="topbar-breadcrumb">
                        <span className="topbar-section">{navItems.find(n => n.id === activeView)?.label}</span>
                    </div>
                    <button className={`topbar-refresh ${refreshing ? 'spinning' : ''}`} onClick={handleRefresh} title="Actualiser">
                        <RefreshCw size={16} />
                    </button>
                </header>

                {/* Content */}
                <div className="admin-content">
                    {/* ══ OVERVIEW ══ */}
                    {activeView === 'overview' && (
                        <div className="view-overview">
                            <div className="view-header">
                                <h1 className="view-title">Vue d'ensemble</h1>
                                <p className="view-subtitle">Pilotez votre boutique en temps réel</p>
                            </div>

                            {/* KPI Grid */}
                            <div className="kpi-grid">
                                <KpiCard

                                    icon={Package}
                                    label="Produits"
                                    value={products.length}
                                    sub={`${totalVariants} variante${totalVariants > 1 ? 's' : ''} au total`}
                                    sparkData={sparkData}
                                    accentColor="#000"
                                    onClick={() => setActiveView('products')}
                                />
                                <KpiCard
                                    icon={Star}
                                    label="Nouveautés"
                                    value={kpiNew}
                                    sub="Marqués « Nouveau »"
                                    accentColor="#6366f1"
                                    onClick={() => setActiveView('products')}
                                />
                                <KpiCard
                                    icon={Tag}
                                    label="En solde"
                                    value={kpiSale}
                                    sub="Produits soldés actifs"
                                    accentColor="#d9363e"
                                    onClick={() => setActiveView('products')}
                                />
                                <KpiCard
                                    icon={TrendingUp}
                                    label="Commandes"
                                    value={orders.length || '—'}
                                    sub={orders.length ? 'Dernières 50 commandes' : 'Table orders introuvable'}
                                    accentColor="#10b981"
                                    onClick={() => setActiveView('orders')}
                                />
                            </div>

                            {/* Recent products */}
                            <div className="overview-section">
                                <div className="section-header-row">
                                    <h2 className="section-heading">Derniers produits ajoutés</h2>
                                    <button className="section-link-btn" onClick={() => setActiveView('products')}>
                                        Voir tout <ChevronRight size={14} />
                                    </button>
                                </div>
                                <div className="recent-products-list">
                                    {products.slice(0, 6).map(p => (
                                        <div key={p.id} className="recent-product-row">
                                            <div className="recent-product-thumb">
                                                {p.variants?.[0]?.images?.[0] ? (
                                                    <img
                                                        src={p.variants[0].images[0].replace(/^https?:\/\/localhost(:\d+)?/i, '')}
                                                        alt={p.name}
                                                    />
                                                ) : (
                                                    <div className="recent-product-no-img"><Package size={16} /></div>
                                                )}
                                            </div>
                                            <div className="recent-product-info">
                                                <span className="recent-product-name">{p.name}</span>
                                                <span className="recent-product-meta">{p.category} · {p.gender}</span>
                                            </div>
                                            <div className="recent-product-right">
                                                <span className="recent-product-price">{p.price}</span>
                                                <div className="recent-product-badges">
                                                    {p.isNew && <span className="badge badge-new">Nouveau</span>}
                                                    {p.isOnSale && <span className="badge badge-sale">Solde</span>}
                                                </div>
                                            </div>
                                            <button className="recent-product-edit" onClick={() => handleEdit(p)} title="Modifier">
                                                <Pencil size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {products.length === 0 && (
                                        <div className="empty-state">
                                            <Package size={32} />
                                            <p>Aucun produit pour l'instant</p>
                                            <button className="btn-cta" onClick={() => setActiveView('products')}>
                                                <Plus size={14} /> Ajouter un produit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Orders preview */}
                            {orders.length > 0 && (
                                <div className="overview-section">
                                    <div className="section-header-row">
                                        <h2 className="section-heading">Dernières commandes</h2>
                                        <button className="section-link-btn" onClick={() => setActiveView('orders')}>
                                            Voir toutes <ChevronRight size={14} />
                                        </button>
                                    </div>
                                    <div className="orders-table-wrap">
                                        <table className="orders-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Client</th>
                                                    <th>Montant</th>
                                                    <th>Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.slice(0, 5).map(o => (
                                                    <tr key={o.id}>
                                                        <td className="order-id">#{o.id}</td>
                                                        <td>{o.user_email || o.user_details?.email || '—'}</td>
                                                        <td>{o.total_price != null ? `${Number(o.total_price).toFixed(2)}€` : '—'}</td>
                                                        <td>
                                                            <span className="order-status" style={getStatusStyle(o.status)}>
                                                                {o.status || 'pending'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══ PRODUCTS ══ */}
                    {activeView === 'products' && (
                        <div className="view-products">
                            <div className="view-header">
                                <h1 className="view-title">Produits
                                    <span className="view-count">{products.length}</span>
                                </h1>
                                <p className="view-subtitle">Gérez votre catalogue</p>
                            </div>

                            <div className="products-layout">
                                {/* List */}
                                <div className="products-list-panel">
                                    <div className="panel-header">
                                        <span>Catalogue</span>
                                        <button className="btn-add-product" onClick={resetForm}>
                                            <Plus size={14} /> Nouveau
                                        </button>
                                    </div>
                                    <div className="products-list-scroll">
                                        {products.length === 0 ? (
                                            <div className="empty-state">
                                                <Package size={28} />
                                                <p>Aucun produit</p>
                                            </div>
                                        ) : (
                                            products.map(p => (
                                                <div key={p.id} className={`product-list-item ${editingId === p.id ? 'editing' : ''}`}>
                                                    <div className="pli-thumb">
                                                        {p.variants?.[0]?.images?.[0] ? (
                                                            <img src={p.variants[0].images[0].replace(/^https?:\/\/localhost(:\d+)?/i, '')} alt={p.name} />
                                                        ) : <Package size={14} />}
                                                    </div>
                                                    <div className="pli-info">
                                                        <span className="pli-name">{p.name}</span>
                                                        <span className="pli-meta">{p.price} · {p.category}</span>
                                                    </div>
                                                    <div className="pli-actions">
                                                        <button onClick={() => handleEdit(p)} title="Modifier"><Pencil size={13} /></button>
                                                        <button onClick={() => handleDelete(p.id)} title="Supprimer" className="danger"><Trash2 size={13} /></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="product-form-panel">
                                    <div className="panel-header">
                                        <span>{editingId ? 'Modifier le produit' : 'Nouveau produit'}</span>
                                        {editingId && (
                                            <button className="btn-cancel" onClick={resetForm}>Annuler</button>
                                        )}
                                    </div>

                                    <form className="admin-form" onSubmit={handleSubmit}>
                                        {/* Identité */}
                                        <fieldset className="form-fieldset">
                                            <legend>Identité</legend>
                                            <div className="form-group">
                                                <label>Nom du produit</label>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="ex: Ona Haze" />
                                            </div>
                                            <div className="form-group">
                                                <label>Slug (URL) <small>auto-généré</small></label>
                                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required placeholder="ex: ona-haze" />
                                            </div>
                                        </fieldset>

                                        {/* Caractéristiques */}
                                        <fieldset className="form-fieldset">
                                            <legend>Caractéristiques</legend>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Prix</label>
                                                    <input type="text" name="price" value={formData.price} onChange={handleChange} onBlur={handlePriceBlur} required placeholder="ex: 80" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Catégorie</label>
                                                    <select name="category" value={formData.category} onChange={handleChange}>
                                                        <option>Solaires</option>
                                                        <option>Optiques</option>
                                                        <option>Accessoires</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Genre</label>
                                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                                        <option>Unisexe</option>
                                                        <option>Homme</option>
                                                        <option>Femme</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Forme</label>
                                                    <select name="shape" value={formData.shape} onChange={handleChange}>
                                                        <option value="">(Aucune)</option>
                                                        {['Aviateur', 'Carré', 'Hexagonal', 'Ovale', 'Papillon', 'Rectangulaire', 'Rond'].map(s => <option key={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Matériel</label>
                                                    <select name="material" value={formData.material} onChange={handleChange}>
                                                        <option value="">(Aucun)</option>
                                                        {['Acétate', 'Acétate & titane', 'Acétate & métal', 'Métal', 'Titane'].map(m => <option key={m}>{m}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </fieldset>

                                        {/* Variantes */}
                                        <fieldset className="form-fieldset">
                                            <legend>Variantes & Images</legend>
                                            {variants.map((variant, index) => (
                                                <div key={index} className="variant-row">
                                                    <div className="form-group flex-1">
                                                        <label>Couleur</label>
                                                        <input type="text" value={variant.color} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} placeholder="ex: Noir" required={index === 0} />
                                                    </div>
                                                    <div className="form-group flex-3">
                                                        <label>Images</label>
                                                        <input type="file" multiple accept="image/*" onChange={(e) => handleVariantFiles(index, e.target.files)} />

                                                        {/* Section de prévisualisation des images */}
                                                        <div className="variant-image-previews" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                                            {variant.imageList && variant.imageList.length > 0 ? (
                                                                variant.imageList.map((img, i) => (
                                                                    <div
                                                                        key={img.id}
                                                                        className="image-preview-item"
                                                                        draggable
                                                                        onDragStart={() => handleDragStart(index, i)}
                                                                        onDragOver={handleDragOver}
                                                                        onDrop={(e) => handleDrop(e, index, i)}
                                                                        onDragEnd={handleDragEnd}
                                                                        style={{
                                                                            position: 'relative',
                                                                            width: '64px',
                                                                            height: '64px',
                                                                            cursor: 'grab',
                                                                            opacity: draggedItem?.variantIndex === index && draggedItem?.imageIndex === i ? 0.5 : 1
                                                                        }}
                                                                    >
                                                                        <img src={img.type === 'url' ? img.url.replace(/^https?:\/\/localhost(:\d+)?/i, '') : img.url} alt={`Aperçu ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', pointerEvents: 'none' }} />

                                                                        <div className="image-actions" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                                                                            <button type="button" onClick={() => removeImage(index, img.id)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '2px', display: 'flex' }} title="Supprimer">
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Aucune image.</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {variants.length > 1 && (
                                                        <button type="button" className="btn-remove-variant" onClick={() => removeVariantRow(index)} title="Supprimer cette variante">
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" className="btn-add-variant" onClick={addVariantRow}>
                                                <Plus size={14} /> Ajouter une couleur
                                            </button>
                                        </fieldset>

                                        {/* Contenu */}
                                        <fieldset className="form-fieldset">
                                            <legend>Contenu</legend>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Détails (accordéon)</label>
                                                <textarea name="details" value={formData.details} onChange={handleChange} rows="3" placeholder="Texte de l'accordéon…" />
                                            </div>
                                        </fieldset>

                                        {/* Avis & Statuts */}
                                        <fieldset className="form-fieldset">
                                            <legend>Avis & Statuts</legend>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Note (0–5)</label>
                                                    <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} placeholder="ex: 4.5" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Nb d'avis</label>
                                                    <input type="number" min="0" step="1" name="reviewCount" value={formData.reviewCount} onChange={handleChange} placeholder="ex: 12" />
                                                </div>
                                            </div>
                                            <div className="toggle-row">
                                                <label className="toggle-label">
                                                    <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} />
                                                    <span className="toggle-switch" />
                                                    Marquer comme <strong>Nouveau</strong>
                                                </label>
                                                <label className="toggle-label">
                                                    <input type="checkbox" name="isOnSale" checked={formData.isOnSale} onChange={handleChange} />
                                                    <span className="toggle-switch" />
                                                    Mettre en <strong style={{ color: '#d9363e' }}>Solde</strong>
                                                </label>
                                            </div>
                                            {formData.isOnSale && (
                                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                                    <label>Prix soldé</label>
                                                    <input type="text" name="salePrice" value={formData.salePrice} onChange={handleChange} onBlur={handlePriceBlur} placeholder="Nouveau prix…" required={formData.isOnSale} />
                                                </div>
                                            )}
                                        </fieldset>

                                        <button type="submit" className="btn-submit" disabled={loading}>
                                            {loading ? 'Enregistrement…' : (editingId ? 'Mettre à jour' : 'Ajouter le produit')}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══ ORDERS ══ */}
                    {activeView === 'orders' && (
                        <div className="view-orders">
                            <div className="view-header">
                                <h1 className="view-title">Commandes
                                    {orders.length > 0 && <span className="view-count">{orders.length}</span>}
                                </h1>
                                <p className="view-subtitle">Suivi et gestion des commandes clients</p>
                            </div>

                            {orders.length === 0 ? (
                                <div className="empty-state large">
                                    <AlertCircle size={40} />
                                    <p>Aucune commande trouvée.</p>
                                    <small>La table <code>orders</code> est vide ou n'existe pas encore dans Supabase.</small>
                                </div>
                            ) : (
                                <div className="orders-split-layout">
                                    {/* ── Liste ── */}
                                    <div className="orders-list-panel">
                                        <div className="panel-header">
                                            <span>Toutes les commandes</span>
                                        </div>
                                        <div className="orders-list-scroll">
                                            {orders.map(o => (
                                                <div
                                                    key={o.id}
                                                    className={`order-list-item ${selectedOrder?.id === o.id ? 'active' : ''}`}
                                                    onClick={() => setSelectedOrder(o)}
                                                >
                                                    <div className="oli-info">
                                                        <span className="oli-id">#{o.id}</span>
                                                        <span className="oli-name">
                                                            {o.user_details?.firstName
                                                                ? `${o.user_details.firstName} ${o.user_details.lastName}`
                                                                : o.user_email || '—'}
                                                        </span>
                                                        <span className="oli-meta">
                                                            {o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                        </span>
                                                    </div>
                                                    <div className="oli-right">
                                                        <span className="oli-price">
                                                            {o.total_price != null ? `${Number(o.total_price).toFixed(2)}€` : '—'}
                                                        </span>
                                                        <span className="order-status" style={getStatusStyle(o.status)}>
                                                            {o.status || 'pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Détail ── */}
                                    <div className={`order-detail-panel ${selectedOrder ? 'visible' : ''}`}>
                                        {!selectedOrder ? (
                                            <div className="order-detail-placeholder">
                                                <ShoppingBag size={36} />
                                                <p>Sélectionnez une commande<br />pour voir ses détails</p>
                                            </div>
                                        ) : (
                                            <div className="order-detail-content">
                                                {/* Header */}
                                                <div className="order-detail-header">
                                                    <div className="order-detail-title">
                                                        <button className="order-back-btn" onClick={() => setSelectedOrder(null)} title="Fermer">
                                                            <ArrowLeft size={16} />
                                                        </button>
                                                        <div>
                                                            <span className="order-detail-id">Commande #{selectedOrder.id}</span>
                                                            <span className="order-detail-date">
                                                                {selectedOrder.created_at
                                                                    ? new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
                                                                    : '—'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="order-status-change">
                                                        <select
                                                            className="status-select"
                                                            value={selectedOrder.status || 'pending'}
                                                            onChange={e => updateOrderStatus(selectedOrder.id, e.target.value)}
                                                        >
                                                            <option value="pending">En attente</option>
                                                            <option value="payé">Payé</option>
                                                            <option value="payéx">Payé (test)</option>
                                                            <option value="expédié">Expédié</option>
                                                            <option value="livré">Livré</option>
                                                            <option value="annulé">Annulé</option>
                                                            <option value="remboursé">Remboursé</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Blocs info */}
                                                <div className="order-detail-grid">
                                                    {/* Client */}
                                                    <div className="order-info-block">
                                                        <div className="oib-header"><User size={14} /> Client</div>
                                                        <div className="oib-body">
                                                            {selectedOrder.user_details?.firstName && (
                                                                <p><strong>{selectedOrder.user_details.firstName} {selectedOrder.user_details.lastName}</strong></p>
                                                            )}
                                                            <p>{selectedOrder.user_email || selectedOrder.user_details?.email || '—'}</p>
                                                        </div>
                                                    </div>

                                                    {/* Livraison */}
                                                    {selectedOrder.user_details?.address && (
                                                        <div className="order-info-block">
                                                            <div className="oib-header"><MapPin size={14} /> Adresse de livraison</div>
                                                            <div className="oib-body">
                                                                <p>{selectedOrder.user_details.address}</p>
                                                                <p>{selectedOrder.user_details.zip} {selectedOrder.user_details.city}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Paiement */}
                                                    <div className="order-info-block">
                                                        <div className="oib-header"><CreditCard size={14} /> Paiement</div>
                                                        <div className="oib-body">
                                                            <p><strong>{selectedOrder.total_price != null ? `${Number(selectedOrder.total_price).toFixed(2)}€` : '—'}</strong></p>
                                                            {selectedOrder.stripe_session_id && (
                                                                <p className="stripe-id" title={selectedOrder.stripe_session_id}>
                                                                    Stripe: {selectedOrder.stripe_session_id.substring(0, 24)}…
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Articles commandés */}
                                                <div className="order-items-section">
                                                    <div className="oib-header" style={{ marginBottom: '0.875rem' }}>
                                                        <Package2 size={14} /> Articles commandés
                                                    </div>
                                                    {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                                                        <div className="order-items-list">
                                                            {selectedOrder.items.map((item, idx) => {
                                                                const product = item.product || item;
                                                                const variant = product.variants?.find(v => v.color === item.color) || product.variants?.[0];
                                                                const img = variant?.images?.[0] || product.image;
                                                                const imgSrc = img ? img.replace(/^https?:\/\/localhost(:\d+)?/i, '') : null;
                                                                const price = product.isOnSale ? product.salePrice : product.price;
                                                                return (
                                                                    <div key={idx} className="order-item-row">
                                                                        <div className="order-item-img">
                                                                            {imgSrc
                                                                                ? <img src={imgSrc} alt={product.name} />
                                                                                : <Package size={16} />}
                                                                        </div>
                                                                        <div className="order-item-info">
                                                                            <span className="order-item-name">{product.name || '—'}</span>
                                                                            <span className="order-item-meta">
                                                                                {item.color && `${item.color}`}
                                                                                {item.quantity && ` · Qté: ${item.quantity}`}
                                                                            </span>
                                                                            {/* Prescription / Correction */}
                                                                            {item.prescriptionData && (
                                                                                <div className="order-item-prescription" style={{ marginTop: '0.5rem', padding: '0.6rem 0.75rem', background: '#f5f5f4', fontSize: '0.78rem', lineHeight: '1.6', color: '#444', borderLeft: '2px solid #111' }}>
                                                                                    <strong style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111' }}>
                                                                                        🏥 Correction optique
                                                                                    </strong>
                                                                                    {item.prescriptionData.type === 'form' ? (
                                                                                        <div style={{ marginTop: '0.35rem' }}>
                                                                                            {item.prescriptionData.od?.sphere && (
                                                                                                <div>OD : Sph {item.prescriptionData.od.sphere}
                                                                                                    {item.prescriptionData.od.cylinder && ` / Cyl ${item.prescriptionData.od.cylinder}`}
                                                                                                    {item.prescriptionData.od.axis && ` / Axe ${item.prescriptionData.od.axis}°`}
                                                                                                    {item.prescriptionData.od.addition && ` / Add +${item.prescriptionData.od.addition}`}
                                                                                                </div>
                                                                                            )}
                                                                                            {item.prescriptionData.og?.sphere && (
                                                                                                <div>OG : Sph {item.prescriptionData.og.sphere}
                                                                                                    {item.prescriptionData.og.cylinder && ` / Cyl ${item.prescriptionData.og.cylinder}`}
                                                                                                    {item.prescriptionData.og.axis && ` / Axe ${item.prescriptionData.og.axis}°`}
                                                                                                    {item.prescriptionData.og.addition && ` / Add +${item.prescriptionData.og.addition}`}
                                                                                                </div>
                                                                                            )}
                                                                                            {item.prescriptionData.pupillaryDistance && (
                                                                                                <div>EP : {item.prescriptionData.pupillaryDistance} mm</div>
                                                                                            )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div style={{ marginTop: '0.35rem' }}>
                                                                                            <div>📎 Ordonnance : {item.prescriptionData.fileName || 'Fichier téléversé'}</div>
                                                                                            {item.prescriptionData.fileUrl && (
                                                                                                <>
                                                                                                    {/* Aperçu image si c'est un fichier image */}
                                                                                                    {/\.(jpg|jpeg|png|webp)$/i.test(item.prescriptionData.fileUrl) && (
                                                                                                        <img
                                                                                                            src={item.prescriptionData.fileUrl}
                                                                                                            alt="Ordonnance"
                                                                                                            style={{ display: 'block', maxWidth: '100%', maxHeight: '220px', objectFit: 'contain', marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}
                                                                                                        />
                                                                                                    )}
                                                                                                    <a
                                                                                                        href={item.prescriptionData.fileUrl}
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', padding: '0.4rem 0.85rem', background: '#111', color: '#fff', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.04em' }}
                                                                                                    >
                                                                                                        <Eye size={13} /> Voir / Télécharger l'ordonnance
                                                                                                    </a>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="order-item-price">{price || '—'}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <p className="order-no-items">Aucun article enregistré.</p>
                                                    )}
                                                </div>

                                                {/* Total */}
                                                <div className="order-total-row">
                                                    <span>Total payé</span>
                                                    <span className="order-total-amount">
                                                        {selectedOrder.total_price != null ? `${Number(selectedOrder.total_price).toFixed(2)}€` : '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══ USERS ══ */}
                    {activeView === 'users' && (() => {
                        const filteredUsers = users.filter(u => {
                            const q = userSearch.toLowerCase();
                            return !q || (u.email || '').toLowerCase().includes(q)
                                || (getUserDisplayName(u) || '').toLowerCase().includes(q);
                        });
                        return (
                            <div className="view-users">
                                <div className="view-header">
                                    <h1 className="view-title">
                                        <Users size={28} />
                                        Utilisateurs
                                        {users.length > 0 && <span className="view-count">{users.length}</span>}
                                    </h1>
                                    <p className="view-subtitle">Gérez les comptes clients inscrits — données issues de <code>auth.users</code></p>
                                </div>

                                <div className="users-layout">
                                    {/* ── Colonne liste ── */}
                                    <div className="users-list-panel">
                                        {/* Recherche */}
                                        <div className="users-search-bar">
                                            <Search size={15} className="users-search-icon" />
                                            <input
                                                type="text"
                                                placeholder="Rechercher par email ou nom…"
                                                value={userSearch}
                                                onChange={e => setUserSearch(e.target.value)}
                                                className="users-search-input"
                                            />
                                            {userSearch && (
                                                <button className="users-search-clear" onClick={() => setUserSearch('')}>
                                                    <X size={13} />
                                                </button>
                                            )}
                                        </div>

                                        {users.length === 0 ? (
                                            <div className="empty-state large">
                                                <User size={40} />
                                                <p>Aucun utilisateur trouvé.</p>
                                                <small>Créez la fonction SQL <code>get_admin_users()</code> dans Supabase.</small>
                                            </div>
                                        ) : filteredUsers.length === 0 ? (
                                            <div className="empty-state">
                                                <Search size={28} />
                                                <p>Aucun résultat pour « {userSearch} »</p>
                                            </div>
                                        ) : (
                                            <div className="users-list-scroll">
                                                {filteredUsers.map(u => {
                                                    const initials = getUserInitials(u);
                                                    const displayName = getUserDisplayName(u);
                                                    const isActive = selectedUser?.id === u.id;
                                                    return (
                                                        <div
                                                            key={u.id}
                                                            className={`user-list-item ${isActive ? 'active' : ''}`}
                                                            onClick={() => setSelectedUser(u)}
                                                        >
                                                            <div className="uli-avatar">{initials}</div>
                                                            <div className="uli-info">
                                                                <span className="uli-email">{u.email || '—'}</span>
                                                                {displayName && <span className="uli-name">{displayName}</span>}
                                                            </div>
                                                            <div className="uli-right">
                                                                {u.email_confirmed_at
                                                                    ? <span className="user-badge verified"><CheckCheck size={10} /> Vérifié</span>
                                                                    : <span className="user-badge pending"><Clock size={10} /> En attente</span>
                                                                }
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Colonne détail ── */}
                                    <div className={`user-detail-panel ${selectedUser ? 'visible' : ''}`}>
                                        {!selectedUser ? (
                                            <div className="user-detail-placeholder">
                                                <Users size={36} />
                                                <p>Sélectionnez un utilisateur<br />pour voir ses détails</p>
                                            </div>
                                        ) : (() => {
                                            const u = selectedUser;
                                            const displayName = getUserDisplayName(u);
                                            const initials = getUserInitials(u);
                                            return (
                                                <div className="user-detail-content">
                                                    {/* Header */}
                                                    <div className="user-detail-header">
                                                        <button className="order-back-btn" onClick={() => setSelectedUser(null)}>
                                                            <ArrowLeft size={16} />
                                                        </button>
                                                        <div className="user-detail-avatar-big">{initials}</div>
                                                        <div className="user-detail-identity">
                                                            <span className="user-detail-name">{displayName || u.email}</span>
                                                            {displayName && <span className="user-detail-email-sub">{u.email}</span>}
                                                            {u.email_confirmed_at
                                                                ? <span className="user-badge verified"><CheckCheck size={10} /> Email vérifié</span>
                                                                : <span className="user-badge pending"><Clock size={10} /> Email non vérifié</span>
                                                            }
                                                        </div>
                                                    </div>

                                                    {/* Infos */}
                                                    <div className="user-info-grid">
                                                        <div className="user-info-block">
                                                            <div className="uib-label"><Mail size={13} /> Email</div>
                                                            <div className="uib-value">
                                                                {u.email}
                                                                <button
                                                                    className="copy-btn"
                                                                    onClick={() => copyToClipboard(u.email, 'email-' + u.id)}
                                                                    title="Copier l'email"
                                                                >
                                                                    {copiedId === 'email-' + u.id ? <CheckCheck size={12} /> : <Copy size={12} />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="user-info-block">
                                                            <div className="uib-label"><Shield size={13} /> ID utilisateur</div>
                                                            <div className="uib-value mono">
                                                                {u.id}
                                                                <button
                                                                    className="copy-btn"
                                                                    onClick={() => copyToClipboard(u.id, 'id-' + u.id)}
                                                                    title="Copier l'ID"
                                                                >
                                                                    {copiedId === 'id-' + u.id ? <CheckCheck size={12} /> : <Copy size={12} />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="user-info-block">
                                                            <div className="uib-label"><Clock size={13} /> Inscription</div>
                                                            <div className="uib-value">
                                                                {u.created_at
                                                                    ? new Date(u.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
                                                                    : '—'}
                                                            </div>
                                                        </div>

                                                        {u.last_sign_in_at && (
                                                            <div className="user-info-block">
                                                                <div className="uib-label"><Eye size={13} /> Dernière connexion</div>
                                                                <div className="uib-value">
                                                                    {new Date(u.last_sign_in_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {(u.phone || u.raw_user_meta_data?.phone) && (
                                                            <div className="user-info-block">
                                                                <div className="uib-label">Téléphone</div>
                                                                <div className="uib-value">{u.phone || u.raw_user_meta_data?.phone}</div>
                                                            </div>
                                                        )}

                                                        {u.provider && (
                                                            <div className="user-info-block">
                                                                <div className="uib-label">Méthode de connexion</div>
                                                                <div className="uib-value">
                                                                    <span className="user-provider-badge">{u.provider}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="user-actions-footer">
                                                        <button
                                                            className="btn-user-action danger"
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            disabled={deletingUserId === u.id}
                                                        >
                                                            <UserX size={15} />
                                                            {deletingUserId === u.id ? 'Suppression…' : 'Supprimer ce compte'}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* ── SETTINGS VIEW ── */}
                    {activeView === 'settings' && (
                        <div className="view-settings">
                            <div className="view-header">
                                <h1 className="view-title"><Settings size={28} /> Configuration</h1>
                                <p className="view-subtitle">Gérez les éléments dynamiques de votre site : Hero Section, textes, médias.</p>
                            </div>

                            <div className="settings-layout">
                                <div className="overview-section">
                                    <div className="section-header-row">
                                        <span className="section-heading">Hero Section — Page d'accueil</span>
                                    </div>

                                    <form onSubmit={handleSaveHeroSettings} className="admin-form" style={{ padding: 0, maxHeight: 'none', overflow: 'visible' }}>

                                        {/* Fieldset — Média */}
                                        <fieldset className="form-fieldset">
                                            <legend>Média de fond</legend>

                                            <div className="form-row">
                                                <div className="form-group flex-1">
                                                    <label>Type de média</label>
                                                    <select
                                                        value={heroSettings.mediaType}
                                                        onChange={e => setHeroSettings(p => ({ ...p, mediaType: e.target.value }))}
                                                    >
                                                        <option value="image">Image</option>
                                                        <option value="video">Vidéo</option>
                                                    </select>
                                                </div>
                                                <div className="form-group flex-3">
                                                    <label>Téléverser un fichier <small>(optionnel)</small></label>
                                                    <input
                                                        type="file"
                                                        accept={heroSettings.mediaType === 'video' ? 'video/mp4,video/webm' : 'image/*'}
                                                        onChange={e => handleHeroMediaUpload(e.target.files[0])}
                                                        disabled={heroSettings.uploading}
                                                    />
                                                    {heroSettings.uploading && (
                                                        <span className="file-hint" style={{ color: '#f59e0b' }}>Téléversement en cours…</span>
                                                    )}
                                                    {heroSettings.mediaUrl && !heroSettings.uploading && (
                                                        <span className="file-hint" style={{ color: '#10b981' }}>
                                                            ✓ Média configuré — <a href={heroSettings.mediaUrl} target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'underline' }}>Voir</a>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Aperçu */}
                                            {heroSettings.mediaUrl && !heroSettings.uploading && (
                                                <div className="settings-media-preview">
                                                    {heroSettings.mediaType === 'video' ? (
                                                        <video src={heroSettings.mediaUrl} muted loop autoPlay playsInline />
                                                    ) : (
                                                        <img src={heroSettings.mediaUrl} alt="Aperçu hero" />
                                                    )}
                                                </div>
                                            )}
                                        </fieldset>

                                        {/* Fieldset — Contenus textuels */}
                                        <fieldset className="form-fieldset">
                                            <legend>Contenus textuels</legend>

                                            <div className="form-group">
                                                <label>Titre principal</label>
                                                <input
                                                    type="text"
                                                    value={heroSettings.title}
                                                    onChange={e => setHeroSettings(p => ({ ...p, title: e.target.value }))}
                                                    placeholder="Ex: Collection Printemps Été 26"
                                                    required
                                                />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Texte du bouton</label>
                                                    <input
                                                        type="text"
                                                        value={heroSettings.buttonText}
                                                        onChange={e => setHeroSettings(p => ({ ...p, buttonText: e.target.value }))}
                                                        placeholder="Ex: Voir la collection"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Lien du bouton</label>
                                                    <input
                                                        type="text"
                                                        value={heroSettings.buttonLink}
                                                        onChange={e => setHeroSettings(p => ({ ...p, buttonLink: e.target.value }))}
                                                        placeholder="Ex: /shop"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </fieldset>

                                        <button type="submit" className="btn-submit" disabled={loading || heroSettings.uploading}>
                                            {loading ? 'Sauvegarde en cours…' : 'Sauvegarder les réglages'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── TOAST ── */}
            {message && (
                <div className={`admin-toast ${message.includes('✅') ? 'success' : 'error'}`}>
                    <div className="toast-content">
                        {message.includes('✅') ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        <div className="toast-message">
                            <h4>{message.includes('✅') ? 'Succès' : 'Erreur'}</h4>
                            <p>{message.replace('✅ ', '').replace('❌ ', '')}</p>
                        </div>
                    </div>
                    <button className="toast-close" onClick={() => setMessage('')}><X size={16} /></button>
                    <div className="toast-progress" />
                </div>
            )}
        </div>
    );
};

export default AdminPage;
