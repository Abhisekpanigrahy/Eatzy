/** @type {import('expo/config').ExpoConfig} */
export default ({ config }) => ({
  ...config,
  name: 'Eatzy',
  slug: 'eatzy-mobile',
  version: '1.0.1',
  sdkVersion: '54.0.0',
  orientation: 'portrait',
  icon: './assets/logo.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    usesCleartextTraffic: true,
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.abhisek_panigrahy.eatzymobile',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-notifications'],
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  },
});
