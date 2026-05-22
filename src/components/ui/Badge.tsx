import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import {Colors, Typography, Spacing, BorderRadius} from '../../theme';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gold' | 'outline' | 'pro';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  small?: boolean;
  style?: ViewStyle;
  emoji?: string;
}

const variantConfig: Record<BadgeVariant, {bg: string; text: string; border?: string; gradient?: string[]}> = {
  primary: {bg: Colors.primaryTransparent20, text: Colors.primaryLight},
  secondary: {bg: Colors.secondaryTransparent20, text: Colors.secondaryLight},
  success: {bg: 'rgba(0,230,118,0.15)', text: Colors.success},
  warning: {bg: 'rgba(255,171,0,0.15)', text: Colors.warning},
  error: {bg: 'rgba(255,23,68,0.15)', text: Colors.errorLight},
  gold: {bg: 'rgba(255,215,0,0.15)', text: Colors.gold},
  outline: {bg: Colors.transparent, text: Colors.textSecondary, border: Colors.border},
  pro: {
    bg: Colors.transparent,
    text: Colors.goldLight,
    gradient: Colors.gradientGold as unknown as string[],
  },
};

export default function Badge({label, variant = 'primary', small = false, style, emoji}: BadgeProps) {
  const cfg = variantConfig[variant];
  const height = small ? 20 : 24;
  const px = small ? Spacing.xs : Spacing.sm;

  if (variant === 'pro') {
    return (
      <View style={[{height, borderRadius: BorderRadius.full, overflow: 'hidden'}, style]}>
        <LinearGradient
          colors={cfg.gradient!}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.inner, {height, paddingHorizontal: px}]}>
          <Text style={[small ? styles.labelSm : styles.label, {color: '#0A0A1A'}]}>
            {emoji}{emoji ? ' ' : ''}⭐ PRO
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.inner,
        {
          height,
          paddingHorizontal: px,
          backgroundColor: cfg.bg,
          borderRadius: BorderRadius.full,
          ...(cfg.border ? {borderWidth: 1, borderColor: cfg.border} : {}),
        },
        style,
      ]}>
      <Text style={[small ? styles.labelSm : styles.label, {color: cfg.text}]}>
        {emoji}{emoji ? ' ' : ''}{label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.tag,
    fontWeight: '600',
  },
  labelSm: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
