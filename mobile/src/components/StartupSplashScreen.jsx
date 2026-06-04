import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions, ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');
const logoImg = require('../../assets/logo.png');

const StartupSplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={logoImg}
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#FF4C24" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 250,
    height: 90,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartupSplashScreen;
