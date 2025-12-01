import { apiClient } from './api';
import { StoreConfig } from '../stores/useStoreConfigStore';

export const storeConfigService = {
  /**
   * Get current store configuration
   */
  get: () => apiClient.get<StoreConfig>('/store-config'),

  /**
   * Update store configuration
   */
  update: (data: Partial<StoreConfig>) =>
    apiClient.put<StoreConfig>('/store-config', data),

  /**
   * Upload shop logo
   */
  uploadLogo: (formData: FormData) => apiClient.upload('/upload', formData),
};
