import React from 'react';
import { Image } from 'react-native';

const FastImage = (props: any) => React.createElement(Image, props);
FastImage.displayName = 'FastImage';

FastImage.resizeMode = {
  contain: 'contain' as const,
  cover: 'cover' as const,
  stretch: 'stretch' as const,
  center: 'center' as const,
};

FastImage.priority = { low: 'low', normal: 'normal', high: 'high' };
FastImage.cacheControl = { immutable: 'immutable', web: 'web', cacheOnly: 'cacheOnly' };
FastImage.preload = (_sources: any[]) => {};

export default FastImage;
