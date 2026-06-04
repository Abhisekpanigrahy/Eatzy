import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import MenuScreen       from '../screens/MenuScreen';

const Stack = createNativeStackNavigator();

const MenuStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MenuMain"   component={MenuScreen} />
    <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
  </Stack.Navigator>
);

export default MenuStack;
