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
import AdminLogin from './pages/AdminLogin';
import ProtectedAdminRoute from './components/UI/ProtectedAdminRoute';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Account from './pages/Account';
import WishlistOverlay from './components/UI/WishlistOverlay';
import CartOverlay from './components/UI/CartOverlay';
import NewsletterPopup from './components/UI/NewsletterPopup';
import CGV from './pages/CGV';
import CGU from './pages/CGU';
import Confidentialite from './pages/Confidentialite';
import MentionsLegales from './pages/MentionsLegales';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Magasin from './pages/Magasin';




function App() {
  return (
    <Routes>
      {/* Admin — layout isolé, sans Header/Footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Toutes les autres routes — layout standard */}
      <Route
        path="*"
        element={
          <div className="app-container">
            <ScrollToTop />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<ProductDetail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/compte" element={<Account />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/about" element={<About />} />
                <Route path="/cgv" element={<CGV />} />
                <Route path="/cgu" element={<CGU />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/magasin" element={<Magasin />} />
              </Routes>
            </main>
            <WishlistOverlay />
            <CartOverlay />
            <NewsletterPopup />
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
