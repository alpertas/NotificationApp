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
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      if (token && user) {
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
      // Handle notification tap if needed
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
    // console.warn("Not a physical device. Push notifications might not work.");
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
    // console.error("Failed to get push token for push notification!");
    return;
  }

  // 1. Get Expo Token
  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    const expoToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    token = expoToken;
  } catch (e) {
    // console.log('Failed to get Expo Push Token:', e);
  }

  // 2. Get Device Token (FCM/APNS)
  try {
    if (Device.isDevice) {
      await Notifications.getDevicePushTokenAsync();
    }
  } catch (e) {
    // console.error('Failed to get Device Push Token:', e);
  }

  return token;
}
