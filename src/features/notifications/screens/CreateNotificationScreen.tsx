import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton, useTheme } from 'react-native-paper';
import { useToast } from '../../../core/hooks/useToast';
import { notificationService } from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CreateNotificationScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const { showToast } = useToast();

  const handleSend = async () => {
    if (!title || !body) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      // Assuming sending to 'self' or handled by backend logic (to: 'current_user_token' or topic)
      // For this case study, we just send title/body.
      await notificationService.createNotification({
        to: 'self', // or specific token if the app supports picking users
        title,
        body,
        data: { screen: 'NotificationList' }
      });
      showToast('Notification sent!', 'success');
      navigation.goBack();
    } catch (error) {
      showToast('Failed to send notification', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Custom Header */}
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <View>
              <Text variant="titleLarge" style={styles.headerTitle}>New Notification</Text>
              <Text variant="bodySmall" style={styles.headerSubtitle}>Compose a message to yourself</Text>
            </View>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              outlineColor="transparent"
              activeOutlineColor="#FF8F00"
              theme={{ roundness: 12 }}
              left={<TextInput.Icon icon="format-title" color="#6B7280" />}
              placeholder="Enter notification title"
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              label="Message"
              value={body}
              onChangeText={setBody}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={[styles.input, styles.textArea]}
              outlineColor="transparent"
              activeOutlineColor="#FF8F00"
              theme={{ roundness: 12 }}
              left={<TextInput.Icon icon="text" color="#6B7280" style={{ marginBottom: 84 }} />} // Align icon to top aproximately
              placeholder="What's on your mind?"
              placeholderTextColor="#9CA3AF"
            />

            <Button
              mode="contained"
              onPress={handleSend}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              SEND NOTIFICATION
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  backButton: {
    marginRight: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    color: '#6B7280',
  },
  form: {
    padding: 24,
    gap: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    fontSize: 16,
  },
  textArea: {
    paddingVertical: 8, // Add padding for multiline comfort
  },
  button: {
    marginTop: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#FF8F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: '#FF8F00',
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
