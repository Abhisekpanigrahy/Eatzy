import axios from 'axios';
import { BASE_URL } from '../constants/config';
import { getToken } from '../storage/storageHelpers';

/**
 * Centralised axios instance for all API calls.
 * baseURL is set from the EXPO_PUBLIC_API_BASE_URL environment variable.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

/**
 * Request interceptor: read the JWT from AsyncStorage and attach it as the
 * `token` header so the existing backend auth middleware can read it via
 * `req.headers.token`.
 */
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers['token'] = token;
  }
  return config;
});

export default apiClient;
