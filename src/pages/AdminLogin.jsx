import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const { signIn, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Si déjà connecté, renvoyer vers /admin
    if (user) {
        navigate('/admin', { replace: true });
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            setError('Email ou mot de passe incorrect.');
        } else {
            navigate('/admin', { replace: true });
        }

        setLoading(false);
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-box">
                <p className="admin-login-logo">studio ona</p>
                <p className="admin-login-subtitle">Accès Administration</p>

                {error && <div className="admin-login-error">{error}</div>}

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Adresse e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
