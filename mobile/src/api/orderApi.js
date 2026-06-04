import apiClient from './apiClient';

/**
 * Place a new order and initiate a Stripe checkout session.
 * The response will contain a `session_url` to redirect the user to Stripe.
 * `userId` is injected server-side by the auth middleware — do not send it.
 *
 * @param {Array<{_id: string, quantity: number, [key: string]: any}>} items - Cart items.
 * @param {number} amount - Grand total including delivery charge.
 * @param {object} address - Delivery address from AddressForm.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const placeOrder = (items, amount, address, paymentMethod = 'stripe') =>
  apiClient.post('/api/order/place', { items, amount, address, paymentMethod });

/**
 * Verify a Stripe payment after the WebView redirect.
 * @param {string} orderId - The order ID extracted from the Stripe redirect URL.
 * @param {string} success - "true" or "false" extracted from the redirect URL query param.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const verifyOrder = (orderId, success) =>
  apiClient.post('/api/order/verify', { orderId, success });

/**
 * Fetch all orders placed by the authenticated user.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const getUserOrders = () => apiClient.post('/api/order/userorders');
