import React from 'react';
import { Badge as PaperBadge, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface BadgeProps extends React.ComponentProps<typeof PaperBadge> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  style?: any;
}

export function Badge({ variant = 'default', style, ...props }: BadgeProps) {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: theme.colors.secondaryContainer };
      case 'destructive':
        return { backgroundColor: theme.colors.error };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.outline,
        };
      default:
        return { backgroundColor: theme.colors.primary };
    }
  };

  return <PaperBadge style={[getVariantStyle(), style]} {...props} />;
}

const styles = StyleSheet.create({
  // Add any common badge styles here if needed
});
