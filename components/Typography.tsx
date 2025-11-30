import React from 'react';
import { Text as PaperText } from 'react-native-paper';
import { cn } from '../lib/utils';

interface TypographyProps extends React.ComponentProps<typeof PaperText> {
  className?: string;
}

export function H1({ className, children, ...props }: TypographyProps) {
  return (
    <PaperText
      variant="displaySmall"
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className,
      )}
      {...props}
    >
      {children}
    </PaperText>
  );
}

export function H2({ className, children, ...props }: TypographyProps) {
  return (
    <PaperText
      variant="headlineMedium"
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    >
      {children}
    </PaperText>
  );
}

export function H3({ className, children, ...props }: TypographyProps) {
  return (
    <PaperText
      variant="headlineSmall"
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </PaperText>
  );
}

export function P({ className, children, ...props }: TypographyProps) {
  return (
    <PaperText
      variant="bodyLarge"
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    >
      {children}
    </PaperText>
  );
}

export function Small({ className, children, ...props }: TypographyProps) {
  return (
    <PaperText
      variant="bodySmall"
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    >
      {children}
    </PaperText>
  );
}

export function Muted({ className, children, ...props }: TypographyProps) {
  return (
    <PaperText
      variant="bodyMedium"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </PaperText>
  );
}
