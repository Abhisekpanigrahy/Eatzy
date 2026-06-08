import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Show alerts in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions.
 * Checks current status and prompts if not yet granted.
 */
export const requestPermissionsIfNeeded = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('[NotificationService] Permission not granted');
      return false;
    }

    // On Android, we need a channel for notifications to show up correctly
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
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
        data: { orderId },
        sound: 'default',
      },
      trigger: null, // deliver immediately
    });
  } catch (e) {
    console.error('[NotificationService] scheduleStatusNotification error:', e);
  }
};
