import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, ActivityIndicator, IconButton } from 'react-native-paper';
import { notificationService } from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from '../../../core/hooks/useToast';

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
  const [refreshing, setRefreshing] = useState(false);
  const { logout, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  const fetchNotifications = useCallback(async (isManual = false) => {
    // Race Condition Fix: Check if we have a token or user
    // Now we check useAuthStore which is faster
    const token = useAuthStore.getState().token;
    if (!token) {
      console.log('⚠️ [NotificationList] No token in store, skipping fetch.');
      return;
    }

    if (isManual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.log('Error fetching notifications', error);
      showToast('Failed to refresh notifications', 'error');
      setNotifications([]); // Clear on error or keep old? Clear safe.
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const renderItem = ({ item }: { item: NotificationItem }) => {
    // Date formatting helper
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Just now' : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardIconContainer}>
          <IconButton icon="bell-ring-outline" iconColor="#FF8F00" size={24} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
            <Text variant="bodySmall" style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text variant="bodyMedium" style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.headerTitle}>Notifications</Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>Manage your updates</Text>
        </View>
        <IconButton
          icon="logout"
          mode="contained-tonal"
          onPress={logout}
          iconColor="#B00020"
          containerColor="#FFEBEE"
          size={24}
        />
      </View>

      {/* 
        Fix: Always render FlatList to allow Pull-to-Refresh even if list is empty or reloading.
        If initial loading (and no data), we can show ActivityIndicator, but for refresh we need list.
      */}
      {loading && notifications.length === 0 ? (
        <ActivityIndicator animating={true} style={styles.loader} color="#FF8F00" size="large" />
      ) : (
        <FlatList
            data={notifications.slice().reverse()} // Show newest first
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <IconButton icon="bell-sleep-outline" size={64} iconColor="#E5E7EB" />
                <Text style={styles.emptyText}>No notifications yet.</Text>
                <Text style={styles.emptySubText}>Pull down to refresh</Text>
              </View>
            }
            refreshing={refreshing}
            onRefresh={() => fetchNotifications(true)}
            showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNotification')}
        label="New"
        color="white"
        theme={{ colors: { primaryContainer: '#FF8F00' } }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F9FC', // Seamless header
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    color: '#6B7280',
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    // Shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardIconContainer: {
    backgroundColor: '#FFF3E0', // Light Orange
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  cardDate: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  cardBody: {
    color: '#4B5563',
    lineHeight: 20,
  },
  loader: {
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  emptySubText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 20,
    borderRadius: 16,
  },
});
