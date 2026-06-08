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

function getConfiguredApiUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const fromExtra = Constants.expoConfig?.extra?.apiBaseUrl?.trim();
  if (fromExtra) return fromExtra.replace(/\/$/, '');

  return null;
}

function resolveBaseUrl() {
  const configured = getConfiguredApiUrl();
  if (configured) return configured;

  // Local dev only — when no API URL is set in .env
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    const devHost = getDevServerHost();
    if (devHost) return `http://${devHost}:4000`;
  }

  if (Platform.OS === 'android') return 'http://10.0.2.2:4000';
  return 'http://localhost:4000';
}

/**
 * API origin. Set EXPO_PUBLIC_API_BASE_URL in mobile/.env before building the APK.
 */
export const BASE_URL = resolveBaseUrl();
