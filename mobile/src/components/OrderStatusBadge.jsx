import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const STATUS_COLORS = {
  'food processing': { bg: '#FFF5F2', text: '#FF4C24' },
  'out for delivery': { bg: '#EBF3FE', text: '#1A73E8' },
  'delivered': { bg: '#E6F4EA', text: '#137333' },
};

const OrderStatusBadge = ({ status }) => {
  const normStatus = (status || '').toLowerCase();
  const colors = STATUS_COLORS[normStatus] || { bg: '#F1F3F4', text: '#5F6368' };
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
});

export default OrderStatusBadge;
