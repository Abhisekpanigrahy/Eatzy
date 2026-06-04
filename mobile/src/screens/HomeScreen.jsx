import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ErrorState        from '../components/ErrorState';
import FavoritesSection  from '../components/FavoritesSection';
import FoodCard          from '../components/FoodCard';
import LoadingSpinner    from '../components/LoadingSpinner';
import PromoBanner       from '../components/PromoBanner';
import { useFoods }      from '../context/FoodContext';

/* ─── Newsletter strip ───────────────────────────────────────────────────── */
const NewsletterStrip = ({ onPress }) => (
  <TouchableOpacity style={styles.newsletterStrip} onPress={onPress} activeOpacity={0.85}>
    <View style={{ flex: 1 }}>
      <Text style={styles.nlTitle}>Subscribe & get 20% off 🎁</Text>
      <Text style={styles.nlSub}>Join our food lovers community</Text>
    </View>
    <Text style={styles.nlArrow}>›</Text>
  </TouchableOpacity>
);

/* ─── Quick-links row (About / Delivery) ─────────────────────────────────── */
const QuickLinks = ({ onAbout, onDelivery }) => (
  <View style={styles.quickRow}>
    <TouchableOpacity style={styles.quickBtn} onPress={onAbout} activeOpacity={0.8}>
      <Text style={styles.quickIcon}>ℹ️</Text>
      <Text style={styles.quickLabel}>About</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.quickBtn} onPress={onDelivery} activeOpacity={0.8}>
      <Text style={styles.quickIcon}>🚚</Text>
      <Text style={styles.quickLabel}>Delivery</Text>
    </TouchableOpacity>
  </View>
);

/* ─── Policy badges ──────────────────────────────────────────────────────── */
const PolicyBadges = () => (
  <View style={styles.policyRow}>
    {[
      { icon: '⚡', label: 'Fast Delivery' },
      { icon: '🔄', label: 'Easy Reorder' },
      { icon: '🛡️', label: 'Safe & Fresh' },
      { icon: '💬', label: '24/7 Support' },
    ].map((p) => (
      <View key={p.label} style={styles.policyCard}>
        <Text style={styles.policyIcon}>{p.icon}</Text>
        <Text style={styles.policyLabel}>{p.label}</Text>
      </View>
    ))}
  </View>
);

/* ─── Main screen ────────────────────────────────────────────────────────── */
const HomeScreen = ({ navigation }) => {
  const { foods, loading, error, retryFetch } = useFoods();
  const [searchQuery, setSearchQuery] = useState('');

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
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* App header */}
            <View style={styles.header}>
              <Text style={styles.logo}>
                Eatzy<Text style={styles.dot}>.</Text>
              </Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search food…"
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>

            {/* Hero banner + category chips */}
            <PromoBanner
              onCategoryPress={(cat) => navigation.navigate('MenuTab', { screen: 'MenuMain', params: { category: cat } })}
            />

            {/* Policy badges */}
            <PolicyBadges />

            {/* Favorites row */}
            <FavoritesSection
              onFoodPress={handleFoodPress}
              onLoginRequired={handleLoginRequired}
            />

            {/* Newsletter */}
            <NewsletterStrip onPress={() => navigation.navigate('Newsletter')} />

            {/* Quick links */}
            <QuickLinks
              onAbout={() => navigation.navigate('About')}
              onDelivery={() => navigation.navigate('Delivery')}
            />

            {/* Section heading */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: '#FCFCFC' },
  list:  { padding: 16, paddingBottom: 32 },

  header:      { marginBottom: 20 },
  logo:        { fontSize: 30, fontWeight: '800', color: '#FF4C24', letterSpacing: -1, marginBottom: 12 },
  dot:         { color: '#49557E' },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e2e7',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#262626',
  },

  /* Policy */
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  policyCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  policyIcon:  { fontSize: 20, marginBottom: 4 },
  policyLabel: { fontSize: 10, fontWeight: '600', color: '#49557E', textAlign: 'center' },

  /* Newsletter */
  newsletterStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff4f2',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffd5c8',
  },
  nlTitle: { fontSize: 15, fontWeight: '700', color: '#FF4C24', marginBottom: 2 },
  nlSub:   { fontSize: 12, color: '#6b7280' },
  nlArrow: { fontSize: 24, color: '#FF4C24', fontWeight: '700' },

  /* Quick links */
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  quickIcon:  { fontSize: 20 },
  quickLabel: { fontSize: 14, fontWeight: '600', color: '#262626' },

  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#262626', marginBottom: 12, marginTop: 4 },
  row:      { justifyContent: 'space-between' },
  cardWrap: { width: '48%', marginBottom: 16 },
  empty:    { textAlign: 'center', color: '#676767', fontSize: 15, marginTop: 24 },
});

export default HomeScreen;
