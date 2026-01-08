import React from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { createStyles as styles } from '../notification.styles';

interface CreateNotificationHeaderProps {
  onBack: () => void;
}

export const CreateNotificationHeader = ({ onBack }: CreateNotificationHeaderProps) => {
  return (
    <View style={styles.header}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={onBack}
        style={styles.backButton}
      />
      <View>
        <Text variant="titleLarge" style={styles.headerTitle}>New Notification</Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>Compose a message to yourself</Text>
      </View>
    </View>
  );
};
