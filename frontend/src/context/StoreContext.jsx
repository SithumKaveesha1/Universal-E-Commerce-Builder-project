import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        if (user && (user.role === 'Admin' || user.role === 'Super Admin') && user.storeId) {
          const { data } = await axios.get('/stores/my-store');
          setStore(data);
        }
      } catch (error) {
        console.error('Error fetching store', error);
      } finally {
        setLoadingStore(false);
      }
    };
    
    if (user) {
      fetchStore();
    } else {
      setStore(null);
      setLoadingStore(false);
    }
  }, [user]);

  const createStore = async (name, slug) => {
    const { data } = await axios.post('/stores', { name, slug });
    setStore(data);
    return data;
  };

  const updateStoreSettings = async (settings) => {
    const { data } = await axios.put('/stores/my-store', { settings });
    setStore(data);
    return data;
  };

  return (
    <StoreContext.Provider value={{ store, createStore, updateStoreSettings, loadingStore }}>
      {children}
    </StoreContext.Provider>
  );
};
