import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user || user.role !== 'BUYER') return;
    try {
      const res = await cartAPI.get();
      setCartItems(res.data);
      setCartCount(res.data.reduce((sum, i) => sum + i.quantity, 0));
    } catch {}
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId) => {
    await cartAPI.add(productId);
    fetchCart();
  };

  const updateItem = async (cartId, quantity) => {
    await cartAPI.update(cartId, quantity);
    fetchCart();
  };

  const removeItem = async (cartId) => {
    await cartAPI.remove(cartId);
    fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCartItems([]);
    setCartCount(0);
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  const discount = cartTotal > 2000 ? cartTotal * 0.10 : 0;
  const finalTotal = cartTotal - discount;

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal, discount, finalTotal,
      addToCart, updateItem, removeItem, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
