import React from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../../core/hooks/useToast';
import { parseAuthError } from '../../../core/utils/errorParser';
import { registerSchema, RegisterCredentials } from '../authTypes';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export const RegisterScreen = ({ navigation }: any) => {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { showToast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      await register(data);
      showToast('Account created successfully!', 'success');
    } catch (err: any) {
      showToast(parseAuthError(err), 'error');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F7F9FC' }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Text variant="displaySmall" style={styles.title}>Create Account</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Join us today!</Text>
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
                  activeOutlineColor="#FF8F00"
                  placeholderTextColor="#9CA3AF"
                  error={!!errors.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  left={<TextInput.Icon icon="email-outline" color="#6B7280" />}
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
                  activeOutlineColor="#FF8F00"
                  secureTextEntry
                  error={!!errors.password}
                  left={<TextInput.Icon icon="lock-outline" color="#6B7280" />}
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
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              SIGN UP
            </Button>

            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
              style={styles.linkContainer}
            >
              <Text variant="bodyMedium" style={{ color: '#6B7280' }}>
                Already have an account? <Text style={{ color: '#FF8F00', fontWeight: 'bold' }}>Login</Text>
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
    padding: 24,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F5',
    marginBottom: 4,
    fontSize: 16,
  },
  helperText: {
    marginBottom: 8,
    marginTop: -4,
  },
  button: {
    marginTop: 16,
    borderRadius: 16,
    elevation: 4, // Shadow for Android
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
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
    padding: 8,
  },
});
