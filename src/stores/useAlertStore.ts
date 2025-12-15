import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  duration?: number; // Auto-dismiss duration in ms (0 = no auto-dismiss)
  onDismiss?: () => void;
}

interface AlertStore {
  alerts: Alert[];
  showAlert: (alert: Omit<Alert, 'id'>) => string;
  hideAlert: (id: string) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: [],

  showAlert: alert => {
    const id = `alert-${Date.now()}-${Math.random()}`;
    const newAlert: Alert = {
      id,
      ...alert,
      // Default buttons based on type
      buttons:
        alert.buttons ||
        (alert.type === 'confirm'
          ? [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', style: 'default' },
            ]
          : [{ text: 'OK', style: 'default' }]),
      // Default duration: 3s for success/info, 0 for error/warning/confirm
      duration:
        alert.duration !== undefined
          ? alert.duration
          : ['success', 'info'].includes(alert.type)
          ? 3000
          : 0,
    };

    set(state => ({
      alerts: [...state.alerts, newAlert],
    }));

    return id;
  },

  hideAlert: id => {
    set(state => ({
      alerts: state.alerts.filter(alert => alert.id !== id),
    }));
  },

  clearAlerts: () => {
    set({ alerts: [] });
  },
}));
