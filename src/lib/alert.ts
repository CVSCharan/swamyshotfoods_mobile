/**
 * Alert Utility Functions
 * Convenient functions for showing alerts throughout the app
 */

import { useAlertStore, AlertType, AlertButton } from '../stores/useAlertStore';

interface ShowAlertOptions {
  type: AlertType;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  duration?: number;
  onDismiss?: () => void;
}

/**
 * Show a custom alert
 */
export const showAlert = (options: ShowAlertOptions): string => {
  return useAlertStore.getState().showAlert(options);
};

/**
 * Show a success alert
 */
export const showSuccess = (
  title: string,
  message?: string,
  duration: number = 3000,
): string => {
  return showAlert({
    type: 'success',
    title,
    message,
    duration,
  });
};

/**
 * Show an error alert
 */
export const showError = (
  title: string,
  message?: string,
  onDismiss?: () => void,
): string => {
  return showAlert({
    type: 'error',
    title,
    message,
    duration: 0, // Don't auto-dismiss errors
    onDismiss,
  });
};

/**
 * Show a warning alert
 */
export const showWarning = (
  title: string,
  message?: string,
  onDismiss?: () => void,
): string => {
  return showAlert({
    type: 'warning',
    title,
    message,
    duration: 0, // Don't auto-dismiss warnings
    onDismiss,
  });
};

/**
 * Show an info alert
 */
export const showInfo = (
  title: string,
  message?: string,
  duration: number = 3000,
): string => {
  return showAlert({
    type: 'info',
    title,
    message,
    duration,
  });
};

/**
 * Show a confirmation alert
 */
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
): string => {
  return showAlert({
    type: 'confirm',
    title,
    message,
    buttons: [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'OK',
        style: 'default',
        onPress: onConfirm,
      },
    ],
    duration: 0,
  });
};

/**
 * Hide a specific alert by ID
 */
export const hideAlert = (id: string): void => {
  useAlertStore.getState().hideAlert(id);
};

/**
 * Clear all alerts
 */
export const clearAlerts = (): void => {
  useAlertStore.getState().clearAlerts();
};

/**
 * Alert utility object with all methods
 */
export const alert = {
  show: showAlert,
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  confirm: showConfirm,
  hide: hideAlert,
  clear: clearAlerts,
};

export default alert;
