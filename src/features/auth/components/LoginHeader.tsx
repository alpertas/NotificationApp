import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { loginStyles as styles } from '../auth.styles';

export const LoginHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text variant="displaySmall" style={styles.title}>Welcome!</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Sign in to continue</Text>
    </View>
  );
};
