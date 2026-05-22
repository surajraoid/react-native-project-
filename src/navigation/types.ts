import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParams = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParams>;
  Editor: {projectId: string};
  Subscription: {highlight?: string};
  Preview: {projectId: string};
  Export: {projectId: string};
  Settings: undefined;
};

export type MainTabParams = {
  Home: undefined;
  Templates: undefined;
  Projects: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParams {}
  }
}
