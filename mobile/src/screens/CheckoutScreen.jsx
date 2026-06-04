import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddressForm, { validateAddress } from '../components/AddressForm';
import { useCart } from '../context/CartContext';
import { useFoods } from '../context/FoodContext';
import { useOrders } from '../context/OrderContext';
import { DELIVERY_CHARGE } from '../constants/config';

const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Pay with Card', sub: 'Stripe — secure online payment', icon: '💳' },
  { id: 'cod',    label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
];

const CheckoutScreen = ({ navigation }) => {
  const { cartData, clearCart } = useCart();
  const { foods } = useFoods();
  const { placeOrder, error } = useOrders();

  const [address, setAddress]           = useState({});
  const [formErrors, setFormErrors]     = useState({});
  const [loading, setLoading]           = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const cartItems = foods
    .filter((f) => (cartData[f._id] || 0) > 0)
    .map((f) => ({ ...f, quantity: cartData[f._id] }));

  const subtotal = cartItems.reduce((sum, f) => sum + f.price * f.quantity, 0);
  const total    = subtotal + DELIVERY_CHARGE;

  const handlePlaceOrder = async () => {
    const errors = validateAddress(address);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setLoading(true);

    const result = await placeOrder(cartItems, total, address, paymentMethod);
    setLoading(false);

    if (result.success) {
      if (paymentMethod === 'cod') {
        clearCart();
        Alert.alert(
          'Order Placed! 🎉',
          'Your order has been placed. Pay when it arrives.',
          [{ text: 'View Orders', onPress: () => navigation.navigate('OrdersTab') }],
        );
      } else if (result.session_url) {
        navigation.navigate('StripeWebView', { sessionUrl: result.session_url });
      }
    } else {
      Alert.alert('Order Error', error || 'Failed to place order. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Delivery Details</Text>
        <AddressForm value={address} onChange={setAddress} errors={formErrors} />

        {/* Payment method */}
        <Text style={styles.sectionLabel}>Payment Method</Text>
        {PAYMENT_METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.payOption, paymentMethod === m.id && styles.payOptionSelected]}
            onPress={() => setPaymentMethod(m.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.radio, paymentMethod === m.id && styles.radioSelected]}>
              {paymentMethod === m.id && <View style={styles.radioDot} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payLabel}>{m.label}</Text>
              <Text style={styles.paySub}>{m.sub}</Text>
            </View>
            <Text style={styles.payIcon}>{m.icon}</Text>
          </TouchableOpacity>
        ))}

        {/* Order summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item._id} style={styles.summaryRow}>
              <Text style={styles.summaryItemName} numberOfLines={1}>
                {item.name} × {item.quantity}
              </Text>
              <Text style={styles.summaryItemPrice}>${item.price * item.quantity}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItemName}>Delivery</Text>
            <Text style={styles.summaryItemPrice}>${DELIVERY_CHARGE}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.placeBtn, loading && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeBtnText}>
            {loading
              ? 'Placing Order…'
              : paymentMethod === 'cod'
              ? 'Place Order (COD)'
              : `Pay $${total}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48, backgroundColor: '#FCFCFC' },
  title:     { fontSize: 22, fontWeight: '700', color: '#262626', marginBottom: 20 },

  sectionLabel: {
    fontSize: 16, fontWeight: '700', color: '#262626',
    marginTop: 24, marginBottom: 12,
  },

  payOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 12,
    padding: 14, marginBottom: 10, backgroundColor: '#fff',
  },
  payOptionSelected: { borderColor: '#FF4C24', backgroundColor: '#fff4f2' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#d1d5db',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#FF4C24' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF4C24' },
  payLabel: { fontSize: 14, fontWeight: '600', color: '#262626' },
  paySub:   { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  payIcon:  { fontSize: 22 },

  summary: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginTop: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: '#262626', marginBottom: 12 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryItemName: { fontSize: 14, color: '#555', flex: 1, marginRight: 8 },
  summaryItemPrice: { fontSize: 14, fontWeight: '500', color: '#262626' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 8 },
  totalRow:  { marginTop: 4 },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#262626', flex: 1 },
  totalValue: { fontSize: 14, fontWeight: '700', color: '#FF4C24' },

  placeBtn: {
    backgroundColor: '#FF4C24', borderRadius: 50,
    padding: 16, alignItems: 'center', marginTop: 24,
  },
  placeBtnDisabled: { opacity: 0.6 },
  placeBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});

export default CheckoutScreen;
