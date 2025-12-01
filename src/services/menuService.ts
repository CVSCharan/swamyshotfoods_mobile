import { apiClient } from './api';
import { MenuItem } from '../stores/useMenuStore';

export const menuService = {
  /**
   * Get all menu items
   */
  getAll: () => apiClient.get<MenuItem[]>('/menu'),

  /**
   * Get a single menu item by ID
   */
  getById: (id: string) => apiClient.get<MenuItem>(`/menu/${id}`),

  /**
   * Create a new menu item
   */
  create: (data: Partial<MenuItem>) => apiClient.post<MenuItem>('/menu', data),

  /**
   * Update an existing menu item
   */
  update: (id: string, data: Partial<MenuItem>) =>
    apiClient.put<MenuItem>(`/menu/${id}`, data),

  /**
   * Delete a menu item
   */
  delete: (id: string) => apiClient.delete(`/menu/${id}`),
};
