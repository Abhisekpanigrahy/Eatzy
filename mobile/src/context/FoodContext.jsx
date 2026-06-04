import React, { createContext, useContext, useEffect, useState } from 'react';
import { listFoods } from '../api/foodApi';

const FoodContext = createContext(null);

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listFoods();
      if (res.data.success) {
        setFoods(res.data.data);
      } else {
        setError(res.data.message || 'Failed to load menu');
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <FoodContext.Provider value={{ foods, loading, error, retryFetch: fetchFoods }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFoods = () => useContext(FoodContext);
export default FoodContext;
