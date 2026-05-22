import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParams} from './types';
import {useAppStore} from '../store/useAppStore';
import MainTabNavigator from './MainTabNavigator';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import EditorScreen from '../screens/Editor/EditorScreen';
import SubscriptionScreen from '../screens/Subscription/SubscriptionScreen';

const Stack = createStackNavigator<RootStackParams>();

const darkNavTheme = {
  dark: true,
  colors: {
    primary: '#7C4DFF',
    background: '#0A0A1A',
    card: '#12122A',
    text: '#FFFFFF',
    border: '#2A2A4A',
    notification: '#FF4081',
  },
};

export default function RootNavigator() {
  const {isOnboardingDone} = useAppStore();

  return (
    <NavigationContainer theme={darkNavTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#0A0A1A'},
          gestureEnabled: true,
        }}
        initialRouteName={isOnboardingDone ? 'Main' : 'Onboarding'}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen
          name="Editor"
          component={EditorScreen}
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{
            presentation: 'modal',
            cardOverlayEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
