import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CartScreen          from '../screens/CartScreen';
import CheckoutScreen      from '../screens/CheckoutScreen';
import StripeWebViewScreen from '../screens/StripeWebViewScreen';

const Stack = createNativeStackNavigator();

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartMain"     component={CartScreen} />
    <Stack.Screen name="Checkout"     component={CheckoutScreen} />
    <Stack.Screen
      name="StripeWebView"
      component={StripeWebViewScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

export default CartStack;
