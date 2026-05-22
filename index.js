import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App)
// on native and renders using React 18 createRoot on web.
registerRootComponent(App);
