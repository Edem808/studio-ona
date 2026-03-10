import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Liste des emails autorisés à accéder à /admin
// Ajoutez votre email admin ici ou dans VITE_ADMIN_EMAILS (séparés par des virgules)
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    // Non connecté → page de login admin
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Connecté mais pas admin → accès refusé
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                gap: '1rem',
                fontFamily: 'var(--font-sans)'
            }}>
                <h2 style={{ fontSize: '2rem' }}>⛔ Accès refusé</h2>
                <p style={{ color: '#666' }}>Votre compte n'a pas les droits administrateur.</p>
                <p style={{ color: '#999', fontSize: '0.85rem' }}>Connecté en tant que : {user.email}</p>
            </div>
        );
    }

    return children;
};

export default ProtectedAdminRoute;
