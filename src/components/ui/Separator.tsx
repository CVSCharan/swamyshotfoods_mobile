import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { lightColors, darkColors } from '../../theme/colors';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: ViewStyle;
  colorScheme?: 'light' | 'dark';
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  style,
  colorScheme = 'light',
}) => {
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <View
      style={[
        styles.separator,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        { backgroundColor: colors.border },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#e5e7eb',
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});
