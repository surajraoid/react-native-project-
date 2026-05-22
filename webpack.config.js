const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Alias native-only modules to web stubs so the bundle compiles on web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-purchases': path.resolve(__dirname, 'src/web-stubs/react-native-purchases.ts'),
    'react-native-video': path.resolve(__dirname, 'src/web-stubs/react-native-video.ts'),
    'react-native-image-picker': path.resolve(__dirname, 'src/web-stubs/react-native-image-picker.ts'),
    'react-native-camera': path.resolve(__dirname, 'src/web-stubs/react-native-camera.ts'),
    'react-native-fs': path.resolve(__dirname, 'src/web-stubs/react-native-fs.ts'),
    'react-native-blob-util': path.resolve(__dirname, 'src/web-stubs/react-native-blob-util.ts'),
    'react-native-share': path.resolve(__dirname, 'src/web-stubs/react-native-share.ts'),
    'react-native-document-picker': path.resolve(__dirname, 'src/web-stubs/react-native-document-picker.ts'),
    'react-native-audio-recorder-player': path.resolve(__dirname, 'src/web-stubs/react-native-audio-recorder-player.ts'),
    'react-native-haptic-feedback': path.resolve(__dirname, 'src/web-stubs/react-native-haptic-feedback.ts'),
    'react-native-fast-image': path.resolve(__dirname, 'src/web-stubs/react-native-fast-image.ts'),
    'react-native-localize': path.resolve(__dirname, 'src/web-stubs/react-native-localize.ts'),
    'react-native-orientation-locker': path.resolve(__dirname, 'src/web-stubs/react-native-orientation-locker.ts'),
    'react-native-vector-icons/MaterialIcons': path.resolve(__dirname, 'src/web-stubs/react-native-vector-icons.ts'),
    'react-native-vector-icons/Ionicons': path.resolve(__dirname, 'src/web-stubs/react-native-vector-icons.ts'),
    'react-native-vector-icons/FontAwesome': path.resolve(__dirname, 'src/web-stubs/react-native-vector-icons.ts'),
    '@react-native-masked-view/masked-view': path.resolve(__dirname, 'src/web-stubs/masked-view.ts'),
  };

  return config;
};
