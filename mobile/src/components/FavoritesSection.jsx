import React, { useState, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useFoods } from '../context/FoodContext';
import FoodCard from './FoodCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 220; // Adjusted for better dot visibility

const FavoritesSection = ({ onFoodPress, onLoginRequired }) => {
  const { favorites } = useFavorites();
  const { foods } = useFoods();
  const [activeIndex, setActiveIndex] = useState(0);

  const favoriteFoods = foods.filter((f) => favorites.includes(f._id));

  const onScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / (CARD_WIDTH + 14));
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Your Favorites</Text>
      {favoriteFoods.length === 0 ? (
        <Text style={styles.empty}>No favorites saved yet. Tap ❤️ on any dish to save it.</Text>
      ) : (
        <View>
          <FlatList
            horizontal
            data={favoriteFoods}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            onScroll={onScroll}
            scrollEventThrottle={16}
            snapToInterval={CARD_WIDTH + 14}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <FoodCard
                  item={item}
                  onPress={() => onFoodPress?.(item)}
                  onLoginRequired={onLoginRequired}
                />
              </View>
            )}
          />
          {/* Pagination dots */}
          <View style={styles.pagination}>
            {favoriteFoods.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  activeIndex === i ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  empty: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    paddingLeft: 4,
  },
  scroll: {
    paddingBottom: 12,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#FF4C24',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#e5e7eb',
  },
});

export default FavoritesSection;
