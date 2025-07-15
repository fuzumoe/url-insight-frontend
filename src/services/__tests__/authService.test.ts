import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { authService } from '../authService';

vi.mock('../apiService', () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('../../utils/storage', () => ({
  setToken: vi.fn(),
  removeToken: vi.fn(),
  setUser: vi.fn(),
  removeUser: vi.fn(),
}));

import apiService from '../apiService';
import {
  setToken,
  removeToken,
  setUser,
  removeUser,
} from '../../utils/storage';

global.btoa = vi.fn((str: string) => `encoded_${str}`);

describe('Auth Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('login', () => {
    it('sends correct request with Basic auth', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2025-07-13',
      };
      const mockResponse = { data: { user: mockUser, token: 'token123' } };

      (apiService.post as Mock).mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(apiService.post).toHaveBeenCalledWith(
        '/auth/login',
        {},
        {
          headers: {
            Authorization: 'Basic encoded_test@example.com:password123',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
      expect(btoa).toHaveBeenCalledWith('test@example.com:password123');
      expect(setToken).toHaveBeenCalledWith('token123');
      expect(setUser).toHaveBeenCalledWith(mockUser);
    });

    it('handles login errors', async () => {
      const mockError = new Error('Login failed');
      (apiService.post as Mock).mockRejectedValue(mockError);

      await expect(
        authService.login('test@example.com', 'password123')
      ).rejects.toThrow('Login failed');

      expect(setToken).not.toHaveBeenCalled();
      expect(setUser).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('sends correct request with user data', async () => {
      const mockUser = {
        id: '1',
        username: 'newuser',
        email: 'new@example.com',
        createdAt: '2025-07-13',
      };
      const mockResponse = { data: { user: mockUser, token: 'token123' } };

      (apiService.post as Mock).mockResolvedValue(mockResponse);

      const result = await authService.register(
        'newuser',
        'new@example.com',
        'password123'
      );

      expect(apiService.post).toHaveBeenCalledWith('/auth/register', {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
      expect(setToken).toHaveBeenCalledWith('token123');
      expect(setUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getCurrentUser', () => {
    it('fetches the current user', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2025-07-13',
      };
      const mockResponse = { data: mockUser };

      (apiService.get as Mock).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(apiService.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('logs out the user and removes token and user data', async () => {
      const mockResponse = { data: {} };

      (apiService.post as Mock).mockResolvedValue(mockResponse);

      await authService.logout();

      expect(apiService.post).toHaveBeenCalledWith('/auth/logout');
      expect(removeToken).toHaveBeenCalled();
      expect(removeUser).toHaveBeenCalled();
    });
  });
});
