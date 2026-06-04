import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrdersScreen from '../screens/OrdersScreen';

const Stack = createNativeStackNavigator();

const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle:         { backgroundColor: '#fff' },
      headerTintColor:     '#FF4C24',
      headerTitleStyle:    { color: '#262626', fontWeight: '700' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen name="OrdersMain" component={OrdersScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default OrdersStack;
