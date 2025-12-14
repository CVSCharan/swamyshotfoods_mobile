/**
 * Enhanced Card Component
 * Modern card with glassmorphism, fade-in animation, and press effects
 */

import React, { useEffect } from 'react';
import { View, ViewProps, StyleSheet, Pressable } from 'react-native';
import { Card as PaperCard, Text, useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { SPRING_CONFIGS, DURATIONS } from '../lib/animations';

// ============================================================================
// TYPES
// ============================================================================

type CardProps = React.ComponentProps<typeof PaperCard> & {
  style?: any;
  children: React.ReactNode;
  glassmorphism?: boolean;
  pressable?: boolean;
  onPress?: () => void;
};

// ============================================================================
// ANIMATED COMPONENTS
// ============================================================================

const AnimatedCard = Animated.createAnimatedComponent(PaperCard);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================================================
// CARD COMPONENT
// ============================================================================

export function Card({
  style,
  children,
  glassmorphism = false,
  pressable = false,
  onPress,
  ...props
}: CardProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const pressScale = useSharedValue(1);

  // Mount animation
  useEffect(() => {
    opacity.value = withTiming(1, { duration: DURATIONS.normal });
    scale.value = withSpring(1, SPRING_CONFIGS.gentle);
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value * pressScale.value }],
    };
  });

  const handlePressIn = () => {
    if (!pressable) return;
    pressScale.value = withTiming(0.98, { duration: DURATIONS.fast });
  };

  const handlePressOut = () => {
    if (!pressable) return;
    pressScale.value = withSpring(1, SPRING_CONFIGS.snappy);
  };

  if (glassmorphism) {
    return (
      <AnimatedCard
        style={[styles.card, styles.glassmorphism, animatedStyle, style]}
        {...props}
      >
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        >
          {children}
        </BlurView>
      </AnimatedCard>
    );
  }

  if (pressable && onPress) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={animatedStyle}
      >
        <PaperCard style={[styles.card, styles.elevated, style]} {...props}>
          {children}
        </PaperCard>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedCard
      style={[styles.card, styles.elevated, animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedCard>
  );
}

export function CardHeader({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ style, children, ...props }: any) {
  return (
    <Text variant="titleLarge" style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
}

export function CardDescription({ style, children, ...props }: any) {
  const theme = useTheme();
  return (
    <Text
      variant="bodyMedium"
      style={[
        styles.description,
        { color: theme.colors.onSurfaceVariant },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardContent({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  elevated: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  glassmorphism: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 0,
  },
  blur: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'column',
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.15,
  },
  description: {
    marginTop: 6,
    lineHeight: 20,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
  },
});
