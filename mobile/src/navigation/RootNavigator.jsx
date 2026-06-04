import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AppTabs from './AppTabs';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  // Always show AppTabs — individual tabs protect themselves via listeners.
  // Login / Register are pushed on top of the tabs as modal-style screens.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="App" component={AppTabs} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
