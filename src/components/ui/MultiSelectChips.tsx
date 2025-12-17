import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { moderateScale, spacing, fontSize } from '../../utils/responsive';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectChipsProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

export const MultiSelectChips: React.FC<MultiSelectChipsProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const theme = useTheme();

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        variant="bodySmall"
        style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
      >
        {label}
      </Text>
      <View style={styles.chipsContainer}>
        {options.map(option => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <Chip
              key={option.value}
              selected={isSelected}
              onPress={() => toggleValue(option.value)}
              mode={isSelected ? 'flat' : 'outlined'}
              style={[
                styles.chip,
                isSelected && {
                  backgroundColor: theme.colors.primaryContainer,
                },
              ]}
              textStyle={[
                styles.chipText,
                isSelected && {
                  color: theme.colors.onPrimaryContainer,
                },
              ]}
            >
              {option.label}
            </Chip>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    fontSize: fontSize.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    marginRight: 0,
    marginBottom: 0,
  },
  chipText: {
    fontSize: fontSize.sm,
  },
});
