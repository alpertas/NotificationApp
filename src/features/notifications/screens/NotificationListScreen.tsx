import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, Button, FAB, ActivityIndicator } from 'react-native-paper';
import { notificationService } from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useFocusEffect } from '@react-navigation/native';

// Temporary Type
interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export const NotificationListScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { logout, isAuthenticated } = useAuthStore();

  const fetchNotifications = useCallback(async () => {
    // Race Condition Fix: Check if we have a token or user
    // Now we check useAuthStore which is faster
    const token = useAuthStore.getState().token;
    if (!token) {
      console.log('⚠️ [NotificationList] No token in store, skipping fetch.');
      return;
    }

    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.log('Error fetching notifications', error);
      setNotifications([]); // Clear on error or keep old? Clear safe.
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Auto-Refetch when screen focuses and we are authenticated
      if (isAuthenticated) {
        fetchNotifications();
      }

      // Cleanup function (optional, runs on blur or unmount)
      return () => {
        // setNotifications([]); // Optional: clear list on blur (user pref)
      };
    }, [isAuthenticated, fetchNotifications])
  );

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <Card style={styles.card}>
      <Card.Title title={item.title} subtitle={new Date(item.createdAt).toLocaleDateString()} />
      <Card.Content>
        <Text variant="bodyMedium">{item.body}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Notifications</Text>
        <Button onPress={logout}>Logout</Button>
      </View>

      {/* 
        Fix: Always render FlatList to allow Pull-to-Refresh even if list is empty or reloading.
        If initial loading (and no data), we can show ActivityIndicator, but for refresh we need list.
      */}
      {loading && notifications.length === 0 ? (
        <ActivityIndicator animating={true} style={styles.loader} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No notifications yet. Pull to refresh.</Text>}
          refreshing={loading}
          onRefresh={fetchNotifications}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNotification')}
        label="Send"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 2,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
