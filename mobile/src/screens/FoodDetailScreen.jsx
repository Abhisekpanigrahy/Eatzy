import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiClient          from '../api/apiClient';
import { getFoodImageUrl } from '../api/foodApi';
import { useAuth }         from '../context/AuthContext';
import { useCart }         from '../context/CartContext';
import { useFavorites }    from '../context/FavoritesContext';
import BackArrow from '../components/BackArrow';

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
const ReviewCard = ({ review }) => {
  const formatDateWithTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          {review.userImage ? (
            <Image source={{ uri: review.userImage }} style={styles.avatarImgSmall} />
          ) : (
            <Text style={styles.avatarTextSmall}>{review.userName?.charAt(0) || 'A'}</Text>
          )}
        </View>
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewUser}>{review.userName || 'Customer'}</Text>
          <Text style={styles.reviewDate}>
            {formatDateWithTime(review.date)}
          </Text>
        </View>
        <View style={styles.reviewRatingBadge}>
          <Text style={styles.badgeStars}>{review.rating} ★</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  );
};

/* ── main screen ─────────────────────────────────────────────────── */
const FoodDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { token, user }  = useAuth();
  const { cartData, addToCart, removeFromCart } = useCart();
  const { isFavorite, toggleFavorite }          = useFavorites();
  const insets = useSafeAreaInsets();

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
        foodId: item._id,
        rating,
        text: reviewText.trim(),
        userName: user?.name,
        userImage: user?.image,
      });
      if (res.data.success) {
        setReviews(res.data.data.reviews || []);
        setReviewText('');
        setRating(5);
        Alert.alert('Review Submitted', 'Thank you for your feedback!');
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
    <View style={styles.main}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* Header Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getFoodImageUrl(item.image) }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={[styles.headerOverlay, { paddingTop: insets.top || 20 }]}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <BackArrow />
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundBtn} onPress={() => toggleFavorite(item._id)}>
                <Text style={styles.btnIcon}>{favorited ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.mainCard}>
              <View style={styles.titleRow}>
                <View style={styles.titleContent}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.category}>{item.category}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingVal}>{avgRating} ★</Text>
                  <Text style={styles.ratingTotal}>{reviews.length} reviews</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>⏲️</Text>
                  <Text style={styles.infoText}>25 mins</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>💰</Text>
                  <Text style={styles.infoText}>${item.price}</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>🥗</Text>
                  <Text style={styles.infoText}>Veg</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this dish</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            {/* Reviews section */}
            <View style={styles.reviewsContainer}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Customer Reviews</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              </View>

              {/* Write review */}
              <View style={styles.writeReviewCard}>
                <Text style={styles.writeTitle}>Rate your experience</Text>
                <StarPicker value={rating} onChange={setRating} />
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Share your thoughts about this dish..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  value={reviewText}
                  onChangeText={setReviewText}
                />
                <TouchableOpacity
                  style={[styles.submitBtn, (!reviewText.trim() || submitting) && styles.submitBtnDisabled]}
                  onPress={submitReview}
                  disabled={!reviewText.trim() || submitting}
                >
                  <Text style={styles.submitBtnText}>
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <View style={styles.emptyReviews}>
                  <Text style={styles.emptyEmoji}>⭐</Text>
                  <Text style={styles.emptyText}>No reviews yet. Be the first to share your experience!</Text>
                </View>
              ) : (
                reviews.slice(0, 3).map((r, i) => <ReviewCard key={i} review={r} />)
              )}
            </View>
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Floating Bottom Bar */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
          <View style={styles.priceContainer}>
            <Text style={styles.bottomPrice}>${item.price}</Text>
            <Text style={styles.taxLabel}>inclusive of all taxes</Text>
          </View>
          
          {qty === 0 ? (
            <TouchableOpacity style={styles.addMainBtn} onPress={handleAdd}>
              <Text style={styles.addMainText}>ADD TO CART</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.mainCounter}>
              <TouchableOpacity style={styles.counterAction} onPress={handleRemove}>
                <Text style={styles.counterIcon}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{qty}</Text>
              <TouchableOpacity style={styles.counterAction} onPress={handleAdd}>
                <Text style={styles.counterIcon}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#f9fafb' },
  imageContainer: { height: 320, position: 'relative' },
  image: { width: '100%', height: '100%' },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  backBtn: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  btnIcon: { fontSize: 20, color: '#FF4C24', fontWeight: 'bold' },

  content: { marginTop: -30, paddingHorizontal: 16 },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 24,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleContent: { flex: 1 },
  name: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', marginBottom: 4 },
  category: { fontSize: 14, fontWeight: '700', color: '#FF4C24', textTransform: 'uppercase' },
  ratingBadge: { backgroundColor: '#2d7d32', padding: 8, borderRadius: 12, alignItems: 'center' },
  ratingVal: { fontSize: 16, fontWeight: '900', color: '#fff' },
  ratingTotal: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 2 },
  
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 16 },
  
  infoRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  infoItem: { alignItems: 'center' },
  infoIcon: { fontSize: 18, marginBottom: 4 },
  infoText: { fontSize: 12, fontWeight: '800', color: '#4b5563' },
  infoDivider: { width: 1, height: 30, backgroundColor: '#f3f4f6' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1a1a1a', marginBottom: 12 },
  description: { fontSize: 15, color: '#4b5563', lineHeight: 24, fontWeight: '500' },

  reviewsContainer: {},
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAll: { fontSize: 14, fontWeight: '800', color: '#FF4C24' },
  
  writeReviewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  writeTitle: { fontSize: 15, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 },
  starRow: { flexDirection: 'row', marginBottom: 16 },
  star: { fontSize: 32, color: '#e5e7eb', marginRight: 4 },
  starFilled: { color: '#fbbf24' },
  reviewInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    height: 80,
    fontSize: 14,
    color: '#1a1a1a',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: '#FF4C24',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#fca5a5' },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4C24',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  avatarImgSmall: {
    width: '100%',
    height: '100%',
  },
  avatarTextSmall: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  reviewInfo: { flex: 1 },
  reviewUser: { fontSize: 15, fontWeight: '900', color: '#1a1a1a' },
  reviewDate: { fontSize: 11, color: '#9ca3af', fontWeight: '700', marginTop: 2 },
  reviewRatingBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  badgeStars: { fontSize: 13, fontWeight: '900', color: '#FF4C24' },
  reviewText: { fontSize: 14, color: '#4b5563', lineHeight: 20, fontWeight: '500' },

  emptyReviews: { alignItems: 'center', padding: 24 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { textAlign: 'center', color: '#9ca3af', fontSize: 14, fontWeight: '600' },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  priceContainer: { flex: 1 },
  bottomPrice: { fontSize: 24, fontWeight: '900', color: '#1a1a1a' },
  taxLabel: { fontSize: 10, color: '#9ca3af', fontWeight: '700' },
  addMainBtn: {
    backgroundColor: '#FF4C24',
    paddingHorizontal: 32,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4C24',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  addMainText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  mainCounter: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 54,
    width: 140,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#FF4C24',
  },
  counterAction: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterIcon: { fontSize: 24, color: '#FF4C24', fontWeight: 'bold' },
  qtyNum: { fontSize: 18, fontWeight: '900', color: '#1a1a1a' },
});

export default FoodDetailScreen;
