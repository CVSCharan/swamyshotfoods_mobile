/**
 * Enhanced Badge Component
 * Modern badge with pulse animation and glow effects
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Badge as PaperBadge, useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { DURATIONS, SPRING_CONFIGS } from '../lib/animations';

// ============================================================================
// TYPES
// ============================================================================

interface BadgeProps extends React.ComponentProps<typeof PaperBadge> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  pulse?: boolean;
  glow?: boolean;
  style?: any;
}

// ============================================================================
// ANIMATED BADGE
// ============================================================================

const AnimatedBadge = Animated.createAnimatedComponent(PaperBadge);

// ============================================================================
// BADGE COMPONENT
// ============================================================================

export function Badge({
  variant = 'default',
  pulse = false,
  glow = false,
  style,
  ...props
}: BadgeProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Mount animation
  useEffect(() => {
    scale.value = withSpring(1, SPRING_CONFIGS.bouncy);
  }, [scale]);

  // Pulse animation
  useEffect(() => {
    if (pulse) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: DURATIONS.normal }),
          withTiming(1, { duration: DURATIONS.normal }),
        ),
        -1, // Infinite
        false,
      );
    } else {
      scale.value = withSpring(1, SPRING_CONFIGS.snappy);
    }
  }, [pulse, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondaryContainer,
          color: theme.colors.onSecondaryContainer,
        };
      case 'destructive':
        return {
          backgroundColor: theme.colors.error,
          color: theme.colors.onError,
        };
      case 'success':
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.onPrimary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.colors.outline,
          color: theme.colors.onSurface,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.onPrimary,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <AnimatedBadge
      style={[
        styles.badge,
        variantStyle,
        glow && variant !== 'outline' && styles.glow,
        animatedStyle,
        style,
      ]}
      {...props}
    />
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  glow: {
    elevation: 4,
    shadowColor: '#16a34a',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
