import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default axios config
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          // Set token to axios defaults if needed, though cookies are better
          if (parsedUser.token) {
             axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
          }
          const { data } = await axios.get('/auth/profile');
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user profile', error);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
