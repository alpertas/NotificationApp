import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  NotificationList: undefined;
  CreateNotification: undefined;
};

export type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type CreateNotificationProps = NativeStackScreenProps<RootStackParamList, 'CreateNotification'>;
export type NotificationListProps = NativeStackScreenProps<RootStackParamList, 'NotificationList'>;
