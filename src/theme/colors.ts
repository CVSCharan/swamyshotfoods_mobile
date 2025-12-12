// Brand Colors
export const brandColors = {
  primary: '#ff7722',
  primaryDark: '#e66610',
  primaryLight: '#ff9955',
  secondary: '#50ba94',
  secondaryDark: '#3fa07a',
  secondaryLight: '#6fcaa8',
  background: '#F4EFE6',
  backgroundDark: '#2a2a2a',
};

// Semantic Colors
export const semanticColors = {
  success: '#10b981',
  successLight: '#d1fae5',
  error: '#ef4444',
  errorLight: '#fee2e2',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  info: '#3b82f6',
  infoLight: '#dbeafe',
};

// Neutral Palette
export const neutralColors = {
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
};

// Light Theme Colors
export const lightColors = {
  ...brandColors,
  ...semanticColors,
  ...neutralColors,
  text: neutralColors.gray900,
  textSecondary: neutralColors.gray600,
  textTertiary: neutralColors.gray500,
  border: neutralColors.gray200,
  borderLight: neutralColors.gray100,
  card: neutralColors.white,
  cardHover: neutralColors.gray50,
  input: neutralColors.white,
  inputBorder: neutralColors.gray300,
  disabled: neutralColors.gray400,
  disabledBg: neutralColors.gray100,
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark Theme Colors
export const darkColors = {
  ...brandColors,
  ...semanticColors,
  primary: '#ff9955',
  primaryDark: '#ff7722',
  background: '#1a1a1a',
  backgroundDark: '#0a0a0a',
  text: neutralColors.gray100,
  textSecondary: neutralColors.gray400,
  textTertiary: neutralColors.gray500,
  border: neutralColors.gray700,
  borderLight: neutralColors.gray800,
  card: neutralColors.gray800,
  cardHover: neutralColors.gray700,
  input: neutralColors.gray800,
  inputBorder: neutralColors.gray600,
  disabled: neutralColors.gray600,
  disabledBg: neutralColors.gray800,
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export type ColorScheme = typeof lightColors;
