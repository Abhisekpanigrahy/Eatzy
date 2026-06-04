import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const logoImg = require('../../assets/logo.png');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to Eatzy',
    description: 'Discover the best foods from over 1,000 restaurants and fast delivery to your doorstep.',
    image: '🍔',
    bgColor: '#FFF0ED', // Pastel Orange/Red
  },
  {
    id: '2',
    title: 'Fast Delivery',
    description: 'Fast delivery to your home, office wherever you are. We ensure your food stays fresh.',
    image: '🚴',
    bgColor: '#FFFBE6', // Pastel Yellow
  },
  {
    id: '3',
    title: 'Live Tracking',
    description: 'Real time tracking of your food on the app once you placed the order.',
    image: '📍',
    bgColor: '#E6F4FF', // Pastel Blue
  },
];

const SplashScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const insets = useSafeAreaInsets();

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login');
    }
  };

  const skip = () => {
    navigation.navigate('Login');
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {item.id === '1' ? (
        /* Large logo in the center of the first screen instead of emoji wrapper */
        <View style={styles.logoWrapper}>
          <Image source={logoImg} style={styles.bigLogo} resizeMode="contain" />
        </View>
      ) : (
        /* Circular pastel emoji wrapper for other onboarding slides */
        <View style={[styles.emojiWrapper, { backgroundColor: item.bgColor }]}>
          <Text style={styles.emoji}>{item.image}</Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <FlatList
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      {/* Pagination Dots with dynamic width and color interpolation */}
      <View style={styles.pagination}>
        {ONBOARDING_DATA.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#e5e7eb', '#FF4C24', '#e5e7eb'],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
              key={i.toString()}
            />
          );
        })}
      </View>

      {/* Clean action buttons matching Login/Register styling */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={skip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={scrollToNext} style={styles.nextBtn} activeOpacity={0.8}>
          <Text style={styles.nextText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoWrapper: {
    width: '100%',
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  bigLogo: {
    width: 280,
    height: 100,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  emojiWrapper: {
    width: 190,
    height: 190,
    borderRadius: 95,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4C24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 40,
  },
  emoji: {
    fontSize: 90,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 23,
    fontWeight: '600',
    paddingHorizontal: 15,
  },
  pagination: {
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: height * 0.06,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  skipText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextBtn: {
    backgroundColor: '#FF4C24',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#FF4C24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
