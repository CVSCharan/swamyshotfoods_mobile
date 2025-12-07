import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { lightColors, darkColors } from '../../theme/colors';
import {
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme/typography';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
  style?: ViewStyle;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  label,
  disabled = false,
  colorScheme = 'light',
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: colors.input,
            borderColor: colors.inputBorder,
          },
          disabled && { opacity: 0.5 },
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.triggerText,
            {
              color: selectedOption ? colors.text : colors.textSecondary,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.card,
                ...shadows.lg,
              },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && {
                      backgroundColor: colors.primaryLight + '20',
                    },
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: colors.text,
                        fontWeight:
                          item.value === value
                            ? typography.fontWeight.semibold
                            : typography.fontWeight.normal,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[2],
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[3],
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  triggerText: {
    fontSize: typography.fontSize.base,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing[4],
  },
  dropdown: {
    maxHeight: 300,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  optionText: {
    fontSize: typography.fontSize.base,
    flex: 1,
  },
});
