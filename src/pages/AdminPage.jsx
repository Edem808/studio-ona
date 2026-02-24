import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import './AdminPage.css';

const AdminPage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        price: '',
        category: 'Solaires',
        gender: 'Unisexe',
        shape: '',
        material: '',
        description: '',
        details: '',
        isNew: false,
        isOnSale: false,
        salePrice: ''
    });
    // New state for variants: array of objects { color: '', images: '' }
    const [variants, setVariants] = useState([{ color: '', images: '' }]);

    // New states for Dashboard CRUD
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // Auto-hide message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let finalValue = type === 'checkbox' ? checked : value;

        // Auto-append € for price fields
        if ((name === 'price' || name === 'salePrice') && finalValue) {
            finalValue = finalValue.replace(/[^\d.,€]/g, ''); // Keep numbers, commas, dots, euro
        }

        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: finalValue
            };

            // Auto-generate slug when name changes, if slug hasn't been manually touched or we are creating a new one
            if (name === 'name' && !editingId && !prev.slugModified) {
                updated.slug = generateSlug(value);
            }

            // Mark slug as user-modified if they explicitly edit the slug field
            if (name === 'slug') {
                updated.slugModified = true;
            }

            return updated;
        });
    };

    const generateSlug = (text) => {
        return text
            .toString()
            .normalize('NFD')                   // split an accented letter in the base letter and the acent
            .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const handlePriceBlur = (e) => {
        const { name, value } = e.target;
        if (value && !value.endsWith('€')) {
            setFormData(prev => ({
                ...prev,
                [name]: value.trim() + '€'
            }));
        }
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleVariantFiles = (index, files) => {
        const newVariants = [...variants];
        // Convert FileList to Array
        newVariants[index].imageFiles = Array.from(files);
        // We still keep the 'images' string for display or editing existing records
        newVariants[index].images = Array.from(files).map(f => f.name).join(', ');
        setVariants(newVariants);
    };

    const addVariantRow = () => {
        setVariants([...variants, { color: '', images: '', imageFiles: [] }]);
    };

    const removeVariantRow = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Process the variants payload
            const processedVariants = [];

            for (const v of variants) {
                const colorTrimmed = v.color.trim();
                if (!colorTrimmed) continue;

                let imageUrls = [];

                // 1. If there are new files selected, upload them to Supabase Storage
                if (v.imageFiles && v.imageFiles.length > 0) {
                    for (const file of v.imageFiles) {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
                        const filePath = `${fileName}`;

                        const { error: uploadError, data } = await supabase.storage
                            .from('product-images')
                            .upload(filePath, file);

                        if (uploadError) {
                            console.error("Storage upload error:", uploadError);
                            throw new Error("L'upload des images a échoué.");
                        }

                        // Retrieve the public URL
                        const { data: publicURLData } = supabase.storage
                            .from('product-images')
                            .getPublicUrl(filePath);

                        imageUrls.push(publicURLData.publicUrl);
                    }
                }
                // 2. If no new files, but we have existing text URLs (e.g. while editing)
                else if (v.images) {
                    imageUrls = v.images.split(',').map(img => img.trim()).filter(Boolean);
                }

                processedVariants.push({
                    color: colorTrimmed,
                    images: imageUrls
                });
            }

            if (processedVariants.length === 0) {
                throw new Error("Vous devez ajouter au moins une variante avec une couleur et une image.");
            }

            // Ensure price fields end with €
            let finalPrice = formData.price;
            let finalSalePrice = formData.salePrice;
            if (finalPrice && !finalPrice.endsWith('€')) finalPrice += '€';
            if (finalSalePrice && !finalSalePrice.endsWith('€')) finalSalePrice += '€';

            const productPayload = {
                name: formData.name,
                slug: formData.slug || generateSlug(formData.name),
                price: finalPrice,
                category: formData.category,
                gender: formData.gender,
                shape: formData.shape,
                material: formData.material,
                description: formData.description,
                details: formData.details,
                isNew: formData.isNew,
                isOnSale: formData.isOnSale,
                salePrice: formData.isOnSale ? finalSalePrice : null,
                variants: processedVariants,
                rating: formData.rating ? parseFloat(formData.rating) : null,
                reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : null
            };

            if (editingId) {
                // UPDATE existing product
                const { error } = await supabase
                    .from('products')
                    .update(productPayload)
                    .eq('id', editingId);

                if (error) throw error;
                setMessage('✅ Produit mis à jour avec succès !');
            } else {
                // INSERT new product
                const { error } = await supabase
                    .from('products')
                    .insert([productPayload]);

                if (error) throw error;
                setMessage('✅ Produit ajouté avec succès !');
            }

            // Reset form without clearing the success message
            resetForm(false);
            // Refresh list
            fetchProducts();
        } catch (error) {
            console.error('Erreur lors de l\'opération :', error);
            setMessage(`❌ Erreur: ${error.message || 'Impossible d\'enregistrer le produit'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            slug: product.slug || '',
            price: product.price,
            category: product.category || 'Solaires',
            gender: product.gender || 'Unisexe',
            shape: product.shape || '',
            material: product.material || '',
            description: product.description || '',
            details: product.details || '',
            isNew: product.isNew || false,
            isOnSale: product.isOnSale || false,
            salePrice: product.salePrice || '',
            rating: product.rating || '',
            reviewCount: product.reviewCount || ''
        });

        // Populate variants if they exist, otherwise empty row
        if (product.variants && product.variants.length > 0) {
            // Join images array back into strings for the form (legacy support)
            const editableVariants = product.variants.map(v => ({
                color: v.color,
                images: v.images.join(', '),
                imageFiles: []
            }));
            setVariants(editableVariants);
        } else {
            setVariants([{ color: '', images: '', imageFiles: [] }]);
        }

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMessage('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setMessage('✅ Produit supprimé !');
            fetchProducts();

            // If deleting the currently edited item, reset form
            if (editingId === id) {
                resetForm(false);
            }
        } catch (err) {
            console.error("Error deleting:", err);
            setMessage(`❌ Erreur: Impossible de supprimer le produit`);
        }
    };

    const resetForm = (clearMessage = true) => {
        setEditingId(null);
        setFormData({
            name: '',
            slug: '',
            price: '',
            category: 'Solaires',
            gender: 'Unisexe',
            shape: '',
            material: '',
            description: '',
            details: '',
            isNew: false,
            isOnSale: false,
            salePrice: '',
            rating: '',
            reviewCount: ''
        });
        setVariants([{ color: '', images: '', imageFiles: [] }]);
        if (clearMessage) setMessage('');
    };
    return (
        <div className="admin-page container">
            <h1 className="text-serif heading-md">Administration</h1>
            <p className="admin-subtitle">Tableau de bord : Gérez vos produits</p>

            {message && (
                <div className={`admin-toast ${message.includes('✅') ? 'success' : 'error'}`}>
                    <div className="toast-content">
                        {message.includes('✅') ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        <div className="toast-message">
                            <h4>{message.includes('✅') ? 'Succès' : 'Erreur'}</h4>
                            <p>{message.replace('✅ ', '').replace('❌ ', '')}</p>
                        </div>
                    </div>
                    <button className="toast-close" onClick={() => setMessage('')} aria-label="Fermer">
                        <X size={18} />
                    </button>
                    <div className="toast-progress"></div>
                </div>
            )}

            <div className="admin-dashboard-layout">
                {/* LIST SECTION */}
                <div className="admin-list-section">
                    <h3 className="form-header">Vos Produits ({products.length})</h3>
                    <div className="products-list">
                        {products.length === 0 ? (
                            <p className="text-small">Aucun produit pour le moment.</p>
                        ) : (
                            products.map(product => (
                                <div key={product.id} className={`admin-product-item ${editingId === product.id ? 'editing' : ''}`}>
                                    <div className="admin-product-info">
                                        <strong>{product.name}</strong> <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>({product.slug})</span>
                                        <span className="text-small">{product.price} {product.isOnSale && <span style={{ color: 'red' }}>(Soldé)</span>}</span>
                                    </div>
                                    <div className="admin-product-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(product)}>Modifier</button>
                                        <button className="btn-delete" onClick={() => handleDelete(product.id)}>Supprimer</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* FORM SECTION */}
                <div className="admin-form-section">
                    <div className="form-header">
                        <h3>{editingId ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h3>
                        {editingId && (
                            <button type="button" className="btn-cancel-edit" onClick={resetForm}>
                                Annuler la modification
                            </button>
                        )}
                    </div>

                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nom du Produit</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="ex: Ona Haze" />
                        </div>
                        <div className="form-group">
                            <label>Slug (URL) <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>généré auto - modifiable</span></label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required placeholder="ex: lunettes-solaires" />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Prix (ex: 80)</label>
                                <input type="text" name="price" value={formData.price} onChange={handleChange} onBlur={handlePriceBlur} required placeholder="ex: 80" />
                            </div>
                            <div className="form-group">
                                <label>Catégorie</label>
                                <select name="category" value={formData.category} onChange={handleChange}>
                                    <option value="Solaires">Solaires</option>
                                    <option value="Optiques">Optiques</option>
                                    <option value="Accessoires">Accessoires</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Genre</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="Unisexe">Unisexe</option>
                                    <option value="Homme">Homme</option>
                                    <option value="Femme">Femme</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Forme</label>
                                <select name="shape" value={formData.shape} onChange={handleChange}>
                                    <option value="">(Aucune)</option>
                                    <option value="Aviateur">Aviateur</option>
                                    <option value="Carré">Carré</option>
                                    <option value="Hexagonal">Hexagonal</option>
                                    <option value="Ovale">Ovale</option>
                                    <option value="Papillon">Papillon</option>
                                    <option value="Rectangulaire">Rectangulaire</option>
                                    <option value="Rond">Rond</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Matériel</label>
                                <select name="material" value={formData.material} onChange={handleChange}>
                                    <option value="">(Aucun)</option>
                                    <option value="Acétate">Acétate</option>
                                    <option value="Acétate & titane">Acétate & titane</option>
                                    <option value="Acetate & titanium">Acetate & titanium</option>
                                    <option value="Acétate & métal">Acétate & métal</option>
                                    <option value="Acetate and titanium">Acetate and titanium</option>
                                    <option value="Métal">Métal</option>
                                    <option value="Titane">Titane</option>
                                </select>
                            </div>
                        </div>

                        <div className="variants-section">
                            <h3 className="section-title text-sans">Variantes de Couleur et Images</h3>
                            <p className="section-subtitle">Ajoutez des couleurs. Pour chaque couleur, séparez les liens d'images par des virgules.</p>

                            {variants.map((variant, index) => (
                                <div key={index} className="variant-row">
                                    <div className="form-group flex-1">
                                        <label>Couleur</label>
                                        <input
                                            type="text"
                                            value={variant.color}
                                            onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                            placeholder="ex: Noir"
                                            required={index === 0}
                                        />
                                    </div>
                                    <div className="form-group flex-3">
                                        <label>Images (Glisser ou cliquer)</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleVariantFiles(index, e.target.files)}
                                        />
                                        {variant.images && (
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#666' }}>
                                                Sélectionné: {variant.images.length > 50 ? variant.images.substring(0, 50) + '...' : variant.images}
                                            </p>
                                        )}
                                    </div>
                                    {variants.length > 1 && (
                                        <button type="button" className="btn-remove-variant" onClick={() => removeVariantRow(index)}>
                                            X
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="btn-add-variant" onClick={addVariantRow}>
                                + Ajouter une autre couleur
                            </button>
                        </div>

                        <div className="form-group">
                            <label>Description (globale)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required></textarea>
                        </div>

                        <div className="form-group">
                            <label>Détail du produit (Accordéon)</label>
                            <textarea name="details" value={formData.details} onChange={handleChange} rows="4" placeholder="Ce texte apparaîtra dans l'accordéon Détail du produit..."></textarea>
                        </div>

                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="isNew" name="isNew" checked={formData.isNew} onChange={handleChange} />
                            <label htmlFor="isNew">Marquer comme "Nouveau"</label>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Note (0 à 5, ex: 4.5)</label>
                                <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} placeholder="ex: 4.5" />
                            </div>
                            <div className="form-group">
                                <label>Nombre d'avis</label>
                                <input type="number" min="0" step="1" name="reviewCount" value={formData.reviewCount} onChange={handleChange} placeholder="ex: 12" />
                            </div>
                        </div>

                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="isOnSale" name="isOnSale" checked={formData.isOnSale} onChange={handleChange} />
                            <label htmlFor="isOnSale" style={{ color: '#d9363e', fontWeight: 'bold' }}>Mettre en Solde</label>
                        </div>

                        {
                            formData.isOnSale && (
                                <div className="form-group">
                                    <label>Prix Soldé (ex: 60)</label>
                                    <input type="text" name="salePrice" value={formData.salePrice} onChange={handleChange} onBlur={handlePriceBlur} placeholder="Nouveau prix..." required={formData.isOnSale} />
                                </div>
                            )
                        }

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'Enregistrement en cours...' : (editingId ? 'Mettre à jour le produit' : 'Ajouter le produit')}
                        </button>
                    </form >

                    <div className="admin-instructions">
                        <h3 className="text-sans">ℹ️ Instructions SQL pour Supabase</h3>
                        <p>N'oublie pas de créer la table <code>products</code> dans Supabase avec ce code SQL :</p>
                        <div className="sql-snippet">
                            <code>
                                create table products (<br />
                                &nbsp;&nbsp;id bigint generated by default as identity primary key,<br />
                                &nbsp;&nbsp;name text not null,<br />
                                &nbsp;&nbsp;slug text,<br />
                                &nbsp;&nbsp;price text not null,<br />
                                &nbsp;&nbsp;category text,<br />
                                &nbsp;&nbsp;gender text default 'Unisexe',<br />
                                &nbsp;&nbsp;shape text,<br />
                                &nbsp;&nbsp;material text,<br />
                                &nbsp;&nbsp;variants jsonb default '[]'::jsonb,<br />
                                &nbsp;&nbsp;description text,<br />
                                &nbsp;&nbsp;details text,<br />
                                &nbsp;&nbsp;"isNew" boolean default false,<br />
                                &nbsp;&nbsp;"isOnSale" boolean default false,<br />
                                &nbsp;&nbsp;"salePrice" text,<br />
                                &nbsp;&nbsp;"rating" numeric,<br />
                                &nbsp;&nbsp;"reviewCount" integer<br />
                                );
                            </code>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default AdminPage;
