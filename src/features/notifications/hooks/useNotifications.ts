import { useState, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useToast } from '../../../core/hooks/useToast';
import { notificationService } from '../services/notificationService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { theme } from '../../../core/theme';
import { NotificationListProps } from '../../../core/navigation/types';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  deliveryStatus: 'PENDING' | 'SENT' | 'FAILED' | 'DRAFT';
}

export const useNotifications = () => {
  const navigation = useNavigation<NotificationListProps['navigation']>();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  const fetchNotifications = useCallback(async (isManual = false) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await notificationService.getNotifications();
      // Ensure data maps to our new interface if backend doesn't provide status yet, default to SENT or PENDING
      const mappedData = Array.isArray(data) ? data.map((item: any) => {
        // Determine status from various possible fields
        const rawStatus = item.deliveryStatus || item.status || item.data?.status || 'SENT';
        
        return {
          ...item,
          deliveryStatus: rawStatus.toUpperCase(),
          createdAt: item.createdAt || item.timestamp || new Date().toISOString()
        };
      }) : [];
      // Sort by createdAt descending (newest first)
      mappedData.sort((a, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(mappedData);
    } catch (error) {
      console.log('Error fetching notifications', error);
      showToast('Failed to refresh notifications', 'error');
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchNotifications();
      }
    }, [isAuthenticated, fetchNotifications])
  );

  const getStatusColor = (status: NotificationItem['deliveryStatus']) => {
    switch (status) {
      case 'SENT': return theme.colors.success;
      case 'FAILED': return theme.colors.error;
      case 'PENDING': return theme.colors.primary;
      case 'DRAFT': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: NotificationItem['deliveryStatus']) => {
    switch (status) {
      case 'SENT': return 'check-circle-outline';
      case 'FAILED': return 'alert-circle-outline';
      case 'PENDING': return 'clock-outline';
      case 'DRAFT': return 'content-save-outline';
      default: return 'bell-outline';
    }
  };

  const handleNotificationPress = (item: NotificationItem) => {
    console.log(`[NotificationList] Clicked item: ${item.id}, Status: ${item.deliveryStatus}`);
    // Allow editing Drafts and Pending (stuck) notifications
    if (item.deliveryStatus === 'DRAFT' || item.deliveryStatus === 'PENDING') {
      navigation.navigate('CreateNotification', {
        initialData: { title: item.title, body: item.body }
      });
    }
  }

  const handleCreateNotification = () => {
    navigation.navigate('CreateNotification');
  }

  return {
    notifications,
    loading,
    refreshing,
    handleRefresh: () => fetchNotifications(true),
    logout,
    handleNotificationPress,
    handleCreateNotification,
    getStatusColor,
    getStatusIcon
  };
};
