/**
 * Enhanced Typography Components
 * Modern typography with fade-in animations
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text as PaperText, useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { DURATIONS, SPRING_CONFIGS } from '../lib/animations';

// ============================================================================
// TYPES
// ============================================================================

interface TypographyProps extends React.ComponentProps<typeof PaperText> {
  style?: any;
  animate?: boolean;
}

// ============================================================================
// ANIMATED TEXT
// ============================================================================

const AnimatedText = Animated.createAnimatedComponent(PaperText);

// ============================================================================
// BASE ANIMATED TEXT
// ============================================================================

function AnimatedTypography({
  children,
  animate = true,
  variant,
  style,
  ...props
}: TypographyProps & { variant: any }) {
  const opacity = useSharedValue(animate ? 0 : 1);
  const translateY = useSharedValue(animate ? 10 : 0);

  useEffect(() => {
    if (animate) {
      opacity.value = withTiming(1, { duration: DURATIONS.normal });
      translateY.value = withSpring(0, SPRING_CONFIGS.gentle);
    }
  }, [animate, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <AnimatedText variant={variant} style={[animatedStyle, style]} {...props}>
      {children}
    </AnimatedText>
  );
}

// ============================================================================
// TYPOGRAPHY COMPONENTS
// ============================================================================

export function H1({ style, children, animate, ...props }: TypographyProps) {
  return (
    <AnimatedTypography
      variant="displaySmall"
      style={[styles.h1, style]}
      animate={animate}
      {...props}
    >
      {children}
    </AnimatedTypography>
  );
}

export function H2({ style, children, animate, ...props }: TypographyProps) {
  return (
    <AnimatedTypography
      variant="headlineMedium"
      style={[styles.h2, style]}
      animate={animate}
      {...props}
    >
      {children}
    </AnimatedTypography>
  );
}

export function H3({ style, children, animate, ...props }: TypographyProps) {
  return (
    <AnimatedTypography
      variant="headlineSmall"
      style={[styles.h3, style]}
      animate={animate}
      {...props}
    >
      {children}
    </AnimatedTypography>
  );
}

export function P({ style, children, animate, ...props }: TypographyProps) {
  return (
    <AnimatedTypography
      variant="bodyLarge"
      style={[styles.p, style]}
      animate={animate}
      {...props}
    >
      {children}
    </AnimatedTypography>
  );
}

export function Small({ style, children, animate, ...props }: TypographyProps) {
  return (
    <AnimatedTypography
      variant="bodySmall"
      style={[styles.small, style]}
      animate={animate}
      {...props}
    >
      {children}
    </AnimatedTypography>
  );
}

export function Muted({ style, children, animate, ...props }: TypographyProps) {
  const theme = useTheme();
  return (
    <AnimatedTypography
      variant="bodyMedium"
      style={[styles.muted, { color: theme.colors.onSurfaceVariant }, style]}
      animate={animate}
      {...props}
    >
      {children}
    </AnimatedTypography>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.25,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 28,
  },
  p: {
    lineHeight: 26,
    letterSpacing: 0.15,
  },
  small: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  muted: {
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
});
