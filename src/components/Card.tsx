import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Card as PaperCard, Text, useTheme } from 'react-native-paper';

type CardProps = React.ComponentProps<typeof PaperCard> & {
  style?: any;
  children: React.ReactNode;
};

export function Card({ style, children, ...props }: CardProps) {
  return (
    <PaperCard style={[styles.card, style]} {...props}>
      {children}
    </PaperCard>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    padding: 24,
    flexDirection: 'column',
  },
  title: {
    fontWeight: '600',
  },
  description: {
    marginTop: 4,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
});
