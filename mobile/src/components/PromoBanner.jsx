import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Image } from 'react-native';
import { assets, menu_list } from '../assets/assets';

const PromoBanner = ({ onCategoryPress }) => (
  <View style={styles.wrapper}>
    <ImageBackground 
      source={assets.header_img} 
      style={styles.hero}
      imageStyle={{ borderRadius: 24 }}
    >
      <View style={styles.heroOverlay}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Order your{'\n'}favourite food here</Text>
          <Text style={styles.heroSub}>Choose from a diverse menu featuring a delectable array of dishes.</Text>
          <TouchableOpacity style={styles.orderNowBtn} onPress={() => onCategoryPress?.('All')}>
            <Text style={styles.orderNowText}>View Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>

    <Text style={styles.sectionTitle}>Explore our menu</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {menu_list.map((item) => (
        <TouchableOpacity
          key={item.menu_name}
          style={styles.categoryItem}
          onPress={() => onCategoryPress?.(item.menu_name)}
        >
          <View style={styles.imageCircle}>
            <Image source={item.menu_image} style={styles.catImage} />
          </View>
          <Text style={styles.catLabel}>{item.menu_name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  hero: {
    height: 200,
    marginBottom: 24,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
    maxWidth: '80%',
  },
  orderNowBtn: {
    backgroundColor: '#FF4C24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  orderNowText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  scroll: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  imageCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
  },
  catImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
  },
});

export default PromoBanner;
