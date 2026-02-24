import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/UI/ScrollToTop';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import AdminPage from './pages/AdminPage'; // Import
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Account from './pages/Account';
import WishlistOverlay from './components/UI/WishlistOverlay';
import CartOverlay from './components/UI/CartOverlay';
import NewsletterPopup from './components/UI/NewsletterPopup';

function App() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<ProductDetail />} /> {/* New Route */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/compte" element={<Account />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <WishlistOverlay />
      <CartOverlay />
      <NewsletterPopup />
      <Footer />
    </div>
  );
}

export default App;
