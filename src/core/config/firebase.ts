import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { getAuth, initializeAuth, Auth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from './env';

// Placeholder config - User will replace these via .env
const firebaseConfig = {
  apiKey: ENV.FIREBASE.apiKey,
  authDomain: ENV.FIREBASE.authDomain,
  projectId: ENV.FIREBASE.projectId,
  storageBucket: ENV.FIREBASE.storageBucket,
  messagingSenderId: ENV.FIREBASE.messagingSenderId,
  appId: ENV.FIREBASE.appId,
};

let app;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  // Initialize Auth with persistence (keep user logged in)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

export { app, auth };
