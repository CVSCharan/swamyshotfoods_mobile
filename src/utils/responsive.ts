import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Device size categories
 */
export const DeviceSize = {
  isSmall: SCREEN_WIDTH < 375,
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768,
  isLarge: SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024,
  isXLarge: SCREEN_WIDTH >= 1024,
  isTablet: SCREEN_WIDTH >= 768,
};

/**
 * Responsive width based on screen width
 * @param widthPercent - Percentage of screen width (0-100)
 */
export const wp = (widthPercent: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * widthPercent) / 100);
};

/**
 * Responsive height based on screen height
 * @param heightPercent - Percentage of screen height (0-100)
 */
export const hp = (heightPercent: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * heightPercent) / 100);
};

/**
 * Scale font size based on screen width
 * @param size - Base font size
 */
export const scaleFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }

  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Scale size based on screen width
 * @param size - Base size
 */
export const scaleSize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return PixelRatio.roundToNearestPixel(size * scale);
};

/**
 * Moderate scale - scales less aggressively
 * @param size - Base size
 * @param factor - Scaling factor (default: 0.5)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return PixelRatio.roundToNearestPixel(size + (scale - 1) * size * factor);
};

/**
 * Vertical scale based on screen height
 * @param size - Base size
 */
export const verticalScale = (size: number): number => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return PixelRatio.roundToNearestPixel(size * scale);
};

/**
 * Responsive spacing
 */
export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
};

/**
 * Responsive border radius
 */
export const borderRadius = {
  xs: moderateScale(4),
  sm: moderateScale(6),
  md: moderateScale(8),
  lg: moderateScale(12),
  xl: moderateScale(16),
  xxl: moderateScale(20),
  full: 9999,
};

/**
 * Responsive icon sizes
 */
export const iconSize = {
  xs: moderateScale(16),
  sm: moderateScale(20),
  md: moderateScale(24),
  lg: moderateScale(28),
  xl: moderateScale(32),
  xxl: moderateScale(40),
};

/**
 * Responsive font sizes
 */
export const fontSize = {
  xs: scaleFontSize(10),
  sm: scaleFontSize(12),
  md: scaleFontSize(14),
  lg: scaleFontSize(16),
  xl: scaleFontSize(18),
  xxl: scaleFontSize(20),
  xxxl: scaleFontSize(24),
  xxxxl: scaleFontSize(32),
};

/**
 * Get responsive value based on device size
 */
export const getResponsiveValue = <T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  xlarge?: T;
  default: T;
}): T => {
  if (DeviceSize.isSmall && values.small !== undefined) {
    return values.small;
  }
  if (DeviceSize.isMedium && values.medium !== undefined) {
    return values.medium;
  }
  if (DeviceSize.isLarge && values.large !== undefined) {
    return values.large;
  }
  if (DeviceSize.isXLarge && values.xlarge !== undefined) {
    return values.xlarge;
  }
  return values.default;
};

/**
 * Screen dimensions
 */
export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
