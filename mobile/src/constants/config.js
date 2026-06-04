import { Platform } from 'react-native';
import Constants from 'expo-constants';

/** Fixed delivery charge added to every order total (₹). */
export const DELIVERY_CHARGE = 5;

/**
 * Metro / Expo Go host (e.g. 192.168.1.5:8081) — same machine as the API in local dev.
 */
function getDevServerHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) return null;
  const host = String(hostUri).split(':')[0];
  return host || null;
}

function resolveBaseUrl() {
  // In dev, prefer Metro's host so a stale .env IP does not break login on device.
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    const devHost = getDevServerHost();
    if (devHost) return `http://${devHost}:4000`;
  }

  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, '');

  if (Platform.OS === 'android') return 'http://10.0.2.2:4000';
  return 'http://localhost:4000';
}

/**
 * API origin. Override with EXPO_PUBLIC_API_BASE_URL in mobile/.env for production builds.
 */
export const BASE_URL = resolveBaseUrl();
