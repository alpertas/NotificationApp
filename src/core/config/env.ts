import { Platform } from 'react-native';

const LOCALHOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || LOCALHOST,
  FIREBASE: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
};
