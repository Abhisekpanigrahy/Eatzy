import React, { useRef } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import 'react-native-url-polyfill/auto';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

const StripeWebViewScreen = ({ route, navigation }) => {
  const { sessionUrl } = route.params;
  const { clearCart } = useCart();
  const { verifyOrder } = useOrders();
  const handled = useRef(false);

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
          navigation.reset({ index: 0, routes: [{ name: 'Orders' }] });
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

  const handleError = () => {
    Alert.alert('WebView Error', 'Unable to load payment page. Please try again.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
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
  container: { flex: 1 },
  webview: { flex: 1 },
});

export default StripeWebViewScreen;
