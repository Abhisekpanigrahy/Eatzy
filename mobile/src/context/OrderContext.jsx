import React, { createContext, useContext, useState } from 'react';
import { placeOrder as apiPlace, verifyOrder as apiVerify, getUserOrders } from '../api/orderApi';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserOrders();
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        setError(res.data.message || 'Failed to load orders');
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Place an order. Returns { success, session_url } on success.
   * paymentMethod: 'stripe' | 'cod'
   */
  const placeOrder = async (items, amount, address, paymentMethod = 'stripe') => {
    setError(null);
    try {
      const res = await apiPlace(items, amount, address, paymentMethod);
      if (res.data.success) {
        return { success: true, session_url: res.data.session_url, cod: res.data.cod };
      } else {
        setError(res.data.message || 'Failed to place order');
        return { success: false };
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Failed to place order';
      setError(msg);
      return { success: false };
    }
  };

  /**
   * Verify a Stripe payment. Returns response data.
   */
  const verifyOrder = async (orderId, success) => {
    try {
      const res = await apiVerify(orderId, success);
      return res.data;
    } catch (e) {
      return { success: false };
    }
  };

  const clearError = () => setError(null);

  return (
    <OrderContext.Provider value={{ orders, loading, error, fetchOrders, placeOrder, verifyOrder, clearError }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
export default OrderContext;
