import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ProductProvider } from './context/ProductContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './components/AdminLayout';
import CreateStore from './pages/admin/CreateStore';
import StoreSettings from './pages/admin/StoreSettings';
import Categories from './pages/admin/Categories';
import Products from './pages/admin/Products';
import StorefrontLayout from './components/StorefrontLayout';
import StoreFront from './pages/StoreFront';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import OrderHistory from './pages/OrderHistory';
import AdminOrders from './pages/admin/Orders';
import Dashboard from './pages/admin/Dashboard';

// A placeholder Home component for now
const Home = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Universal E-Commerce Builder</h1>
      {user ? (
        <div>
          <p className="mb-4">Logged in as {user.name} ({user.role})</p>
          {(user.role === 'Admin' || user.role === 'Super Admin') && (
            <Link to="/admin/dashboard" className="px-4 py-2 bg-green-600 text-white rounded mr-2 inline-block">Go to Admin Dashboard</Link>
          )}
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>
      ) : (
        <div>
          <p className="mb-4">You are not logged in.</p>
          <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Login</a>
          <a href="/register" className="px-4 py-2 bg-gray-500 text-white rounded">Register</a>
        </div>
      )}
    </div>
  );
};

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={user && (user.role === 'Admin' || user.role === 'Super Admin') ? <AdminLayout /> : <Navigate to="/login" />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-store" element={<CreateStore />} />
        <Route path="settings" element={<StoreSettings />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* Customer Storefront Routes */}
      <Route path="/:storeSlug" element={<StorefrontLayout />}>
        <Route index element={<StoreFront />} />
        <Route path="products" element={<StoreFront />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout-success" element={<CheckoutSuccess />} />
        <Route path="orders" element={<OrderHistory />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <ProductProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ProductProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
