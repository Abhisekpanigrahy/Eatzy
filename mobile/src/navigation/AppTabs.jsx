import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartBadge from '../components/CartBadge';
import { useAuth } from '../context/AuthContext';
import CartStack from './CartStack';
import HomeStack from './HomeStack';
import MenuStack from './MenuStack';
import OrdersStack from './OrdersStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const BRAND = '#FF4C24';
const INACTIVE = '#9ca3af';

// Premium Icon component
const TabIcon = ({ type, label, focused }) => {
  const getIcon = () => {
    switch (type) {
      case 'home':    return focused ? '🏠' : '🏠';
      case 'menu':    return focused ? '📋' : '📋';
      case 'cart':    return focused ? '🛒' : '🛒';
      case 'orders':  return focused ? '🛍️' : '🛍️';
      case 'profile': return focused ? '👤' : '👤';
      default:        return '❓';
    }
  };

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={[styles.iconSymbol, { opacity: focused ? 1 : 0.6, fontSize: focused ? 22 : 20 }]}>
        {getIcon()}
      </Text>
      <Text style={[styles.iconLabel, { color: focused ? BRAND : INACTIVE, fontWeight: focused ? '800' : '600' }]}>
        {label}
      </Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
};

const AppTabs = () => {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          }
        ],
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon type="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon type="menu" label="Menu" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon type="cart" label="Cart" focused={focused} />
              <CartBadge />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!token) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon type="orders" label="Orders" focused={focused} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!token) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon type="profile" label="Profile" focused={focused} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!token) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    paddingTop: 12,
    elevation: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -10 },
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: '100%',
  },
  iconWrapActive: {
    // Optional: add a slight background or scale effect
  },
  iconSymbol: {
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BRAND,
  }
});

export default AppTabs;
