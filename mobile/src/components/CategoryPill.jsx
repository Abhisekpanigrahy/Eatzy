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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: '#FF4C24',
    borderColor: '#FF4C24',
    shadowColor: '#FF4C24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
  labelActive: {
    color: '#fff',
    fontWeight: '800',
  },
});

export default CategoryPill;
