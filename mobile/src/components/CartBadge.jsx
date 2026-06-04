import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCart } from '../context/CartContext';

/**
 * Numeric badge overlay for the Cart tab icon.
 * Must be placed inside a View with position:relative.
 */
const CartBadge = () => {
  const { cartItemCount } = useCart();
  if (!cartItemCount) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{cartItemCount > 99 ? '99+' : String(cartItemCount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4C24',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    zIndex: 99,
  },
  text: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
});

export default CartBadge;
