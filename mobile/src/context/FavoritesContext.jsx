import React, { createContext, useContext, useEffect, useState } from 'react';
import { getFavorites, setFavorites } from '../storage/storageHelpers';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavoritesState] = useState([]);

  // Load persisted favorites from AsyncStorage on mount
  useEffect(() => {
    const load = async () => {
      const stored = await getFavorites();
      setFavoritesState(stored);
    };
    load();
  }, []);

  const toggleFavorite = async (itemId) => {
    const updated = favorites.includes(itemId)
      ? favorites.filter((id) => id !== itemId)
      : [...favorites, itemId];
    setFavoritesState(updated);
    await setFavorites(updated);
  };

  const isFavorite = (itemId) => favorites.includes(itemId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
export default FavoritesContext;
