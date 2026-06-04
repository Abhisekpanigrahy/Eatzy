import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import apiClient          from '../api/apiClient';
import { getFoodImageUrl } from '../api/foodApi';
import { useAuth }         from '../context/AuthContext';
import { useCart }         from '../context/CartContext';
import { useFavorites }    from '../context/FavoritesContext';

/* ── star rating picker ─────────────────────────────────────────── */
const StarPicker = ({ value, onChange }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((n) => (
      <TouchableOpacity key={n} onPress={() => onChange(n)}>
        <Text style={[styles.star, n <= value && styles.starFilled]}>★</Text>
      </TouchableOpacity>
    ))}
  </View>
);

/* ── single review card ─────────────────────────────────────────── */
const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewUser}>{review.userName || 'Anonymous'}</Text>
      <Text style={styles.reviewStars}>{'★'.repeat(review.rating)}</Text>
      <Text style={styles.reviewDate}>
        {review.date ? new Date(review.date).toLocaleDateString() : ''}
      </Text>
    </View>
    <Text style={styles.reviewText}>{review.text}</Text>
  </View>
);

/* ── main screen ─────────────────────────────────────────────────── */
const FoodDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { token, user }  = useAuth();
  const { cartData, addToCart, removeFromCart } = useCart();
  const { isFavorite, toggleFavorite }          = useFavorites();

  const [reviews, setReviews]       = useState(item.reviews || []);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating]         = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const qty       = cartData[item._id] || 0;
  const favorited = isFavorite(item._id);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  /* load fresh reviews on mount */
  useEffect(() => {
    apiClient.get(`/api/food/${item._id}`)
      .then((res) => { if (res.data.success) setReviews(res.data.data.reviews || []); })
      .catch(() => {});
  }, [item._id]);

  const handleAdd    = () => { if (!token) { navigation.navigate('Login'); return; } addToCart(item._id); };
  const handleRemove = () => removeFromCart(item._id);

  const submitReview = async () => {
    if (!token) { navigation.navigate('Login'); return; }
    if (!reviewText.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post('/api/food/review', {
        foodId:   item._id,
        rating,
        text:     reviewText.trim(),
        userName: user?.name || 'You',
      });
      if (res.data.success) {
        setReviews(res.data.data.reviews || []);
        setReviewText('');
        setRating(5);
      } else {
        Alert.alert('Error', res.data.message || 'Failed to submit review');
      }
    } catch {
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Food image */}
          <Image
            source={{ uri: getFoodImageUrl(item.image) }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.body}>
            {/* Title row */}
            <View style={styles.titleRow}>
              <Text style={styles.name}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item._id)}>
                <Text style={styles.heart}>{favorited ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.category}>{item.category}</Text>

            {/* Rating summary */}
            <View style={styles.ratingRow}>
              <Text style={styles.ratingValue}>{avgRating}</Text>
              <Text style={styles.ratingStars}>{'★'.repeat(Math.round(Number(avgRating)))}</Text>
              <Text style={styles.ratingCount}>({reviews.length} reviews)</Text>
            </View>

            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>${item.price}</Text>

            {/* Add to cart / counter */}
            <View style={styles.actions}>
              {qty === 0 ? (
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                  <Text style={styles.addBtnText}>Add to Cart</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.counter}>
                  <TouchableOpacity style={styles.counterBtn} onPress={handleRemove}>
                    <Text style={styles.counterBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qty}>{qty}</Text>
                  <TouchableOpacity style={styles.counterBtn} onPress={handleAdd}>
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Reviews section */}
            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsTitle}>Customer Reviews</Text>

              {/* Write review */}
              <View style={styles.writeReview}>
                <Text style={styles.writeLabel}>Your Rating</Text>
                <StarPicker value={rating} onChange={setRating} />
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Share your experience with this dish…"
                  placeholderTextColor="#bbb"
                  multiline
                  numberOfLines={3}
                  value={reviewText}
                  onChangeText={setReviewText}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                  onPress={submitReview}
                  disabled={submitting}
                >
                  <Text style={styles.submitBtnText}>
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
              ) : (
                reviews.map((r, i) => <ReviewCard key={i} review={r} />)
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 280 },
  body:  { padding: 20 },

  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 6,
  },
  name:  { fontSize: 24, fontWeight: '700', color: '#262626', flex: 1, marginRight: 12 },
  heart: { fontSize: 26 },

  category: {
    fontSize: 12, color: '#FF4C24', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  ratingValue: { fontSize: 16, fontWeight: '700', color: '#262626' },
  ratingStars: { fontSize: 14, color: '#f59e0b' },
  ratingCount: { fontSize: 13, color: '#9ca3af' },

  description: { fontSize: 15, color: '#676767', lineHeight: 22, marginBottom: 16 },
  price:       { fontSize: 28, fontWeight: '700', color: '#FF4C24', marginBottom: 24 },

  actions: { alignItems: 'flex-start', marginBottom: 32 },
  addBtn: {
    backgroundColor: '#FF4C24', paddingVertical: 14,
    paddingHorizontal: 36, borderRadius: 50,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  counter: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FF4C24', borderRadius: 50, overflow: 'hidden',
  },
  counterBtn: { paddingVertical: 12, paddingHorizontal: 20 },
  counterBtnText: { fontSize: 22, color: '#FF4C24', fontWeight: '700' },
  qty: { fontSize: 18, fontWeight: '600', color: '#262626', paddingHorizontal: 12 },

  /* Reviews */
  reviewsSection: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 24 },
  reviewsTitle:   { fontSize: 18, fontWeight: '700', color: '#262626', marginBottom: 16 },

  writeReview: {
    backgroundColor: '#fafafa', borderRadius: 14,
    padding: 16, marginBottom: 20,
  },
  writeLabel: { fontSize: 13, fontWeight: '600', color: '#49557E', marginBottom: 8 },

  starRow:    { flexDirection: 'row', gap: 6, marginBottom: 14 },
  star:       { fontSize: 28, color: '#d1d5db' },
  starFilled: { color: '#f59e0b' },

  reviewInput: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10,
    padding: 12, fontSize: 14, color: '#262626',
    minHeight: 80, marginBottom: 14,
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#FF4C24', borderRadius: 50,
    padding: 12, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  reviewCard: {
    backgroundColor: '#fff4f2', borderRadius: 12,
    padding: 14, marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 6,
  },
  reviewUser:  { fontSize: 13, fontWeight: '700', color: '#262626', flex: 1 },
  reviewStars: { fontSize: 13, color: '#f59e0b' },
  reviewDate:  { fontSize: 11, color: '#9ca3af' },
  reviewText:  { fontSize: 13, color: '#374151', lineHeight: 20 },
  noReviews:   { color: '#9ca3af', fontSize: 14, textAlign: 'center', marginTop: 8 },
});

export default FoodDetailScreen;
