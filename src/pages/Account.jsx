import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Account.css';

const Account = () => {
    const { user, signIn, signUp, signOut, resetPassword, updatePassword, updateProfile } = useAuth();

    // Context & Routing
    const location = useLocation();
    const navigate = useNavigate();

    // UI state
    const [view, setView] = useState('login'); // 'login', 'register', 'forgot-password', 'reset-password'
    const [activeTab, setActiveTab] = useState('apercu'); // 'apercu', 'historique', 'adresses'

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Feedback state
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Address form state
    const [addressForm, setAddressForm] = useState({
        address: user?.user_metadata?.address || '',
        zip: user?.user_metadata?.zip || '',
        city: user?.user_metadata?.city || '',
        phone: user?.user_metadata?.phone || '',
    });
    const [addressMessage, setAddressMessage] = useState({ type: '', text: '' });

    // Orders state
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Refresh address state if user updates
    useEffect(() => {
        if (user) {
            setAddressForm({
                address: user.user_metadata?.address || '',
                zip: user.user_metadata?.zip || '',
                city: user.user_metadata?.city || '',
                phone: user.user_metadata?.phone || '',
            });
        }
    }, [user]);

    // Fetch orders if user is logged in
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            setLoadingOrders(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_email', user.email)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setOrders(data);
            }
            setLoadingOrders(false);
        };

        fetchOrders();
    }, [user]);

    // Check if we arrived from a password reset email link
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('reset') === 'true') {
            setView('reset-password');
        }
    }, [location]);

    // Handlers
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
        } else {
            // Successful login, context will update `user`
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const { error } = await signUp(email, password, {
            first_name: firstName,
            last_name: lastName
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Vérifiez vos e-mails pour confirmer votre compte !");
            setView('login');
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const { error } = await resetPassword(email);

        if (error) {
            setError(error.message);
        } else {
            setMessage("Si cet e-mail existe, un lien de réinitialisation a été envoyé.");
        }
        setLoading(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const { error } = await updatePassword(password);

        if (error) {
            setError(error.message);
        } else {
            setMessage("Votre mot de passe a été mis à jour.");
            setTimeout(() => {
                navigate('/compte');
                setView('login');
            }, 2000);
        }
        setLoading(false);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAddressMessage({ type: '', text: '' });

        const { error } = await updateProfile(addressForm);

        if (error) {
            setAddressMessage({ type: 'error', text: error.message });
        } else {
            setAddressMessage({ type: 'success', text: 'Vos adresses ont été mises à jour avec succès.' });
            setTimeout(() => setAddressMessage({ type: '', text: '' }), 3000);
        }
        setLoading(false);
    };

    const handleAddressChange = (e) => {
        setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ----- Render Authenticated Dashboard -----
    if (user) {
        return (
            <div className="account-page container text-sans">
                <h1 className="heading-lg text-serif" style={{ paddingTop: '150px', marginBottom: '2rem' }}>Mon Compte</h1>

                <div className="account-dashboard">
                    <div className="account-sidebar">
                        <ul className="account-menu">
                            <li className={activeTab === 'apercu' ? 'active' : ''} onClick={() => setActiveTab('apercu')}>Aperçu du compte</li>
                            <li className={activeTab === 'historique' ? 'active' : ''} onClick={() => setActiveTab('historique')}>Historique des commandes</li>
                            <li className={activeTab === 'adresses' ? 'active' : ''} onClick={() => setActiveTab('adresses')}>Adresses</li>
                            <li>
                                <button className="btn-logout" onClick={signOut}>Déconnexion</button>
                            </li>
                        </ul>
                    </div>

                    <div className="account-content">
                        <h2>Bonjour, {user.user_metadata?.first_name || user.email.split('@')[0]}</h2>

                        {activeTab === 'apercu' && (
                            <div className="account-info-box fade-in">
                                <h3>Informations du profil</h3>
                                <p><strong>Email:</strong> {user.email}</p>
                                {user.user_metadata?.first_name && (
                                    <p><strong>Nom:</strong> {user.user_metadata.first_name} {user.user_metadata?.last_name || ''}</p>
                                )}
                                <button className="btn-secondary mt-1" onClick={() => setActiveTab('adresses')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Gérer mes adresses</button>
                            </div>
                        )}

                        {activeTab === 'adresses' && (
                            <div className="account-info-box fade-in">
                                <h3>Mes adresses de livraison</h3>
                                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Gérez vos adresses pour passer commande plus rapidement.</p>

                                {addressMessage.text && (
                                    <div className={`auth-alert ${addressMessage.type}`} style={{ marginBottom: '1.5rem' }}>
                                        {addressMessage.text}
                                    </div>
                                )}

                                <form className="account-address-form" onSubmit={handleAddressSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="address">Adresse complète</label>
                                        <input type="text" id="address" name="address" value={addressForm.address} onChange={handleAddressChange} placeholder="ex: 12 rue de la Paix" />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="zip">Code Postal</label>
                                            <input type="text" id="zip" name="zip" value={addressForm.zip} onChange={handleAddressChange} placeholder="ex: 75000" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="city">Ville</label>
                                            <input type="text" id="city" name="city" value={addressForm.city} onChange={handleAddressChange} placeholder="ex: Paris" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Numéro de téléphone</label>
                                        <input type="tel" id="phone" name="phone" value={addressForm.phone} onChange={handleAddressChange} placeholder="ex: 06 12 34 56 78" />
                                    </div>

                                    <button type="submit" className="btn-primary mt-1" disabled={loading} style={{ marginTop: '1rem', padding: '0.8rem 1.5rem' }}>
                                        {loading ? 'Enregistrement...' : 'Enregistrer mon adresse'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'historique' && (
                            <div className="account-info-box fade-in">
                                <h3>Historique des commandes</h3>
                                {loadingOrders ? (
                                    <p className="text-muted">Chargement de vos commandes...</p>
                                ) : orders.length === 0 ? (
                                    <p className="text-muted">Vous n'avez pas encore passé de commande.</p>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map((order) => {
                                            const date = new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            });
                                            // Handle backward compatibility or specific Stripe implementations
                                            const items = Array.isArray(order.items) ? order.items : [];

                                            return (
                                                <div key={order.id} className="order-card">
                                                    <div className="order-header">
                                                        <span className="order-date">{date}</span>
                                                        <span className="order-status">Payé <span style={{ color: '#10b981' }}>●</span></span>
                                                    </div>
                                                    <div className="order-details">
                                                        <p className="order-number">Commande N° {order.id.split('-')[0].toUpperCase()}</p>
                                                        <p className="order-price">Total: {parseFloat(order.total_price).toFixed(2)}€</p>
                                                    </div>
                                                    <div className="order-items-preview">
                                                        {items.map((item, idx) => (
                                                            <span key={idx} className="order-item-badge">
                                                                {item.product?.name || 'Produit'} (x{item.quantity})
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ----- Render Forms (Unauthenticated) -----
    return (
        <div className="account-page container text-sans">
            <div className="auth-wrapper">
                <h1 className="heading-lg text-serif" style={{ paddingTop: '150px', marginBottom: '2rem', textAlign: 'center' }}>
                    {view === 'login' && 'Connexion'}
                    {view === 'register' && 'Créer un compte'}
                    {view === 'forgot-password' && 'Mot de passe oublié'}
                    {view === 'reset-password' && 'Nouveau mot de passe'}
                </h1>

                {error && <div className="auth-alert error">{error}</div>}
                {message && <div className="auth-alert success">{message}</div>}

                {/* LOGIN FORM */}
                {view === 'login' && (
                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Adresse e-mail</label>
                            <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input type="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="form-actions-row">
                            <button type="button" className="text-link" onClick={() => setView('forgot-password')}>
                                Mot de passe oublié ?
                            </button>
                        </div>
                        <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>

                        <div className="auth-switch">
                            <span>Pas encore de compte ?</span>
                            <button type="button" className="text-link bold" onClick={() => setView('register')}>
                                Créer un compte
                            </button>
                        </div>
                    </form>
                )}

                {/* REGISTRATION FORM */}
                {view === 'register' && (
                    <form className="auth-form" onSubmit={handleRegister}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">Prénom</label>
                                <input type="text" id="firstName" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Nom</label>
                                <input type="text" id="lastName" required value={lastName} onChange={e => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Adresse e-mail</label>
                            <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input type="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Création...' : 'Créer mon compte'}
                        </button>

                        <div className="auth-switch">
                            <span>Déjà un compte ?</span>
                            <button type="button" className="text-link bold" onClick={() => setView('login')}>
                                Se connecter
                            </button>
                        </div>
                    </form>
                )}

                {/* FORGOT PASSWORD FORM */}
                {view === 'forgot-password' && (
                    <form className="auth-form" onSubmit={handleForgotPassword}>
                        <p className="auth-desc">
                            Veuillez entrer votre adresse e-mail. Vous recevrez un lien pour créer un nouveau mot de passe.
                        </p>
                        <div className="form-group">
                            <label htmlFor="email">Adresse e-mail</label>
                            <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Envoi...' : 'Réinitialiser le mot de passe'}
                        </button>

                        <div className="auth-switch center">
                            <button type="button" className="text-link" onClick={() => setView('login')}>
                                Retour à la connexion
                            </button>
                        </div>
                    </form>
                )}

                {/* RESET PASSWORD FORM (Accessed via Email Link) */}
                {view === 'reset-password' && (
                    <form className="auth-form" onSubmit={handleUpdatePassword}>
                        <p className="auth-desc">
                            Veuillez entrer votre nouveau mot de passe.
                        </p>
                        <div className="form-group">
                            <label htmlFor="password">Nouveau mot de passe</label>
                            <input type="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default Account;
