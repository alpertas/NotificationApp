import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import { theme, spacing } from '../../../core/theme';
import { GlobalLoader } from '../../../core/components/GlobalLoader';
import { createStyles as styles } from '../notification.styles';
import { CreateNotificationHeader } from '../components/CreateNotificationHeader';
import { CustomLabeledInput } from '../components/CustomLabeledInput';
import { useCreateNotification } from '../hooks/useCreateNotification';

export const CreateNotificationScreen = () => {
  const {
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
    goBack
  } = useCreateNotification();

  const titleValue = watch('title');
  const bodyValue = watch('body');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlobalLoader visible={loading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

            <CreateNotificationHeader
              onBack={goBack}
              title={initialData ? "Edit Draft" : "New Notification"}
            />

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
