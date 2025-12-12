import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>(set => ({
  toasts: [],
  addToast: toast => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    set(state => ({ toasts: [...state.toasts, newToast] }));

    // Auto remove after duration
    const duration = toast.duration || 3000;
    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id),
      }));
    }, duration);
  },
  removeToast: id =>
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    })),
}));

export const useToast = () => {
  const { addToast } = useToastStore();

  return {
    toast: (message: string, type: ToastType = 'info', duration?: number) => {
      addToast({ message, type, duration });
    },
    success: (message: string, duration?: number) => {
      addToast({ message, type: 'success', duration });
    },
    error: (message: string, duration?: number) => {
      addToast({ message, type: 'error', duration });
    },
    warning: (message: string, duration?: number) => {
      addToast({ message, type: 'warning', duration });
    },
    info: (message: string, duration?: number) => {
      addToast({ message, type: 'info', duration });
    },
  };
};
