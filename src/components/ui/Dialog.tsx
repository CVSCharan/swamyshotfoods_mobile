import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { lightColors, darkColors } from '../../theme/colors';
import {
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  colorScheme?: 'light' | 'dark';
  style?: ViewStyle;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  colorScheme = 'light',
  style,
}) => {
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: colors.card,
              ...shadows.lg,
            },
            style,
          ]}
        >
          {/* Header */}
          {title && (
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {title}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>{children}</View>

          {/* Footer */}
          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  dialog: {
    width: Math.min(SCREEN_WIDTH - spacing[8], 500),
    maxHeight: '80%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
  },
  closeButton: {
    padding: spacing[2],
  },
  content: {
    padding: spacing[4],
  },
  footer: {
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});
