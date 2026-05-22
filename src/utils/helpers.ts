import {Dimensions, Platform} from 'react-native';
import {AspectRatio} from '../types';

export function getCanvasDimensions(aspectRatio: AspectRatio, containerWidth: number) {
  const ratios: Record<AspectRatio, number> = {
    '16:9': 9 / 16,
    '9:16': 16 / 9,
    '1:1': 1,
    '4:3': 3 / 4,
    '21:9': 9 / 21,
  };
  const ratio = ratios[aspectRatio];
  return {
    width: containerWidth,
    height: Math.round(containerWidth * ratio),
  };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {return `${bytes} B`;}
  if (bytes < 1024 * 1024) {return `${(bytes / 1024).toFixed(1)} KB`;}
  if (bytes < 1024 * 1024 * 1024) {return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;}
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function isTablet(): boolean {
  const {width, height} = Dimensions.get('window');
  return Math.min(width, height) >= 600;
}

export function isLandscape(): boolean {
  const {width, height} = Dimensions.get('window');
  return width > height;
}

export function getDeviceType(): 'phone' | 'tablet' {
  return isTablet() ? 'tablet' : 'phone';
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function timelinePositionToMs(
  position: number,
  timelineWidth: number,
  totalDuration: number,
): number {
  return Math.round((position / timelineWidth) * totalDuration);
}

export function msToTimelinePosition(
  ms: number,
  timelineWidth: number,
  totalDuration: number,
): number {
  return (ms / totalDuration) * timelineWidth;
}

export function getAspectRatioDimensions(ratio: AspectRatio): {width: number; height: number} {
  const map: Record<AspectRatio, {width: number; height: number}> = {
    '16:9': {width: 1920, height: 1080},
    '9:16': {width: 1080, height: 1920},
    '1:1': {width: 1080, height: 1080},
    '4:3': {width: 1280, height: 960},
    '21:9': {width: 2560, height: 1080},
  };
  return map[ratio];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {return text;}
  return `${text.substring(0, maxLength - 3)}...`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
