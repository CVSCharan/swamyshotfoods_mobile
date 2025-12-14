/**
 * Enhanced Input Component
 * Modern input with focus animations, floating label, and success/error states
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  TextInput as PaperTextInput,
  HelperText,
  useTheme,
} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Eye, EyeOff, LucideIcon, CheckCircle2 } from 'lucide-react-native';
import { DURATIONS, SPRING_CONFIGS } from '../lib/animations';

// ============================================================================
// TYPES
// ============================================================================

type PaperInputProps = React.ComponentProps<typeof PaperTextInput>;

interface InputProps extends Omit<PaperInputProps, 'error'> {
  label?: string;
  error?: string | boolean;
  success?: boolean;
  containerStyle?: any;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
}

// ============================================================================
// ANIMATED COMPONENTS
// ============================================================================

const AnimatedView = Animated.createAnimatedComponent(View);

// ============================================================================
// INPUT COMPONENT
// ============================================================================

export function Input({
  label,
  error,
  success = false,
  containerStyle,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  secureTextEntry,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  // Animation values
  const borderScale = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const successScale = useSharedValue(0);

  // Border glow animation on focus
  const borderAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: borderScale.value }, { translateX: shakeX.value }],
    };
  });

  // Success icon animation
  const successAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: successScale.value }],
      opacity: successScale.value,
    };
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderScale.value = withSpring(1.02, SPRING_CONFIGS.gentle);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderScale.value = withSpring(1, SPRING_CONFIGS.gentle);
    onBlur?.(e);
  };

  // Shake animation for errors
  React.useEffect(() => {
    if (error && typeof error === 'string') {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [error, shakeX]);

  // Success animation
  React.useEffect(() => {
    if (success) {
      successScale.value = withSpring(1, SPRING_CONFIGS.bouncy);
    } else {
      successScale.value = withTiming(0, { duration: DURATIONS.fast });
    }
  }, [success, successScale]);

  const isPassword = secureTextEntry && !isPasswordVisible;

  return (
    <AnimatedView
      style={[borderAnimatedStyle as any, styles.container, containerStyle]}
    >
      <PaperTextInput
        mode="outlined"
        label={label}
        error={!!error}
        secureTextEntry={isPassword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        theme={{
          roundness: 12,
          colors: {
            background: 'white',
            ...(success && {
              primary: theme.colors.primary,
              outline: theme.colors.primary,
            }),
            ...(isFocused && {
              outline: theme.colors.primary,
            }),
          },
        }}
        outlineStyle={[
          styles.outline,
          success && styles.successOutline,
          isFocused && styles.focusedOutline,
        ]}
        left={
          LeftIcon ? (
            <PaperTextInput.Icon
              icon={({ size, color }) => <LeftIcon size={size} color={color} />}
            />
          ) : null
        }
        right={
          secureTextEntry ? (
            <PaperTextInput.Icon
              icon={({ size, color }) =>
                isPasswordVisible ? (
                  <EyeOff size={size} color={color} />
                ) : (
                  <Eye size={size} color={color} />
                )
              }
              onPress={togglePasswordVisibility}
            />
          ) : success ? (
            <AnimatedView style={successAnimatedStyle as any}>
              <PaperTextInput.Icon
                icon={({ size }) => (
                  <CheckCircle2 size={size} color={theme.colors.primary} />
                )}
              />
            </AnimatedView>
          ) : RightIcon ? (
            <PaperTextInput.Icon
              icon={({ size, color }) => (
                <RightIcon size={size} color={color} />
              )}
              onPress={onRightIconPress}
            />
          ) : null
        }
        {...props}
      />
      {typeof error === 'string' && (
        <HelperText type="error" visible={!!error} style={styles.helperText}>
          {error}
        </HelperText>
      )}
    </AnimatedView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    marginTop: 4,
  },
  outline: {
    borderWidth: 1.5,
  },
  focusedOutline: {
    borderWidth: 2,
  },
  successOutline: {
    borderWidth: 2,
  },
  helperText: {
    paddingHorizontal: 4,
  },
});
