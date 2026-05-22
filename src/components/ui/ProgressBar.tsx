import React, {useEffect} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, Easing} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, BorderRadius} from '../../theme';

interface ProgressBarProps {
  progress: number; // 0-1
  height?: number;
  colors?: string[];
  trackColor?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  height = 4,
  colors = Colors.gradientPrimary as unknown as string[],
  trackColor = Colors.border,
  style,
  animated = true,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      width.value = withTiming(Math.min(1, Math.max(0, progress)), {
        duration: 400,
        easing: Easing.out(Easing.quad),
      });
    } else {
      width.value = Math.min(1, Math.max(0, progress));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, animated]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[{height, backgroundColor: trackColor, borderRadius: BorderRadius.full, overflow: 'hidden'}, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
