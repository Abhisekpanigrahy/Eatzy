import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AboutScreen      from '../screens/AboutScreen';
import DeliveryScreen   from '../screens/DeliveryScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import HomeScreen       from '../screens/HomeScreen';
import NewsletterScreen from '../screens/NewsletterScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain"    component={HomeScreen} />
    <Stack.Screen name="FoodDetail"  component={FoodDetailScreen} />
    <Stack.Screen name="About"       component={AboutScreen} />
    <Stack.Screen name="Delivery"    component={DeliveryScreen} />
    <Stack.Screen name="Newsletter"  component={NewsletterScreen} />
  </Stack.Navigator>
);

export default HomeStack;
