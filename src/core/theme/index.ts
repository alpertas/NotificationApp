import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// 1. Define Central Palette (Single Source of Truth)
const palette = {
  primary: '#FFA000',      // Firebase Amber
  secondary: '#FF6F00',
  background: '#FFFFFF',
  surface: '#F5F5F5',      // Input backgrounds etc.
  error: '#D32F2F',
  success: '#388E3C',
  textPrimary: '#212121',
  textSecondary: '#757575',
  white: '#FFFFFF',
  black: '#000000',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey800: '#424242',
};

// 2. Define Spacing System
export const spacing = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// 3. Define Typography (Optional extensions)
export const fontSizes = {
  small: 12,
  medium: 14,
  regular: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
};

// 4. Create Paper Theme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    surface: palette.surface,
    error: palette.error,
    onPrimary: palette.white,
    onSurface: palette.textPrimary,
    // Custom semantic colors for usage in styles
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    success: palette.success,
    inputBackground: palette.surface,
    disabled: palette.grey300,
  },
  spacing,
  palette, // Export raw palette if needed
};
