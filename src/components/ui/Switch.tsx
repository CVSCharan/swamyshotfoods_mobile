import React from 'react';
import {
  Switch as RNSwitch,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { lightColors, darkColors } from '../../theme/colors';
import { typography, spacing } from '../../theme/typography';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
  style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  colorScheme = 'light',
  style,
}) => {
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: disabled ? colors.disabled : colors.text,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.inputBorder,
          true: colors.primary,
        }}
        thumbColor={value ? '#ffffff' : '#d1d5db'}
        ios_backgroundColor={colors.inputBorder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
    marginRight: spacing[3],
  },
});
