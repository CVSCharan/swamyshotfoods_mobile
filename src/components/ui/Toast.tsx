import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react-native';
import { useToastStore, ToastType } from '../../hooks/useToast';
import { semanticColors, lightColors } from '../../theme/colors';
import {
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../theme/typography';

const iconMap: Record<ToastType, any> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap: Record<ToastType, string> = {
  success: semanticColors.success,
  error: semanticColors.error,
  warning: semanticColors.warning,
  info: semanticColors.info,
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <SafeAreaView style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => {
        const Icon = iconMap[toast.type];
        const color = colorMap[toast.type];

        return (
          <Animated.View
            key={toast.id}
            style={[
              styles.toast,
              {
                backgroundColor: lightColors.card,
                borderLeftColor: color,
                ...shadows.md,
              },
            ]}
          >
            <Icon size={20} color={color} style={styles.icon} />
            <Text
              style={[styles.message, { color: lightColors.text }]}
              numberOfLines={2}
            >
              {toast.message}
            </Text>
            <TouchableOpacity
              onPress={() => removeToast(toast.id)}
              style={styles.closeButton}
            >
              <X size={18} color={lightColors.textSecondary} />
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: spacing[4],
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
  },
  icon: {
    marginRight: spacing[3],
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  closeButton: {
    padding: spacing[1],
    marginLeft: spacing[2],
  },
});
