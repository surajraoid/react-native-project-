import React from 'react';
import {View, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import {Colors, BorderRadius, Shadow, Spacing} from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  gradient?: boolean;
  elevated?: boolean;
  glow?: 'primary' | 'secondary' | 'gold' | 'accent';
  padding?: number;
  borderColor?: string;
}

export default function Card({
  children,
  style,
  onPress,
  gradient = false,
  elevated = false,
  glow,
  padding = Spacing.base,
  borderColor,
}: CardProps) {
  const glowStyle: ViewStyle = glow
    ? {
        shadowColor:
          glow === 'primary'
            ? Colors.primary
            : glow === 'secondary'
            ? Colors.secondary
            : glow === 'gold'
            ? Colors.gold
            : Colors.accent,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
      }
    : {};

  const inner = (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        {padding},
        borderColor ? {borderColor, borderWidth: 1} : {},
        glowStyle,
        style,
      ]}>
      {gradient ? (
        <LinearGradient
          colors={[Colors.cardElevated, Colors.card]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={StyleSheet.absoluteFill}
          borderRadius={BorderRadius.base}
        />
      ) : null}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.base,
    overflow: 'hidden',
    ...Shadow.md,
  },
  elevated: {
    backgroundColor: Colors.cardElevated,
    ...Shadow.lg,
  },
});
