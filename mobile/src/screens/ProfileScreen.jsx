import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const MenuItem = ({ icon, label, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <Text style={[styles.menuIcon, danger && { color: '#ef4444' }]}>{icon}</Text>
    <Text style={[styles.menuLabel, danger && { color: '#ef4444' }]}>{label}</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile]   = useState({ name: '', phone: '', address: '' });
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    // Load profile from backend
    apiClient.get('/api/user/profile')
      .then((res) => {
        if (res.data.success) {
          const u = res.data.data;
          setProfile({
            name:    u.name    || '',
            phone:   u.phone   || '',
            address: u.address || '',
          });
        }
      })
      .catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await apiClient.post('/api/user/profile/update', profile);
      if (res.data.success) {
        Alert.alert('Saved', 'Profile updated successfully.');
        setEditing(false);
      } else {
        Alert.alert('Error', res.data.message || 'Failed to update profile');
      }
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const initials = (user?.name || profile.name || '?').charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name || profile.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
        </View>

        {/* Edit profile form */}
        {editing ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Edit Profile</Text>
            {[
              { key: 'name',    label: 'Full Name',   placeholder: 'Your name' },
              { key: 'phone',   label: 'Phone',        placeholder: '+91 ...' },
              { key: 'address', label: 'Default Address', placeholder: 'Street, City...' },
            ].map(({ key, label, placeholder }) => (
              <View key={key} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={profile[key]}
                  onChangeText={(v) => setProfile((p) => ({ ...p, [key]: v }))}
                  placeholder={placeholder}
                  placeholderTextColor="#bbb"
                />
              </View>
            ))}
            <View style={styles.formBtns}>
              <TouchableOpacity
                style={[styles.btn, styles.btnOutline]}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.btnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, saving && styles.btnDisabled]}
                onPress={saveProfile}
                disabled={saving}
              >
                <Text style={styles.btnPrimaryText}>{saving ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.menuCard}>
            <MenuItem icon="✏️" label="Edit Profile"   onPress={() => setEditing(true)} />
            <MenuItem icon="📦" label="My Orders"      onPress={() => navigation.navigate('OrdersTab')} />
            <MenuItem icon="❤️" label="Wishlist"       onPress={() => navigation.navigate('MenuTab')} />
            <MenuItem icon="ℹ️" label="About Eatzy"    onPress={() => navigation.navigate('About')} />
            <MenuItem icon="🚚" label="Delivery Info"  onPress={() => navigation.navigate('Delivery')} />
            <MenuItem icon="📞" label="Contact Us"     onPress={() => {}} />
            <MenuItem icon="🚪" label="Logout"         onPress={handleLogout} danger />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FCFCFC' },
  container: { padding: 20, paddingBottom: 48 },

  avatarWrap: { alignItems: 'center', marginBottom: 28, marginTop: 10 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#FF4C24',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '700' },
  name:  { fontSize: 20, fontWeight: '700', color: '#262626' },
  email: { fontSize: 13, color: '#9ca3af', marginTop: 4 },

  menuCard: {
    backgroundColor: '#fff', borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 15, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  menuIcon:  { fontSize: 20, width: 30 },
  menuLabel: { flex: 1, fontSize: 15, color: '#262626', fontWeight: '500' },
  menuArrow: { fontSize: 20, color: '#d1d5db' },

  formCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  formTitle: { fontSize: 18, fontWeight: '700', color: '#262626', marginBottom: 16 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#49557E', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: '#262626',
  },
  formBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1, padding: 13, borderRadius: 50, alignItems: 'center' },
  btnOutline: { borderWidth: 1.5, borderColor: '#FF4C24' },
  btnOutlineText: { color: '#FF4C24', fontWeight: '700', fontSize: 15 },
  btnPrimary: { backgroundColor: '#FF4C24' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.6 },
});

export default ProfileScreen;
