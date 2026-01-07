import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const useToast = () => useContext(ToastContext);

// Config
const TOAST_WIDTH = Dimensions.get('window').width - 40;
const TOAST_HEIGHT = 60;

const TOAST_CONFIG = {
  success: { icon: 'check-circle-outline', color: '#4CAF50', bg: '#E8F5E9' },
  error: { icon: 'alert-circle-outline', color: '#F44336', bg: '#FFEBEE' },
  info: { icon: 'information-outline', color: '#2196F3', bg: '#E3F2FD' },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const insets = useSafeAreaInsets();
  
  // Animation Value: Start at -100 (above screen)
  const translateY = useRef(new Animated.Value(-150)).current;

  const showToast = (msg: string, toastType: ToastType = 'info') => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);

    // Slide In
    Animated.spring(translateY, {
      toValue: insets.top + 10, // Just below status bar
      useNativeDriver: true,
      friction: 5,
    }).start();

    // Auto Hide
    setTimeout(() => {
      hideToast();
    }, 3000);
  };

  const hideToast = () => {
    Animated.timing(translateY, {
      toValue: -150,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View style={[
          styles.toastContainer, 
          { transform: [{ translateY }] },
          { borderLeftColor: TOAST_CONFIG[type].color }
        ]}>
            <View style={[styles.iconContainer, { backgroundColor: TOAST_CONFIG[type].bg }]}>
                <MaterialCommunityIcons 
                    name={TOAST_CONFIG[type].icon as any} 
                    size={24} 
                    color={TOAST_CONFIG[type].color} 
                />
            </View>
            <Text style={styles.message} numberOfLines={2}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: TOAST_WIDTH,
    minHeight: TOAST_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderLeftWidth: 4,
    zIndex: 9999,
  },
  iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  message: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
  }
});
