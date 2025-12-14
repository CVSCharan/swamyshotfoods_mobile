/**
 * Enhanced Button Component
 * Modern button with animations and haptic feedback
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button as PaperButton,
  ButtonProps,
  useTheme,
} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { buttonPress } from '../lib/haptics';
import { SPRING_CONFIGS, DURATIONS } from '../lib/animations';

// ============================================================================
// TYPES
// ============================================================================

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outlined' | 'text';
  enableHaptic?: boolean;
  enableAnimation?: boolean;
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

export function Button({
  variant = 'primary',
  style,
  enableHaptic = true,
  enableAnimation = true,
  onPress,
  onPressIn,
  onPressOut,
  children,
  disabled,
  ...props
}: CustomButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  // Animation styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Press handlers
  const handlePressIn = (e: any) => {
    if (enableAnimation && !disabled) {
      scale.value = withTiming(0.97, {
        duration: DURATIONS.fast,
      });
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    if (enableAnimation && !disabled) {
      scale.value = withSpring(1, SPRING_CONFIGS.snappy);
    }
    onPressOut?.(e);
  };

  const handlePress = (e: any) => {
    if (disabled) return;

    // Haptic feedback
    if (enableHaptic) {
      buttonPress();
    }

    // Call original onPress
    onPress?.(e);
  };

  // Get button colors based on variant
  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return {
          buttonColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
        };
      case 'secondary':
        return {
          buttonColor: theme.colors.secondary,
          textColor: theme.colors.onSecondary,
        };
      case 'accent':
        return {
          buttonColor: theme.colors.tertiary,
          textColor: theme.colors.onTertiary,
        };
      case 'outlined':
        return {
          buttonColor: 'transparent',
          textColor: theme.colors.primary,
        };
      case 'text':
        return {
          buttonColor: 'transparent',
          textColor: theme.colors.primary,
        };
      default:
        return {
          buttonColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
        };
    }
  };

  const colors = getButtonColors();
  const mode =
    variant === 'outlined'
      ? 'outlined'
      : variant === 'text'
      ? 'text'
      : 'contained'; // Regular button

  return (
    <Animated.View style={animatedStyle as any}>
      <PaperButton
        mode={mode}
        buttonColor={colors.buttonColor}
        textColor={colors.textColor}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        contentStyle={styles.content}
        labelStyle={styles.label}
        disabled={disabled}
        style={[
          mode === 'contained' && styles.elevatedButton,
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {children}
      </PaperButton>
    </Animated.View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  elevatedButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});
