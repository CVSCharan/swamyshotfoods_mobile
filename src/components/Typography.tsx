import React from 'react';
import { Text as PaperText, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface TypographyProps extends React.ComponentProps<typeof PaperText> {
  style?: any;
}

export function H1({ style, children, ...props }: TypographyProps) {
  return (
    <PaperText variant="displaySmall" style={[styles.h1, style]} {...props}>
      {children}
    </PaperText>
  );
}

export function H2({ style, children, ...props }: TypographyProps) {
  return (
    <PaperText variant="headlineMedium" style={[styles.h2, style]} {...props}>
      {children}
    </PaperText>
  );
}

export function H3({ style, children, ...props }: TypographyProps) {
  return (
    <PaperText variant="headlineSmall" style={[styles.h3, style]} {...props}>
      {children}
    </PaperText>
  );
}

export function P({ style, children, ...props }: TypographyProps) {
  return (
    <PaperText variant="bodyLarge" style={[styles.p, style]} {...props}>
      {children}
    </PaperText>
  );
}

export function Small({ style, children, ...props }: TypographyProps) {
  return (
    <PaperText variant="bodySmall" style={[styles.small, style]} {...props}>
      {children}
    </PaperText>
  );
}

export function Muted({ style, children, ...props }: TypographyProps) {
  const theme = useTheme();
  return (
    <PaperText
      variant="bodyMedium"
      style={[styles.muted, { color: theme.colors.onSurfaceVariant }, style]}
      {...props}
    >
      {children}
    </PaperText>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '800',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  p: {
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    fontWeight: '500',
  },
  muted: {
    fontSize: 14,
  },
});
