import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFoodImageUrl } from '../api/foodApi';
import { useCart } from '../context/CartContext';
import { useFoods } from '../context/FoodContext';
import { DELIVERY_CHARGE } from '../constants/config';

const CartScreen = ({ navigation }) => {
  const { cartData, addToCart, removeFromCart } = useCart();
  const { foods } = useFoods();
  const insets = useSafeAreaInsets();

  const cartItems = foods.filter((f) => (cartData[f._id] || 0) > 0);
  const subtotal = cartItems.reduce((sum, f) => sum + f.price * cartData[f._id], 0);
  const total = cartItems.length > 0 ? subtotal + DELIVERY_CHARGE : 0;

  const renderItem = ({ item }) => {
    const qty = cartData[item._id];
    return (
      <View style={styles.itemRow}>
        <Image source={{ uri: getFoodImageUrl(item.image) }} style={styles.itemImg} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
        <View style={styles.itemActions}>
          <View style={styles.qtyControl}>
            <TouchableOpacity style={styles.qtyAction} onPress={() => removeFromCart(item._id)}>
              <Text style={styles.qtyActionText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyDisplay}>{qty}</Text>
            <TouchableOpacity style={styles.qtyAction} onPress={() => addToCart(item._id)}>
              <Text style={styles.qtyActionText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.itemTotal}>${item.price * qty}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Cart</Text>
          {cartItems.length > 0 && (
            <Text style={styles.headerSub}>{cartItems.length} items added</Text>
          )}
        </View>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: 150 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Looks like you haven't added anything to your cart yet.</Text>
            <TouchableOpacity 
              style={styles.browseBtn}
              onPress={() => navigation.navigate('HomeTab')}
            >
              <Text style={styles.browseBtnText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          cartItems.length > 0 ? (
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.addMore}
                onPress={() => navigation.navigate('MenuTab')}
              >
                <Text style={styles.addMoreText}>+ Add more items</Text>
              </TouchableOpacity>

              <View style={styles.billCard}>
                <Text style={styles.billTitle}>Bill Summary</Text>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Item Total</Text>
                  <Text style={styles.billValue}>${subtotal}</Text>
                </View>
                <View style={styles.billRow}>
                  <View style={styles.labelWithIcon}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    <View style={styles.infoCircle}><Text style={styles.infoText}>i</Text></View>
                  </View>
                  <Text style={styles.billValue}>${DELIVERY_CHARGE}</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.billRow, { marginBottom: 0 }]}>
                  <Text style={styles.totalLabel}>Grand Total</Text>
                  <Text style={styles.totalValue}>${total}</Text>
                </View>
              </View>

              <View style={styles.policyCard}>
                <Text style={styles.policyText}>Cancellation Policy</Text>
                <Text style={styles.policySub}>Orders cannot be cancelled once packed. Please check your address before placing order.</Text>
              </View>
            </View>
          ) : null
        }
      />

      {cartItems.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20 }]}>
          <View>
            <Text style={styles.bottomTotal}>${total}</Text>
            <Text style={styles.viewDetailed}>View Detailed Bill</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('Checkout')}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutBtnText}>Place Order</Text>
            <Text style={styles.checkoutBtnIcon}>›</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backIcon: { fontSize: 20, color: '#1a1a1a', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1a1a1a' },
  headerSub: { fontSize: 13, color: '#6b7280', fontWeight: '600' },

  list: { padding: 16 },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  itemImg: { width: 80, height: 80, borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  itemName: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 2 },
  itemCategory: { fontSize: 12, color: '#9ca3af', fontWeight: '600', marginBottom: 6 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: '#1a1a1a' },
  
  itemActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  qtyControl: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF4C24',
    borderRadius: 8,
    height: 32,
    alignItems: 'center',
    overflow: 'hidden',
  },
  qtyAction: {
    width: 30,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
  },
  qtyActionText: { fontSize: 18, color: '#FF4C24', fontWeight: 'bold' },
  qtyDisplay: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF4C24',
    paddingHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotal: { fontSize: 15, fontWeight: '800', color: '#1a1a1a', marginTop: 8 },

  footer: { marginTop: 8, marginBottom: 120 },
  addMore: {
    paddingVertical: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 16,
    marginBottom: 24,
  },
  addMoreText: { fontSize: 14, fontWeight: '800', color: '#FF4C24' },

  billCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 20,
  },
  billTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a1a', marginBottom: 16 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  billValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '700' },
  labelWithIcon: { flexDirection: 'row', alignItems: 'center' },
  infoCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  infoText: { fontSize: 8, color: '#9ca3af', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: '900', color: '#1a1a1a' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#1a1a1a' },

  policyCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  policyText: { fontSize: 14, fontWeight: '800', color: '#4b5563', marginBottom: 4 },
  policySub: { fontSize: 12, color: '#9ca3af', lineHeight: 18, fontWeight: '500' },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  bottomTotal: { fontSize: 22, fontWeight: '900', color: '#1a1a1a' },
  viewDetailed: { fontSize: 12, color: '#FF4C24', fontWeight: '800', marginTop: 2 },
  checkoutBtn: {
    backgroundColor: '#FF4C24',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 54,
    borderRadius: 16,
    shadowColor: '#FF4C24',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', marginRight: 8 },
  checkoutBtnIcon: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyEmoji: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', marginBottom: 12 },
  emptySub: { fontSize: 15, color: '#6b7280', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22, marginBottom: 30 },
  browseBtn: {
    backgroundColor: '#FF4C24',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#FF4C24',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  browseBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default CartScreen;
