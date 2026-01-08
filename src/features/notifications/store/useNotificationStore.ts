import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import { NotificationItem } from '../notificationTypes';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: (isManual?: boolean, isBackground?: boolean) => Promise<void>;
  addNotification: (item: NotificationItem) => void;
  markAsRead: (id: string) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Modified signature to allow background fetch
  fetchNotifications: async (isManual = false, isBackground = false) => {
    // Prevent double loading unless manual refresh or background update
    if (get().isLoading && !isManual && !isBackground) return;
    
    // Only show loading indicator if NOT a background fetch
    if (!isBackground) {
      set({ isLoading: true, error: null });
    }

    try {
      const data = await notificationService.getNotifications();
      
      const mappedData: NotificationItem[] = Array.isArray(data) ? data.map((item: any) => {
        const rawStatus = item.deliveryStatus || item.status || item.data?.status || 'SENT';
        return {
          id: item.id || Math.random().toString(), // Fallback if ID invalid
          title: item.title,
          body: item.body,
          createdAt: item.createdAt || item.timestamp || new Date().toISOString(),
          deliveryStatus: rawStatus.toUpperCase(),
          data: item.data
        };
      }) : [];

      // Sort by createdAt descending
      mappedData.sort((a, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      set({ 
        notifications: mappedData, 
        isLoading: false,
        unreadCount: 0 
      });
    } catch (error: any) {
      console.error('Store: Failed to fetch notifications', error);
      set({ 
        error: error.message || 'Failed to fetch notifications', 
        isLoading: false 
      });
    }
  },

  addNotification: (item: NotificationItem) => {
    set((state) => ({
      notifications: [item, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: (id: string) => {
    // Placeholder logic for local state update
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  reset: () => {
    set({ notifications: [], unreadCount: 0, error: null, isLoading: false });
  }
}));
