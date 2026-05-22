import {Platform} from 'react-native';

const fontFamily = {
  regular: Platform.select({ios: 'SF Pro Display', android: 'Roboto', default: 'System'}),
  medium: Platform.select({ios: 'SF Pro Display', android: 'Roboto-Medium', default: 'System'}),
  semiBold: Platform.select({ios: 'SF Pro Display', android: 'Roboto-Medium', default: 'System'}),
  bold: Platform.select({ios: 'SF Pro Display', android: 'Roboto-Bold', default: 'System'}),
  light: Platform.select({ios: 'SF Pro Display', android: 'Roboto-Light', default: 'System'}),
  mono: Platform.select({ios: 'SF Mono', android: 'RobotoMono-Regular', default: 'monospace'}),
};

export const Typography = {
  // Display
  display1: {
    fontSize: 56,
    fontWeight: '800' as const,
    letterSpacing: -1.5,
    lineHeight: 64,
    fontFamily: fontFamily.bold,
  },
  display2: {
    fontSize: 45,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 52,
    fontFamily: fontFamily.bold,
  },

  // Headings
  h1: {
    fontSize: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 44,
    fontFamily: fontFamily.bold,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
    lineHeight: 36,
    fontFamily: fontFamily.bold,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 30,
    fontFamily: fontFamily.semiBold,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 26,
    fontFamily: fontFamily.semiBold,
  },
  h5: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
    fontFamily: fontFamily.semiBold,
  },
  h6: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 22,
    fontFamily: fontFamily.semiBold,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 26,
    fontFamily: fontFamily.regular,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
  },

  // UI Elements
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 20,
    fontFamily: fontFamily.semiBold,
  },
  buttonSmall: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 18,
    fontFamily: fontFamily.semiBold,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 1.2,
    lineHeight: 16,
    fontFamily: fontFamily.medium,
    textTransform: 'uppercase' as const,
  },
  overline: {
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: 1.5,
    lineHeight: 14,
    fontFamily: fontFamily.medium,
    textTransform: 'uppercase' as const,
  },
  tag: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
    fontFamily: fontFamily.semiBold,
  },
  mono: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
    fontFamily: fontFamily.mono,
  },

  // Numeric / Stats
  statLarge: {
    fontSize: 40,
    fontWeight: '800' as const,
    letterSpacing: -1,
    lineHeight: 48,
    fontFamily: fontFamily.bold,
  },
  statMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 36,
    fontFamily: fontFamily.bold,
  },
  price: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
    fontFamily: fontFamily.bold,
  },
} as const;

export const fontFamily_ = fontFamily;
