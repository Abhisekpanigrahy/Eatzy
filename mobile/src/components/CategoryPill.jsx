import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const CategoryPill = ({ label, active = false, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, active && styles.pillActive]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
  >
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e2e7',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: '#FF4C24',
    borderColor: '#FF4C24',
  },
  label: {
    fontSize: 14,
    color: '#49557E',
    whiteSpace: 'nowrap',
  },
  labelActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CategoryPill;
