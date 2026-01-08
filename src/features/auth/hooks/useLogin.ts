import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginCredentials } from '../authTypes';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../../../core/hooks/useToast';
import { parseAuthError } from '../../../core/utils/errorParser';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../core/navigation/types';

export const useLogin = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  const navigateToRegister = () => {
    navigation.replace('Register');
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    navigateToRegister
  };
};
