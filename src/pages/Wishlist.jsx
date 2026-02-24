import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/UI/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <div className="wishlist-page container">
            <h1 className="heading-lg text-serif" style={{ paddingTop: '150px', marginBottom: '2rem' }}>Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="wishlist-empty">
                    <p className="text-sans" style={{ color: '#666', marginBottom: '2rem' }}>Votre wishlist est actuellement vide.</p>
                    <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        Découvrir la collection
                    </Link>
                </div>
            ) : (
                <div className="shop-grid">
                    {wishlist.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
