import { AppState } from 'react-native';
import { getUserOrders } from '../api/orderApi';
import { getOrderStatuses, setOrderStatuses } from '../storage/storageHelpers';
import { scheduleStatusNotification } from './NotificationService';

const POLL_INTERVAL_MS = 30_000;       // 30 seconds
const BG_TIMEOUT_MS   = 10 * 60 * 1000; // 10 minutes

let intervalId       = null;
let bgTimer          = null;
let appStateListener = null;

/** Internal: fetch orders, diff statuses, fire notifications. */
const poll = async () => {
  try {
    const response = await getUserOrders();
    if (!response.data.success) return;

    const orders = response.data.data;
    const storedStatuses  = await getOrderStatuses();
    const updatedStatuses = { ...storedStatuses };
    let hasActiveOrders   = false;

    for (const order of orders) {
      if (order.status !== 'Delivered') hasActiveOrders = true;

      const prev = storedStatuses[order._id];
      if (prev && prev !== order.status) {
        await scheduleStatusNotification(order._id, order.status);
      }
      updatedStatuses[order._id] = order.status;
    }

    await setOrderStatuses(updatedStatuses);

    if (!hasActiveOrders) {
      stop(); // all delivered — suspend
    }
  } catch (_) {
    // silent — next interval will retry
  }
};

/** Start polling. Idempotent — safe to call multiple times. */
export const start = () => {
  if (intervalId) return;

  poll(); // immediate first poll
  intervalId = setInterval(poll, POLL_INTERVAL_MS);

  appStateListener = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'background' || nextState === 'inactive') {
      // Stop polling after 10 min in background
      bgTimer = setTimeout(stop, BG_TIMEOUT_MS);
    } else if (nextState === 'active') {
      clearTimeout(bgTimer);
      bgTimer = null;
      poll(); // immediate re-poll on foreground
    }
  });
};

/** Stop polling and clean up listeners. */
export const stop = () => {
  if (intervalId)       { clearInterval(intervalId);       intervalId = null; }
  if (bgTimer)          { clearTimeout(bgTimer);           bgTimer = null; }
  if (appStateListener) { appStateListener.remove();       appStateListener = null; }
};
