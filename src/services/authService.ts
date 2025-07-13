import type { AuthResponse, User } from '../types';
import apiService from './apiService';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const credentials = btoa(`${email}:${password}`);
    const response = await apiService.post(
      '/auth/login',
      {},
      {
        headers: { Authorization: `Basic ${credentials}` },
      }
    );
    return response.data;
  },

  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await apiService.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiService.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiService.post('/auth/logout');
    localStorage.removeItem('token');
  },
};
