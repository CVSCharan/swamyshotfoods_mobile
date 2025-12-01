import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

export interface User {
  _id: string;
  username: string;
  role: 'admin' | 'staff' | 'user';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  setError: (error: string | null) => void;
}

const TOKEN_KEY = '@swamys_token';
const USER_KEY = '@swamys_user';

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ error: null });
      const response = await authService.login(username, password);

      // Store token and user
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        error: null,
      });
    } catch (err: any) {
      set({ error: err.message || 'Login failed' });
      throw err;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  },

  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userStr = await AsyncStorage.getItem(USER_KEY);

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.error('Load token error:', err);
      set({ isLoading: false });
    }
  },

  setError: error => set({ error }),
}));
