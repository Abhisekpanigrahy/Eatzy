import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import apiClient from '../api/apiClient';

const NewsletterScreen = () => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.post('/api/newsletter/subscribe', { email });
      if (res.data.success) {
        setDone(true);
      } else {
        Alert.alert('Notice', res.data.message || 'Already subscribed!');
      }
    } catch {
      Alert.alert('Error', 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {done ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>🎉</Text>
              <Text style={styles.successTitle}>You're subscribed!</Text>
              <Text style={styles.successSub}>
                Check your email — we've sent you a{' '}
                <Text style={styles.highlight}>20% off coupon</Text> for your next order.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.topBox}>
                <Text style={styles.badge}>Newsletter</Text>
                <Text style={styles.title}>Get 20% off your next order</Text>
                <Text style={styles.sub}>
                  Subscribe for exclusive offers, fresh arrivals, and special
                  deals delivered to your inbox.
                </Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#bbb"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="done"
                onSubmitEditing={handleSubscribe}
              />

              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleSubscribe}
                disabled={loading}
              >
                <Text style={styles.btnText}>{loading ? 'Subscribing…' : 'SUBSCRIBE'}</Text>
              </TouchableOpacity>

              <Text style={styles.note}>
                No spam. Unsubscribe anytime.
              </Text>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#FCFCFC' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },

  topBox:   { alignItems: 'center', marginBottom: 32 },
  badge: {
    color: '#FF4C24', fontSize: 12, fontWeight: '700',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontSize: 26, fontWeight: '800', color: '#262626',
    textAlign: 'center', marginBottom: 12,
  },
  sub: {
    fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22,
  },

  input: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 50,
    paddingHorizontal: 20, paddingVertical: 14,
    fontSize: 15, color: '#262626',
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  btn: {
    backgroundColor: '#FF4C24', borderRadius: 50,
    padding: 16, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText:     { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
  note:        { textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 14 },

  successBox: { alignItems: 'center', padding: 20 },
  successIcon: { fontSize: 56, marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#262626', marginBottom: 12 },
  successSub:   { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 24 },
  highlight:    { color: '#FF4C24', fontWeight: '700' },
});

export default NewsletterScreen;
