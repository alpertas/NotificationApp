import api from '../../../core/api/axios';

export interface NotificationPayload {
  to: string; // Token or Topic
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export const notificationService = {
  // Sync FCM Token with Backend
  syncDeviceToken: async (token: string) => {
    try {
      await api.post<void>('/auth/sync-token', { fcmToken: token });
    } catch (error: unknown) {
      console.error('Failed to sync device token', error);
      // Silent fail or retry logic could go here
    }
  },

  // Get Notifications List
  getNotifications: async () => {
    // Define expected response type if possible, for now unknown or any []
    const response = await api.get<any[]>('/notifications');
    return response.data;
  },

  // Create Notification (Send to Backend)
  createNotification: async (payload: NotificationPayload) => {
    const response = await api.post<any>('/notifications/send', payload);
    return response.data;
  },

  // Save as Draft (DB Only)
  saveAsDraft: async (payload: NotificationPayload) => {
    const response = await api.post<any>('/notifications', payload);
    return response.data;
  }
};
