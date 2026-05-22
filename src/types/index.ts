export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';
export type ExportQuality = '4K' | '1080p' | '720p' | '480p';
export type CartoonStyle =
  | 'anime'
  | 'comic'
  | 'watercolor'
  | 'sketch'
  | 'pixar'
  | 'flat'
  | 'retro'
  | 'neon'
  | 'fantasy'
  | 'chibi'
  | 'realistic'
  | 'oil_painting'
  | 'cel_shading'
  | 'minimalist'
  | 'cyberpunk';

export type AnimationType =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'wave'
  | 'dance'
  | 'talk'
  | 'think'
  | 'laugh'
  | 'cry'
  | 'angry'
  | 'surprise'
  | 'sleep';

export type TransitionType =
  | 'fade'
  | 'slide_left'
  | 'slide_right'
  | 'slide_up'
  | 'slide_down'
  | 'zoom_in'
  | 'zoom_out'
  | 'flip'
  | 'rotate'
  | 'dissolve'
  | 'wipe'
  | 'morph';

export type BackgroundType = 'color' | 'gradient' | 'image' | 'video' | 'pattern';

export interface Color {
  hex: string;
  opacity: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  position: Position;
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
}

export interface Background {
  type: BackgroundType;
  color?: string;
  gradient?: {
    colors: string[];
    angle: number;
  };
  imageUri?: string;
  videoUri?: string;
  patternId?: string;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowOffset?: Position;
  shadowRadius?: number;
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  italic?: boolean;
  underline?: boolean;
  background?: string;
  backgroundBorderRadius?: number;
}

export interface Character {
  id: string;
  name: string;
  avatarUri: string;
  style: CartoonStyle;
  transform: Transform;
  animation: AnimationType;
  dialogueText?: string;
  dialogueStyle?: TextStyle;
  voiceId?: string;
  isVisible: boolean;
  opacity: number;
  layer: number;
  effects: string[];
  enterAnimation?: string;
  exitAnimation?: string;
  enterTime?: number;
  exitTime?: number;
}

export interface TextLayer {
  id: string;
  text: string;
  style: TextStyle;
  transform: Transform;
  animation?: string;
  isVisible: boolean;
  layer: number;
  enterTime?: number;
  exitTime?: number;
  duration?: number;
}

export interface Sticker {
  id: string;
  uri: string;
  transform: Transform;
  isVisible: boolean;
  layer: number;
  animation?: string;
  enterTime?: number;
  exitTime?: number;
}

export interface AudioLayer {
  id: string;
  uri: string;
  name: string;
  type: 'music' | 'sfx' | 'voice' | 'narration';
  startTime: number;
  duration: number;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
  pitch?: number;
  tempo?: number;
  cartoonEffect?: string;
  isVisible: boolean;
  color?: string;
}

export interface Effect {
  id: string;
  type: string;
  params: Record<string, number | string | boolean>;
  intensity: number;
}

export interface Scene {
  id: string;
  name: string;
  duration: number;
  background: Background;
  characters: Character[];
  textLayers: TextLayer[];
  stickers: Sticker[];
  audioLayers: AudioLayer[];
  effects: Effect[];
  transition: TransitionType;
  transitionDuration: number;
  thumbnail?: string;
}

export interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
  aspectRatio: AspectRatio;
  style: CartoonStyle;
  fps: number;
  exportQuality: ExportQuality;
  tags: string[];
  isFavorite: boolean;
  isShared: boolean;
  description?: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  duration: number;
  category: TemplateCategory;
  style: CartoonStyle;
  aspectRatio: AspectRatio;
  isPro: boolean;
  tags: string[];
  rating: number;
  uses: number;
  scenes: Scene[];
  previewVideoUri?: string;
}

export type TemplateCategory =
  | 'trending'
  | 'birthday'
  | 'love'
  | 'business'
  | 'education'
  | 'social_media'
  | 'gaming'
  | 'travel'
  | 'comedy'
  | 'music'
  | 'news'
  | 'sports'
  | 'kids'
  | 'holiday'
  | 'motivational';

export interface SubscriptionPlan {
  id: 'free' | 'pro_monthly' | 'pro_yearly';
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'once' | 'monthly' | 'yearly';
  features: PlanFeature[];
  maxVideos?: number;
  maxDuration?: number;
  exportQuality: ExportQuality[];
  hasWatermark: boolean;
  cloudStorage?: string;
}

export interface PlanFeature {
  label: string;
  included: boolean;
  highlight?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUri?: string;
  subscription: 'free' | 'pro_monthly' | 'pro_yearly';
  subscriptionExpiry?: string;
  totalVideos: number;
  totalDuration: number;
  joinedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  autoSave: boolean;
  hapticFeedback: boolean;
  pushNotifications: boolean;
  defaultAspectRatio: AspectRatio;
  defaultCartoonStyle: CartoonStyle;
  defaultExportQuality: ExportQuality;
  watermarkPosition: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'center';
}

export interface EditorState {
  projectId: string | null;
  currentSceneIndex: number;
  selectedElementId: string | null;
  selectedElementType: 'character' | 'text' | 'sticker' | 'audio' | null;
  playbackTime: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  zoom: number;
  isRecording: boolean;
  activePanel: EditorPanel;
  undoStack: string[];
  redoStack: string[];
  isDirty: boolean;
}

export type EditorPanel =
  | 'scenes'
  | 'characters'
  | 'effects'
  | 'audio'
  | 'text'
  | 'stickers'
  | 'transitions'
  | 'export'
  | 'settings';

export interface CartoonEffect {
  id: string;
  name: string;
  icon: string;
  category: EffectCategory;
  isPro: boolean;
  thumbnail: string;
  params?: Record<string, EffectParam>;
}

export interface EffectParam {
  type: 'slider' | 'color' | 'select' | 'toggle';
  label: string;
  min?: number;
  max?: number;
  step?: number;
  default: number | string | boolean;
  options?: string[];
}

export type EffectCategory =
  | 'cartoon_style'
  | 'color_grade'
  | 'distort'
  | 'glow'
  | 'blur'
  | 'vignette'
  | 'noise'
  | 'outline'
  | 'halftone'
  | 'vintage'
  | 'neon'
  | 'particle';

export interface Font {
  id: string;
  name: string;
  family: string;
  category: 'sans_serif' | 'serif' | 'display' | 'handwriting' | 'monospace' | 'cartoon';
  isPro: boolean;
  preview: string;
}

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  duration: number;
  genre: string;
  mood: string;
  tempo: number;
  isPro: boolean;
  uri: string;
  thumbnail: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  category: string;
  duration: number;
  uri: string;
  isPro: boolean;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  style: string;
  language: string;
  isPro: boolean;
  preview: string;
}

export interface ExportConfig {
  quality: ExportQuality;
  format: 'mp4' | 'mov' | 'gif' | 'webm';
  fps: number;
  bitrate: number;
  includeAudio: boolean;
  watermark: boolean;
  watermarkPosition?: string;
  destination: 'local' | 'cloud' | 'social';
}

export type AppRoute =
  | 'Onboarding'
  | 'Main'
  | 'Home'
  | 'Editor'
  | 'Templates'
  | 'Projects'
  | 'Subscription'
  | 'Profile'
  | 'Settings'
  | 'Export'
  | 'Preview';
