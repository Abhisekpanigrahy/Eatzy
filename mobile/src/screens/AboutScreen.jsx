import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const StatCard = ({ value, label }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ValueCard = ({ icon, title, desc }) => (
  <View style={styles.valueCard}>
    <Text style={styles.valueIcon}>{icon}</Text>
    <Text style={styles.valueTitle}>{title}</Text>
    <Text style={styles.valueDesc}>{desc}</Text>
  </View>
);

const AboutScreen = () => (
  <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Our Story</Text>
        <Text style={styles.heroTitle}>
          About <Text style={styles.brand}>Eatzy</Text>
        </Text>
        <Text style={styles.heroSub}>
          Bringing delicious food from the best local kitchens right to your
          doorstep — fast, fresh, and hassle-free.
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard value="50K+" label="Customers" />
        <StatCard value="200+" label="Dishes" />
        <StatCard value="30 min" label="Avg Delivery" />
        <StatCard value="4.8★" label="Rating" />
      </View>

      {/* Mission */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why We Started</Text>
        <Text style={styles.sectionText}>
          Eatzy was founded with a simple mission: make great food accessible to
          everyone. We partner with the finest local restaurants and home chefs
          to curate a menu that satisfies every craving.
        </Text>
        <Text style={styles.sectionText}>
          Whether you're a student wanting a quick bite, a family craving a
          comfortable dinner, or an office worker hungry for a hearty lunch —
          Eatzy is your go-to food delivery partner.
        </Text>
      </View>

      {/* Values */}
      <Text style={styles.sectionTitle}>Our Values</Text>
      <View style={styles.valuesGrid}>
        <ValueCard icon="🍽️" title="Quality First"   desc="Only restaurants with the highest hygiene and food quality standards." />
        <ValueCard icon="⚡"  title="Speed"           desc="Optimised delivery network to get your food hot and on time." />
        <ValueCard icon="🌱"  title="Sustainability"  desc="Eco-friendly packaging and sustainable restaurant partnerships." />
        <ValueCard icon="❤️"  title="Community"       desc="Supporting local restaurants and chefs, feeding their community." />
      </View>
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
  heroLabel: {
    color: '#FF4C24',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#262626',
    textAlign: 'center',
    marginBottom: 10,
  },
  brand:    { color: '#FF4C24' },
  heroSub:  { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12,
    padding: 14, alignItems: 'center', marginHorizontal: 4,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FF4C24', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#6b7280', textAlign: 'center' },

  section:      { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#262626', marginBottom: 14 },
  sectionText:  { fontSize: 14, color: '#6b7280', lineHeight: 22, marginBottom: 10 },

  valuesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  valueCard: {
    width: '47%', backgroundColor: '#fff',
    borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  valueIcon:  { fontSize: 28, marginBottom: 10 },
  valueTitle: { fontSize: 14, fontWeight: '700', color: '#262626', marginBottom: 6 },
  valueDesc:  { fontSize: 12, color: '#6b7280', lineHeight: 18 },
});

export default AboutScreen;
