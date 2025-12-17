/**
 * Professional Badge Component
 * Clean, minimal badge with proper sizing to prevent text cutoff
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { moderateScale, fontSize, spacing } from '../utils/responsive';

// ============================================================================
// TYPES
// ============================================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ============================================================================
// BADGE COMPONENT
// ============================================================================

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}: BadgeProps) {
  const theme = useTheme();

  const getVariantStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.secondaryContainer,
            borderColor: theme.colors.secondary,
          },
          text: {
            color: theme.colors.onSecondaryContainer,
          },
        };
      case 'destructive':
        return {
          container: {
            backgroundColor: theme.colors.errorContainer,
            borderColor: theme.colors.error,
          },
          text: {
            color: theme.colors.error,
          },
        };
      case 'success':
        return {
          container: {
            backgroundColor: theme.colors.primaryContainer,
            borderColor: theme.colors.primary,
          },
          text: {
            color: theme.colors.primary,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.outline,
          },
          text: {
            color: theme.colors.onSurface,
          },
        };
      default:
        return {
          container: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
          text: {
            color: theme.colors.onPrimary,
          },
        };
    }
  };

  const getSizeStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            minWidth: moderateScale(50),
          },
          text: {
            fontSize: fontSize.xs,
          },
        };
      case 'lg':
        return {
          container: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            minWidth: moderateScale(80),
          },
          text: {
            fontSize: fontSize.md,
          },
        };
      default: // md
        return {
          container: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs + 2,
            minWidth: moderateScale(60),
          },
          text: {
            fontSize: fontSize.sm,
          },
        };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  return (
    <View
      style={[
        styles.container,
        variantStyle.container,
        sizeStyle.container,
        style,
      ]}
    >
      <Text
        style={[styles.text, variantStyle.text, sizeStyle.text, textStyle]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {children}
      </Text>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexShrink: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
