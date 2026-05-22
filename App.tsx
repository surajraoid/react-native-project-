import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigation/RootNavigator';
import {useAppStore} from './src/store/useAppStore';
import {useProjectStore} from './src/store/useProjectStore';
import {useSubscriptionStore} from './src/store/useSubscriptionStore';
import {Colors} from './src/theme';

function AppLoader() {
  const {isLoading, loadFromStorage} = useAppStore();
  const {loadProjects} = useProjectStore();
  const {loadSubscription} = useSubscriptionStore();

  useEffect(() => {
    Promise.all([
      loadFromStorage(),
      loadProjects(),
      loadSubscription(),
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppLoader />
      <Toast />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  loader: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
