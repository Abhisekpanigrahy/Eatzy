# Requirements Document

## Introduction

This document describes the requirements for a React Native (Expo) mobile application for food delivery, targeting iOS and Android platforms. The app mirrors the existing web frontend's feature set — browsing food items, managing a cart, placing orders via Stripe, and viewing order history — while adding mobile-native features: push notifications for order status changes and a favorites system stored locally in AsyncStorage. The app consumes the existing Node.js/Express + MongoDB backend without any backend modifications, authenticating via JWT stored in AsyncStorage. Navigation is implemented using React Navigation v6 with a bottom tab bar (Home, Menu, Cart, Orders, Profile).

---

## Glossary

- **App**: The React Native Expo mobile application being specified.
- **API**: The existing Node.js/Express backend accessible at `/api/user`, `/api/food`, `/api/cart`, and `/api/order` endpoints.
- **JWT**: JSON Web Token issued by the API on successful login or registration, used to authenticate subsequent requests.
- **AsyncStorage**: React Native's key-value storage used to persist JWT tokens, favorites, and other local data on the device.
- **FoodItem**: A menu item returned by the API with fields: `_id`, `name`, `description`, `price`, `image`, and `category`.
- **Cart**: The server-side cart associated with the authenticated user, managed via `/api/cart` endpoints.
- **Order**: A placed order record stored in MongoDB, containing `userId`, `items`, `amount`, `address`, `status`, `date`, and `payment` fields.
- **Order Status**: A string value representing the current state of an order. Valid values are: `"Food Processing"`, `"Out for Delivery"`, `"Delivered"`.
- **Stripe Session URL**: A Stripe-hosted checkout URL returned by `POST /api/order/place`, used to collect payment.
- **WebView**: A React Native in-app browser component used to load the Stripe Session URL for payment.
- **Favorites**: A list of FoodItem `_id` values stored in AsyncStorage representing items the user has saved locally.
- **Polling**: A client-side mechanism that periodically calls `POST /api/order/userorders` to detect order status changes.
- **Bottom Tab Navigator**: The React Navigation v6 bottom tab bar providing navigation to Home, Menu, Cart, Orders, and Profile screens.
- **Push Notification**: A local device notification triggered by the App when a polled order status change is detected.
- **Delivery Charge**: A fixed charge of ₹50 added to every order total, as defined by the backend.

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to register and log in to the app using my existing credentials, so that I can access my cart and order history across devices.

#### Acceptance Criteria

1. THE App SHALL provide a login screen with email and password fields that submits credentials to `POST /api/user/login`.
2. THE App SHALL provide a registration screen with name, email, and password fields that submits data to `POST /api/user/register`.
3. WHEN the API returns a JWT on successful authentication, THE App SHALL store the JWT in AsyncStorage under the key `"token"`.
4. WHILE the App holds a valid JWT in AsyncStorage, THE App SHALL include the JWT as a Bearer token in the `token` header of all authenticated API requests to `/api/cart` and `/api/order` endpoints.
5. IF the API returns a non-success response during login or registration, THEN THE App SHALL display the error message returned by the API to the user.
6. WHEN the user selects the logout option on the Profile screen, THE App SHALL remove the JWT from AsyncStorage and navigate the user to the login screen.

---

### Requirement 2: Food Menu Browsing

**User Story:** As a user, I want to browse the full food menu and filter by category, so that I can quickly find items I want to order.

#### Acceptance Criteria

1. WHEN the Menu screen is loaded, THE App SHALL fetch all food items from `GET /api/food/list` and display them as a scrollable grid.
2. THE App SHALL display each FoodItem with its name, image (loaded from the `/images/` path on the API server), price, and description.
3. THE App SHALL display a horizontally scrollable list of food categories derived from the fetched FoodItem data.
4. WHEN the user selects a category, THE App SHALL filter the displayed FoodItem list to show only items matching the selected category.
5. WHEN the user selects the "All" category or no category filter is active, THE App SHALL display all FoodItems.
6. IF the `GET /api/food/list` request fails, THEN THE App SHALL display an error message and provide a retry option.

---

### Requirement 3: Cart Management

**User Story:** As an authenticated user, I want to add, remove, and review items in my cart, so that I can control what I'm ordering before checkout.

#### Acceptance Criteria

1. WHILE a user is authenticated, THE App SHALL load the user's cart by calling `POST /api/cart/get` on app launch and on Cart screen focus.
2. WHEN the user taps the add button on a FoodItem, THE App SHALL call `POST /api/cart/add` with the item's `_id` and update the local cart state.
3. WHEN the user taps the remove button on a FoodItem in the cart, THE App SHALL call `POST /api/cart/remove` with the item's `_id` and update the local cart state.
4. THE App SHALL display the Cart screen with each cart item's name, price, quantity, and line total.
5. THE App SHALL display the cart subtotal, the Delivery Charge of ₹50, and the final total on the Cart screen.
6. THE App SHALL display a cart item count badge on the Cart tab icon reflecting the total number of items in the current cart.
7. IF the user is not authenticated and attempts to add an item to the cart, THEN THE App SHALL navigate the user to the login screen.

---

### Requirement 4: Order Placement and Stripe Payment

**User Story:** As an authenticated user, I want to place an order and pay securely via Stripe, so that my order is confirmed and sent to the restaurant.

#### Acceptance Criteria

1. THE App SHALL provide an order placement screen where the user enters a delivery address (first name, last name, email, street, city, state, zip code, country, phone).
2. WHEN the user submits the order placement form, THE App SHALL call `POST /api/order/place` with the cart items, total amount, and delivery address.
3. WHEN the API returns a `session_url` in response to `POST /api/order/place`, THE App SHALL open the Stripe Session URL inside an in-app WebView.
4. WHEN the Stripe WebView navigates to a URL containing the path `/verify`, THE App SHALL close the WebView and call `POST /api/order/verify` with the `orderId` and `success` query parameters extracted from the URL.
5. WHEN `POST /api/order/verify` returns `success: true`, THE App SHALL clear the local cart state, display a payment success message, and navigate the user to the Orders screen.
6. WHEN `POST /api/order/verify` returns `success: false`, THE App SHALL display a payment failure message and navigate the user to the Cart screen.
7. IF the `POST /api/order/place` request fails, THEN THE App SHALL display an error message and allow the user to retry without re-entering the delivery address.

---

### Requirement 5: Order History

**User Story:** As an authenticated user, I want to view my past and current orders, so that I can track the status of my deliveries.

#### Acceptance Criteria

1. WHEN the Orders screen is loaded, THE App SHALL call `POST /api/order/userorders` to fetch all orders for the authenticated user.
2. THE App SHALL display each order with its placed date, list of items with quantities, total amount, payment status, and current Order Status.
3. THE App SHALL display orders sorted by date in descending order, with the most recent order shown first.
4. THE App SHALL provide a manual refresh control on the Orders screen that re-calls `POST /api/order/userorders` when activated.
5. IF the `POST /api/order/userorders` request fails, THEN THE App SHALL display an error message and provide a retry option.

---

### Requirement 6: Push Notifications for Order Status

**User Story:** As a user, I want to receive a notification when my order status changes, so that I know when my food is being prepared or delivered.

#### Acceptance Criteria

1. WHILE at least one order with a status other than `"Delivered"` exists for the authenticated user, THE App SHALL poll `POST /api/order/userorders` at an interval of no less than 30 seconds.
2. WHEN the polled response contains an order whose Order Status differs from the previously stored Order Status for that order, THE App SHALL trigger a local device Push Notification with the order ID and new Order Status as the notification body.
3. THE App SHALL store the last known Order Status for each order in AsyncStorage to enable change detection across app restarts.
4. WHEN the App moves to the background, THE App SHALL continue the polling interval for a maximum of 10 minutes before suspending polling.
5. WHEN the App returns to the foreground, THE App SHALL immediately poll `POST /api/order/userorders` and resume the polling interval.
6. WHEN all of the authenticated user's orders have an Order Status of `"Delivered"`, THE App SHALL suspend polling until a new order is placed.
7. IF the user has not granted notification permissions, THEN THE App SHALL request notification permissions from the device operating system on first launch after authentication.

---

### Requirement 7: Favorites

**User Story:** As a user, I want to save food items to a favorites list, so that I can quickly find and reorder the items I enjoy most.

#### Acceptance Criteria

1. THE App SHALL display a favorites toggle (heart icon) on each FoodItem card throughout the Menu and Home screens.
2. WHEN the user taps the favorites toggle on a FoodItem that is not currently a favorite, THE App SHALL add the FoodItem's `_id` to the Favorites list stored in AsyncStorage.
3. WHEN the user taps the favorites toggle on a FoodItem that is currently a favorite, THE App SHALL remove the FoodItem's `_id` from the Favorites list stored in AsyncStorage.
4. THE App SHALL display a Favorites section on the Home screen showing FoodItems whose `_id` values are present in the AsyncStorage Favorites list.
5. THE App SHALL display the favorites toggle in an active (filled) state for all FoodItems whose `_id` is currently in the Favorites list.
6. THE App SHALL persist the Favorites list in AsyncStorage under the key `"favorites"` so that the Favorites list is preserved across app restarts.
7. IF no favorites have been saved, THEN THE App SHALL display an empty state message in the Favorites section of the Home screen.

---

### Requirement 8: Bottom Tab Navigation

**User Story:** As a user, I want to navigate between the main sections of the app using a bottom tab bar, so that I can switch between screens quickly and intuitively.

#### Acceptance Criteria

1. THE App SHALL implement a Bottom Tab Navigator using React Navigation v6 with five tabs: Home, Menu, Cart, Orders, and Profile.
2. THE App SHALL display the bottom tab bar on all main screens accessible from the Bottom Tab Navigator.
3. WHEN the user taps a tab, THE App SHALL navigate to the corresponding screen without resetting the screen's scroll position unless the user taps the active tab again.
4. THE App SHALL display a numeric badge on the Cart tab reflecting the current total item count in the user's cart, updating whenever the cart state changes.
5. WHILE the user is not authenticated, THE App SHALL restrict access to the Cart, Orders, and Profile tabs and redirect the user to the login screen when those tabs are tapped.

---

### Requirement 9: User Profile

**User Story:** As an authenticated user, I want to view my profile information and log out of the app, so that I can manage my account.

#### Acceptance Criteria

1. THE App SHALL display the authenticated user's name and email on the Profile screen, as returned by the login or registration API response.
2. THE App SHALL display a logout button on the Profile screen.
3. WHEN the user taps the logout button, THE App SHALL remove the JWT from AsyncStorage, clear all local cart state, suspend order status polling, and navigate the user to the login screen.

---

### Requirement 10: Home Screen

**User Story:** As a user, I want a home screen that highlights the menu and my saved favorites, so that I have a useful starting point when I open the app.

#### Acceptance Criteria

1. THE App SHALL display a header with the app logo and a search field on the Home screen.
2. WHEN the user enters text in the search field on the Home screen, THE App SHALL filter displayed FoodItems in real time to show only items whose name or category contains the entered text (case-insensitive).
3. THE App SHALL display a horizontally scrollable promotional banner or featured categories section on the Home screen.
4. THE App SHALL display the Favorites section (as defined in Requirement 7) below the promotional banner on the Home screen.
5. THE App SHALL display a section of all available FoodItems below the Favorites section on the Home screen.
