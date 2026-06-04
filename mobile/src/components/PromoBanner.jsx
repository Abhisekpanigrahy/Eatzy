import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CATEGORIES = [
  { label: '🥗 Salad', color: '#e6f9f0' },
  { label: '🌯 Rolls', color: '#fff4e5' },
  { label: '🍰 Desserts', color: '#fce4ec' },
  { label: '🥪 Sandwich', color: '#e3f2fd' },
  { label: '🎂 Cake', color: '#f3e5f5' },
  { label: '🌿 Pure Veg', color: '#e8f5e9' },
  { label: '🍝 Pasta', color: '#fff8e1' },
  { label: '🍜 Noodles', color: '#e0f7fa' },
];

const PromoBanner = ({ onCategoryPress }) => (
  <View style={styles.wrapper}>
    <View style={styles.hero}>
      <Text style={styles.heroText}>Order your{'\n'}favourite food 🍔</Text>
      <Text style={styles.subText}>Fast delivery • Fresh ingredients</Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.label}
          style={[styles.chip, { backgroundColor: cat.color }]}
          onPress={() => onCategoryPress?.(cat.label.split(' ').slice(1).join(' '))}
        >
          <Text style={styles.chipText}>{cat.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  hero: {
    backgroundColor: '#FF4C24',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  heroText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 6,
  },
  subText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  scroll: {
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#262626',
  },
});

export default PromoBanner;
