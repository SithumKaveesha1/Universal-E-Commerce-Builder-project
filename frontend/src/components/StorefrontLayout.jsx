import React, { useState, useEffect } from 'react';
import { Outlet, useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Search, User } from 'lucide-react';
import { CartProvider } from '../context/CartContext';

const StorefrontLayout = () => {
  const { storeSlug } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await axios.get(`/stores/${storeSlug}`);
        setStore(data);
        
        // Dynamically set CSS variables based on store theme
        if (data.settings?.themeColor) {
          document.documentElement.style.setProperty('--store-theme-color', data.settings.themeColor);
        }
      } catch (err) {
        setError('Store not found');
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [storeSlug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading store...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>;

  return (
    <CartProvider storeId={store._id}>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* Navbar */}
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b" style={{ borderBottomColor: store.settings?.themeColor }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo / Store Name */}
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate(`/${store.slug}`)}>
                {store.settings?.logo ? (
                  <img src={store.settings.logo} alt={store.name} className="h-8 w-auto" />
                ) : (
                  <span className="text-xl font-bold" style={{ color: store.settings?.themeColor || '#000' }}>
                    {store.name}
                  </span>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-8">
                <Link to={`/${store.slug}`} className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">Home</Link>
                <Link to={`/${store.slug}/products`} className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium">Shop</Link>
              </nav>

              {/* Right Icons */}
              <div className="flex items-center space-x-6">
                <button className="text-gray-500 hover:text-gray-700">
                  <Search size={20} />
                </button>
                <Link to={`/${store.slug}/cart`} className="text-gray-500 hover:text-gray-700 relative">
                  <ShoppingCart size={20} />
                  {/* Badge could go here */}
                </Link>
                <Link to="/login" className="text-gray-500 hover:text-gray-700">
                  <User size={20} />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Banner (if exists) */}
        {store.settings?.banner && (
          <div className="w-full h-48 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url(${store.settings.banner})` }}></div>
        )}

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet context={{ store }} />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {store.name}. Powered by Universal E-Commerce Builder.
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default StorefrontLayout;
