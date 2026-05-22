import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export {SCREEN_WIDTH, SCREEN_HEIGHT};

export const APP_NAME = 'ToonCraft Pro';
export const APP_VERSION = '1.0.0';
export const BUNDLE_ID = 'com.tooncraftpro.app';

export const SUBSCRIPTION = {
  FREE_MAX_VIDEOS: 1,
  FREE_MAX_DURATION: 30,
  PRO_MONTHLY_PRICE: 99,
  PRO_YEARLY_PRICE: 799,
  CURRENCY: '₹',
  CURRENCY_CODE: 'INR',
  REVENUECAT_KEY: 'YOUR_REVENUECAT_KEY',
  MONTHLY_PRODUCT_ID: 'tooncraftpro_monthly_99',
  YEARLY_PRODUCT_ID: 'tooncraftpro_yearly_799',
};

export const EXPORT = {
  DEFAULT_FPS: 30,
  DEFAULT_QUALITY: '1080p',
  MAX_DURATION_FREE: 30,
  SUPPORTED_FORMATS: ['mp4', 'mov', 'gif'],
};

export const EDITOR = {
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 3.0,
  DEFAULT_ZOOM: 1.0,
  TIMELINE_HEIGHT: 120,
  TOOLBAR_WIDTH: 60,
  PANEL_WIDTH: 280,
  DEFAULT_SCENE_DURATION: 5000,
  MAX_UNDO_STEPS: 50,
};

export const CARTOON_STYLES = [
  {id: 'anime', name: 'Anime', icon: '🎌', color: '#FF6B9D', isPro: false},
  {id: 'comic', name: 'Comic', icon: '💥', color: '#FF4444', isPro: false},
  {id: 'watercolor', name: 'Watercolor', icon: '🎨', color: '#64B5F6', isPro: false},
  {id: 'sketch', name: 'Sketch', icon: '✏️', color: '#9E9E9E', isPro: true},
  {id: 'pixar', name: 'Pixar 3D', icon: '🎬', color: '#66BB6A', isPro: true},
  {id: 'flat', name: 'Flat Design', icon: '🔷', color: '#42A5F5', isPro: false},
  {id: 'retro', name: 'Retro', icon: '📺', color: '#FFB300', isPro: true},
  {id: 'neon', name: 'Neon Glow', icon: '✨', color: '#00E5FF', isPro: true},
  {id: 'fantasy', name: 'Fantasy', icon: '🧙', color: '#CE93D8', isPro: true},
  {id: 'chibi', name: 'Chibi', icon: '🥺', color: '#F06292', isPro: false},
  {id: 'realistic', name: 'Semi-Real', icon: '🦸', color: '#78909C', isPro: true},
  {id: 'oil_painting', name: 'Oil Paint', icon: '🖼️', color: '#A1887F', isPro: true},
  {id: 'cel_shading', name: 'Cel Shade', icon: '🎯', color: '#4FC3F7', isPro: true},
  {id: 'minimalist', name: 'Minimal', icon: '⬜', color: '#E0E0E0', isPro: false},
  {id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖', color: '#FF4081', isPro: true},
] as const;

export const ASPECT_RATIOS = [
  {id: '16:9', label: '16:9', description: 'Landscape / YouTube', icon: '📺', width: 1920, height: 1080},
  {id: '9:16', label: '9:16', description: 'Portrait / Reels', icon: '📱', width: 1080, height: 1920},
  {id: '1:1', label: '1:1', description: 'Square / Instagram', icon: '⬛', width: 1080, height: 1080},
  {id: '4:3', label: '4:3', description: 'Classic', icon: '🖼️', width: 1280, height: 960},
  {id: '21:9', label: '21:9', description: 'Cinematic', icon: '🎬', width: 2560, height: 1080},
] as const;

export const TEMPLATE_CATEGORIES = [
  {id: 'trending', label: 'Trending', icon: '🔥'},
  {id: 'birthday', label: 'Birthday', icon: '🎂'},
  {id: 'love', label: 'Love & Romance', icon: '❤️'},
  {id: 'business', label: 'Business', icon: '💼'},
  {id: 'education', label: 'Education', icon: '📚'},
  {id: 'social_media', label: 'Social Media', icon: '📲'},
  {id: 'gaming', label: 'Gaming', icon: '🎮'},
  {id: 'travel', label: 'Travel', icon: '✈️'},
  {id: 'comedy', label: 'Comedy', icon: '😂'},
  {id: 'music', label: 'Music', icon: '🎵'},
  {id: 'news', label: 'News', icon: '📰'},
  {id: 'sports', label: 'Sports', icon: '⚽'},
  {id: 'kids', label: 'Kids', icon: '👶'},
  {id: 'holiday', label: 'Holiday', icon: '🎄'},
  {id: 'motivational', label: 'Motivation', icon: '💪'},
] as const;

export const ANIMATION_TYPES = [
  {id: 'idle', label: 'Idle', icon: '😐'},
  {id: 'walk', label: 'Walk', icon: '🚶'},
  {id: 'run', label: 'Run', icon: '🏃'},
  {id: 'jump', label: 'Jump', icon: '🦘'},
  {id: 'wave', label: 'Wave', icon: '👋'},
  {id: 'dance', label: 'Dance', icon: '💃'},
  {id: 'talk', label: 'Talk', icon: '💬'},
  {id: 'think', label: 'Think', icon: '🤔'},
  {id: 'laugh', label: 'Laugh', icon: '😂'},
  {id: 'cry', label: 'Cry', icon: '😢'},
  {id: 'angry', label: 'Angry', icon: '😠'},
  {id: 'surprise', label: 'Surprise', icon: '😲'},
  {id: 'sleep', label: 'Sleep', icon: '😴'},
] as const;

export const EFFECT_CATEGORIES = [
  {id: 'cartoon_style', label: 'Cartoon Style', icon: '🎨'},
  {id: 'color_grade', label: 'Color Grade', icon: '🌈'},
  {id: 'glow', label: 'Glow & Bloom', icon: '✨'},
  {id: 'blur', label: 'Blur & Focus', icon: '🔮'},
  {id: 'distort', label: 'Distort', icon: '🌀'},
  {id: 'outline', label: 'Outline', icon: '🖊️'},
  {id: 'vintage', label: 'Vintage', icon: '📷'},
  {id: 'neon', label: 'Neon', icon: '💡'},
  {id: 'particle', label: 'Particles', icon: '🌟'},
  {id: 'halftone', label: 'Halftone', icon: '⚫'},
] as const;

export const MUSIC_MOODS = [
  'Happy', 'Sad', 'Epic', 'Funny', 'Romantic', 'Action',
  'Chill', 'Mysterious', 'Horror', 'Kids', 'Corporate',
] as const;

export const VOICE_CARTOON_EFFECTS = [
  {id: 'none', label: 'Original'},
  {id: 'chipmunk', label: 'Chipmunk'},
  {id: 'robot', label: 'Robot'},
  {id: 'deep', label: 'Deep Voice'},
  {id: 'echo', label: 'Echo'},
  {id: 'reverb', label: 'Reverb'},
  {id: 'cartoon', label: 'Cartoon'},
  {id: 'alien', label: 'Alien'},
  {id: 'whisper', label: 'Whisper'},
] as const;

export const STORAGE_KEYS = {
  USER_PROFILE: '@tooncraftpro/user_profile',
  PROJECTS: '@tooncraftpro/projects',
  SUBSCRIPTION: '@tooncraftpro/subscription',
  PREFERENCES: '@tooncraftpro/preferences',
  ONBOARDING_DONE: '@tooncraftpro/onboarding_done',
  LAST_PROJECT: '@tooncraftpro/last_project',
};
