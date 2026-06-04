import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Show alerts in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PERMISSION_ASKED_KEY = 'notif_permission_asked';

/**
 * Request notification permissions once per install.
 * Guards with an AsyncStorage flag so we only prompt once.
 */
export const requestPermissionsIfNeeded = async () => {
  try {
    const asked = await AsyncStorage.getItem(PERMISSION_ASKED_KEY);
    if (asked) return;
    const { status } = await Notifications.requestPermissionsAsync();
    await AsyncStorage.setItem(PERMISSION_ASKED_KEY, 'true');
    return status === 'granted';
  } catch (e) {
    console.error('[NotificationService] requestPermissionsIfNeeded error:', e);
  }
};

/**
 * Trigger an immediate local push notification for an order status change.
 * @param {string} orderId
 * @param {string} newStatus
 */
export const scheduleStatusNotification = async (orderId, newStatus) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🍔 Order Update',
        body: `Order #${orderId.slice(-6).toUpperCase()}: ${newStatus}`,
      },
      trigger: null, // deliver immediately
    });
  } catch (e) {
    console.error('[NotificationService] scheduleStatusNotification error:', e);
  }
};
