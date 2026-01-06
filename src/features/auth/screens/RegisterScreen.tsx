import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterCredentials } from '../authTypes';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export const RegisterScreen = ({ navigation }: any) => {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [error, setError] = React.useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterCredentials) => {
    setError(null);
    try {
      await register(data);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
      
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
          Sign Up
        </Button>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Login')}
          style={styles.link}
        >
          Already have an account? Login
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
