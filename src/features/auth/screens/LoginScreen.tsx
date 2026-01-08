import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { GlobalLoader } from '../../../core/components/GlobalLoader';
import { theme } from '../../../core/theme';
import { loginStyles as styles } from '../auth.styles';
import { LoginHeader } from '../components/LoginHeader';
import { useLogin } from '../hooks/useLogin';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen = () => {
  const { control, handleSubmit, errors, onSubmit, isLoading, navigateToRegister } = useLogin();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <GlobalLoader visible={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          <LoginHeader />

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  theme={{ roundness: 12 }}
                  style={styles.input}
                  outlineColor="transparent"
                  activeOutlineColor={theme.colors.primary}
                  placeholderTextColor={theme.colors.textSecondary}
                  error={!!errors.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  left={<TextInput.Icon icon="email-outline" color={theme.colors.textSecondary} />}
                />
              )}
            />
            {errors.email && (
              <HelperText type="error" visible={true} style={styles.helperText}>
                {errors.email.message}
              </HelperText>
            )}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  theme={{ roundness: 12 }}
                  style={styles.input}
                  outlineColor="transparent"
                  activeOutlineColor={theme.colors.primary}
                  secureTextEntry
                  error={!!errors.password}
                  left={<TextInput.Icon icon="lock-outline" color={theme.colors.textSecondary} />}
                />
              )}
            />
            {errors.password && (
              <HelperText type="error" visible={true} style={styles.helperText}>
                {errors.password.message}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              LOGIN
            </Button>

            <TouchableOpacity
              onPress={navigateToRegister}
              style={styles.linkContainer}
            >
              <Text variant="bodyMedium" style={{ color: theme.colors.textSecondary }}>
                Don't have an account? <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};