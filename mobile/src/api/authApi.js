import apiClient from './apiClient';

/**
 * Authenticate an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const login = (email, password) =>
  apiClient.post('/api/user/login', { email, password });

/**
 * Register a new user account.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const register = (name, email, password) =>
  apiClient.post('/api/user/register', { name, email, password });
