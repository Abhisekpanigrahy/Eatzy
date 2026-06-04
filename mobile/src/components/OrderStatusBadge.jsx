import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const STATUS_COLORS = {
  'Food Processing': { bg: '#fff4e5', text: '#e68a00' },
  'Out for Delivery': { bg: '#e5f0ff', text: '#1a62d4' },
  'Delivered': { bg: '#e6f9f0', text: '#1a9e5c' },
};

const OrderStatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || { bg: '#f0f0f0', text: '#555' };
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OrderStatusBadge;
