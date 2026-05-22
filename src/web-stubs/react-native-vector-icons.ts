import React from 'react';
import { Text } from 'react-native';

const Icon = ({ name, size = 16, color = '#fff', style }: any) =>
  React.createElement(Text, { style: [{ fontSize: size, color }, style] }, name?.[0]?.toUpperCase() ?? '');

Icon.Button = Icon;
export default Icon;
export { Icon };
