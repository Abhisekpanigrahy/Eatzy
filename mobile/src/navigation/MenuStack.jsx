import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BackButton       from '../components/BackButton';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import MenuScreen       from '../screens/MenuScreen';

const Stack = createNativeStackNavigator();

const screenOptions = ({ navigation }) => ({
  headerStyle:         { backgroundColor: '#fff' },
  headerTintColor:     '#FF4C24',
  headerTitleStyle:    { color: '#262626', fontWeight: '700', fontSize: 17 },
  headerShadowVisible: false,
  headerBackVisible:   false,
  headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
});

const MenuStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="MenuMain"   component={MenuScreen}       options={{ title: 'Menu' }} />
    <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ title: 'Dish Details' }} />
  </Stack.Navigator>
);

export default MenuStack;
