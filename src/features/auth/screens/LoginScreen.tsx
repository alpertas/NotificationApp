import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginCredentials } from '../authTypes';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen = ({ navigation }: any) => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [error, setError] = React.useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    try {
      await login(data);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
      
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
              error={!!errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        <HelperText type="error" visible={!!errors.email}>
          {errors.email?.message}
        </HelperText>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              secureTextEntry
              error={!!errors.password}
            />
          )}
        />
        <HelperText type="error" visible={!!errors.password}>
          {errors.password?.message}
        </HelperText>

        {error && (
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        )}

        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Login
        </Button>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Register')}
          style={styles.link}
        >
          Don't have an account? Sign up
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  form: {
    gap: 5,
  },
  button: {
    marginTop: 10,
  },
  link: {
    marginTop: 10,
  },
});
