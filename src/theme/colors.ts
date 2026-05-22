export const Colors = {
  // Background hierarchy
  background: '#0A0A1A',
  surface: '#12122A',
  card: '#1A1A35',
  cardElevated: '#22224A',
  overlay: 'rgba(0,0,0,0.75)',

  // Primary brand
  primary: '#7C4DFF',
  primaryLight: '#9E6FFF',
  primaryDark: '#5B2FD4',
  primaryGlow: 'rgba(124,77,255,0.3)',

  // Secondary accent
  secondary: '#FF4081',
  secondaryLight: '#FF6FA6',
  secondaryDark: '#C60055',
  secondaryGlow: 'rgba(255,64,129,0.3)',

  // Accent cyan
  accent: '#00E5FF',
  accentLight: '#6EFCFF',
  accentDark: '#00B2CC',
  accentGlow: 'rgba(0,229,255,0.25)',

  // Gold / Pro
  gold: '#FFD700',
  goldLight: '#FFEB6B',
  goldDark: '#C9A800',
  goldGlow: 'rgba(255,215,0,0.3)',

  // Status
  success: '#00E676',
  successLight: '#69F0AE',
  successDark: '#00B248',
  warning: '#FFAB00',
  warningLight: '#FFD740',
  warningDark: '#FF6D00',
  error: '#FF1744',
  errorLight: '#FF5252',
  errorDark: '#D50000',
  info: '#448AFF',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B8B8D4',
  textMuted: '#6B6B9A',
  textDisabled: '#3D3D60',
  textInverse: '#0A0A1A',
  textOnPrimary: '#FFFFFF',

  // Borders
  border: '#2A2A4A',
  borderLight: '#3A3A5C',
  borderFocus: '#7C4DFF',
  divider: '#1E1E38',

  // Gradients
  gradientPrimary: ['#7C4DFF', '#FF4081'] as const,
  gradientSecondary: ['#FF4081', '#FF6D00'] as const,
  gradientAccent: ['#00E5FF', '#7C4DFF'] as const,
  gradientGold: ['#FFD700', '#FF8C00'] as const,
  gradientDark: ['#1A1A35', '#0A0A1A'] as const,
  gradientCard: ['#22224A', '#1A1A35'] as const,
  gradientSuccess: ['#00E676', '#00B248'] as const,
  gradientPurpleBlue: ['#7C4DFF', '#448AFF'] as const,
  gradientSunset: ['#FF4081', '#FF6D00', '#FFAB00'] as const,
  gradientNeon: ['#00E5FF', '#7C4DFF', '#FF4081'] as const,
  gradientMidnight: ['#0A0A1A', '#12122A', '#1A1A35'] as const,

  // Cartoon style palettes
  styleAnime: '#FF6B9D',
  styleComic: '#FF4444',
  styleWatercolor: '#64B5F6',
  styleSketch: '#9E9E9E',
  stylePixar: '#66BB6A',
  styleFlat: '#42A5F5',
  styleRetro: '#FFB300',
  styleNeon: '#00E5FF',
  styleFantasy: '#CE93D8',
  styleChibi: '#F06292',
  styleCyberpunk: '#FF4081',
  styleCelShading: '#4FC3F7',

  // Transparent variants
  primaryTransparent10: 'rgba(124,77,255,0.1)',
  primaryTransparent20: 'rgba(124,77,255,0.2)',
  secondaryTransparent10: 'rgba(255,64,129,0.1)',
  secondaryTransparent20: 'rgba(255,64,129,0.2)',
  accentTransparent10: 'rgba(0,229,255,0.1)',
  whiteTransparent10: 'rgba(255,255,255,0.1)',
  whiteTransparent5: 'rgba(255,255,255,0.05)',
  blackTransparent50: 'rgba(0,0,0,0.5)',
  blackTransparent80: 'rgba(0,0,0,0.8)',

  // Timeline track colors
  trackVoice: '#7C4DFF',
  trackMusic: '#00E5FF',
  trackSFX: '#00E676',
  trackNarration: '#FF4081',
  trackVideo: '#FF6D00',

  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
