import {create} from 'zustand';
import {UserProfile, UserPreferences} from '../types';
import {STORAGE_KEYS} from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  isLoading: boolean;
  isOnboardingDone: boolean;
  user: UserProfile | null;
  preferences: UserPreferences;
  isOffline: boolean;
  theme: 'dark' | 'light';

  setLoading: (loading: boolean) => void;
  setOnboardingDone: (done: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  logout: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  language: 'en',
  autoSave: true,
  hapticFeedback: true,
  pushNotifications: true,
  defaultAspectRatio: '16:9',
  defaultCartoonStyle: 'anime',
  defaultExportQuality: '1080p',
  watermarkPosition: 'bottom_right',
};

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: true,
  isOnboardingDone: false,
  user: null,
  preferences: defaultPreferences,
  isOffline: false,
  theme: 'dark',

  setLoading: loading => set({isLoading: loading}),
  setOnboardingDone: done => {
    set({isOnboardingDone: done});
    AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, JSON.stringify(done));
  },
  setUser: user => {
    set({user});
    if (user) {
      AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    }
  },
  updatePreferences: prefs => {
    const updated = {...get().preferences, ...prefs};
    set({preferences: updated, theme: updated.theme === 'auto' ? 'dark' : updated.theme});
    AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  },
  setTheme: theme => set({theme}),

  loadFromStorage: async () => {
    try {
      const [onboarding, userJson, prefsJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE),
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES),
      ]);
      const preferences = prefsJson
        ? {...defaultPreferences, ...JSON.parse(prefsJson)}
        : defaultPreferences;
      set({
        isOnboardingDone: onboarding ? JSON.parse(onboarding) : false,
        user: userJson ? JSON.parse(userJson) : null,
        preferences,
        theme: preferences.theme === 'auto' ? 'dark' : preferences.theme,
        isLoading: false,
      });
    } catch {
      set({isLoading: false});
    }
  },

  saveToStorage: async () => {
    const {user, preferences} = get();
    await Promise.all([
      user ? AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user)) : Promise.resolve(),
      AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences)),
    ]);
  },

  logout: () => {
    set({user: null});
    AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },
}));
