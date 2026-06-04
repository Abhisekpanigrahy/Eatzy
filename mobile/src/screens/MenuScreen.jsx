import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CategoryPill from '../components/CategoryPill';
import ErrorState from '../components/ErrorState';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFoods } from '../context/FoodContext';

const MenuScreen = ({ navigation, route }) => {
  const { foods, loading, error, retryFetch } = useFoods();

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(foods.map((f) => f.category))].sort();
    return ['All', ...cats];
  }, [foods]);

  const initialCategory = route?.params?.category || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredFoods = useMemo(() => {
    if (activeCategory === 'All') return foods;
    return foods.filter((f) => f.category === activeCategory);
  }, [foods, activeCategory]);

  const handleLoginRequired = () => navigation.navigate('Login');
  const handleFoodPress = (item) => navigation.navigate('FoodDetail', { item });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={retryFetch} />;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Category filter bar */}
      <View style={styles.filterBar}>
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
          <Text style={styles.heading}>
            {activeCategory === 'All' ? 'All Dishes' : activeCategory}
            {'  '}
            <Text style={styles.count}>({filteredFoods.length})</Text>
          </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FCFCFC' },
  filterBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 10,
  },
  pills: { paddingHorizontal: 16 },
  list: { padding: 16, paddingBottom: 32 },
  heading: { fontSize: 20, fontWeight: '600', color: '#262626', marginBottom: 14 },
  count: { fontSize: 15, fontWeight: '400', color: '#676767' },
  row: { justifyContent: 'space-between' },
  cardWrap: { width: '48%', marginBottom: 16 },
  empty: { textAlign: 'center', color: '#676767', fontSize: 15, marginTop: 24 },
});

export default MenuScreen;
