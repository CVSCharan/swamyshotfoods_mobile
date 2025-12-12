import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Custom font configuration
const fontConfig = {
  displayLarge: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 32,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

// Swamy's Hot Foods Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  fonts: {
    ...MD3LightTheme.fonts,
    ...fontConfig,
  },
  colors: {
    ...MD3LightTheme.colors,
    // Primary - Curry Leaf Green
    primary: '#16a34a',
    onPrimary: '#ffffff',
    primaryContainer: '#dcfce7',
    onPrimaryContainer: '#14532d',

    // Secondary - Ocean Blue
    secondary: '#1d4ed8',
    onSecondary: '#ffffff',
    secondaryContainer: '#dbeafe',
    onSecondaryContainer: '#172554',

    // Tertiary - Saffron Gold
    tertiary: '#c08810',
    onTertiary: '#ffffff',
    tertiaryContainer: '#ffefc4',
    onTertiaryContainer: '#4a3403',

    // Error
    error: '#dc2626',
    onError: '#ffffff',
    errorContainer: '#fecaca',
    onErrorContainer: '#7f1d1d',

    // Background - Warm Cream
    background: '#fdfcfb',
    onBackground: '#2a241f',

    // Surface - Cards
    surface: '#ffffff',
    onSurface: '#2a241f',
    surfaceVariant: '#f5f1eb',
    onSurfaceVariant: '#5a5045',

    // Outline
    outline: '#d4c9b8',
    outlineVariant: '#e8e2d8',

    // Other
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#2a241f',
    inverseOnSurface: '#fdfcfb',
    inversePrimary: '#4ade80',

    // Custom - Success, Warning, Info
    success: '#16a34a',
    warning: '#d97706',
    info: '#0284c7',
  },
  roundness: 12,
};

// Swamy's Hot Foods Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  fonts: {
    ...MD3DarkTheme.fonts,
    ...fontConfig,
  },
  colors: {
    ...MD3DarkTheme.colors,
    // Primary - Lighter green for dark mode
    primary: '#4ade80',
    onPrimary: '#14532d',
    primaryContainer: '#15803d',
    onPrimaryContainer: '#dcfce7',

    // Secondary - Lighter blue for dark mode
    secondary: '#60a5fa',
    onSecondary: '#172554',
    secondaryContainer: '#1e40af',
    onSecondaryContainer: '#dbeafe',

    // Tertiary - Lighter saffron for dark mode
    tertiary: '#ffc940',
    onTertiary: '#4a3403',
    tertiaryContainer: '#9a6d08',
    onTertiaryContainer: '#ffefc4',

    // Error
    error: '#ef4444',
    onError: '#7f1d1d',
    errorContainer: '#991b1b',
    onErrorContainer: '#fecaca',

    // Background
    background: '#2a241f',
    onBackground: '#fdfcfb',

    // Surface
    surface: '#3d3630',
    onSurface: '#fdfcfb',
    surfaceVariant: '#5a5045',
    onSurfaceVariant: '#e8e2d8',

    // Outline
    outline: '#7a6d5a',
    outlineVariant: '#5a5045',

    // Other
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#fdfcfb',
    inverseOnSurface: '#2a241f',
    inversePrimary: '#16a34a',
  },
  roundness: 12,
};
