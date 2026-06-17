import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// A placeholder Home component for now
const Home = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Universal E-Commerce Builder</h1>
      {user ? (
        <div>
          <p className="mb-4">Logged in as {user.name} ({user.role})</p>
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
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
