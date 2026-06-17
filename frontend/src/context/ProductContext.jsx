import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from './StoreContext';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { store } = useContext(StoreContext);

  const fetchCategories = async () => {
    if (!store) return;
    const { data } = await axios.get(`/categories/store/${store._id}`);
    setCategories(data);
  };

  const createCategory = async (name, slug) => {
    const { data } = await axios.post('/categories', { name, slug });
    setCategories([...categories, data]);
  };

  const fetchProducts = async (category = '', search = '') => {
    if (!store) return;
    const { data } = await axios.get(`/products/store/${store._id}?category=${category}&search=${search}`);
    setProducts(data);
  };

  const createProduct = async (productData) => {
    const { data } = await axios.post('/products', productData);
    setProducts([...products, data]);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <ProductContext.Provider value={{
      products, categories, fetchCategories, createCategory, fetchProducts, createProduct, deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};
