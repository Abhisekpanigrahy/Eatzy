import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BackButton       from '../components/BackButton';
import AboutScreen      from '../screens/AboutScreen';
import DeliveryScreen   from '../screens/DeliveryScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import HomeScreen       from '../screens/HomeScreen';
import NewsletterScreen from '../screens/NewsletterScreen';

const Stack = createNativeStackNavigator();

const screenOptions = ({ navigation }) => ({
  headerStyle:         { backgroundColor: '#fff' },
  headerTintColor:     '#FF4C24',
  headerTitleStyle:    { color: '#262626', fontWeight: '700', fontSize: 17 },
  headerShadowVisible: false,
  headerBackVisible:   false,
  headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
});

const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="HomeMain"    component={HomeScreen}       options={{ headerShown: false }} />
    <Stack.Screen name="FoodDetail"  component={FoodDetailScreen} options={{ title: 'Dish Details' }} />
    <Stack.Screen name="About"       component={AboutScreen}      options={{ title: 'About Eatzy' }} />
    <Stack.Screen name="Delivery"    component={DeliveryScreen}   options={{ title: 'Delivery Info' }} />
    <Stack.Screen name="Newsletter"  component={NewsletterScreen} options={{ title: 'Newsletter' }} />
  </Stack.Navigator>
);

export default HomeStack;
