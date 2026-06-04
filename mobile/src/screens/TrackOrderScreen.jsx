import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrow from '../components/BackArrow';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const TrackingStep = ({ title, sub, date, status, isLast, isActive, isCompleted }) => (
  <View style={styles.stepRow}>
    <View style={styles.stepLeft}>
      <View style={[
        styles.dot,
        isCompleted && styles.dotCompleted,
        isActive && styles.dotActive
      ]}>
        {isCompleted && <Text style={styles.checkIcon}>✓</Text>}
      </View>
      {!isLast && <View style={[styles.line, isCompleted && styles.lineCompleted]} />}
    </View>
    <View style={styles.stepRight}>
      <Text style={[styles.stepTitle, isActive && styles.stepTitleActive]}>{title}</Text>
      <Text style={styles.stepSub}>{sub}</Text>
      {date && <Text style={styles.stepDate}>{date}</Text>}
    </View>
  </View>
);

const formatAddress = (addr) => {
  if (!addr) return 'Standard Delivery Address';
  if (typeof addr === 'string') return addr;
  
  const { street, city, state, zipcode, country } = addr;
  const parts = [street, city, state, zipcode, country].filter(Boolean);
  return parts.join(', ');
};

const TrackOrderScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (token) {
      apiClient.get('/api/user/profile')
        .then((res) => {
          if (res.data.success) {
            setProfileImage(res.data.data.image);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const getStatusIndex = (status) => {
    const statuses = ['Food Processing', 'Out for delivery', 'Delivered'];
    return statuses.indexOf(status);
  };

  const currentIndex = getStatusIndex(order.status);
  const fullName = order.address?.firstName ? `${order.address.firstName} ${order.address.lastName}` : 'Valued Customer';
  const initials = (order.address?.firstName?.charAt(0) || 'U').toUpperCase();

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackArrow />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Track Order</Text>
          <Text style={styles.headerSub}>Order #{order._id.slice(-6).toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Customer Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfoRow}>
            <View style={styles.avatarWrap}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImg} />
              ) : (
                <View style={styles.initialsWrap}>
                  <Text style={styles.initialsText}>{initials}</Text>
                </View>
              )}
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{fullName}</Text>
              <Text style={styles.userEmail}>{order.address?.email || 'No email provided'}</Text>
              <Text style={styles.userPhone}>{order.address?.phone || 'No phone provided'}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Delivery Address</Text>
          <Text style={styles.addressText}>{formatAddress(order.address)}</Text>
        </View>

        {/* Order Status Section */}
        <View style={styles.trackingCard}>
          <Text style={styles.trackingTitle}>Order Status</Text>
          
          <View style={styles.timeline}>
            <TrackingStep 
              title="Order Placed"
              sub="We have received your order"
              date={new Date(order.date).toLocaleString()}
              isCompleted={true}
            />
            <TrackingStep 
              title="Food Processing"
              sub="Chef is preparing your delicious meal"
              isCompleted={currentIndex >= 0}
              isActive={order.status === 'Food Processing'}
            />
            <TrackingStep 
              title="Out for delivery"
              sub="Our delivery partner is on the way"
              isCompleted={currentIndex >= 1}
              isActive={order.status === 'Out for delivery'}
            />
            <TrackingStep 
              title="Delivered"
              sub="Enjoy your meal!"
              isLast={true}
              isCompleted={currentIndex >= 2}
              isActive={order.status === 'Delivered'}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
    paddingVertical: 10,
    paddingRight: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1a1a1a' },
  headerSub: { fontSize: 13, color: '#9ca3af', fontWeight: '700' },

  container: { padding: 20 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4C24',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  initialsWrap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '700',
  },
  trackingCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  trackingTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a1a', marginBottom: 24 },
  
  timeline: { paddingLeft: 8 },
  stepRow: { flexDirection: 'row', minHeight: 80 },
  stepLeft: { alignItems: 'center', marginRight: 16 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: { backgroundColor: '#FF4C24', borderColor: '#FF4C24' },
  dotActive: { borderColor: '#FF4C24', borderWidth: 4 },
  checkIcon: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  lineCompleted: { backgroundColor: '#FF4C24' },
  
  stepRight: { flex: 1, paddingBottom: 24 },
  stepTitle: { fontSize: 16, fontWeight: '800', color: '#9ca3af' },
  stepTitleActive: { color: '#1a1a1a' },
  stepSub: { fontSize: 13, color: '#6b7280', marginTop: 4, fontWeight: '500' },
  stepDate: { fontSize: 11, color: '#9ca3af', marginTop: 6, fontWeight: '600' },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  infoTitle: { fontSize: 16, fontWeight: '900', color: '#1a1a1a', marginBottom: 12 },
  addressText: { fontSize: 14, color: '#4b5563', lineHeight: 20, fontWeight: '500' },

  homeBtn: {
    backgroundColor: '#FF4C24',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF4C24',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default TrackOrderScreen;
