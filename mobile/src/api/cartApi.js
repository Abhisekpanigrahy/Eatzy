import apiClient from './apiClient';

/**
 * Fetch the current user's cart data from the backend.
 * The auth middleware injects userId from the JWT, so no body is needed.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const getCart = () => apiClient.post('/api/cart/get');

/**
 * Add one unit of an item to the cart.
 * @param {string} itemId - The _id of the FoodItem to add.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const addToCart = (itemId) =>
  apiClient.post('/api/cart/add', { itemId });

/**
 * Remove one unit of an item from the cart.
 * @param {string} itemId - The _id of the FoodItem to remove.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const removeFromCart = (itemId) =>
  apiClient.post('/api/cart/remove', { itemId });
