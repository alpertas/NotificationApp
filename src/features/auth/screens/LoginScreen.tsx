import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginCredentials } from '../authTypes';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';

export const LoginScreen = ({ navigation }: any) => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [error, setError] = React.useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    console.log("🟢 [DEBUG] onSubmit fonksiyonuna girildi. Veriler:", data);

    setError(null);
    try {
      console.log("🟡 [DEBUG] useAuthStore.login çağrılıyor...");
      await login(data);
      console.log("✅ [DEBUG] Login işlemi tamamlandı.");

      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        console.log("\n🔥🔥🔥 BACKEND TEST TOKEN 🔥🔥🔥");
        console.log(token);
        console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥\n");
      } else {
        console.log("⚠️ [DEBUG] User objesi null geldi.");
      }

    } catch (err: any) {
      console.error("🔴 [DEBUG] HATA OLUŞTU:", err);
      console.log("🔴 [DEBUG] Hata Detayı:", JSON.stringify(err, null, 2));
      setError(err.message || 'Login failed');
    }
  };

  const onError = (errors: any) => {
    console.log("⛔ [DEBUG] Form Validasyon Hatası:", errors);
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
          onPress={handleSubmit(onSubmit, onError)}
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