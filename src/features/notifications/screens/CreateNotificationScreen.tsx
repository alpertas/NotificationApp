import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TextInput as RNTextInput } from 'react-native';
import { Button, Text, IconButton, HelperText } from 'react-native-paper';
import { useToast } from '../../../core/hooks/useToast';
import { notificationService } from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNotificationSchema, CreateNotificationFormData } from '../notificationTypes';
import * as Notifications from 'expo-notifications';
import { theme, spacing } from '../../../core/theme';
import { GlobalLoader } from '../../../core/components/GlobalLoader';
import { useNetworkStatus } from '../../../core/hooks/useNetworkStatus';

// Reusable Custom Input Component with External Label
const CustomLabeledInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          isFocused && styles.inputBoxFocused,
          error && styles.inputBoxError,
          disabled && styles.inputBoxDisabled,
          multiline && { height: 120 }
        ]}
      >
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          style={[
            styles.nativeInput,
            multiline && { textAlignVertical: 'top', paddingTop: 12 }
          ]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
        />
      </View>
    </View>
  );
};

export const CreateNotificationScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { isConnected } = useNetworkStatus();

  const { control, handleSubmit, formState: { errors }, watch, getValues } = useForm<CreateNotificationFormData>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: '',
      body: ''
    }
  });

  const titleValue = watch('title');
  const bodyValue = watch('body');

  const onSubmit = async (data: CreateNotificationFormData) => {
    if (isConnected === false) {
      showToast('No internet connection', 'error');
      return;
    }

    setLoading(true);
    try {
      await notificationService.createNotification({
        to: 'self',
        title: data.title,
        body: data.body,
        data: { screen: 'NotificationList' }
      });
      showToast('Push Sent: ' + data.title, 'success');
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
      await notificationService.saveAsDraft({
        to: 'self',
        title: data.title,
        body: data.body,
        data: { screen: 'NotificationList', status: 'DRAFT' }
      });
      showToast('Saved to drafts', 'info');
      navigation.goBack();
    } catch (error) {
      showToast('Failed to save draft', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlobalLoader visible={loading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

            {/* Header */}
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

            <View style={styles.formContainer}>

              {/* Composer Card */}
              <View style={styles.card}>

                {/* Title Input */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomLabeledInput
                        label="Title"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Enter title (e.g. Order Update)"
                        error={!!errors.title}
                        disabled={loading}
                      />
                    )}
                  />
                  <View style={styles.inputFooter}>
                    <HelperText type="error" visible={!!errors.title} style={styles.errorText}>
                      {errors.title?.message}
                    </HelperText>
                    <Text style={[styles.charCount, (titleValue?.length || 0) > 50 && styles.charCountError]}>
                      {titleValue?.length || 0}/50
                    </Text>
                  </View>
                </View>

                {/* Message Input */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="body"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomLabeledInput
                        label="Message"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Type your message here..."
                        multiline={true}
                        numberOfLines={5}
                        error={!!errors.body}
                        disabled={loading}
                      />
                    )}
                  />
                  <View style={styles.inputFooter}>
                    <HelperText type="error" visible={!!errors.body} style={styles.errorText}>
                      {errors.body?.message}
                    </HelperText>
                    <Text style={[styles.charCount, (bodyValue?.length || 0) > 250 && styles.charCountError]}>
                      {bodyValue?.length || 0}/250
                    </Text>
                  </View>
                </View>

              </View>

              {/* Action Buttons */}
              <View style={{ gap: spacing.s + 4 }}>
                <Button
                  mode="outlined"
                  onPress={handleTestNotification}
                  disabled={loading}
                  style={styles.testButton}
                  textColor={theme.colors.primary}
                  icon="bell-ring-outline"
                >
                  TEST LOCAL NOTIFICATION
                </Button>

                <Button
                  mode="outlined"
                  onPress={handleSaveDraft}
                  disabled={loading || isConnected === false}
                  style={[styles.draftButton, isConnected === false && styles.disabledButton]}
                  textColor={isConnected === false ? theme.colors.disabled : theme.colors.textSecondary}
                  icon="content-save-outline"
                >
                  SAVE AS DRAFT
                </Button>

                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading || isConnected === false}
                  style={[styles.button, isConnected === false && styles.disabledButton]}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  SEND NOTIFICATION
                </Button>
              </View>

            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    marginBottom: spacing.s,
  },
  backButton: {
    marginRight: spacing.s,
    marginLeft: -spacing.s,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    color: theme.colors.textSecondary,
  },
  formContainer: {
    paddingHorizontal: spacing.l,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: spacing.l,
    elevation: 2,
    shadowColor: theme.colors.backdrop, // Using backdrop or black
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: theme.palette.grey200,
  },
  inputContainer: {
    marginBottom: spacing.l,
  },
  inputWrapper: {
    // Wrapper around label and input box
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: theme.palette.grey300,
    borderRadius: 12,
    backgroundColor: theme.colors.background, // Or surface if card is surface
    paddingHorizontal: spacing.m,
    minHeight: 56,
    justifyContent: 'center',
  },
  inputBoxFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
  },
  inputBoxError: {
    borderColor: theme.colors.error,
  },
  inputBoxDisabled: {
    backgroundColor: theme.palette.grey200,
    opacity: 0.7,
  },
  nativeInput: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
    minHeight: 20,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    paddingHorizontal: 0,
    marginTop: 0,
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginLeft: 8,
  },
  charCountError: {
    color: theme.colors.error,
  },
  button: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  testButton: {
    borderRadius: 12,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  draftButton: {
    borderRadius: 12,
    borderColor: theme.palette.grey300,
    backgroundColor: theme.palette.grey100,
    borderWidth: 1,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: theme.colors.onPrimary,
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
});
