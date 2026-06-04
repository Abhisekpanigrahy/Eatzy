import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../api/apiClient';

const NewsletterScreen = ({ navigation }) => {
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
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Newsletter</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {done ? (
            <View style={styles.successBox}>
              <View style={styles.successIconWrap}>
                <Text style={styles.successIcon}>🎉</Text>
              </View>
              <Text style={styles.successTitle}>You're subscribed!</Text>
              <Text style={styles.successSub}>
                Check your email — we've sent you a{' '}
                <Text style={styles.highlight}>20% off coupon</Text> for your next order.
              </Text>
              <TouchableOpacity 
                style={styles.backHomeBtn}
                onPress={() => navigation.navigate('HomeTab')}
              >
                <Text style={styles.backHomeBtnText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.topBox}>
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>EXCLUSIVE OFFER</Text>
                </View>
                <Text style={styles.title}>Get 20% off your{'\n'}next order</Text>
                <Text style={styles.sub}>
                  Subscribe for exclusive offers, fresh arrivals, and special
                  deals delivered to your inbox.
                </Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="done"
                  onSubmitEditing={handleSubscribe}
                />
              </View>

              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleSubscribe}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>{loading ? 'Subscribing...' : 'SUBSCRIBE'}</Text>
              </TouchableOpacity>

              <View style={styles.noteBox}>
                <Text style={styles.noteText}>🔒 No spam. Unsubscribe anytime.</Text>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#f9fafb' },
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

  container: { flex: 1, padding: 24, justifyContent: 'center' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  topBox:   { alignItems: 'center', marginBottom: 32 },
  promoBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 16,
  },
  promoBadgeText: {
    color: '#FF4C24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: '#1a1a1a', 
    textAlign: 'center', 
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  sub: { 
    fontSize: 14, 
    color: '#6b7280', 
    textAlign: 'center', 
    lineHeight: 22,
    fontWeight: '600',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#f3f4f6',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  inputIcon: { fontSize: 18, marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },

  btn: {
    backgroundColor: '#FF4C24',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4C24',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 24,
  },
  btnDisabled: { backgroundColor: '#fca5a5', elevation: 0 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  noteBox: { alignItems: 'center' },
  noteText: { fontSize: 12, color: '#9ca3af', fontWeight: '700' },

  successBox: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  successIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: { fontSize: 48 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', marginBottom: 12 },
  successSub: { 
    fontSize: 15, 
    color: '#6b7280', 
    textAlign: 'center', 
    lineHeight: 24,
    fontWeight: '600',
  },
  highlight: { color: '#FF4C24', fontWeight: '800' },
  backHomeBtn: {
    marginTop: 32,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  backHomeBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});

export default NewsletterScreen;
