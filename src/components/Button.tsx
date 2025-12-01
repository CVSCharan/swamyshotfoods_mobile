/**
 * Custom Button wrapper for React Native Paper
 * Provides additional styling options while maintaining Paper's functionality
 */

import React from 'react';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outlined' | 'text';
}

export function Button({
  variant = 'primary',
  style,
  ...props
}: CustomButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'accent':
        return styles.accent;
      case 'outlined':
        return styles.outlined;
      case 'text':
        return styles.text;
      default:
        return styles.primary;
    }
  };

  const mode =
    variant === 'outlined'
      ? 'outlined'
      : variant === 'text'
      ? 'text'
      : 'contained';

  return (
    <PaperButton
      mode={mode}
      style={[getButtonStyle(), style]}
      contentStyle={styles.content}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  primary: {
    // Uses theme primary color by default
  },
  secondary: {
    // Uses theme secondary color
  },
  accent: {
    // Uses theme tertiary color
  },
  outlined: {
    // Outlined style
  },
  text: {
    // Text button style
  },
  content: {
    paddingVertical: 8,
  },
});
