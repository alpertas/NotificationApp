import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { styles } from './NotificationSkeleton.styles';

const SkeletonCard = ({ opacity }: { opacity: Animated.Value }) => {
  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.iconCircle} />
      <View style={styles.content}>
        <View style={styles.titleLine} />
        <View style={styles.bodyLine} />
        <View style={[styles.bodyLine, { width: '60%' }]} />
      </View>
    </Animated.View>
  );
};

export const NotificationSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <SkeletonCard key={key} opacity={opacity} />
      ))}
    </View>
  );
};
