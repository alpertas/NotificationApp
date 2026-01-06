import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { NotificationListScreen } from '../features/notifications/screens/NotificationListScreen';
import { CreateNotificationScreen } from '../features/notifications/screens/CreateNotificationScreen';
import { ActivityIndicator, View } from 'react-native';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

export const Navigation = () => {
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppStack.Navigator>
           <AppStack.Screen 
            name="NotificationList" 
            component={NotificationListScreen} 
            options={{ headerShown: false }}
          />
          <AppStack.Screen 
            name="CreateNotification" 
            component={CreateNotificationScreen} 
            options={{ headerShown: false }} 
          />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <AuthStack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }}
          />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};
