import React from 'react';
import { AuthProvider } from './AuthContext';
import { FoodProvider } from './FoodContext';
import { FavoritesProvider } from './FavoritesContext';
import { CartProvider } from './CartContext';
import { OrderProvider } from './OrderContext';

/**
 * Composes all app-level providers in the correct dependency order:
 * Auth → Food → Favorites → Cart (depends on Auth) → Order
 */
const AppProviders = ({ children }) => (
  <AuthProvider>
    <FoodProvider>
      <FavoritesProvider>
        <CartProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </CartProvider>
      </FavoritesProvider>
    </FoodProvider>
  </AuthProvider>
);

export default AppProviders;
