import {useSubscriptionStore} from '../store/useSubscriptionStore';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

export function useSubscription() {
  const store = useSubscriptionStore();
  const navigation = useNavigation();

  const requirePro = useCallback(
    (feature?: string, action?: () => void) => {
      if (store.isPro()) {
        action?.();
        return true;
      }
      navigation.navigate('Subscription' as never, {highlight: feature} as never);
      return false;
    },
    [store, navigation],
  );

  const proGate = useCallback(
    (feature?: string) => (fn: () => void) => () => requirePro(feature, fn),
    [requirePro],
  );

  return {
    isPro: store.isPro(),
    currentPlan: store.currentPlan,
    expiryDate: store.expiryDate,
    plans: store.plans,
    canCreateVideo: store.canCreateVideo(),
    canExportHD: store.canExportHD(),
    hasWatermark: store.hasWatermark(),
    isLoading: store.isLoading,
    requirePro,
    proGate,
    subscribe: store.subscribe,
    cancelSubscription: store.cancelSubscription,
    restorePurchases: store.restorePurchases,
  };
}
