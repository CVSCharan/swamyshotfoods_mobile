import React from 'react';
import { Badge as PaperBadge } from 'react-native-paper';
import { cn } from '../lib/utils';

interface BadgeProps extends React.ComponentProps<typeof PaperBadge> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function Badge({
  variant = 'default',
  className,
  style,
  ...props
}: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground';
      case 'outline':
        return 'bg-transparent border border-border text-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <PaperBadge
      className={cn(getVariantStyle(), className)}
      style={style}
      {...props}
    />
  );
}
