/**
 * Font Family Names
 * These must match EXACTLY with the font file names (without extension)
 * For Android release builds, the font family name is case-sensitive and must match the file name
 */

export const FontFamily = {
  // Inter fonts
  InterRegular: 'Inter-Regular',
  InterMedium: 'Inter-Medium',
  InterSemiBold: 'Inter-SemiBold',
  InterBold: 'Inter-Bold',

  // Playfair Display fonts
  PlayfairDisplayRegular: 'PlayfairDisplay-Regular',
  PlayfairDisplaySemiBold: 'PlayfairDisplay-SemiBold',
  PlayfairDisplayBold: 'PlayfairDisplay-Bold',
} as const;

/**
 * Font weights mapping
 * Use these constants instead of string literals
 */
export const FontWeight = {
  Regular: '400',
  Medium: '500',
  SemiBold: '600',
  Bold: '700',
} as const;

/**
 * Get the correct font family based on weight
 * This ensures fonts work correctly in both debug and release builds
 */
export const getFontFamily = (
  baseFamily: 'Inter' | 'PlayfairDisplay',
  weight: keyof typeof FontWeight = 'Regular',
): string => {
  const fontMap = {
    Inter: {
      Regular: FontFamily.InterRegular,
      Medium: FontFamily.InterMedium,
      SemiBold: FontFamily.InterSemiBold,
      Bold: FontFamily.InterBold,
    },
    PlayfairDisplay: {
      Regular: FontFamily.PlayfairDisplayRegular,
      Medium: FontFamily.PlayfairDisplaySemiBold, // Use SemiBold for Medium
      SemiBold: FontFamily.PlayfairDisplaySemiBold,
      Bold: FontFamily.PlayfairDisplayBold,
    },
  };

  return fontMap[baseFamily][weight];
};
