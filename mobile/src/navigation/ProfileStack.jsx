import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AboutScreen       from '../screens/AboutScreen';
import DeliveryScreen    from '../screens/DeliveryScreen';
import NewsletterScreen  from '../screens/NewsletterScreen';
import ProfileScreen     from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="About"       component={AboutScreen} />
    <Stack.Screen name="Delivery"    component={DeliveryScreen} />
    <Stack.Screen name="Newsletter"  component={NewsletterScreen} />
  </Stack.Navigator>
);

export default ProfileStack;
