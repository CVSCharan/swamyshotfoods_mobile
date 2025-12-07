import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { getInitials } from '../../lib/formatters';
import { lightColors, darkColors } from '../../theme/colors';
import { typography, borderRadius } from '../../theme/typography';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  colorScheme?: 'light' | 'dark';
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const fontSizeMap = {
  sm: typography.fontSize.sm,
  md: typography.fontSize.base,
  lg: typography.fontSize.lg,
  xl: typography.fontSize.xl,
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  style,
  colorScheme = 'light',
}) => {
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const avatarSize = sizeMap[size];
  const fontSize = fontSizeMap[size];

  const initials = fallback
    ? getInitials(fallback)
    : alt
    ? getInitials(alt)
    : '?';

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.primary,
        },
        style,
      ]}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        />
      ) : (
        <Text
          style={[
            styles.fallbackText,
            {
              fontSize,
              color: '#ffffff',
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  fallbackText: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
});
