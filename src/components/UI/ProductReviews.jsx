import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Star } from 'lucide-react';
import './ProductReviews.css';

const ProductReviews = ({ productId, onReviewsLoaded }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [existingReview, setExistingReview] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        if (user) {
            const firstName = user.user_metadata?.first_name || '';
            const lastName = user.user_metadata?.last_name || '';
            setUserName(`${firstName} ${lastName}`.trim() || user.email);
        }
    }, [user]);

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    useEffect(() => {
        if (user && reviews.length > 0) {
            const userReview = reviews.find(r => r.user_id === user.id);
            if (userReview) {
                setExistingReview(userReview);
                setRating(userReview.rating);
                setComment(userReview.comment);
            }
        }
    }, [user, reviews]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('product_reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setReviews(data);
                if (onReviewsLoaded) onReviewsLoaded(data);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des avis:", err);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('Vous devez être connecté pour laisser un avis.');
            return;
        }

        if (!userName.trim() || !comment.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setSubmitting(true);

        if (existingReview) {
            const { data, error: updateError } = await supabase
                .from('product_reviews')
                .update({ rating, comment, user_name: userName })
                .eq('id', existingReview.id)
                .select();

            if (updateError) {
                setError('Erreur lors de la mise à jour de l\'avis.');
                console.error(updateError);
            } else {
                const updatedReview = data && data.length > 0 ? data[0] : { ...existingReview, rating, comment, user_name: userName };
                const updatedReviews = reviews.map(r => r.id === existingReview.id ? updatedReview : r);
                setReviews(updatedReviews);
                setExistingReview(updatedReview);
                setShowForm(false);
                if (onReviewsLoaded) onReviewsLoaded(updatedReviews);
            }
        } else {
            const newReview = {
                product_id: productId,
                user_id: user.id,
                user_name: userName,
                rating,
                comment
            };

            const { data, error: insertError } = await supabase
                .from('product_reviews')
                .insert([newReview])
                .select();

            if (insertError) {
                setError('Une erreur est survenue lors de l\'envoi de votre avis. Êtes-vous sûr que la table `product_reviews` existe ?');
                console.error(insertError);
            } else {
                const createdReview = data && data.length > 0 ? data[0] : { ...newReview, id: Date.now().toString(), created_at: new Date().toISOString() };
                const newReviews = [createdReview, ...reviews];
                setReviews(newReviews);
                setExistingReview(createdReview);
                setShowForm(false);
                setComment('');
                setRating(5);
                if (onReviewsLoaded) onReviewsLoaded(newReviews);
            }
        }

        setSubmitting(false);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="product-reviews-section" id="reviews">
            <h3 className="reviews-title text-sans">Avis clients ({reviews.length})</h3>

            {reviews.length > 0 && (
                <div className="reviews-summary">
                    <div className="average-rating">
                        <span className="avg-number">{averageRating}</span>
                        <div className="stars-display">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={20} fill={star <= Math.round(averageRating) ? "#000" : "none"} color={star <= Math.round(averageRating) ? "#000" : "#ccc"} strokeWidth={1} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="reviews-actions">
                <button className="btn-review-link" onClick={() => {
                    if (!user) {
                        setShowForm('login');
                    } else {
                        setShowForm(showForm === true ? false : true);
                    }
                }}>
                    {showForm === true ? 'Annuler' : (existingReview ? 'Modifier mon avis' : 'Laisser un avis')}
                </button>
            </div>

            {showForm === 'login' && (
                <div className="review-login-modal">
                    <div className="review-login-modal-content">
                        <button className="review-login-close" onClick={() => setShowForm(false)}>✕</button>
                        <p className="review-login-icon">✍️</p>
                        <h4 className="review-login-title">Connexion requise</h4>
                        <p className="review-login-text">
                            Afin de garantir l'authenticité des avis, vous devez être connecté pour laisser un commentaire.
                        </p>
                        <a href="/compte" className="btn-buy-now review-login-btn">Se connecter / S'inscrire</a>
                    </div>
                </div>
            )}

            {showForm === true && (
                <form className="review-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label>Votre prénom / nom d'affichage</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Note</label>
                        <div className="rating-select">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className="star-btn"
                                    onClick={() => setRating(star)}
                                >
                                    <Star size={24} fill={star <= rating ? "#000" : "none"} color={star <= rating ? "#000" : "#ccc"} strokeWidth={1} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Votre avis</label>
                        <textarea
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Que pensez-vous de cet article ?"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-add-cart submit-review" disabled={submitting}>
                        {submitting ? 'Envoi...' : (existingReview ? 'Mettre à jour mon avis' : 'Envoyer mon avis')}
                    </button>
                </form>
            )}

            <div className="reviews-list">
                {loading ? (
                    <p style={{ fontStyle: 'italic', color: '#666' }}>Chargement des avis...</p>
                ) : reviews.length > 0 ? (
                    <>
                        {(showAllReviews ? reviews : reviews.slice(0, 4)).map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <span className="reviewer-name">{review.user_name}</span>
                                    <span className="review-date">
                                        {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="review-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={14} fill={star <= review.rating ? "#000" : "none"} color={star <= review.rating ? "#000" : "#ccc"} strokeWidth={1} />
                                    ))}
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                        {reviews.length > 4 && (
                            <button
                                className="btn-show-more-reviews"
                                onClick={() => setShowAllReviews(!showAllReviews)}
                            >
                                {showAllReviews ? 'Voir moins d\'avis' : `Voir plus d'avis (${reviews.length - 4})`}
                            </button>
                        )}
                    </>
                ) : (
                    <p className="no-reviews">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
