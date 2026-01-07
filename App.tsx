import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Navigation } from './src/app/Navigation';
import { theme } from './src/core/theme';
import { usePushNotification } from './src/features/notifications/hooks/usePushNotification';
import { ToastProvider } from './src/core/providers/ToastProvider';

// Component to handle global hook logic
const AppContent = () => {
  // Initialize Push Notifications (Listeners + Token)
  usePushNotification();

  return <Navigation />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
