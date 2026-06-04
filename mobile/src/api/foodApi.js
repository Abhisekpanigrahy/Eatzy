import apiClient from './apiClient';
import { BASE_URL } from '../constants/config';

/**
 * Fetch all available food items from the backend.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const listFoods = () => apiClient.get('/api/food/list');

/**
 * Build the full image URL for a food item.
 * If the image is already a full URL (Cloudinary), return as-is.
 * Otherwise build from BASE_URL + /images/<filename>.
 * @param {string} image - Cloudinary URL or local filename.
 * @returns {string} Full URL to the image.
 */
export const getFoodImageUrl = (image) => {
  if (!image) return `${BASE_URL}/images/placeholder.png`;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${BASE_URL}/images/${image}`;
};
