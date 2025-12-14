/**
 * Haptic Feedback Utilities
 * Provides tactile feedback for user interactions
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

// ============================================================================
// HAPTIC OPTIONS
// ============================================================================

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// ============================================================================
// IMPACT FEEDBACK
// ============================================================================

/**
 * Light Impact
 * Use for: Subtle interactions, toggles, switches
 */
export const lightImpact = () => {
  ReactNativeHapticFeedback.trigger('impactLight', options);
};

/**
 * Medium Impact
 * Use for: Button presses, selections
 */
export const mediumImpact = () => {
  ReactNativeHapticFeedback.trigger('impactMedium', options);
};

/**
 * Heavy Impact
 * Use for: Important actions, confirmations
 */
export const heavyImpact = () => {
  ReactNativeHapticFeedback.trigger('impactHeavy', options);
};

// ============================================================================
// NOTIFICATION FEEDBACK
// ============================================================================

/**
 * Success Feedback
 * Use for: Successful operations, confirmations
 */
export const success = () => {
  ReactNativeHapticFeedback.trigger('notificationSuccess', options);
};

/**
 * Warning Feedback
 * Use for: Warnings, cautions
 */
export const warning = () => {
  ReactNativeHapticFeedback.trigger('notificationWarning', options);
};

/**
 * Error Feedback
 * Use for: Errors, failures
 */
export const error = () => {
  ReactNativeHapticFeedback.trigger('notificationError', options);
};

// ============================================================================
// SELECTION FEEDBACK
// ============================================================================

/**
 * Selection Feedback
 * Use for: Picker selections, scrolling through options
 */
export const selection = () => {
  ReactNativeHapticFeedback.trigger('selection', options);
};

// ============================================================================
// CUSTOM PATTERNS
// ============================================================================

/**
 * Clock Tick
 * Use for: Timer ticks, countdown
 */
export const clockTick = () => {
  if (Platform.OS === 'ios') {
    ReactNativeHapticFeedback.trigger('clockTick', options);
  } else {
    lightImpact();
  }
};

/**
 * Context Click
 * Use for: Long press, context menu
 */
export const contextClick = () => {
  if (Platform.OS === 'ios') {
    ReactNativeHapticFeedback.trigger('contextClick', options);
  } else {
    mediumImpact();
  }
};

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Button Press Haptic
 * Standard haptic for button presses
 */
export const buttonPress = () => {
  mediumImpact();
};

/**
 * Toggle Haptic
 * Standard haptic for toggle switches
 */
export const toggle = () => {
  lightImpact();
};

/**
 * Delete Haptic
 * Standard haptic for delete actions
 */
export const deleteAction = () => {
  warning();
};

/**
 * Save Haptic
 * Standard haptic for save actions
 */
export const saveAction = () => {
  success();
};

/**
 * Cancel Haptic
 * Standard haptic for cancel actions
 */
export const cancelAction = () => {
  lightImpact();
};

// ============================================================================
// HAPTIC MANAGER
// ============================================================================

/**
 * Haptic Manager
 * Centralized haptic feedback with enable/disable support
 */
class HapticManager {
  private enabled: boolean = true;

  /**
   * Enable haptic feedback
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Disable haptic feedback
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Check if haptics are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Trigger haptic if enabled
   */
  trigger(
    type:
      | 'light'
      | 'medium'
      | 'heavy'
      | 'success'
      | 'warning'
      | 'error'
      | 'selection',
  ) {
    if (!this.enabled) return;

    switch (type) {
      case 'light':
        lightImpact();
        break;
      case 'medium':
        mediumImpact();
        break;
      case 'heavy':
        heavyImpact();
        break;
      case 'success':
        success();
        break;
      case 'warning':
        warning();
        break;
      case 'error':
        error();
        break;
      case 'selection':
        selection();
        break;
    }
  }
}

export const hapticManager = new HapticManager();

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Impact
  lightImpact,
  mediumImpact,
  heavyImpact,

  // Notification
  success,
  warning,
  error,

  // Selection
  selection,

  // Custom
  clockTick,
  contextClick,

  // Convenience
  buttonPress,
  toggle,
  deleteAction,
  saveAction,
  cancelAction,

  // Manager
  manager: hapticManager,
};
