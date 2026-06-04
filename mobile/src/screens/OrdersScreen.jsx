import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { useOrders } from '../context/OrderContext';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const OrderCard = ({ order }) => (
  <View style={styles.card}>
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

    {order.status !== 'Delivered' && (
      <TouchableOpacity style={styles.trackBtn}>
        <Text style={styles.trackBtnText}>Track Order</Text>
      </TouchableOpacity>
    )}
  </View>
);

const OrdersScreen = () => {
  const { orders, loading, error, fetchOrders } = useOrders();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchOrders();
  }, []);

  const sorted = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const onRefresh = useCallback(() => fetchOrders(), []);

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
        renderItem={({ item }) => <OrderCard order={item} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor="#FF4C24"
            colors={['#FF4C24']}
          />
        }
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

  trackBtn: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  trackBtnText: { color: '#FF4C24', fontSize: 14, fontWeight: '800' },

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
