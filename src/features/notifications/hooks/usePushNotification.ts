import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { storage } from '../../../core/utils/storage';
import { notificationService } from '../services/notificationService';
import { useAuthStore } from '../../auth/store/useAuthStore';

// Default Handler for Foreground Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  /* @ts-ignore */
  const notificationListener = useRef<Notifications.EventSubscription>(undefined);
  /* @ts-ignore */
  const responseListener = useRef<Notifications.EventSubscription>(undefined);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log("🔵 [usePushNotification] Effect Triggered. User state changed:", user?.email || 'No User');

    registerForPushNotificationsAsync().then(token => {
      console.log("🔵 [usePushNotification] registerAsync completed. Token:", token);
      setExpoPushToken(token);
      if (token && user) {
        console.log("🔵 [usePushNotification] Syncing token with backend for user:", user.email);
        notificationService.syncDeviceToken(token);
        storage.setDeviceToken(token);
      }
    });

    // Foreground Listener
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Background/Killed Response Listener (Tap)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('Notification Tapped:', data);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user]);

  return {
    expoPushToken,
    notification,
  };
};

async function registerForPushNotificationsAsync() {
  console.log("🚀 [registerForPushNotificationsAsync] Starting...");
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Check if physical device
  if (!Device.isDevice) {
    console.log("⚠️ [registerForPushNotificationsAsync] Not a physical device. Push notifications might not work.");
    // IMPORTANT: For debugging on Simulator, we return null but still log.
    // return undefined; 
  }

  // Permission Check
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log("👉 [Permission] Existing Status:", existingStatus);

  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log("👉 [Permission] New Status:", finalStatus);
  }

  if (finalStatus !== 'granted') {
    console.log("⛔ [Permission] Failed to get push token for push notification! Status:", finalStatus);
    return;
  }

  // Get Project ID
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  console.log("👉 [Config] Project ID:", projectId);

  // 1. Get Expo Token
  try {
    if (projectId) {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("🔥 [PushToken] Expo Token:", token);
    } else {
      console.log("⚠️ [PushToken] Project ID not found. Attempting to get token without ID (might fail)...");
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("🔥 [PushToken] Expo Token:", token);
    }
  } catch (e) {
    console.log('⛔ [Error] Failed to get Expo Push Token:', e);
  }

  // 2. Get Device Token (FCM/APNS) - Independent of Expo Token success
  try {
    if (Device.isDevice) {
      const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
      console.log("🔥 [PushToken] Device Token (FCM/APNS):", deviceToken);
    } else {
      console.log("⚠️ [PushToken] Skipping Device Token fetch (Simulator)");
    }
  } catch (e) {
    console.log('⛔ [Error] Failed to get Device Push Token:', e);
  }

  return token;
}
