/**
 * Skeleton Component
 * Loading skeleton with shimmer animation for better perceived performance
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

// ============================================================================
// TYPES
// ============================================================================

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'text' | 'circular' | 'rectangular';
}

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  variant = 'rectangular',
}: SkeletonProps) {
  const theme = useTheme();
  const shimmer = useSharedValue(0);

  // Determine dimensions based on variant
  const dimensions = React.useMemo(() => {
    switch (variant) {
      case 'circular':
        return {
          width: height,
          height: height,
          borderRadius: height / 2,
        } as ViewStyle;
      case 'text':
        return {
          width,
          height,
          borderRadius: 4,
        } as ViewStyle;
      case 'rectangular':
      default:
        return {
          width,
          height,
          borderRadius,
        } as ViewStyle;
    }
  }, [variant, width, height, borderRadius]);

  // Shimmer animation
  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1, // Infinite
      false,
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [0, 1], [-100, 100]);

    return {
      transform: [{ translateX: `${translateX}%` }],
    };
  });

  return (
    <View
      style={[
        styles.skeleton,
        {
          backgroundColor: theme.colors.surfaceVariant,
        },
        dimensions,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: theme.colors.surface,
          },
          animatedStyle as any,
        ]}
      />
    </View>
  );
}

// ============================================================================
// SKELETON VARIANTS
// ============================================================================

/**
 * Text Skeleton
 * For loading text content
 */
export function SkeletonText({
  lines = 1,
  width = '100%',
  height = 16,
  spacing = 8,
  style,
}: {
  lines?: number;
  width?: number | string;
  height?: number;
  spacing?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '80%' : width}
          height={height}
          style={{ marginBottom: index < lines - 1 ? spacing : 0 }}
        />
      ))}
    </View>
  );
}

/**
 * Circle Skeleton
 * For loading avatars, icons
 */
export function SkeletonCircle({
  size = 40,
  style,
}: {
  size?: number;
  style?: ViewStyle;
}) {
  return <Skeleton variant="circular" height={size} style={style} />;
}

/**
 * Rectangle Skeleton
 * For loading images, cards
 */
export function SkeletonRectangle({
  width = '100%',
  height = 100,
  borderRadius = 8,
  style,
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}) {
  return (
    <Skeleton
      variant="rectangular"
      width={width}
      height={height}
      borderRadius={borderRadius}
      style={style}
    />
  );
}

// ============================================================================
// PRESET SKELETONS
// ============================================================================

/**
 * Card Skeleton
 * For loading card components
 */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonRectangle height={150} borderRadius={12} />
      <View style={styles.cardContent}>
        <SkeletonText lines={2} height={20} spacing={12} />
        <View style={styles.cardFooter}>
          <SkeletonCircle size={32} />
          <SkeletonText lines={1} width={100} height={14} />
        </View>
      </View>
    </View>
  );
}

/**
 * List Item Skeleton
 * For loading list items
 */
export function SkeletonListItem({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.listItem, style]}>
      <SkeletonCircle size={48} />
      <View style={styles.listItemContent}>
        <SkeletonText lines={2} height={16} spacing={8} />
      </View>
    </View>
  );
}

/**
 * Menu Item Skeleton
 * For loading menu items
 */
export function SkeletonMenuItem({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.menuItem, style]}>
      <SkeletonRectangle height={120} borderRadius={12} />
      <View style={styles.menuItemContent}>
        <SkeletonText lines={1} height={18} width="60%" />
        <SkeletonText lines={2} height={14} spacing={6} />
        <View style={styles.menuItemFooter}>
          <SkeletonRectangle width={60} height={24} borderRadius={12} />
          <SkeletonRectangle width={80} height={24} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  listItemContent: {
    flex: 1,
  },
  menuItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItemContent: {
    padding: 16,
  },
  menuItemFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
});
