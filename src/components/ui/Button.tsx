import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import {Colors, Typography, Spacing, BorderRadius, Shadow} from '../../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'accent';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  onPress?: () => void;
  label: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const gradientMap: Record<string, string[]> = {
  primary: Colors.gradientPrimary as unknown as string[],
  secondary: Colors.gradientSecondary as unknown as string[],
  accent: Colors.gradientAccent as unknown as string[],
  gold: Colors.gradientGold as unknown as string[],
};

const sizeMap = {
  sm: {height: 36, paddingH: Spacing.md, fontSize: Typography.buttonSmall.fontSize, iconSize: 14},
  md: {height: 48, paddingH: Spacing.base, fontSize: Typography.button.fontSize, iconSize: 18},
  lg: {height: 56, paddingH: Spacing.xl, fontSize: Typography.button.fontSize + 1, iconSize: 20},
  xl: {height: 64, paddingH: Spacing.xl2, fontSize: Typography.button.fontSize + 2, iconSize: 22},
};

export default function Button({
  onPress,
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const sz = sizeMap[size];
  const isGradient = ['primary', 'secondary', 'accent', 'gold'].includes(variant);
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    height: sz.height,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    opacity: isDisabled ? 0.5 : 1,
    ...(fullWidth ? {width: '100%'} : {}),
    ...(isGradient ? Shadow.primary : {}),
  };

  const content = (
    <View
      style={[
        styles.inner,
        {paddingHorizontal: sz.paddingH, height: sz.height},
        !isGradient && styles.innerNonGradient,
        variant === 'outline' && styles.innerOutline,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
        />
      ) : (
        <>
          {icon && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.label,
              {fontSize: sz.fontSize},
              variant === 'outline' && styles.labelOutline,
              variant === 'ghost' && styles.labelGhost,
              variant === 'danger' && styles.labelDanger,
              textStyle,
            ]}>
            {label}
          </Text>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </>
      )}
    </View>
  );

  if (isGradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[containerStyle, style]}>
        <LinearGradient
          colors={gradientMap[variant] || gradientMap.primary}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={StyleSheet.absoluteFill}
        />
        {content}
      </TouchableOpacity>
    );
  }

  const bgMap: Record<string, string> = {
    outline: Colors.transparent,
    ghost: Colors.transparent,
    danger: Colors.error,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        containerStyle,
        {backgroundColor: bgMap[variant] || Colors.surface},
        variant === 'outline' && styles.outlineBorder,
        style,
      ]}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  innerNonGradient: {},
  innerOutline: {},
  label: {
    ...Typography.button,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  labelOutline: {
    color: Colors.primary,
  },
  labelGhost: {
    color: Colors.primary,
  },
  labelDanger: {
    color: Colors.white,
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  iconLeft: {
    marginRight: Spacing.xs2,
  },
  iconRight: {
    marginLeft: Spacing.xs2,
  },
});
