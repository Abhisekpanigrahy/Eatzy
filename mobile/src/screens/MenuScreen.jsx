import React, { useMemo, useState, useEffect } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryPill from '../components/CategoryPill';
import ErrorState from '../components/ErrorState';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFoods } from '../context/FoodContext';

const MenuScreen = ({ navigation, route }) => {
  const { foods, loading, error, retryFetch } = useFoods();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(foods.map((f) => f.category))].sort();
    return ['All', ...cats];
  }, [foods]);

  const [activeCategory, setActiveCategory] = useState('All');

  // Sync activeCategory with route params when they change
  useEffect(() => {
    if (route?.params?.category) {
      setActiveCategory(route.params.category);
    }
  }, [route?.params?.category]);

  const filteredFoods = useMemo(() => {
    if (activeCategory === 'All') return foods;
    return foods.filter((f) => f.category === activeCategory);
  }, [foods, activeCategory]);

  const handleLoginRequired = () => navigation.navigate('Login');
  const handleFoodPress = (item) => navigation.navigate('FoodDetail', { item });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={retryFetch} />;

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* Category filter bar */}
      <View style={[styles.filterBar, { marginTop: 10 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>
              {activeCategory === 'All' ? 'Explore Everything' : activeCategory}
            </Text>
            <Text style={styles.countText}>{filteredFoods.length} items found</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No dishes in this category.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <FoodCard
              item={item}
              onPress={() => handleFoodPress(item)}
              onLoginRequired={handleLoginRequired}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  filterBar: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pills: { paddingHorizontal: 16 },
  list: { padding: 16, paddingBottom: 100 },
  header: {
    marginBottom: 20,
  },
  heading: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#1F2937', 
    letterSpacing: -0.5,
  },
  countText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  row: { justifyContent: 'space-between' },
  cardWrap: { width: '48%', marginBottom: 16 },
  empty: { textAlign: 'center', color: '#6B7280', fontSize: 16, marginTop: 40, fontWeight: '600' },
});

export default MenuScreen;
