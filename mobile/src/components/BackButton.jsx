import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import BackArrow from './BackArrow';

/**
 * Reusable wide orange back arrow — no circle, just the chevron with generous hit area.
 * Usage: <BackButton onPress={() => navigation.goBack()} />
 */
const BackButton = ({ onPress, style }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.btn, style]}
    activeOpacity={0.6}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 20 }}
    accessibilityRole="button"
    accessibilityLabel="Go back"
  >
    <BackArrow />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
});

export default BackButton;
