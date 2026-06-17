import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children, storeId }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && storeId) {
      fetchCart();
    }
  }, [user, storeId]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`/carts/${storeId}`);
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("Please login to add to cart"); // Simple local fallback could be added here
      return;
    }
    try {
      const { data } = await axios.post(`/carts/${storeId}`, { productId, quantity });
      setCart(data);
    } catch (error) {
      console.error('Error adding to cart', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(`/carts/${storeId}/${itemId}`, { quantity });
      setCart(data);
    } catch (error) {
      console.error('Error updating cart', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await axios.delete(`/carts/${storeId}/${itemId}`);
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart', error);
    }
  };

  const cartTotal = cart.items?.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
