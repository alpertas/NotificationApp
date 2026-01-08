import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { registerStyles as styles } from '../auth.styles';

export const RegisterHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text variant="displaySmall" style={styles.title}>Create Account</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Join us today!</Text>
    </View>
  );
};
