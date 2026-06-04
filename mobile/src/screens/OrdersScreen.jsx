import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiClient from '../api/apiClient';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const OrderCard = ({ order, onTrack, onReview }) => (
  <TouchableOpacity style={styles.card} onPress={() => onTrack(order)} activeOpacity={0.9}>
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.orderId} numberOfLines={1}>Order #{order._id.slice(-6).toUpperCase()}</Text>
        <Text style={styles.date}>{formatDate(order.date)}</Text>
      </View>
      <OrderStatusBadge status={order.status} />
    </View>

    <View style={styles.itemsSection}>
      {order.items.map((item, i) => (
        <View key={i} style={styles.itemRow}>
          <Text style={styles.itemText}>
            <Text style={styles.qtyText}>{item.quantity} ×</Text> {item.name}
          </Text>
          <Text style={styles.itemPrice}>${item.price * item.quantity}</Text>
        </View>
      ))}
    </View>

    <View style={styles.divider} />

    <View style={styles.cardFooter}>
      <View style={styles.footerLeft}>
        <View style={[styles.payPill, order.payment ? styles.pillPaid : styles.pillPending]}>
          <Text style={[styles.payPillText, order.payment ? styles.pillPaidText : styles.pillPendingText]}>
            {order.payment ? '✓ Paid' : '⏳ Pending Payment'}
          </Text>
        </View>
        <View style={styles.methodBadge}>
          <Text style={styles.methodText}>
            {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Online'}
          </Text>
        </View>
      </View>
      <View style={styles.totalWrap}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.total}>${order.amount}</Text>
      </View>
    </View>

    <View style={styles.orderActions}>
      {order.status !== 'Delivered' && (
        <View style={styles.trackBtn}>
          <Text style={styles.trackBtnText}>Track Order</Text>
        </View>
      )}
      
      {order.status === 'Delivered' && (
        order.reviewed ? (
          <View style={styles.reviewedBox}>
            <View style={styles.reviewHeaderRow}>
              <Text style={styles.reviewedLabel}>Your Review</Text>
              <Text style={styles.reviewedStars}>{'★'.repeat(order.rating)}{'☆'.repeat(5-order.rating)}</Text>
            </View>
            <Text style={styles.reviewedComment} numberOfLines={2}>{order.comment}</Text>
          </View>
        ) : (
          <TouchableOpacity style={[styles.trackBtn, styles.reviewBtn]} onPress={() => onReview(order)}>
            <Text style={[styles.trackBtnText, styles.reviewBtnText]}>★ Give Rating & Review</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  </TouchableOpacity>
);

const ReviewModal = ({ visible, onClose, order, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('Review', 'Please share your thoughts.');
      return;
    }
    setSubmitting(true);
    const success = await onSubmit(order, rating, text);
    setSubmitting(false);
    if (success) {
      setText('');
      setRating(5);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Rate your Order</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalSub}>How was your experience with Order #{order?._id?.slice(-6).toUpperCase()}?</Text>
              
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setRating(n)}>
                    <Text style={[styles.star, n <= rating && styles.starFilled]}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.reviewInput}
                placeholder="Tell us what you loved or what we can improve..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                value={text}
                onChangeText={setText}
              />

              <TouchableOpacity 
                style={[styles.submitBtn, submitting && { opacity: 0.7 }]} 
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Post Review'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const OrdersScreen = ({ navigation }) => {
  const { orders, loading, error, fetchOrders } = useOrders();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const sorted = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const onRefresh = useCallback(() => fetchOrders(), []);
  const handleTrack = (order) => navigation.navigate('TrackOrder', { order });
  
  const handleReviewPress = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const submitReview = async (order, rating, text) => {
    try {
      // 1. Submit review to individual food items (existing logic)
      const foodPromises = order.items.map(item => 
        apiClient.post('/api/food/review', {
          foodId: item._id,
          rating,
          text: text.trim(),
          userName: user?.name,
          userImage: user?.image,
        })
      );
      
      // 2. Submit review to the order itself (new logic)
      const orderPromise = apiClient.post('/api/order/review', {
        orderId: order._id,
        rating,
        comment: text.trim(),
        userName: user?.name,
        userImage: user?.image,
      });

      const [orderRes] = await Promise.all([orderPromise, ...foodPromises]);
      
      if (orderRes.data.success) {
        Alert.alert('Success', 'Thank you for your feedback!');
        fetchOrders(); // Refresh the list to show the review
        return true;
      } else {
        Alert.alert('Error', orderRes.data.message || 'Failed to submit review');
        return false;
      }
    } catch (err) {
      console.error('Review submission error:', err);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
      return false;
    }
  };

  if (loading && orders.length === 0) return <LoadingSpinner />;
  if (error && orders.length === 0)
    return <ErrorState message={error} onRetry={fetchOrders} />;

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSub}>Check your recent food adventures</Text>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍔</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySub}>Delicious food is just a few taps away!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard 
            order={item} 
            onTrack={handleTrack} 
            onReview={handleReviewPress} 
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor="#FF4C24"
            colors={['#FF4C24']}
          />
        }
      />

      <ReviewModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        order={selectedOrder}
        onSubmit={submitReview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#1a1a1a' },
  headerSub: { fontSize: 13, color: '#6b7280', fontWeight: '600', marginTop: 2 },

  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: { fontSize: 16, fontWeight: '900', color: '#1a1a1a' },
  date: { fontSize: 12, color: '#9ca3af', fontWeight: '600', marginTop: 2 },

  itemsSection: { marginBottom: 16 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemText: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  qtyText: { color: '#FF4C24', fontWeight: '800' },
  itemPrice: { fontSize: 14, color: '#1a1a1a', fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#f3f4f6', marginBottom: 16 },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  payPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillPaid: { backgroundColor: '#e8f5e9' },
  pillPending: { backgroundColor: '#fef2f2' },
  payPillText: { fontSize: 11, fontWeight: '800' },
  pillPaidText: { color: '#2d7d32' },
  pillPendingText: { color: '#ef4444' },
  methodBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  methodText: { fontSize: 11, fontWeight: '800', color: '#6b7280' },

  totalWrap: { alignItems: 'flex-end' },
  totalLabel: { fontSize: 10, color: '#9ca3af', fontWeight: '800', textTransform: 'uppercase' },
  total: { fontSize: 18, fontWeight: '900', color: '#1a1a1a' },

  orderActions: {
    marginTop: 16,
    gap: 12,
  },
  trackBtn: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  trackBtnText: { color: '#FF4C24', fontSize: 14, fontWeight: '800' },
  reviewBtn: {
    backgroundColor: '#fff7ed',
    borderColor: '#fdba74',
  },
  reviewBtnText: {
    color: '#ea580c',
  },

  reviewedBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewedLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4b5563',
    textTransform: 'uppercase',
  },
  reviewedStars: {
    fontSize: 12,
    color: '#fbbf24',
    letterSpacing: 2,
  },
  reviewedComment: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  closeBtn: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  modalSub: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 20,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  star: {
    fontSize: 40,
    color: '#e5e7eb',
  },
  starFilled: {
    color: '#fbbf24',
  },
  reviewInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#1a1a1a',
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 24,
  },
  submitBtn: {
    backgroundColor: '#FF4C24',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4C24',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyEmoji: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', marginBottom: 12 },
  emptySub: { fontSize: 15, color: '#6b7280', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },
});

export default OrdersScreen;
