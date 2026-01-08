import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginCredentials } from '../authTypes';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '../../../core/hooks/useToast';
import { parseAuthError } from '../../../core/utils/errorParser';
import { getAuth } from 'firebase/auth';
import { GlobalLoader } from '../../../core/components/GlobalLoader';
import { theme } from '../../../core/theme';
import { loginStyles as styles } from '../auth.styles';
import { LoginHeader } from '../components/LoginHeader';
import { LoginProps } from '../../../core/navigation/types';

export const LoginScreen = ({ navigation }: LoginProps) => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { showToast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);

      // Log Swagger Token
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          // TODO: Remove in production
          console.log("\n🔑🔑🔑 SWAGGER TOKEN 🔑🔑🔑");
          console.log(token);
          console.log("🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑\n");
        }
      } catch (tokenErr: unknown) {
        console.error("Failed to fetch token for logs", tokenErr);
      }

    } catch (err: unknown) {
      console.error("Login Error:", err);
      showToast(parseAuthError(err), 'error');
    }
  };

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
              onPress={() => navigation.replace('Register')}
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