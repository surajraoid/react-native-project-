import React from 'react';
import { View } from 'react-native';

const MaskedView = ({ children, maskElement, style }: any) =>
  React.createElement(View, { style }, children);

MaskedView.displayName = 'MaskedView';
export default MaskedView;
