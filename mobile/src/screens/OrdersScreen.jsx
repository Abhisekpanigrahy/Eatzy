import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
      <Text style={styles.orderId} numberOfLines={1}>#{order._id.slice(-8).toUpperCase()}</Text>
      <OrderStatusBadge status={order.status} />
    </View>
    <Text style={styles.date}>{formatDate(order.date)}</Text>

    <Text style={styles.itemsLabel}>Items:</Text>
    {order.items.map((item, i) => (
      <Text key={i} style={styles.itemRow}>
        • {item.name} × {item.quantity}
      </Text>
    ))}

    <View style={styles.cardFooter}>
      <View style={styles.footerLeft}>
        <View style={[styles.payPill, order.payment ? styles.pillPaid : styles.pillPending]}>
          <Text style={[styles.payPillText, order.payment ? styles.pillPaidText : styles.pillPendingText]}>
            {order.payment ? '✓ Paid' : '⏳ Pending'}
          </Text>
        </View>
        {order.paymentMethod === 'cod' && (
          <View style={styles.codPill}>
            <Text style={styles.codPillText}>💵 COD</Text>
          </View>
        )}
        {order.paymentMethod === 'stripe' && (
          <View style={styles.stripePill}>
            <Text style={styles.stripePillText}>💳 Stripe</Text>
          </View>
        )}
      </View>
      <Text style={styles.total}>${order.amount}</Text>
    </View>
  </View>
);

const OrdersScreen = () => {
  const { orders, loading, error, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  // Sort descending by date
  const sorted = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const onRefresh = useCallback(() => fetchOrders(), []);

  if (loading && orders.length === 0) return <LoadingSpinner />;
  if (error && orders.length === 0)
    return <ErrorState message={error} onRetry={fetchOrders} />;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>My Orders</Text>}
        ListEmptyComponent={
          <Text style={styles.empty}>No orders yet. Start ordering!</Text>
        }
        renderItem={({ item }) => <OrderCard order={item} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor="#FF4C24"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FCFCFC' },
  list: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '700', color: '#262626', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontSize: 13, fontWeight: '700', color: '#49557E', flex: 1, marginRight: 8 },
  date: { fontSize: 12, color: '#aaa', marginBottom: 10 },
  itemsLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4 },
  itemRow: { fontSize: 13, color: '#676767', marginBottom: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 10,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  payPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  pillPaid:        { backgroundColor: '#e6f9f0' },
  pillPending:     { backgroundColor: '#fef2f2' },
  payPillText:     { fontSize: 12, fontWeight: '600' },
  pillPaidText:    { color: '#1a9e5c' },
  pillPendingText: { color: '#dc2626' },
  codPill: {
    backgroundColor: '#fefce8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50,
  },
  codPillText: { fontSize: 11, fontWeight: '700', color: '#a16207' },
  stripePill: {
    backgroundColor: '#fff4f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50,
  },
  stripePillText: { fontSize: 11, fontWeight: '700', color: '#FF4C24' },
  total: { fontSize: 16, fontWeight: '700', color: '#FF4C24' },
  empty: { textAlign: 'center', color: '#676767', fontSize: 15, marginTop: 40 },
});

export default OrdersScreen;
