import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNotificationSchema, CreateNotificationFormData, NotificationItem } from '../notificationTypes';
import { useToast } from '../../../core/hooks/useToast';
import { notificationService } from '../services/notificationService';
import { useNetworkStatus } from '../../../core/hooks/useNetworkStatus';
import * as Notifications from 'expo-notifications';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CreateNotificationProps, RootStackParamList } from '../../../core/navigation/types';
import { useNotificationStore } from '../store/useNotificationStore';

export const useCreateNotification = () => {
  const navigation = useNavigation<CreateNotificationProps['navigation']>();
  const route = useRoute<RouteProp<RootStackParamList, 'CreateNotification'>>();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { isConnected } = useNetworkStatus();
  const { addNotification } = useNotificationStore();

  // Get initialData from route params if available
  const initialData = route.params?.initialData;

  const { control, handleSubmit, formState: { errors }, watch, getValues, reset } = useForm<CreateNotificationFormData>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: initialData?.title || '',
      body: initialData?.body || ''
    }
  });

  // Populate form if initialData exists (e.g. re-opening a draft)
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        body: initialData.body
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CreateNotificationFormData) => {
    if (isConnected === false) {
      showToast('No internet connection', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await notificationService.createNotification({
        to: 'self',
        title: data.title,
        body: data.body,
        data: { screen: 'NotificationList' }
      });

      showToast('Push Sent: ' + data.title, 'success');

      // Optimistic update
      const newItem: NotificationItem = {
        id: response?.id || Math.random().toString(),
        title: data.title,
        body: data.body,
        createdAt: new Date().toISOString(),
        deliveryStatus: 'SENT',
        data: { screen: 'NotificationList' }
      };
      addNotification(newItem);

      navigation.goBack();
    } catch (error) {
      showToast('Failed to send notification', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    const title = getValues('title');
    const body = getValues('body');

    if (!title || !body) {
      showToast('Please enter title and message to test', 'info');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { test: true },
      },
      trigger: null, // Immediate
    });

    showToast('Local Notification Scheduled', 'success');
  };

  const handleSaveDraft = async () => {
    if (isConnected === false) {
      showToast('Cannot save draft while offline', 'error');
      return;
    }

    const data = getValues();
    if (!data.title || !data.body) {
      showToast('Please enter title and body to save draft', 'info');
      return;
    }

    setLoading(true);
    try {
      const response = await notificationService.saveAsDraft({
        to: 'self',
        title: data.title,
        body: data.body,
        data: { screen: 'NotificationList', status: 'DRAFT' }
      });

      showToast('Saved to drafts', 'info');

      // Optimistic update
      const newItem: NotificationItem = {
        id: response?.id || Math.random().toString(),
        title: data.title,
        body: data.body,
        createdAt: new Date().toISOString(),
        deliveryStatus: 'DRAFT',
        data: { screen: 'NotificationList' }
      };
      addNotification(newItem);

      navigation.goBack();
    } catch (error) {
      showToast('Failed to save draft', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    watch,
    loading,
    isConnected,
    initialData,
    onSubmit,
    handleTestNotification,
    handleSaveDraft,
    goBack: navigation.goBack
  };
};
