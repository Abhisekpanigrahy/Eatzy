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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: getFoodImageUrl(item.image) }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Favorite toggle */}
        <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item._id)}>
          <Text style={styles.heart}>{favorited ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        {/* Add / quantity counter */}
        {qty === 0 ? (
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counter}>
            <TouchableOpacity onPress={handleRemove}>
              <Text style={styles.counterBtn}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterQty}>{qty}</Text>
            <TouchableOpacity onPress={handleAdd}>
              <Text style={styles.counterBtn}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  heart: {
    fontSize: 22,
  },
  addBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FF4C24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  counter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  counterBtn: {
    fontSize: 18,
    paddingHorizontal: 6,
    color: '#FF4C24',
    fontWeight: '700',
  },
  counterQty: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 18,
    textAlign: 'center',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: '#676767',
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF4C24',
  },
});

export default FoodCard;
