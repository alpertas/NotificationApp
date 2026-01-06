import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const DEVICE_TOKEN_KEY = 'device_token';

export const storage = {
  getToken: async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token', error);
      return null;
    }
  },
  setToken: async (token: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token', error);
    }
  },
  deleteToken: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error deleting token', error);
    }
  },
  // Device Token (FCM)
  getDeviceToken: async () => {
    try {
      return await SecureStore.getItemAsync(DEVICE_TOKEN_KEY);
    } catch (error) {
       console.error('Error getting device token', error);
       return null;
    }
  },
  setDeviceToken: async (token: string) => {
     try {
       await SecureStore.setItemAsync(DEVICE_TOKEN_KEY, token);
     } catch (error) {
       console.error('Error setting device token', error);
     }
  }
};
