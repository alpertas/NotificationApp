import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TextInput as RNTextInput } from 'react-native';
import { Button, Text, IconButton, useTheme, HelperText } from 'react-native-paper';
import { useToast } from '../../../core/hooks/useToast';
import { notificationService } from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNotificationSchema, CreateNotificationFormData } from '../notificationTypes';
import * as Notifications from 'expo-notifications';

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
          placeholderTextColor="#9CA3AF"
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

import { GlobalLoader } from '../../../core/components/GlobalLoader';

export const CreateNotificationScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { showToast } = useToast();

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
              <View style={{ gap: 12 }}>
                <Button
                  mode="outlined"
                  onPress={handleTestNotification}
                  disabled={loading}
                  style={styles.testButton}
                  textColor="#FF8F00"
                  icon="bell-ring-outline"
                >
                  TEST LOCAL NOTIFICATION
                </Button>

                <Button
                  mode="outlined"
                  onPress={handleSaveDraft}
                  disabled={loading}
                  style={styles.draftButton}
                  textColor="#757575"
                  icon="content-save-outline"
                >
                  SAVE AS DRAFT
                </Button>

                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                  style={styles.button}
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
    backgroundColor: '#F7F9FC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
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
  formContainer: {
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    // Soft Shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20, // Increased spacing between groups
  },
  inputWrapper: {
    // Wrapper around label and input box
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 6, // 4-6px spacing
    marginLeft: 2,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F5F5F5', // Light grey bg
    paddingHorizontal: 16,
    minHeight: 56, // Standard touch target
    justifyContent: 'center',
  },
  inputBoxFocused: {
    borderColor: '#FFA000',
    backgroundColor: '#FFFFFF', // Optional: white on focus
    borderWidth: 1.5,
  },
  inputBoxError: {
    borderColor: '#D32F2F',
  },
  inputBoxDisabled: {
    backgroundColor: '#EEEEEE',
    opacity: 0.7,
  },
  nativeInput: {
    fontSize: 16,
    color: '#212121',
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
    color: '#D32F2F',
    fontSize: 12,
    paddingHorizontal: 0,
    marginTop: 0,
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
    marginLeft: 8,
  },
  charCountError: {
    color: '#D32F2F',
  },
  button: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: '#FFA000', 
  },
  testButton: {
    borderRadius: 12,
    borderColor: '#FFA000',
    borderWidth: 1,
  },
  draftButton: {
    borderRadius: 12,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },
});
