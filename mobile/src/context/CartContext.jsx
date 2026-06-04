import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCart, addToCart as apiAdd, removeFromCart as apiRemove } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartData, setCartData] = useState({});
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getCart();
      // Backend returns { success, cartData } directly (not nested in .data)
      const cartPayload = res.data;
      if (cartPayload.success) {
        setCartData(cartPayload.cartData || {});
      }
    } catch (e) {
      console.error('[CartContext] loadCart error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Reload cart whenever auth state changes
  useEffect(() => {
    if (token) {
      loadCart();
    } else {
      setCartData({});
    }
  }, [token]);

  const addToCart = async (itemId) => {
    if (!token) return false; // caller should redirect to login
    // Optimistic update
    setCartData((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    try {
      await apiAdd(itemId);
      return true;
    } catch (e) {
      // Rollback
      setCartData((prev) => {
        const qty = (prev[itemId] || 1) - 1;
        if (qty <= 0) {
          const { [itemId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [itemId]: qty };
      });
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) return false;
    const current = cartData[itemId] || 0;
    if (current <= 0) return false;
    // Optimistic update
    setCartData((prev) => {
      if ((prev[itemId] || 0) <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: prev[itemId] - 1 };
    });
    try {
      await apiRemove(itemId);
      return true;
    } catch (e) {
      // Rollback
      setCartData((prev) => ({ ...prev, [itemId]: current }));
      return false;
    }
  };

  const clearCart = () => setCartData({});

  const cartItemCount = Object.values(cartData).reduce((sum, v) => sum + v, 0);

  return (
    <CartContext.Provider value={{ cartData, loading, cartItemCount, loadCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
