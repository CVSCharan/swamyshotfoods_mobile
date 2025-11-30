import React from 'react';
import { View, ViewProps } from 'react-native';
import { Card as PaperCard, Text, useTheme } from 'react-native-paper';
import { cn } from '../lib/utils';

type CardProps = React.ComponentProps<typeof PaperCard> & {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children, ...props }: CardProps) {
  return (
    <PaperCard
      className={cn(
        'bg-white rounded-xl border border-border shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </PaperCard>
  );
}

export function CardHeader({ className, children, ...props }: ViewProps) {
  return (
    <View className={cn('p-6 flex-col space-y-1.5', className)} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ className, children, ...props }: ViewProps) {
  return (
    <Text
      variant="titleLarge"
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardDescription({ className, children, ...props }: ViewProps) {
  return (
    <Text
      variant="bodyMedium"
      className={cn('text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardContent({ className, children, ...props }: ViewProps) {
  return (
    <View className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ className, children, ...props }: ViewProps) {
  return (
    <View
      className={cn('flex-row items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </View>
  );
}
