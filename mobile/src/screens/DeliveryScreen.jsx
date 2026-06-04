import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';

const INFO_ITEMS = [
  {
    icon: '🚀',
    title: 'Delivery Zones',
    desc: 'We deliver to all major areas within the city. Enter your address at checkout to confirm availability.',
    color: '#fef2f2',
  },
  {
    icon: '⏱️',
    title: 'Delivery Time',
    desc: 'Standard delivery takes 25–45 minutes depending on your location and current order volume.',
    color: '#fffbeb',
  },
  {
    icon: '💰',
    title: 'Delivery Charges',
    desc: 'A flat delivery fee of $5 is charged per order. Clearly shown at checkout before payment.',
    color: '#f0fdf4',
  },
  {
    icon: '🔄',
    title: 'Order Issues & Refunds',
    desc: 'Issues with your order? Contact us within 30 minutes of delivery for a refund or replacement.',
    color: '#eff6ff',
  },
  {
    icon: '📦',
    title: 'Packaging',
    desc: 'All orders are packed in food-safe, eco-friendly containers designed to keep your food fresh.',
    color: '#faf5ff',
  },
  {
    icon: '📞',
    title: 'Track & Support',
    desc: 'Track your order from My Orders. Our support team is available 24/7 for assistance.',
    color: '#fff1f2',
  },
];

const DeliveryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Info</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Delivery Information</Text>
          <Text style={styles.heroSub}>Everything you need to know about how we deliver</Text>
        </View>

        <View style={styles.grid}>
          {INFO_ITEMS.map((item, i) => (
            <View key={i} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#F9FAFB' },
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

  container: { padding: 16 },

  hero: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#1F2937', marginBottom: 8, textAlign: 'center' },
  heroSub:   { fontSize: 13, color: '#6B7280', textAlign: 'center', fontWeight: '500' },

  grid: { gap: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon:  { fontSize: 24 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  cardDesc:  { fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '500' },
});

export default DeliveryScreen;
