import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const INFO_ITEMS = [
  {
    icon: '🚀',
    title: 'Delivery Zones',
    desc: 'We deliver to all major areas within the city. Enter your address at checkout to confirm availability.',
  },
  {
    icon: '⏱️',
    title: 'Delivery Time',
    desc: 'Standard delivery takes 25–45 minutes depending on your location and current order volume.',
  },
  {
    icon: '💰',
    title: 'Delivery Charges',
    desc: 'A flat delivery fee of $5 is charged per order. Clearly shown at checkout before payment.',
  },
  {
    icon: '🔄',
    title: 'Order Issues & Refunds',
    desc: 'Issues with your order? Contact us within 30 minutes of delivery for a refund or replacement.',
  },
  {
    icon: '📦',
    title: 'Packaging',
    desc: 'All orders are packed in food-safe, eco-friendly containers designed to keep your food fresh.',
  },
  {
    icon: '📞',
    title: 'Track & Support',
    desc: 'Track your order from My Orders. Our support team is available 24/7 for assistance.',
  },
];

const DeliveryScreen = () => (
  <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Delivery Information</Text>
        <Text style={styles.heroSub}>Everything you need to know about how we deliver</Text>
      </View>

      {INFO_ITEMS.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardIcon}>{item.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#FCFCFC' },
  container: { padding: 20, paddingBottom: 48 },

  hero: {
    backgroundColor: '#fff4f2',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#262626', marginBottom: 8, textAlign: 'center' },
  heroSub:   { fontSize: 14, color: '#6b7280', textAlign: 'center' },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardIcon:  { fontSize: 28, marginTop: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#262626', marginBottom: 6 },
  cardDesc:  { fontSize: 13, color: '#6b7280', lineHeight: 20 },
});

export default DeliveryScreen;
