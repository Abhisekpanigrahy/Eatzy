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
import { SafeAreaView } from 'react-native-safe-area-context';
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
      Alert.alert('Missing Info', 'Please fill in all delivery details.');
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
          'Your order has been placed successfully. You can track it in the Orders section.',
          [{ text: 'View Orders', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'OrdersTab' }] }) }],
        );
      } else if (result.session_url) {
        navigation.navigate('StripeWebView', { sessionUrl: result.session_url });
      }
    } else {
      Alert.alert('Order Error', error || 'Failed to place order. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSub}>Almost there!</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Delivery Details</Text>
          <View style={styles.formContainer}>
            <AddressForm value={address} onChange={setAddress} errors={formErrors} />
          </View>

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
          <Text style={styles.sectionLabel}>Order Summary</Text>
          <View style={styles.summaryCard}>
            {cartItems.map((item) => (
              <View key={item._id} style={styles.summaryRow}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {item.name} <Text style={styles.qtyText}>× {item.quantity}</Text>
                </Text>
                <Text style={styles.summaryItemPrice}>${item.price * item.quantity}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>${subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>${DELIVERY_CHARGE}</Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.summaryRow, { marginBottom: 0 }]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>${total}</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomTotal}>${total}</Text>
            <Text style={styles.totalItemsLabel}>{cartItems.length} items to pay</Text>
          </View>
          <TouchableOpacity
            style={[styles.placeBtn, loading && styles.placeBtnDisabled]}
            onPress={handlePlaceOrder}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.placeBtnText}>
              {loading ? 'Processing...' : 'Confirm Order'}
            </Text>
            {!loading && <Text style={styles.btnArrow}>›</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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

  container: { padding: 16 },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 4,
  },

  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  payOptionSelected: {
    borderColor: '#FF4C24',
    backgroundColor: '#fef2f2',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  radioSelected: { borderColor: '#FF4C24' },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4C24',
  },
  payLabel: { fontSize: 15, fontWeight: '800', color: '#1a1a1a' },
  paySub: { fontSize: 12, color: '#6b7280', fontWeight: '600', marginTop: 2 },
  payIcon: { fontSize: 24 },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryItemName: { fontSize: 14, color: '#4b5563', flex: 1, fontWeight: '600' },
  qtyText: { color: '#FF4C24', fontWeight: '800' },
  summaryItemPrice: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  billLabel: { fontSize: 14, color: '#6b7280', fontWeight: '600' },
  billValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: '900', color: '#1a1a1a' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#FF4C24' },

  bottomBar: {
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
  bottomTotal: { fontSize: 24, fontWeight: '900', color: '#1a1a1a' },
  totalItemsLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '800', marginTop: 2 },
  placeBtn: {
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
  placeBtnDisabled: { backgroundColor: '#fca5a5' },
  placeBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', marginRight: 8 },
  btnArrow: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});

export default CheckoutScreen;
