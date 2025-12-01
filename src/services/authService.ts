import { apiClient } from './api';

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    role: 'admin' | 'staff' | 'user';
  };
}

interface RegisterData {
  username: string;
  password: string;
  role?: 'admin' | 'staff' | 'user';
  pic?: string;
}

export const authService = {
  /**
   * Login with username and password
   */
  login: async (username: string, password: string) => {
    console.log('🔑 authService.login called');
    console.log('API endpoint: /auth/login');
    console.log('Payload:', { username, password: '***' });

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        username,
        password,
      });
      console.log('✅ Login API response:', response);
      return response;
    } catch (error) {
      console.error('❌ Login API error:', error);
      throw error;
    }
  },

  /**
   * Register a new user (admin only)
   */
  register: (data: RegisterData) => {
    console.log('👤 authService.register called');
    return apiClient.post<LoginResponse>('/auth/register', data);
  },
};
