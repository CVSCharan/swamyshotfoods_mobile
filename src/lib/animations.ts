/**
 * Animation Utilities
 * Centralized animation configurations and presets for consistent animations across the app
 * Compatible with React Native Reanimated 2
 */

import {
  withTiming,
  withSpring,
  withSequence,
  Easing,
  WithTimingConfig,
  WithSpringConfig,
} from 'react-native-reanimated';

// ============================================================================
// TIMING CONFIGURATIONS
// ============================================================================

export const DURATIONS = {
  fast: 150,
  normal: 250,
  slow: 350,
  verySlow: 500,
} as const;

export const EASING = {
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  linear: Easing.linear,
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
} as const;

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

export const SPRING_CONFIGS = {
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 1,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  bouncy: {
    damping: 10,
    stiffness: 100,
    mass: 1,
  },
  snappy: {
    damping: 25,
    stiffness: 200,
    mass: 0.8,
  },
} as const;

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Fade In Animation
 * Animates opacity from 0 to 1
 */
export const fadeIn = (duration: number = DURATIONS.normal) => {
  'worklet';
  return withTiming(1, {
    duration,
    easing: EASING.easeOut,
  });
};

/**
 * Fade Out Animation
 * Animates opacity from 1 to 0
 */
export const fadeOut = (duration: number = DURATIONS.normal) => {
  'worklet';
  return withTiming(0, {
    duration,
    easing: EASING.easeIn,
  });
};

/**
 * Scale In Animation
 * Animates scale from 0 to 1
 */
export const scaleIn = (duration: number = DURATIONS.normal) => {
  'worklet';
  return withTiming(1, {
    duration,
    easing: EASING.easeOut,
  });
};

/**
 * Scale Out Animation
 * Animates scale from 1 to 0
 */
export const scaleOut = (duration: number = DURATIONS.normal) => {
  'worklet';
  return withTiming(0, {
    duration,
    easing: EASING.easeIn,
  });
};

/**
 * Press Animation
 * Scales down slightly on press (0.97)
 */
export const pressScale = () => {
  'worklet';
  return withTiming(0.97, {
    duration: DURATIONS.fast,
    easing: EASING.easeOut,
  });
};

/**
 * Release Animation
 * Returns to original scale (1)
 */
export const releaseScale = () => {
  'worklet';
  return withSpring(1, SPRING_CONFIGS.snappy);
};

/**
 * Bounce Animation
 * Creates a bounce effect using spring
 */
export const bounce = (config: WithSpringConfig = SPRING_CONFIGS.bouncy) => {
  'worklet';
  return withSpring(1, config);
};

/**
 * Slide Up Animation
 * Animates translateY from bottom to 0
 */
export const slideUp = (
  from: number = 50,
  duration: number = DURATIONS.normal,
) => {
  'worklet';
  return withTiming(0, {
    duration,
    easing: EASING.easeOut,
  });
};

/**
 * Slide Down Animation
 * Animates translateY from 0 to bottom
 */
export const slideDown = (
  to: number = 50,
  duration: number = DURATIONS.normal,
) => {
  'worklet';
  return withTiming(to, {
    duration,
    easing: EASING.easeIn,
  });
};

/**
 * Shake Animation
 * Creates a shake effect for errors
 */
export const shake = () => {
  'worklet';
  return withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 }),
  );
};

/**
 * Pulse Animation
 * Creates a pulse effect (scale up and down)
 */
export const pulse = (scale: number = 1.05) => {
  'worklet';
  return withSequence(
    withTiming(scale, { duration: DURATIONS.fast }),
    withTiming(1, { duration: DURATIONS.fast }),
  );
};

/**
 * Rotate Animation
 * Rotates element by specified degrees
 */
export const rotate = (
  degrees: number,
  duration: number = DURATIONS.normal,
) => {
  'worklet';
  return withTiming(degrees, {
    duration,
    easing: EASING.easeInOut,
  });
};

// ============================================================================
// STAGGER UTILITIES
// ============================================================================

/**
 * Creates staggered delay for list animations
 * @param index - Item index in list
 * @param baseDelay - Base delay in ms
 * @param increment - Delay increment per item
 */
export const staggerDelay = (
  index: number,
  baseDelay: number = 0,
  increment: number = 50,
): number => {
  return baseDelay + index * increment;
};

// ============================================================================
// LAYOUT ANIMATION CONFIGS
// ============================================================================

export const LAYOUT_ANIMATION_CONFIGS = {
  spring: {
    damping: 20,
    stiffness: 90,
  },
  linear: {
    duration: DURATIONS.normal,
  },
} as const;
