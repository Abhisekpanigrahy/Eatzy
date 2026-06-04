/**
 * App-wide constants derived from environment variables.
 *
 * Set EXPO_PUBLIC_API_BASE_URL in your .env file, e.g.:
 *   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:4000
 */
export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/** Fixed delivery charge added to every order total (₹). */
export const DELIVERY_CHARGE = 50;
