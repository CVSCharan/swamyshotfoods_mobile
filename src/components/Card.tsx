/**
 * Professional Card Component
 * Clean, minimal card with proper shadows and spacing
 */

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { moderateScale, spacing } from '../utils/responsive';

// ============================================================================
// TYPES
// ============================================================================

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
}

// ============================================================================
// CARD COMPONENT
// ============================================================================

export function Card({
  style,
  children,
  elevation = 'medium',
  ...props
}: CardProps) {
  const theme = useTheme();

  const getElevationStyle = () => {
    switch (elevation) {
      case 'low':
        return styles.elevationLow;
      case 'high':
        return styles.elevationHigh;
      default:
        return styles.elevationMedium;
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface },
        getElevationStyle(),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
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
  const theme = useTheme();
  return (
    <Text
      variant="titleLarge"
      style={[styles.title, { color: theme.colors.onSurface }, style]}
      {...props}
    >
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
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  elevationLow: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  elevationMedium: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  elevationHigh: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  header: {
    padding: spacing.lg,
    flexDirection: 'column',
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.15,
  },
  description: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 0,
  },
});
