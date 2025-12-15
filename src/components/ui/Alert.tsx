import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react-native';
import { BlurView } from '@react-native-community/blur';
import {
  Alert as AlertType,
  AlertButton,
  useAlertStore,
} from '../../stores/useAlertStore';
import { Button } from '../Button';
import { lightColors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/typography';
import { SPRING_CONFIGS, DURATIONS } from '../../lib/animations';
import * as haptics from '../../lib/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AlertProps {
  alert: AlertType;
}

const ALERT_COLORS = {
  success: {
    icon: lightColors.success,
    bg: lightColors.successLight,
    border: lightColors.success,
  },
  error: {
    icon: lightColors.error,
    bg: lightColors.errorLight,
    border: lightColors.error,
  },
  warning: {
    icon: lightColors.warning,
    bg: lightColors.warningLight,
    border: lightColors.warning,
  },
  info: {
    icon: lightColors.info,
    bg: lightColors.infoLight,
    border: lightColors.info,
  },
  confirm: {
    icon: lightColors.primary,
    bg: lightColors.white,
    border: lightColors.primary,
  },
};

const ALERT_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  confirm: Info,
};

export const Alert: React.FC<AlertProps> = ({ alert }) => {
  const { hideAlert } = useAlertStore();
  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);

  const colors = ALERT_COLORS[alert.type];
  const IconComponent = ALERT_ICONS[alert.type];

  useEffect(() => {
    // Entrance animation
    translateY.value = withSpring(0, SPRING_CONFIGS.bouncy);
    opacity.value = withTiming(1, { duration: DURATIONS.normal });

    // Haptic feedback
    switch (alert.type) {
      case 'success':
        haptics.success();
        break;
      case 'error':
        haptics.error();
        break;
      case 'warning':
        haptics.warning();
        break;
      default:
        haptics.mediumImpact();
    }

    // Auto-dismiss
    if (alert.duration && alert.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, alert.duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    // Exit animation
    translateY.value = withTiming(-200, { duration: DURATIONS.fast }, () => {
      runOnJS(hideAlert)(alert.id);
      if (alert.onDismiss) {
        runOnJS(alert.onDismiss)();
      }
    });
    opacity.value = withTiming(0, { duration: DURATIONS.fast });
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    handleDismiss();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal
      visible={true}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBlur]} />
        )}

        <Animated.View
          style={[
            styles.alertContainer,
            { borderLeftColor: colors.border },
            animatedStyle,
          ]}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color={lightColors.gray500} />
          </TouchableOpacity>

          {/* Icon and Content */}
          <View style={styles.content}>
            <View
              style={[styles.iconContainer, { backgroundColor: colors.bg }]}
            >
              <IconComponent size={28} color={colors.icon} />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{alert.title}</Text>
              {alert.message && (
                <Text style={styles.message}>{alert.message}</Text>
              )}
            </View>
          </View>

          {/* Buttons */}
          {alert.buttons && alert.buttons.length > 0 && (
            <View style={styles.buttonContainer}>
              {alert.buttons.map((button, index) => (
                <Button
                  key={index}
                  mode={button.style === 'cancel' ? 'outlined' : 'contained'}
                  onPress={() => handleButtonPress(button)}
                  style={[styles.button, index > 0 && styles.buttonSpacing]}
                  variant={
                    button.style === 'destructive'
                      ? 'primary'
                      : button.style === 'cancel'
                      ? 'outlined'
                      : 'primary'
                  }
                  compact
                >
                  {button.text}
                </Button>
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing[4],
  },
  androidBlur: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: Math.min(SCREEN_WIDTH - spacing[8], 400),
    backgroundColor: lightColors.white,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    padding: spacing[4],
    ...shadows.lg,
  },
  closeButton: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    zIndex: 10,
    padding: spacing[1],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  textContainer: {
    flex: 1,
    paddingTop: spacing[1],
    paddingRight: spacing[6], // Space for close button
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: lightColors.gray900,
    marginBottom: spacing[1],
  },
  message: {
    fontSize: 14,
    color: lightColors.gray600,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing[2],
  },
  button: {
    minWidth: 80,
  },
  buttonSpacing: {
    marginLeft: spacing[2],
  },
});
