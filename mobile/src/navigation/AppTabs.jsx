import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

// Clean icon component using Unicode symbols — no extra library needed
const TabIcon = ({ symbol, label, focused }) => (
  <View style={styles.iconWrap}>
    <Text style={[styles.iconSymbol, { color: focused ? BRAND : INACTIVE }]}>
      {symbol}
    </Text>
    <Text style={[styles.iconLabel, { color: focused ? BRAND : INACTIVE }]}>
      {label}
    </Text>
  </View>
);

// Tab icon symbols (clean, system-font glyphs)
const ICONS = {
  home:    '⌂',
  menu:    '▦',
  cart:    '⊞',
  orders:  '◫',
  profile: '◯',
};

const AppTabs = () => {
  const { token } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol={ICONS.home} label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol={ICONS.menu} label="Menu" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon symbol={ICONS.cart} label="Cart" focused={focused} />
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
            <TabIcon symbol={ICONS.orders} label="Orders" focused={focused} />
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
            <TabIcon symbol={ICONS.profile} label="Profile" focused={focused} />
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
    borderTopColor: '#f0f0f0',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 6,
    paddingTop: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSymbol: {
    fontSize: 24,
    lineHeight: 28,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
    letterSpacing: 0.3,
  },
});

export default AppTabs;
