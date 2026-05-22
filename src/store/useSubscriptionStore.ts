import {create} from 'zustand';
import {SubscriptionPlan} from '../types';
import {SUBSCRIPTION, STORAGE_KEYS} from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionState {
  currentPlan: 'free' | 'pro_monthly' | 'pro_yearly';
  expiryDate: string | null;
  isLoading: boolean;
  plans: SubscriptionPlan[];
  hasUsedFreeTrial: boolean;
  videosCreatedThisMonth: number;

  isPro: () => boolean;
  canCreateVideo: () => boolean;
  canExportHD: () => boolean;
  hasWatermark: () => boolean;
  loadSubscription: () => Promise<void>;
  subscribe: (planId: 'pro_monthly' | 'pro_yearly') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  incrementVideoCount: () => void;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: SUBSCRIPTION.CURRENCY,
    billingPeriod: 'once',
    maxVideos: 1,
    maxDuration: 30,
    exportQuality: ['480p', '720p'],
    hasWatermark: true,
    features: [
      {label: '1 video per month', included: true},
      {label: 'Basic cartoon styles (5)', included: true},
      {label: '720p export', included: true},
      {label: 'Watermark on videos', included: true},
      {label: 'Basic templates (10)', included: true},
      {label: '30 second max duration', included: true},
      {label: 'Limited characters', included: true},
      {label: '4K export', included: false},
      {label: 'No watermark', included: false},
      {label: 'All cartoon styles (15+)', included: false},
      {label: 'Unlimited videos', included: false},
      {label: 'Cloud backup', included: false},
      {label: 'Premium templates (100+)', included: false},
      {label: 'AI scene generation', included: false},
      {label: 'Priority support', included: false},
    ],
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: SUBSCRIPTION.PRO_MONTHLY_PRICE,
    currency: SUBSCRIPTION.CURRENCY,
    billingPeriod: 'monthly',
    exportQuality: ['480p', '720p', '1080p', '4K'],
    hasWatermark: false,
    cloudStorage: '5 GB',
    features: [
      {label: 'Unlimited videos', included: true, highlight: true},
      {label: 'All 15+ cartoon styles', included: true, highlight: true},
      {label: '4K ultra HD export', included: true, highlight: true},
      {label: 'No watermark', included: true, highlight: true},
      {label: 'Unlimited duration', included: true},
      {label: '100+ premium characters', included: true},
      {label: '100+ premium templates', included: true},
      {label: 'AI scene generation', included: true, highlight: true},
      {label: '5 GB cloud backup', included: true},
      {label: 'AI voice & lip sync', included: true},
      {label: 'Priority support', included: true},
      {label: 'Advanced audio tools', included: true},
      {label: 'Collaboration (coming soon)', included: true},
      {label: 'New features first', included: true},
      {label: 'Offline mode', included: true},
    ],
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: SUBSCRIPTION.PRO_YEARLY_PRICE,
    currency: SUBSCRIPTION.CURRENCY,
    billingPeriod: 'yearly',
    exportQuality: ['480p', '720p', '1080p', '4K'],
    hasWatermark: false,
    cloudStorage: '20 GB',
    features: [
      {label: 'Everything in Pro Monthly', included: true, highlight: true},
      {label: '20 GB cloud backup', included: true, highlight: true},
      {label: 'Save 33% vs monthly', included: true, highlight: true},
      {label: 'Exclusive yearly templates', included: true},
      {label: 'Early beta features', included: true},
      {label: 'Dedicated support', included: true},
    ],
  },
];

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentPlan: 'free',
  expiryDate: null,
  isLoading: false,
  plans,
  hasUsedFreeTrial: false,
  videosCreatedThisMonth: 0,

  isPro: () => get().currentPlan !== 'free',
  canCreateVideo: () => {
    const {currentPlan, videosCreatedThisMonth} = get();
    if (currentPlan !== 'free') {return true;}
    return videosCreatedThisMonth < 1;
  },
  canExportHD: () => get().currentPlan !== 'free',
  hasWatermark: () => get().currentPlan === 'free',

  loadSubscription: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      if (json) {
        const data = JSON.parse(json);
        if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
          set({currentPlan: 'free', expiryDate: null});
          return;
        }
        set({
          currentPlan: data.currentPlan || 'free',
          expiryDate: data.expiryDate || null,
          hasUsedFreeTrial: data.hasUsedFreeTrial || false,
          videosCreatedThisMonth: data.videosCreatedThisMonth || 0,
        });
      }
    } catch {}
  },

  subscribe: async planId => {
    set({isLoading: true});
    try {
      // In production, integrate RevenueCat SDK here
      // const purchased = await Purchases.purchaseProduct(productId);
      const expiry = planId === 'pro_monthly'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      set({currentPlan: planId, expiryDate: expiry, isLoading: false});
      await AsyncStorage.setItem(
        STORAGE_KEYS.SUBSCRIPTION,
        JSON.stringify({currentPlan: planId, expiryDate: expiry}),
      );
    } catch {
      set({isLoading: false});
    }
  },

  cancelSubscription: async () => {
    set({currentPlan: 'free', expiryDate: null});
    await AsyncStorage.setItem(
      STORAGE_KEYS.SUBSCRIPTION,
      JSON.stringify({currentPlan: 'free', expiryDate: null}),
    );
  },

  restorePurchases: async () => {
    set({isLoading: true});
    try {
      // In production: await Purchases.restorePurchases();
      set({isLoading: false});
    } catch {
      set({isLoading: false});
    }
  },

  incrementVideoCount: () => {
    const count = get().videosCreatedThisMonth + 1;
    set({videosCreatedThisMonth: count});
    AsyncStorage.setItem(
      STORAGE_KEYS.SUBSCRIPTION,
      JSON.stringify({...get(), videosCreatedThisMonth: count}),
    );
  },
}));
