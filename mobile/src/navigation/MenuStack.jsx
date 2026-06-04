import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import MenuScreen       from '../screens/MenuScreen';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle:         { backgroundColor: '#fff' },
  headerTintColor:     '#FF4C24',
  headerTitleStyle:    { color: '#262626', fontWeight: '700' },
  headerBackTitle:     '',
  headerShadowVisible: false,
};

const MenuStack = () => (
  <Stack.Navigator screenOptions={headerOptions}>
    <Stack.Screen name="MenuMain"   component={MenuScreen}       options={{ title: 'Menu' }} />
    <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ title: 'Dish Details' }} />
  </Stack.Navigator>
);

export default MenuStack;
