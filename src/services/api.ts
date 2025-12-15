import { config } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@swamys_token';

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      // Only treat as session expiration if user was logged in
      if (token) {
        console.log('🔐 401 Unauthorized - Session expired, logging out user');

        // Clear tokens
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem('@swamys_user');

        // Import alert dynamically to avoid circular dependencies
        const { showWarning } = await import('../lib/alert');

        // Show user-friendly message
        showWarning(
          'Session Expired',
          'Your session has expired. Please login again.',
        );

        throw new ApiError('Session expired. Please login again.', 401);
      } else {
        // Login failed - show actual error from API
        console.log('🔐 401 Unauthorized - Login failed');
        throw new ApiError(
          errorData.message || 'Invalid credentials',
          401,
          errorData,
        );
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `API Error: ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    console.log(`📡 GET ${this.baseUrl}${endpoint}`);
    const headers = await this.getAuthHeaders();
    console.log('Headers:', headers);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
      console.log(`✅ GET ${endpoint} - Status: ${response.status}`);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`❌ GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    console.log(`📡 POST ${this.baseUrl}${endpoint}`);
    console.log('Request body:', data);
    const headers = await this.getAuthHeaders();
    console.log('Headers:', headers);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      console.log(`✅ POST ${endpoint} - Status: ${response.status}`);
      const result = await this.handleResponse<T>(response);
      console.log('Response data:', result);
      return result;
    } catch (error) {
      console.error(`❌ POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    console.log(`📡 PUT ${this.baseUrl}${endpoint}`);
    console.log('Request body:', data);
    const headers = await this.getAuthHeaders();
    console.log('Headers:', headers);

    // Check if token exists
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.warn('⚠️ WARNING: No token found in AsyncStorage!');
    } else {
      console.log('✅ Token exists, length:', token.length);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      console.log(`✅ PUT ${endpoint} - Status: ${response.status}`);

      if (response.status === 401) {
        console.error(
          '❌ 401 Unauthorized - Token might be invalid or expired',
        );
        console.error(
          'Token preview:',
          token ? `${token.substring(0, 20)}...` : 'null',
        );
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`❌ PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete<T = void>(endpoint: string): Promise<T> {
    console.log(`📡 DELETE ${this.baseUrl}${endpoint}`);
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
      console.log(`✅ DELETE ${endpoint} - Status: ${response.status}`);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`❌ DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  async upload(endpoint: string, formData: FormData): Promise<any> {
    console.log(`📡 UPLOAD ${this.baseUrl}${endpoint}`);
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
      });
      console.log(`✅ UPLOAD ${endpoint} - Status: ${response.status}`);
      return this.handleResponse(response);
    } catch (error) {
      console.error(`❌ UPLOAD ${endpoint} failed:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
