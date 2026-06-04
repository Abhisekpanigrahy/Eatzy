import axios from 'axios';
import { BASE_URL } from '../constants/config';

/**
 * Turn axios / network failures into user-facing copy (avoids raw "Network Error").
 */
export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  if (!error) return fallback;

  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) return serverMessage;

    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }

    if (!error.response) {
      const target = BASE_URL ? ` at ${BASE_URL}` : '';
      return `Cannot reach the server${target}. Start the backend (port 4000), use the same Wi‑Fi as your phone, and check mobile/.env if needed.`;
    }

    if (error.response.status >= 500) {
      return 'Server error. Please try again later.';
    }
  }

  const msg = error.message || '';
  if (/network error/i.test(msg)) {
    const target = BASE_URL ? ` at ${BASE_URL}` : '';
    return `Cannot reach the server${target}. Start the backend and check your API URL in mobile/.env.`;
  }

  return msg || fallback;
}
