import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ErrorState        from '../components/ErrorState';
import FavoritesSection  from '../components/FavoritesSection';
import FoodCard          from '../components/FoodCard';
import LoadingSpinner    from '../components/LoadingSpinner';
import PromoBanner       from '../components/PromoBanner';
import { useFoods }      from '../context/FoodContext';

/* ─── Premium Header ────────────────────────────────────────────────────── */
const HomeHeader = ({ searchQuery, setSearchQuery }) => (
  <View style={styles.headerContainer}>
    <View style={styles.locationRow}>
      <View>
        <Text style={styles.deliveryLabel}>Delivery to</Text>
        <View style={styles.addressRow}>
          <Text style={styles.addressText}>Your Home, Surat</Text>
          <Text style={styles.downArrow}>▼</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.profileIconWrap}>
        <Text style={styles.profileEmoji}>👤</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInputPremium}
        placeholder="Search for 'Pizza' or 'Burger'"
        placeholderTextColor="#9ca3af"
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
      />
      <View style={styles.searchDivider} />
      <Text style={styles.micIcon}>🎙️</Text>
    </View>
  </View>
);

/* ─── Newsletter strip ───────────────────────────────────────────────────── */
const NewsletterStrip = ({ onPress }) => (
  <TouchableOpacity style={styles.newsletterStrip} onPress={onPress} activeOpacity={0.85}>
    <View style={{ flex: 1 }}>
      <Text style={styles.nlTitle}>Subscribe & get 20% off 🎁</Text>
      <Text style={styles.nlSub}>Join our food lovers community</Text>
    </View>
    <View style={styles.nlAction}>
      <Text style={styles.nlArrow}>›</Text>
    </View>
  </TouchableOpacity>
);

/* ─── Main screen ────────────────────────────────────────────────────────── */
const HomeScreen = ({ navigation }) => {
  const { foods, loading, error, retryFetch } = useFoods();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const filteredFoods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q),
    );
  }, [foods, searchQuery]);

  const handleLoginRequired = () => navigation.navigate('Login');
  const handleFoodPress     = (item) => navigation.navigate('FoodDetail', { item });

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorState message={error} onRetry={retryFetch} />;

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <HomeHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <PromoBanner
              onCategoryPress={(cat) => navigation.navigate('MenuTab', { screen: 'MenuMain', params: { category: cat } })}
            />

            <FavoritesSection
              onFoodPress={handleFoodPress}
              onLoginRequired={handleLoginRequired}
            />

            <NewsletterStrip onPress={() => navigation.navigate('Newsletter')} />

            <Text style={styles.sectionTitle}>
              {searchQuery ? `Results for "${searchQuery}"` : 'All Dishes'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No dishes found.</Text>
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
  safe:  { flex: 1, backgroundColor: '#FFF' },
  list:  { padding: 16, paddingBottom: 32 },

  /* Premium Header */
  headerContainer: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#FF4C24',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  addressText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d2d2d',
  },
  downArrow: {
    fontSize: 10,
    color: '#2d2d2d',
    marginLeft: 4,
    marginTop: 2,
  },
  profileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  profileEmoji: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInputPremium: {
    flex: 1,
    fontSize: 15,
    color: '#2d2d2d',
    height: '100%',
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  micIcon: {
    fontSize: 18,
    color: '#FF4C24',
  },

  /* Newsletter */
  newsletterStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fee2e2',
    shadowColor: '#FF4C24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  nlTitle: { fontSize: 16, fontWeight: '800', color: '#2d2d2d', marginBottom: 2 },
  nlSub:   { fontSize: 13, color: '#6b7280' },
  nlAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nlArrow: { fontSize: 20, color: '#FF4C24', fontWeight: '700' },

  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#2d2d2d', marginBottom: 16, marginTop: 4 },
  row:      { justifyContent: 'space-between' },
  cardWrap: { width: '48%', marginBottom: 16 },
  empty:    { textAlign: 'center', color: '#676767', fontSize: 15, marginTop: 24 },
});

export default HomeScreen;
