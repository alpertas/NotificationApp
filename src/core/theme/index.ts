import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF8F00', // Firebase Deep Orange
    secondary: '#FF6F00',
    background: '#F7F9FC', // Keep soft background
    surface: '#ffffff',
    error: '#D32F2F',
    primaryContainer: '#FFF8E1', // Pale Amber for containers
  },
};
