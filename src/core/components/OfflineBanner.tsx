import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { theme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const OfflineBanner = () => {
  const { isConnected } = useNetworkStatus();
  const [slideAnim] = useState(new Animated.Value(-100)); // Start off-screen
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isConnected === false) {
      // Slide Down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide Up
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected]);

  // Don't render until we know status (null check), but animation handles visibility
  if (isConnected === null) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 8),
        },
      ]}
    >
      <Surface style={styles.banner} elevation={4}>
        <View style={styles.content}>
          <Text variant="labelLarge" style={styles.text}>
            No Internet Connection
          </Text>
        </View>
      </Surface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999, // Ensure it's above everything
    backgroundColor: theme.colors.error,
  },
  banner: {
    backgroundColor: theme.colors.error,
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
  },
});
