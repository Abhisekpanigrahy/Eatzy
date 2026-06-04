import React, { useState, useRef, useEffect } from 'react';
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
    titlePrefix: 'Welcome to ',
    titleHighlight: 'Eatzy',
    titleSuffix: '',
    description: 'Discover the best foods from over 1,000 restaurants and fast delivery to your doorstep.',
    bgColor: '#FFEAE6', // Softest warm coral
  },
  {
    id: '2',
    titlePrefix: 'Super ',
    titleHighlight: 'Fast',
    titleSuffix: ' Delivery',
    description: 'Fast delivery to your home, office wherever you are. We ensure your food stays fresh.',
    bgColor: '#FFF7D6', // Softest warm gold
  },
  {
    id: '3',
    titlePrefix: 'Realtime ',
    titleHighlight: 'Live',
    titleSuffix: ' Tracking',
    description: 'Real time tracking of your food on the app once you placed the order.',
    bgColor: '#DDF0FF', // Softest sky blue
  },
];

// Stylized insulated delivery backpack with speed lines
const FastDeliveryIllustration = () => (
  <View style={styles.illContainer}>
    {/* Speed lines */}
    <View style={styles.speedLineRow}>
      <View style={[styles.speedLine, { width: 26 }]} />
      <View style={[styles.speedLine, { width: 38, marginTop: 6 }]} />
      <View style={[styles.speedLine, { width: 20, marginTop: 6 }]} />
    </View>
    {/* Delivery Bag */}
    <View style={styles.deliveryBag}>
      {/* Handle */}
      <View style={styles.bagHandle} />
      {/* Front pocket */}
      <View style={styles.bagPocket}>
        <Text style={styles.bagLogo}>⚡</Text>
      </View>
    </View>
  </View>
);

// Stylized Map Pin with circular radar wave pulses
const LiveTrackingIllustration = () => (
  <View style={styles.illContainer}>
    {/* Map Path Line behind pin */}
    <View style={styles.mapLine} />
    <View style={styles.mapDotStart} />
    
    {/* Radar Rings (expanding pulses) */}
    <View style={[styles.radarRing, { width: 140, height: 140, borderRadius: 70, opacity: 0.12 }]} />
    <View style={[styles.radarRing, { width: 100, height: 100, borderRadius: 50, opacity: 0.24 }]} />
    
    {/* Map Pin */}
    <View style={styles.pinWrapper}>
      <View style={styles.pinHead}>
        <View style={styles.pinInnerCircle} />
      </View>
      <View style={styles.pinTail} />
    </View>
  </View>
);

const SplashScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Floating animation value
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  // Interpolate floating value into Y-axis translation
  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12], // float up by 12px
  });

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

  // Interpolated background color for extremely smooth transitions
  const backgroundColor = scrollX.interpolate({
    inputRange: [0, width, width * 2],
    outputRange: ['#FFF6F4', '#FFFDF2', '#F4F9FF'], // Gentle pastel coral -> ivory -> baby blue
    extrapolate: 'clamp',
  });

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* Floating wrapper with gentle physics */}
      <Animated.View style={{ transform: [{ translateY }], alignItems: 'center' }}>
        {item.id === '1' ? (
          <View style={styles.logoWrapper}>
            <Image source={logoImg} style={styles.bigLogo} resizeMode="contain" />
          </View>
        ) : item.id === '2' ? (
          <View style={[styles.emojiWrapper, { backgroundColor: item.bgColor }]}>
            <FastDeliveryIllustration />
          </View>
        ) : (
          <View style={[styles.emojiWrapper, { backgroundColor: item.bgColor }]}>
            <LiveTrackingIllustration />
          </View>
        )}
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {item.titlePrefix}
          <Text style={styles.highlightText}>{item.titleHighlight}</Text>
          {item.titleSuffix}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
      {/* Ambient background decoration blobs for premium visual depth */}
      <View style={styles.bgBlob1} pointerEvents="none" />
      <View style={styles.bgBlob2} pointerEvents="none" />

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

      {/* Action buttons matching Eatzy style */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={skip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={scrollToNext} style={styles.nextBtn} activeOpacity={0.85}>
          <Text style={styles.nextText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  // Soft pastel abstract background shapes
  bgBlob1: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FFE5E0',
    opacity: 0.35,
    position: 'absolute',
    top: -50,
    right: -80,
    zIndex: 0,
  },
  bgBlob2: {
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#FFF2C6',
    opacity: 0.3,
    position: 'absolute',
    bottom: 50,
    left: -120,
    zIndex: 0,
  },
  logoWrapper: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bigLogo: {
    width: 340,
    height: 120,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
    zIndex: 1,
  },
  emojiWrapper: {
    width: 190,
    height: 190,
    borderRadius: 95,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4C24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 40,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  highlightText: {
    color: '#FF4C24',
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
    zIndex: 1,
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
    zIndex: 1,
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

  // Custom Vector Illustrations Styles
  illContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
  },
  speedLineRow: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  speedLine: {
    height: 4,
    backgroundColor: '#FF4C24',
    borderRadius: 2,
    opacity: 0.85,
  },
  deliveryBag: {
    width: 76,
    height: 72,
    backgroundColor: '#FF4C24',
    borderRadius: 18,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#FF4C24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  bagHandle: {
    position: 'absolute',
    top: -10,
    width: 32,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#FF4C24',
    backgroundColor: 'transparent',
  },
  bagPocket: {
    width: '80%',
    height: '65%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagLogo: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  mapLine: {
    position: 'absolute',
    width: 130,
    height: 4,
    backgroundColor: '#a1a1aa',
    opacity: 0.3,
    borderRadius: 2,
    transform: [{ rotate: '-25deg' }],
  },
  mapDotStart: {
    position: 'absolute',
    left: 10,
    bottom: 35,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#a1a1aa',
    opacity: 0.6,
  },
  radarRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FF4C24',
    borderStyle: 'dashed',
  },
  pinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -6,
  },
  pinHead: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF4C24',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#FF4C24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  pinInnerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
  pinTail: {
    width: 24,
    height: 24,
    backgroundColor: '#FF4C24',
    transform: [{ rotate: '45deg' }],
    marginTop: -16,
    zIndex: 1,
  },
});

export default SplashScreen;
