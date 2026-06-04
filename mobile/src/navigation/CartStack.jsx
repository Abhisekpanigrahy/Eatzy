import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BackButton          from '../components/BackButton';
import CartScreen          from '../screens/CartScreen';
import CheckoutScreen      from '../screens/CheckoutScreen';
import StripeWebViewScreen from '../screens/StripeWebViewScreen';

const Stack = createNativeStackNavigator();

const screenOptions = ({ navigation }) => ({
  headerStyle:         { backgroundColor: '#fff' },
  headerTintColor:     '#FF4C24',
  headerTitleStyle:    { color: '#262626', fontWeight: '700', fontSize: 17 },
  headerShadowVisible: false,
  headerBackVisible:   false,
  headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
});

const CartStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="CartMain"     component={CartScreen}          options={{ title: 'My Cart' }} />
    <Stack.Screen name="Checkout"     component={CheckoutScreen}      options={{ title: 'Checkout' }} />
    <Stack.Screen
      name="StripeWebView"
      component={StripeWebViewScreen}
      options={{ title: 'Secure Payment', presentation: 'modal' }}
    />
  </Stack.Navigator>
);

export default CartStack;
