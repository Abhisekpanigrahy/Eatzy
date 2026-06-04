import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';

const CATEGORIES = [
  { label: 'Salad', emoji: '🥗', color: '#E8F5E9' },
  { label: 'Rolls', emoji: '🌯', color: '#FFF3E0' },
  { label: 'Desserts', emoji: '🍰', color: '#FCE4EC' },
  { label: 'Sandwich', emoji: '🥪', color: '#E3F2FD' },
  { label: 'Cake', emoji: '🎂', color: '#F3E5F5' },
  { label: 'Pure Veg', emoji: '🌿', color: '#E8F5E9' },
  { label: 'Pasta', emoji: '🍝', color: '#FFF8E1' },
  { label: 'Noodles', emoji: '🍜', color: '#E0F7FA' },
];

const PromoBanner = ({ onCategoryPress }) => (
  <View style={styles.wrapper}>
    <TouchableOpacity activeOpacity={0.95} style={styles.hero}>
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>Craving something{'\n'}delicious? 🍔</Text>
        <Text style={styles.heroSub}>Get up to 50% OFF on your first order</Text>
        <TouchableOpacity style={styles.orderNowBtn}>
          <Text style={styles.orderNowText}>Order Now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.heroBadge}>
        <Text style={styles.badgeText}>50% OFF</Text>
      </View>
    </TouchableOpacity>

    <Text style={styles.sectionTitle}>What's on your mind?</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.label}
          style={styles.categoryItem}
          onPress={() => onCategoryPress?.(cat.label)}
        >
          <View style={[styles.emojiCircle, { backgroundColor: cat.color }]}>
            <Text style={styles.emojiText}>{cat.emoji}</Text>
          </View>
          <Text style={styles.catLabel}>{cat.label}</Text>
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
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#FF4C24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
  orderNowBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  orderNowText: {
    color: '#FF4C24',
    fontWeight: '800',
    fontSize: 12,
  },
  heroBadge: {
    position: 'absolute',
    right: -10,
    top: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    transform: [{ rotate: '45deg' }],
  },
  badgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d2d2d',
    marginBottom: 16,
  },
  scroll: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emojiText: {
    fontSize: 32,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
  },
});

export default PromoBanner;
