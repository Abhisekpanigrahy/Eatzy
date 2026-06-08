import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useFoods } from '../context/FoodContext';

const MenuItem = ({ icon, label, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconWrap, danger && { backgroundColor: '#fef2f2' }]}>
      <Text style={[styles.menuIcon, danger && { color: '#ef4444' }]}>{icon}</Text>
    </View>
    <Text style={[styles.menuLabel, danger && { color: '#ef4444' }]}>{label}</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { orders, fetchOrders } = useOrders();
  const { foods } = useFoods();
  const [profile, setProfile]   = useState({ name: '', phone: '', address: '', image: '' });
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const insets = useSafeAreaInsets();

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
            image:   u.image   || '',
          });
        }
      })
      .catch(() => {});
    
    // Fetch orders to get dynamic count
    fetchOrders();
  }, []);

  // Calculate dynamic stats
  const totalOrders = orders.length;
  const totalReviews = foods.reduce((count, food) => {
    const userReviews = food.reviews?.filter(r => r.userId === user?.id) || [];
    return count + userReviews.length;
  }, 0);
  // Using a simplified logic for favorites - counting foods with high ratings or just a mock count if not implemented
  const totalFavs = foods.filter(f => f.averageRating >= 4.5).length;

  const pickImage = async () => {
    console.log('Pick image triggered');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need camera roll permissions to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let data;
      let headers = {};

      if (selectedImage) {
        data = new FormData();
        data.append('name', profile.name);
        data.append('phone', profile.phone);
        data.append('address', profile.address);
        
        const uri = selectedImage.uri;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        data.append('image', {
          uri,
          name: filename,
          type,
        });
      } else {
        data = {
          name:    profile.name,
          phone:   profile.phone,
          address: profile.address,
        };
      }

      const res = await apiClient.post('/api/user/profile/update', data, { headers });
      if (res.data.success) {
        Alert.alert('Saved', 'Profile updated successfully.');
        setEditing(false);
        setSelectedImage(null);
        // Refresh profile to get the new image URL
        const profileRes = await apiClient.get('/api/user/profile');
        if (profileRes.data.success) {
          const u = profileRes.data.data;
          setProfile({
            name:    u.name    || '',
            phone:   u.phone   || '',
            address: u.address || '',
            image:   u.image   || '',
          });
        }
      } else {
        Alert.alert('Error', res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      const msg = err.response?.data?.message || 'Failed to update profile. Please try again later.';
      Alert.alert('Error', msg);
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
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <View style={styles.avatarImageWrapper}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage.uri }} style={styles.avatarImg} />
              ) : profile.image ? (
                <Image source={{ uri: profile.image }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.editAvatarBtn} 
              onPress={pickImage} 
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.editAvatarText}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name || profile.name || 'Foodie'}</Text>
          <Text style={styles.email}>{user?.email || 'Welcome to Eatzy'}</Text>
          
          {selectedImage && (
            <TouchableOpacity 
              style={[styles.saveBtn, { marginTop: 16, paddingHorizontal: 30, borderRadius: 25 }]} 
              onPress={saveProfile}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Profile Photo'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalOrders}</Text>
            <Text style={styles.statLab}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalReviews}</Text>
            <Text style={styles.statLab}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalFavs}</Text>
            <Text style={styles.statLab}>Favs</Text>
          </View>
        </View>

        {/* Edit profile form */}
        {editing ? (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
                  placeholderTextColor="#9ca3af"
                />
              </View>
            ))}
            <TouchableOpacity 
              style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
              onPress={saveProfile}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.menuSection}>
            <Text style={styles.sectionHeading}>My Account</Text>
            <MenuItem icon="👤" label="Personal Information" onPress={() => setEditing(true)} />
            <MenuItem icon="📦" label="Order History" onPress={() => navigation.navigate('OrdersTab')} />
            <MenuItem icon="❤️" label="My Favorites" onPress={() => navigation.navigate('HomeTab')} />
            <MenuItem icon="📍" label="Saved Addresses" onPress={() => {}} />
            
            <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Support & Legal</Text>
            <MenuItem icon="❓" label="Help & Support" onPress={() => {}} />
            <MenuItem icon="🛡️" label="Privacy Policy" onPress={() => {}} />
            <MenuItem icon="🚪" label="Logout" onPress={handleLogout} danger />
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { padding: 20 },
  
  avatarCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF4C24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#FF4C24',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 12,
    zIndex: 10,
  },
  editAvatarText: { fontSize: 14 },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginTop: 16,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  statLab: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F3F4F6',
  },

  menuSection: {},
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuIcon: { fontSize: 18 },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  menuArrow: {
    fontSize: 20,
    color: '#D1D5DB',
    fontWeight: '700',
  },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: { fontSize: 18, fontWeight: '900', color: '#1F2937' },
  cancelText: { color: '#6B7280', fontWeight: '700' },
  fieldWrap: { marginBottom: 20 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveBtn: {
    backgroundColor: '#FF4C24',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF4C24',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default ProfileScreen;
