import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatRelativeTime } from '../../../core/utils/dateFormatter';
import { NotificationSkeleton } from '../components/NotificationSkeleton';
import { theme } from '../../../core/theme';
import { listStyles as styles } from '../notification.styles';
import { useNotifications, NotificationItem } from '../hooks/useNotifications';

export const NotificationListScreen = () => {
  const {
    notifications,
    loading,
    refreshing,
    handleRefresh,
    logout,
    handleNotificationPress,
    handleCreateNotification,
    getStatusColor,
    getStatusIcon
  } = useNotifications();

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const statusColor = getStatusColor(item.deliveryStatus);
    const statusIcon = getStatusIcon(item.deliveryStatus);

    return (
      <TouchableOpacity
        style={[styles.cardContainer, { borderLeftColor: statusColor, borderLeftWidth: 4 }]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
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
      </TouchableOpacity>
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
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateNotification}
        label="New"
        color="white"
        theme={{ colors: { primaryContainer: theme.colors.primary } }}
      />
    </SafeAreaView>
  );
};
