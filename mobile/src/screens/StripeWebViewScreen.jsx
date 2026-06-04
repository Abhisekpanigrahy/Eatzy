import React, { useRef } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import 'react-native-url-polyfill/auto';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

const StripeWebViewScreen = ({ route, navigation }) => {
  const { sessionUrl } = route.params;
  const { clearCart } = useCart();
  const { verifyOrder } = useOrders();
  const handled = useRef(false);
  const insets = useSafeAreaInsets();

  const handleNavChange = async (navState) => {
    if (handled.current) return;
    const url = navState.url || '';

    if (url.includes('/verify')) {
      handled.current = true;
      // Parse query params with URL polyfill (works on Hermes)
      try {
        const parsed = new URL(url);
        const success = parsed.searchParams.get('success');
        const orderId = parsed.searchParams.get('orderId');

        const result = await verifyOrder(orderId, success);
        if (result.success) {
          clearCart();
          navigation.reset({ index: 0, routes: [{ name: 'OrdersTab' }] });
        } else {
          Alert.alert('Payment Failed', 'Your payment was not completed.');
          navigation.navigate('Cart');
        }
      } catch (err) {
        Alert.alert('Error', 'Something went wrong processing your payment.');
        navigation.navigate('Cart');
      }
    }
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    // Ignore errors if they happen during verification redirect
    if (nativeEvent.url?.includes('/verify')) {
      return;
    }
    Alert.alert('WebView Error', 'Unable to load payment page. Please try again.');
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackArrow />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSub}>Complete your purchase</Text>
        </View>
      </View>

      <WebView
        source={{ uri: sessionUrl }}
        onNavigationStateChange={handleNavChange}
        onError={handleError}
        startInLoadingState
        renderLoading={() => <LoadingSpinner />}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1a1a1a' },
  headerSub: { fontSize: 13, color: '#9ca3af', fontWeight: '700' },
});

export default StripeWebViewScreen;
