import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AboutScreen       from '../screens/AboutScreen';
import DeliveryScreen    from '../screens/DeliveryScreen';
import NewsletterScreen  from '../screens/NewsletterScreen';
import ProfileScreen     from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle:            { backgroundColor: '#fff' },
  headerTintColor:        '#FF4C24',
  headerTitleStyle:       { color: '#262626', fontWeight: '700' },
  headerBackTitle:        '',
  headerShadowVisible:    false,
};

const ProfileStack = () => (
  <Stack.Navigator screenOptions={headerOptions}>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: 'My Profile' }}
    />
    <Stack.Screen
      name="About"
      component={AboutScreen}
      options={{ title: 'About Eatzy' }}
    />
    <Stack.Screen
      name="Delivery"
      component={DeliveryScreen}
      options={{ title: 'Delivery Info' }}
    />
    <Stack.Screen
      name="Newsletter"
      component={NewsletterScreen}
      options={{ title: 'Newsletter' }}
    />
  </Stack.Navigator>
);

export default ProfileStack;
