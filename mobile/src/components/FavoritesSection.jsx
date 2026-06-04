import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useFoods } from '../context/FoodContext';
import FoodCard from './FoodCard';

const FavoritesSection = ({ onFoodPress, onLoginRequired }) => {
  const { favorites } = useFavorites();
  const { foods } = useFoods();

  const favoriteFoods = foods.filter((f) => favorites.includes(f._id));

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Your Favorites</Text>
      {favoriteFoods.length === 0 ? (
        <Text style={styles.empty}>No favorites saved yet. Tap ❤️ on any dish to save it.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {favoriteFoods.map((item) => (
            <View key={item._id} style={styles.cardWrapper}>
              <FoodCard
                item={item}
                onPress={() => onFoodPress?.(item)}
                onLoginRequired={onLoginRequired}
              />
            </View>
          ))}
        </ScrollView>
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
    fontWeight: '600',
    color: '#262626',
    marginBottom: 12,
  },
  empty: {
    color: '#676767',
    fontSize: 14,
    fontStyle: 'italic',
  },
  scroll: {
    paddingBottom: 4,
  },
  cardWrapper: {
    width: 200,
    marginRight: 14,
  },
});

export default FavoritesSection;
