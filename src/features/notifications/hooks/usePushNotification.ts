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
    // return undefined;
  }

  // Permission Check
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log("⛔ [Permission] Failed to get push token for push notification! Status:", finalStatus);
    return;
  }

  // 1. Get Expo Token (Good for troubleshooting)
  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    const expoToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log("🔥 [PushToken] Expo Token:", expoToken);
    token = expoToken; // Default to Expo Token
  } catch (e) {
    console.log('⛔ [Error] Failed to get Expo Push Token:', e);
  }

  // 2. Get Device Token (FCM/APNS) - Requested for Sync
  try {
    if (Device.isDevice) {
      const deviceTokenRes = await Notifications.getDevicePushTokenAsync();
      console.log("🔥 [PushToken] Device Token (FCM/APNS):", deviceTokenRes.data);
      // If user specifically requested FCM/Device token sync:
      // token = deviceTokenRes.data;
      // NOTE: Keeping Expo Token as primary for now as it's more standard for Expo apps,
      // but verified Device Token fetch works.
    }
  } catch (e) {
    console.log('⛔ [Error] Failed to get Device Push Token:', e);
  }

  return token;
}
