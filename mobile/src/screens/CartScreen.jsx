import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getFoodImageUrl } from '../api/foodApi';
import { useCart } from '../context/CartContext';
import { useFoods } from '../context/FoodContext';
import { DELIVERY_CHARGE } from '../constants/config';

const CartScreen = ({ navigation }) => {
  const { cartData, addToCart, removeFromCart } = useCart();
  const { foods } = useFoods();

  const cartItems = foods.filter((f) => (cartData[f._id] || 0) > 0);
  const subtotal = cartItems.reduce((sum, f) => sum + f.price * cartData[f._id], 0);
  const total = cartItems.length > 0 ? subtotal + DELIVERY_CHARGE : 0;

  const renderItem = ({ item }) => {
    const qty = cartData[item._id];
    return (
      <View style={styles.row}>
        <Image source={{ uri: getFoodImageUrl(item.image) }} style={styles.img} />
        <View style={styles.info}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price} each</Text>
        </View>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item._id)}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item._id)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.lineTotal}>${item.price * qty}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>Your Cart</Text>}
        ListEmptyComponent={
          <Text style={styles.empty}>Your cart is empty.</Text>
        }
        ListFooterComponent={
          cartItems.length > 0 ? (
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>${DELIVERY_CHARGE}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => navigation.navigate('Checkout')}
              >
                <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FCFCFC' },
  list: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '700', color: '#262626', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  img: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  info: { flex: 1, marginRight: 8 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#262626', marginBottom: 3 },
  itemPrice: { fontSize: 12, color: '#676767' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff4f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 18, color: '#FF4C24', fontWeight: '700', lineHeight: 20 },
  qtyNum: { fontSize: 14, fontWeight: '600', marginHorizontal: 8, minWidth: 16, textAlign: 'center' },
  lineTotal: { fontSize: 14, fontWeight: '600', color: '#FF4C24', minWidth: 40, textAlign: 'right' },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#676767' },
  summaryValue: { fontSize: 14, color: '#262626', fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#262626' },
  totalValue: { fontSize: 16, fontWeight: '700', color: '#FF4C24' },
  checkoutBtn: {
    backgroundColor: '#FF4C24',
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  empty: { textAlign: 'center', color: '#676767', fontSize: 15, marginTop: 40 },
});

export default CartScreen;
