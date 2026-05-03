
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user, getAuthHeaders, API_URL } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart`, { headers: getAuthHeaders() });
      setCartItems(res.data.cart?.items || []);
      setCartCount(res.data.itemCount || 0);
    } catch (err) {
      console.error('Cart fetch error:', err);
    }
  };

  const addToCart = async (productId, quantity, size, color) => {
    try {
      const res = await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity, size, color },
        { headers: getAuthHeaders() }
      );
      if (res.data.success) {
        setCartCount(prev => prev + quantity);
        toast.success('Added to cart!');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/remove/${itemId}`, {
        headers: getAuthHeaders()
      });
      fetchCart();
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart/clear`, { headers: getAuthHeaders() });
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, addToCart, removeFromCart, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
