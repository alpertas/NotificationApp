import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, IconButton } from 'react-native-paper';
import { notificationService } from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from '../../../core/hooks/useToast';
import { formatRelativeTime } from '../../../core/utils/dateFormatter';
import { NotificationSkeleton } from '../components/NotificationSkeleton';
import { theme, spacing } from '../../../core/theme';

// Enhanced Notification Type
interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  deliveryStatus: 'PENDING' | 'SENT' | 'FAILED' | 'DRAFT';
}

const getStatusColor = (status: NotificationItem['deliveryStatus']) => {
  switch (status) {
    case 'SENT': return theme.colors.success; // Green (Success)
    case 'FAILED': return theme.colors.error; // Red (Error)
    case 'PENDING': return theme.colors.primary; // Orange (Primary)
    case 'DRAFT': return theme.colors.textSecondary; // Grey
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

export const NotificationListScreen = ({ navigation }: any) => {
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
      const mappedData = Array.isArray(data) ? data.map((item: any) => ({
        ...item,
        deliveryStatus: item.deliveryStatus || 'SENT',
        createdAt: item.createdAt || item.timestamp || new Date().toISOString() // Handle timestamp field
      })) : [];
      // Sort by createdAt descending (newest first)
      mappedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(mappedData);
    } catch (error) {
      console.log('Error fetching notifications', error);
      showToast('Failed to refresh notifications', 'error');
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchNotifications();
      }
    }, [isAuthenticated, fetchNotifications])
  );

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const statusColor = getStatusColor(item.deliveryStatus);
    const statusIcon = getStatusIcon(item.deliveryStatus);

    return (
      <View style={[styles.cardContainer, { borderLeftColor: statusColor, borderLeftWidth: 4 }]}>
        <View style={[styles.cardIconContainer, { backgroundColor: statusColor + '20' }]}>
          {/* +20 for 12% opacity hex */}
          <IconButton icon={statusIcon} iconColor={statusColor} size={24} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
            <Text variant="bodySmall" style={styles.cardDate}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
          <Text variant="bodyMedium" style={styles.cardBody} numberOfLines={2} ellipsizeMode="tail">{item.body}</Text>
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
          iconColor={theme.colors.error}
          containerColor={theme.palette.grey100}
          size={24}
        />
      </View>

      {loading && notifications.length === 0 ? (
        <NotificationSkeleton />
      ) : (
        <FlatList
            data={notifications} // Already sorted newest first
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <IconButton icon="bell-sleep-outline" size={64} iconColor={theme.colors.disabled} />
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
        theme={{ colors: { primaryContainer: theme.colors.primary } }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    color: theme.colors.textSecondary,
  },
  list: {
    padding: spacing.l,
    paddingTop: 0,
  },
  cardContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginBottom: spacing.m,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'flex-start',
    // Shadow
    elevation: 2,
    shadowColor: theme.colors.backdrop,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardIconContainer: {
    backgroundColor: theme.palette.grey100, // Fallback if not status color
    borderRadius: 12,
    marginRight: spacing.m,
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
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: spacing.s,
  },
  cardDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  cardBody: {
    color: theme.colors.textSecondary,
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
    marginTop: spacing.m,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  emptySubText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: spacing.s,
  },
  fab: {
    position: 'absolute',
    margin: spacing.l,
    right: 0,
    bottom: 20,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
});
