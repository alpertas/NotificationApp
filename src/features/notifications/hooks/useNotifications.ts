import { startTransition, useCallback, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useToast } from '../../../core/hooks/useToast';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { theme } from '../../../core/theme';
import { NotificationListProps } from '../../../core/navigation/types';
import { useNotificationStore } from '../store/useNotificationStore';
import { NotificationItem } from '../notificationTypes';

export { NotificationItem };

export const useNotifications = () => {
  const navigation = useNavigation<NotificationListProps['navigation']>();
  const { notifications, isLoading, error, fetchNotifications, reset } = useNotificationStore();
  const { logout, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  // Initial fetch when authenticated
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        // If we already have data, fetch in background without spinner
        const isBackground = notifications.length > 0;
        fetchNotifications(false, isBackground);
      } else {
        reset();
      }
    }, [isAuthenticated, fetchNotifications, reset, notifications.length])
  );

  // Handle errors from store
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

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
    loading: isLoading,
    refreshing: isLoading, // Using same loading state for now, can separate if needed
    handleRefresh: () => fetchNotifications(true),
    logout,
    handleNotificationPress,
    handleCreateNotification,
    getStatusColor,
    getStatusIcon
  };
};
