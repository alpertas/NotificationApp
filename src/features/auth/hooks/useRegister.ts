import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterCredentials } from '../authTypes';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../../../core/hooks/useToast';
import { parseAuthError } from '../../../core/utils/errorParser';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../core/navigation/types';

export const useRegister = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    } catch (err: unknown) {
      showToast(parseAuthError(err), 'error');
    }
  };

  const navigateToLogin = () => {
    navigation.replace('Login');
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    navigateToLogin
  };
};
