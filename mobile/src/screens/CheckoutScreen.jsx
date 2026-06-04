import React, { useEffect, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import AddressForm, { validateAddress } from '../components/AddressForm';
import { useCart } from '../context/CartContext';
import { useFoods } from '../context/FoodContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { DELIVERY_CHARGE } from '../constants/config';

const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Pay with Card', sub: 'Stripe — secure online payment', icon: '💳' },
  { id: 'cod',    label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
];

const CheckoutScreen = ({ navigation }) => {
  const { cartData, clearCart } = useCart();
  const { foods } = useFoods();
  const { placeOrder, error } = useOrders();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const [address, setAddress]           = useState({});
  const [formErrors, setFormErrors]     = useState({});
  const [loading, setLoading]           = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [savedAddress, setSavedAddress]   = useState(null);
  const [useSaved, setUseSaved]           = useState(false);

  useEffect(() => {
    if (token) {
      apiClient.get('/api/user/profile')
        .then((res) => {
          if (res.data.success && res.data.data.address) {
            const addr = res.data.data.address;
            // If it's a structured address (object) and has content
            if (typeof addr === 'object' && addr !== null && Object.keys(addr).length > 0) {
              setSavedAddress(addr);
              setAddress(addr);
              setUseSaved(true);
            }
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const toggleSavedAddress = () => {
    if (!useSaved && savedAddress) {
      setAddress(savedAddress);
    } else if (useSaved) {
      setAddress({});
    }
    setUseSaved(!useSaved);
  };

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
      // Save this address to user profile for future use
      if (token) {
        apiClient.post('/api/user/profile/update', { address }).catch(() => {});
      }

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
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackArrow />
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Delivery Details</Text>
            {savedAddress && (
              <TouchableOpacity style={styles.useSavedBtn} onPress={toggleSavedAddress}>
                <Text style={styles.useSavedText}>
                  {useSaved ? 'Use Different Address' : 'Use Saved Address'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formContainer}>
            <AddressForm value={address} onChange={(val) => { setAddress(val); setUseSaved(false); }} errors={formErrors} />
          </View>

          {/* Payment method */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Payment Method</Text>
          </View>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Order Summary</Text>
          </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1F2937' },
  headerSub: { fontSize: 13, color: '#6B7280', fontWeight: '700' },

  container: { padding: 16 },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  useSavedBtn: {
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0D9',
  },
  useSavedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF4C24',
    textTransform: 'uppercase',
  },

  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },

  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  payOptionSelected: {
    borderColor: '#FF4C24',
    backgroundColor: '#FFF5F2',
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
  payLabel: { fontSize: 15, fontWeight: '800', color: '#1F2937' },
  paySub: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginTop: 2 },
  payIcon: { fontSize: 24 },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryItemName: { fontSize: 14, color: '#4B5563', flex: 1, fontWeight: '600' },
  qtyText: { color: '#FF4C24', fontWeight: '800' },
  summaryItemPrice: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  billLabel: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  billValue: { fontSize: 14, color: '#1F2937', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: '900', color: '#1F2937' },
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
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 15,
  },
  bottomTotal: { fontSize: 24, fontWeight: '900', color: '#1F2937' },
  totalItemsLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '800', marginTop: 2 },
  placeBtn: {
    backgroundColor: '#FF4C24',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 54,
    borderRadius: 16,
    shadowColor: '#FF4C24',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  placeBtnDisabled: { backgroundColor: '#fca5a5' },
  placeBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', marginRight: 8 },
  btnArrow: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});

export default CheckoutScreen;
