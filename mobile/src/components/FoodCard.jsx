import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFoodImageUrl } from '../api/foodApi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const FoodCard = ({ item, onPress, onLoginRequired }) => {
  const { token } = useAuth();
  const { cartData, addToCart, removeFromCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const qty = cartData[item._id] || 0;
  const favorited = isFavorite(item._id);

  const handleAdd = () => {
    if (!token) {
      onLoginRequired?.();
      return;
    }
    addToCart(item._id);
  };

  const handleRemove = () => removeFromCart(item._id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: getFoodImageUrl(item.image) }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Favorite toggle */}
        <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item._id)}>
          <View style={styles.heartCircle}>
            <Text style={styles.heart}>{favorited ? '❤️' : '🤍'}</Text>
          </View>
        </TouchableOpacity>
        
        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{item.averageRating || '0.0'} ★</Text>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </View>
        <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
        <View style={styles.priceRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.timeText}>• 25 mins</Text>
          </View>
          
          {/* Add / quantity counter */}
          <View style={styles.actionContainer}>
            {qty === 0 ? (
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={styles.addBtnText}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.counter}>
                <TouchableOpacity onPress={handleRemove} style={styles.counterAction}>
                  <Text style={styles.counterBtn}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterQty}>{qty}</Text>
                <TouchableOpacity onPress={handleAdd} style={styles.counterAction}>
                  <Text style={styles.counterBtn}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  heartCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  heart: {
    fontSize: 16,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  ratingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
  actionContainer: {
    width: 70,
  },
  addBtn: {
    backgroundColor: '#fff',
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF4C24',
    shadowColor: '#FF4C24',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  addBtnText: {
    color: '#FF4C24',
    fontSize: 12,
    fontWeight: '900',
  },
  counter: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#FF4C24',
  },
  counterAction: {
    width: 24,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtn: {
    color: '#FF4C24',
    fontSize: 16,
    fontWeight: '800',
  },
  counterQty: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  info: {
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  desc: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default FoodCard;
