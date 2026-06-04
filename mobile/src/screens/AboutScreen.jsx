import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StatCard = ({ value, label }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ValueCard = ({ icon, title, desc, color }) => (
  <View style={styles.valueCard}>
    <View style={[styles.valueIconWrap, { backgroundColor: color }]}>
      <Text style={styles.valueIcon}>{icon}</Text>
    </View>
    <View style={styles.valueContent}>
      <Text style={styles.valueTitle}>{title}</Text>
      <Text style={styles.valueDesc}>{desc}</Text>
    </View>
  </View>
);

const AboutScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Story</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>EST. 2024</Text>
          </View>
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
          <StatCard value="50K+" label="Foodies" />
          <StatCard value="200+" label="Chefs" />
          <StatCard value="25m" label="Avg Time" />
          <StatCard value="4.9★" label="Rating" />
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why We Started</Text>
          <View style={styles.missionCard}>
            <Text style={styles.sectionText}>
              Eatzy was founded with a simple mission: make great food accessible to
              everyone. We partner with the finest local restaurants and home chefs
              to curate a menu that satisfies every craving.
            </Text>
            <Text style={[styles.sectionText, { marginBottom: 0 }]}>
              Whether you're a student wanting a quick bite, a family craving a
              comfortable dinner, or an office worker hungry for a hearty lunch —
              Eatzy is your go-to food delivery partner.
            </Text>
          </View>
        </View>

        {/* Values */}
        <Text style={styles.sectionTitle}>Our Values</Text>
        <View style={styles.valuesList}>
          <ValueCard 
            icon="🍽️" 
            title="Quality First"   
            desc="Only restaurants with the highest hygiene and food quality standards." 
            color="#fef2f2"
          />
          <ValueCard 
            icon="⚡"  
            title="Super Speed"           
            desc="Optimised delivery network to get your food hot and on time." 
            color="#fffbeb"
          />
          <ValueCard 
            icon="🌱"  
            title="Sustainability"  
            desc="Eco-friendly packaging and sustainable restaurant partnerships." 
            color="#f0fdf4"
          />
          <ValueCard 
            icon="❤️"  
            title="Community"       
            desc="Supporting local restaurants and chefs, feeding their community." 
            color="#eff6ff"
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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

  container: { padding: 16 },

  hero: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  heroBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: '#FF4C24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
  },
  brand: { color: '#FF4C24' },
  heroSub: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  statValue: { fontSize: 16, fontWeight: '900', color: '#1a1a1a' },
  statLabel: { fontSize: 9, color: '#9ca3af', fontWeight: '800', marginTop: 4, textTransform: 'uppercase' },

  section: { marginBottom: 32 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#1a1a1a', 
    marginBottom: 16, 
    marginLeft: 4,
    letterSpacing: -0.5,
  },
  missionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  sectionText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '500',
  },

  valuesList: { gap: 16 },
  valueCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  valueIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  valueIcon: { fontSize: 24 },
  valueContent: { flex: 1 },
  valueTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 2 },
  valueDesc: { fontSize: 13, color: '#6b7280', fontWeight: '600', lineHeight: 18 },
});

export default AboutScreen;
