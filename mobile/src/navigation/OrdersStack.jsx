import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BackButton   from '../components/BackButton';
import OrdersScreen from '../screens/OrdersScreen';

const Stack = createNativeStackNavigator();

const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      headerStyle:         { backgroundColor: '#fff' },
      headerTintColor:     '#FF4C24',
      headerTitleStyle:    { color: '#262626', fontWeight: '700', fontSize: 17 },
      headerShadowVisible: false,
      headerBackVisible:   false,
      headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
    })}
  >
    <Stack.Screen name="OrdersMain" component={OrdersScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default OrdersStack;
