import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Token helpers ────────────────────────────────────────────────────────────

/**
 * Read the JWT from AsyncStorage.
 * Returns null on any error.
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (e) {
    console.error('[storageHelpers] getToken error:', e);
    return null;
  }
};

/**
 * Write the JWT to AsyncStorage.
 */
export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (e) {
    console.error('[storageHelpers] setToken error:', e);
  }
};

/**
 * Remove the JWT from AsyncStorage.
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (e) {
    console.error('[storageHelpers] removeToken error:', e);
  }
};

// ─── Favorites helpers ────────────────────────────────────────────────────────

/**
 * Read the favorites list from AsyncStorage.
 * Returns a JSON-parsed array of food item _id strings.
 * Returns [] on missing key or any error.
 */
export const getFavorites = async () => {
  try {
    const raw = await AsyncStorage.getItem('favorites');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('[storageHelpers] getFavorites error:', e);
    return [];
  }
};

/**
 * Persist the favorites list to AsyncStorage.
 * @param {string[]} ids - Array of food item _id strings.
 */
export const setFavorites = async (ids) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(ids));
  } catch (e) {
    console.error('[storageHelpers] setFavorites error:', e);
  }
};

// ─── Order-status helpers ─────────────────────────────────────────────────────

/**
 * Read the persisted order-status map from AsyncStorage.
 * Returns a JSON-parsed object of shape { [orderId: string]: string }.
 * Returns {} on missing key or any error.
 */
export const getOrderStatuses = async () => {
  try {
    const raw = await AsyncStorage.getItem('orderStatuses');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('[storageHelpers] getOrderStatuses error:', e);
    return {};
  }
};

/**
 * Persist the order-status map to AsyncStorage.
 * @param {{ [orderId: string]: string }} statusMap
 */
export const setOrderStatuses = async (statusMap) => {
  try {
    await AsyncStorage.setItem('orderStatuses', JSON.stringify(statusMap));
  } catch (e) {
    console.error('[storageHelpers] setOrderStatuses error:', e);
  }
};
