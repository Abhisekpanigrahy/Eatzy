import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CartScreen         from '../screens/CartScreen';
import CheckoutScreen     from '../screens/CheckoutScreen';
import StripeWebViewScreen from '../screens/StripeWebViewScreen';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle:         { backgroundColor: '#fff' },
  headerTintColor:     '#FF4C24',
  headerTitleStyle:    { color: '#262626', fontWeight: '700' },
  headerBackTitle:     '',
  headerShadowVisible: false,
};

const CartStack = () => (
  <Stack.Navigator screenOptions={headerOptions}>
    <Stack.Screen name="CartMain"  component={CartScreen}      options={{ title: 'My Cart' }} />
    <Stack.Screen name="Checkout"  component={CheckoutScreen}  options={{ title: 'Checkout' }} />
    <Stack.Screen
      name="StripeWebView"
      component={StripeWebViewScreen}
      options={{ title: 'Payment', presentation: 'modal' }}
    />
  </Stack.Navigator>
);

export default CartStack;
