import type { AuthResponse, User } from '../types';
import apiService from './apiService';
import { setToken, removeToken, setUser, removeUser } from '../utils';

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
    // Store the token and user data when logging in
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
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
    // Store the token and user data when registering
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiService.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiService.post('/auth/logout');
    // Use storage utility instead of direct localStorage access
    removeToken();
    removeUser();
  },
};
