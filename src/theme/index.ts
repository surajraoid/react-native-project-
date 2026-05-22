export {Colors} from './colors';
export type {ColorKey} from './colors';
export {Typography, fontFamily_} from './typography';
export {Spacing, BorderRadius, Shadow} from './spacing';

export const Theme = {
  dark: {
    background: '#0A0A1A',
    surface: '#12122A',
    card: '#1A1A35',
    text: '#FFFFFF',
    textSecondary: '#B8B8D4',
  },
  light: {
    background: '#F5F5FF',
    surface: '#EFEFFF',
    card: '#FFFFFF',
    text: '#0A0A1A',
    textSecondary: '#4A4A6A',
  },
} as const;
