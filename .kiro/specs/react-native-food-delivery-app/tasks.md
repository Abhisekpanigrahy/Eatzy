# Implementation Plan: React Native Food Delivery App

## Overview

Build a React Native (Expo) mobile food delivery app targeting iOS and Android. The implementation follows a bottom-up approach: project scaffolding and foundations first, then the API/storage layer, then context/state management, then screens and components, and finally services (polling, notifications) and navigation wiring.

---

## Tasks

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Initialise the Expo project and install core dependencies
    - Run `npx create-expo-app` (or scaffold into existing repo root)
    - Install React Navigation v6 (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`) and peer deps
    - Install `axios`, `@react-native-async-storage/async-storage`, `react-native-webview`, `expo-notifications`, `react-native-url-polyfill`
    - Create `src/` directory tree matching the design's project structure (`api/`, `context/`, `navigation/`, `screens/`, `components/`, `services/`, `storage/`, `constants/`)
    - _Requirements: 8.1_

  - [x] 1.2 Create `src/constants/config.js` with environment constants
    - Export `BASE_URL` sourced from `process.env.EXPO_PUBLIC_API_BASE_URL`
    - Export `DELIVERY_CHARGE = 50`
    - _Requirements: 3.5, 4.2_

- [x] 2. Storage helpers and AsyncStorage schema
  - [x] 2.1 Implement `src/storage/storageHelpers.js`
    - Write `getToken`, `setToken`, `removeToken` helpers
    - Write `getFavorites`, `setFavorites` helpers (JSON-serialised array under key `"favorites"`)
    - Write `getOrderStatuses`, `setOrderStatuses` helpers (JSON-serialised object under key `"orderStatuses"`)
    - _Requirements: 1.3, 6.3, 7.6_

  - [ ]* 2.2 Write property test for token storage round-trip
    - **Property 1: JWT Storage on Authentication**
    - **Validates: Requirements 1.3**

  - [ ]* 2.3 Write property test for favorites persistence round-trip
    - **Property 18: Favorites Persisted Across Restarts**
    - **Validates: Requirements 7.6**

  - [ ]* 2.4 Write property test for order-status persistence
    - **Property 14: Order Status Persisted to AsyncStorage**
    - **Validates: Requirements 6.3**

- [x] 3. API client and API modules
  - [x] 3.1 Implement `src/api/apiClient.js`
    - Create an `axios` instance with `baseURL = BASE_URL`
    - Add a request interceptor that reads `AsyncStorage.getItem('token')` and sets `config.headers['token']`
    - _Requirements: 1.4_

  - [ ]* 3.2 Write property test for JWT header attachment
    - **Property 2: JWT Attachment on Authenticated Requests**
    - **Validates: Requirements 1.4**

  - [x] 3.3 Implement `src/api/authApi.js`
    - Export `login(email, password)` → `POST /api/user/login`
    - Export `register(name, email, password)` → `POST /api/user/register`
    - _Requirements: 1.1, 1.2_

  - [x] 3.4 Implement `src/api/foodApi.js`
    - Export `listFoods()` → `GET /api/food/list`
    - Export `getFoodImageUrl(filename)` helper using `BASE_URL`
    - _Requirements: 2.1, 2.2_

  - [x] 3.5 Implement `src/api/cartApi.js`
    - Export `getCart()`, `addToCart(itemId)`, `removeFromCart(itemId)`
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 3.6 Implement `src/api/orderApi.js`
    - Export `placeOrder(items, amount, address)`, `verifyOrder(orderId, success)`, `getUserOrders()`
    - _Requirements: 4.2, 4.4, 5.1_

- [x] 4. Context layer — foundation
  - [x] 4.1 Implement `src/context/AuthContext.jsx`
    - Initialise token from `AsyncStorage` on mount; expose `token`, `user`, `loading` state
    - Implement `login`, `register` (calls authApi, stores token, sets user)
    - Implement `logout` (removes token, calls `clearCart`, stops polling, navigates to Login)
    - Propagate API error messages to UI state
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 9.3_

  - [ ]* 4.2 Write property test for API error message propagation
    - **Property 3: API Error Messages Propagated to UI**
    - **Validates: Requirements 1.5**

  - [x] 4.3 Implement `src/context/FoodContext.jsx`
    - Expose `foods`, `loading`, `error` state
    - Implement `fetchFoods()` calling `foodApi.listFoods()` on mount
    - On failure set `error` string; expose `retryFetch` action
    - _Requirements: 2.1, 2.6_

  - [x] 4.4 Implement `src/context/FavoritesContext.jsx`
    - Load favorites from AsyncStorage on mount
    - Implement `toggleFavorite(itemId)` and `isFavorite(itemId)`
    - Persist changes back to AsyncStorage
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.6_

  - [ ]* 4.5 Write property test for favorites toggle round-trip
    - **Property 16: Favorites Toggle Add/Remove Round-Trip**
    - **Validates: Requirements 7.2, 7.3**

  - [x] 4.6 Implement `src/context/CartContext.jsx`
    - Expose `cartData`, `loading` state
    - Implement `loadCart`, `addToCart`, `removeFromCart`, `clearCart`
    - Guard `addToCart`/`removeFromCart` behind auth check; redirect to Login if unauthenticated
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 3.7_

  - [x] 4.7 Implement `src/context/OrderContext.jsx`
    - Expose `orders`, `loading`, `error` state
    - Implement `fetchOrders`, `placeOrder`, `verifyOrder`
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1_

  - [x] 4.8 Implement `src/context/AppProviders.jsx`
    - Compose `AuthContext → FoodContext → FavoritesContext → CartContext → OrderContext` as nested providers
    - Wrap `App.jsx` with `AppProviders`
    - _Requirements: all context-dependent requirements_

- [ ] 5. Checkpoint — context layer complete
  - Ensure all tests pass; verify that `AuthContext` restores token on reload, `FoodContext` fetches food, `CartContext` guards unauthenticated access.

- [ ] 6. Shared UI components
  - [~] 6.1 Implement `src/components/LoadingSpinner.jsx` and `src/components/ErrorState.jsx`
    - `LoadingSpinner`: centred `ActivityIndicator` wrapper
    - `ErrorState`: displays error message string + "Retry" `TouchableOpacity`
    - _Requirements: 2.6, 5.5_

  - [~] 6.2 Implement `src/components/FoodCard.jsx`
    - Display `name`, `price`, `description`, and `Image` with URI from `getFoodImageUrl(image)`
    - Include heart toggle (`isFavorite` → filled/outline icon) that calls `toggleFavorite`
    - Include add/remove quantity stepper that calls `addToCart`/`removeFromCart`
    - _Requirements: 2.2, 7.1, 7.5_

  - [ ]* 6.3 Write property test for FoodCard required-fields rendering
    - **Property 5: Food Card Contains All Required Fields**
    - **Validates: Requirements 2.2**

  - [~] 6.4 Implement `src/components/CategoryPill.jsx`
    - Tappable chip component; accepts `label`, `active`, `onPress`
    - _Requirements: 2.3, 2.4_

  - [~] 6.5 Implement `src/components/CartBadge.jsx`
    - Numeric badge overlay for the Cart tab icon
    - Reads total item count from `CartContext` (`Object.values(cartData).reduce(...)`)
    - _Requirements: 3.6, 8.4_

  - [ ]* 6.6 Write property test for cart item count badge
    - **Property 7: Cart Item Count Badge**
    - **Validates: Requirements 3.6**

  - [~] 6.7 Implement `src/components/OrderStatusBadge.jsx`
    - Coloured pill for `"Food Processing"` / `"Out for Delivery"` / `"Delivered"` statuses
    - _Requirements: 5.2_

  - [~] 6.8 Implement `src/components/FavoritesSection.jsx`
    - Horizontally scrollable row of `FoodCard` items filtered to the current favorites list
    - Display empty-state message when `favorites` is empty
    - _Requirements: 7.4, 7.7_

  - [ ]* 6.9 Write property test for favorites section renders correct subset
    - **Property 17: Favorites Section Renders Correct Subset**
    - **Validates: Requirements 7.4, 7.5**

  - [~] 6.10 Implement `src/components/PromoBanner.jsx`
    - Horizontally scrollable static featured categories strip
    - _Requirements: 10.3_

  - [~] 6.11 Implement `src/components/AddressForm.jsx`
    - Controlled form with fields: first name, last name, email, street, city, state, zip code, country, phone
    - Exposes `value` and `onChange` props; validates required fields before submission
    - _Requirements: 4.1_

- [ ] 7. Auth screens
  - [~] 7.1 Implement `src/screens/LoginScreen.jsx`
    - Email and password `TextInput` fields
    - "Login" button calls `AuthContext.login`; shows API error message on failure
    - Link to `RegisterScreen`
    - _Requirements: 1.1, 1.5_

  - [~] 7.2 Implement `src/screens/RegisterScreen.jsx`
    - Name, email, password `TextInput` fields
    - "Register" button calls `AuthContext.register`; shows API error message on failure
    - _Requirements: 1.2, 1.5_

- [ ] 8. Main app screens — browsing and home
  - [~] 8.1 Implement `src/screens/HomeScreen.jsx`
    - Header with app logo and search `TextInput`
    - Real-time filtering via `useMemo` on `FoodContext.foods` (name/category, case-insensitive)
    - `PromoBanner` + `FavoritesSection` + full `FlatList` grid (2-column) of `FoodCard`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 8.2 Write property test for real-time search filter
    - **Property 19: Real-Time Search Filter**
    - **Validates: Requirements 10.2**

  - [~] 8.3 Implement `src/screens/MenuScreen.jsx`
    - Horizontal `CategoryPill` scroll derived from `FoodContext.foods` unique categories; include "All"
    - `FlatList` of `FoodCard` filtered by active category
    - `ErrorState` with retry when `FoodContext.error` is set
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 8.4 Write property test for food list renders all items
    - **Property 4: Food List Renders All Items**
    - **Validates: Requirements 2.1**

  - [ ]* 8.5 Write property test for category filter correctness
    - **Property 6: Category Filter Correctness**
    - **Validates: Requirements 2.4, 2.5**

  - [~] 8.6 Implement `src/screens/FoodDetailScreen.jsx`
    - Display full details of a single `FoodItem` (image, name, description, price)
    - Heart toggle and add-to-cart button
    - _Requirements: 2.2, 7.1_

- [ ] 9. Cart and checkout screens
  - [~] 9.1 Implement `src/screens/CartScreen.jsx`
    - `FlatList` of cart rows showing name, qty stepper (calls `addToCart`/`removeFromCart`), line total
    - Summary row: subtotal + Delivery ₹50 + grand total
    - "Proceed to Checkout" button → navigate to `CheckoutScreen`
    - _Requirements: 3.4, 3.5_

  - [ ]* 9.2 Write property test for cart total computation
    - **Property 8: Cart Total Computation**
    - **Validates: Requirements 3.5**

  - [~] 9.3 Implement `src/screens/CheckoutScreen.jsx`
    - Render `AddressForm`; "Place Order" button calls `OrderContext.placeOrder`
    - On `session_url` response navigate to `StripeWebViewScreen`; on failure show error and keep form data
    - _Requirements: 4.1, 4.2, 4.3, 4.7_

  - [ ]* 9.4 Write property test for order placement payload completeness
    - **Property 9: Order Placement Payload Completeness**
    - **Validates: Requirements 4.2**

  - [~] 9.5 Implement `src/screens/StripeWebViewScreen.jsx`
    - Full-screen `WebView` pointed at `session_url`
    - Install and import `react-native-url-polyfill`
    - `onNavigationStateChange` detects `/verify` path; parse `orderId` and `success` query params; call `verifyOrder`
    - On `success: true` → `clearCart`, show success toast, navigate to Orders
    - On `success: false` → show failure toast, navigate to Cart
    - Handle WebView `onError` with toast + navigate back
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

  - [ ]* 9.6 Write property test for Stripe verify URL parameter extraction
    - **Property 10: Stripe Verify URL Parameter Extraction**
    - **Validates: Requirements 4.4**

- [ ] 10. Orders and profile screens
  - [~] 10.1 Implement `src/screens/OrdersScreen.jsx`
    - On mount and `RefreshControl` pull, call `OrderContext.fetchOrders`
    - `FlatList` of order cards sorted by `date` descending
    - Each card: `OrderStatusBadge`, date, items with quantities, total, payment pill
    - `ErrorState` + retry when error is set
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 10.2 Write property test for orders sorted by date descending
    - **Property 12: Orders Sorted by Date Descending**
    - **Validates: Requirements 5.3**

  - [ ]* 10.3 Write property test for order display contains all required fields
    - **Property 11: Order Display Contains All Required Fields**
    - **Validates: Requirements 5.2**

  - [~] 10.4 Implement `src/screens/ProfileScreen.jsx`
    - Display `AuthContext.user.name` and `AuthContext.user.email`
    - "Logout" button calls `AuthContext.logout`
    - _Requirements: 9.1, 9.2, 9.3_

- [~] 11. Checkpoint — all screens wired to contexts
  - Ensure all tests pass; verify login/logout flows, food browsing, cart add/remove, and order list render correctly in isolation.

- [ ] 12. Notification service and order polling
  - [~] 12.1 Implement `src/services/NotificationService.js`
    - Configure `Notifications.setNotificationHandler` for foreground alerts
    - Export `requestPermissions()` and `scheduleStatusNotification(orderId, newStatus)`
    - Call `requestPermissions` once after first successful login (guarded by AsyncStorage flag)
    - _Requirements: 6.2, 6.7_

  - [~] 12.2 Implement `src/services/OrderPollingService.js`
    - Singleton module with `start()` and `stop()`
    - `poll()` calls `getUserOrders`, compares status against `getOrderStatuses`, schedules notifications on change
    - Persists updated statuses via `setOrderStatuses`
    - Registers `AppState` listener: background → start `bgTimer` (10 min) → stop; foreground → clear timer + immediate poll
    - Stop polling when all orders are `"Delivered"`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 12.3 Write property test for order status change triggers notification
    - **Property 13: Order Status Change Triggers Notification**
    - **Validates: Requirements 6.2**

  - [ ]* 12.4 Write property test for polling suspended when all orders delivered
    - **Property 15: Polling Suspended When All Orders Delivered**
    - **Validates: Requirements 6.6**

  - [~] 12.5 Integrate polling into `AuthContext`
    - Call `OrderPollingService.start()` after successful login/register
    - Call `OrderPollingService.stop()` inside `logout()`
    - _Requirements: 6.1, 9.3_

- [ ] 13. Navigation wiring
  - [~] 13.1 Implement per-stack navigators
    - Create `HomeStack.jsx`, `MenuStack.jsx`, `CartStack.jsx` (including `StripeWebViewScreen` as modal), `OrdersStack.jsx`, `ProfileStack.jsx`
    - _Requirements: 8.1_

  - [~] 13.2 Implement `src/navigation/AppTabs.jsx`
    - Bottom Tab Navigator with five tabs: Home, Menu, Cart, Orders, Profile
    - Attach `CartBadge` to Cart tab icon
    - Guard Cart, Orders, Profile tabs: redirect unauthenticated users to `LoginScreen`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [~] 13.3 Implement `src/navigation/RootNavigator.jsx`
    - Stack navigator that renders `AuthStack` when `AuthContext.token` is null, else `AppTabs`
    - `AuthStack` contains `LoginScreen` and `RegisterScreen`
    - _Requirements: 1.6, 8.5_

  - [~] 13.4 Wire navigation into `App.jsx`
    - Wrap `<NavigationContainer>` with `AppProviders`
    - Render `<RootNavigator />`
    - _Requirements: 8.1, 8.2_

- [~] 14. Final checkpoint — end-to-end integration
  - Ensure all automated tests pass; verify the full flow: login → browse menu → add to cart → checkout → Stripe WebView → order confirmation → orders list → notifications → logout.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All property tests use **fast-check** as the PBT library and **Jest + React Native Testing Library** for unit tests
- Each task references specific requirements for traceability
- Checkpoints (tasks 5, 11, 14) ensure incremental validation before proceeding to the next layer
- Property tests validate universal correctness properties across hundreds of generated inputs; unit tests cover specific edge cases and screen renders
- The `react-native-url-polyfill` package is required because the `URL` global is not available in the Hermes JS engine

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "3.5", "3.6"] },
    { "id": 4, "tasks": ["4.1", "4.3", "4.4", "4.6", "4.7"] },
    { "id": 5, "tasks": ["4.2", "4.5", "4.8"] },
    { "id": 6, "tasks": ["6.1", "6.2", "6.4", "6.5", "6.7", "6.10", "6.11"] },
    { "id": 7, "tasks": ["6.3", "6.6", "6.8"] },
    { "id": 8, "tasks": ["6.9", "7.1", "7.2"] },
    { "id": 9, "tasks": ["8.1", "8.3", "8.6", "10.4"] },
    { "id": 10, "tasks": ["8.2", "8.4", "8.5", "9.1", "10.1"] },
    { "id": 11, "tasks": ["9.2", "9.3", "10.2", "10.3"] },
    { "id": 12, "tasks": ["9.4", "9.5"] },
    { "id": 13, "tasks": ["9.6", "12.1"] },
    { "id": 14, "tasks": ["12.2"] },
    { "id": 15, "tasks": ["12.3", "12.4", "12.5"] },
    { "id": 16, "tasks": ["13.1"] },
    { "id": 17, "tasks": ["13.2", "13.3"] },
    { "id": 18, "tasks": ["13.4"] }
  ]
}
```
