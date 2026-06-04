import apiClient from './apiClient';

export const login = (email, password) =>
  apiClient.post('/api/user/login', { email, password });

export const register = (name, email, password) =>
  apiClient.post('/api/user/register', { name, email, password });

export const forgotPassword = (email) =>
  apiClient.post('/api/user/forgot-password', { email });

export const resetPassword = (email, otp, newPassword) =>
  apiClient.post('/api/user/reset-password', { email, otp, newPassword });
