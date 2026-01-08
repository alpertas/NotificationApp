import React from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
import { theme, spacing } from '../../../core/theme';

export const LoginScreen = ({ navigation }: any) => {
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
      } catch (tokenErr) {
        console.error("Failed to fetch token for logs", tokenErr);
      }

    } catch (err: any) {
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
          <View style={styles.headerContainer}>
            <Text variant="displaySmall" style={styles.title}>Welcome!</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Sign in to continue</Text>
          </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.l, // 24
  },
  headerContainer: {
    marginBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: spacing.s,
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
    marginBottom: 4,
    fontSize: 16,
  },
  helperText: {
    marginBottom: spacing.s,
    marginTop: -4,
  },
  button: {
    marginTop: spacing.m,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkContainer: {
    marginTop: spacing.l,
    alignItems: 'center',
    padding: spacing.s,
  },
});