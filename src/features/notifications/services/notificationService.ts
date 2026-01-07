import api from '../../../core/api/axios';

export interface NotificationPayload {
  to: string; // Token or Topic
  title: string;
  body: string;
  data?: any;
}

export const notificationService = {
  // Sync FCM Token with Backend
  syncDeviceToken: async (token: string) => {
    try {
      await api.post('/users/device-token', { token });
    } catch (error) {
      console.error('Failed to sync device token', error);
      // Silent fail or retry logic could go here
    }
  },

  // Get Notifications List
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Create Notification (Send to Backend)
  // Create Notification (Send to Backend)
  createNotification: async (payload: NotificationPayload) => {
    const response = await api.post('/notifications/send', payload);
    return response.data;
  }
};
