import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtenir la session courante lors du montage
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Erreur lors de la récupération de la session :", error);
            }
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Écouter les changements d'état (connexion, déconnexion, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Nettoyage de l'abonnement
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = async (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signUp = async (email, password, userData) => {
        return supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData // par ex: { first_name: 'John', last_name: 'Doe' }
            }
        });
    };

    const signOut = async () => {
        return supabase.auth.signOut();
    };

    const resetPassword = async (email) => {
        return supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/compte?reset=true`, // URL de redirection après le clic sur l'email
        });
    };

    const updatePassword = async (newPassword) => {
        return supabase.auth.updateUser({ password: newPassword });
    };

    const updateProfile = async (userData) => {
        const { data, error } = await supabase.auth.updateUser({
            data: userData
        });

        // Update local user state immediately
        if (data?.user) {
            setUser(data.user);
        }

        return { data, error };
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            signIn,
            signUp,
            signOut,
            resetPassword,
            updatePassword,
            updateProfile
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
