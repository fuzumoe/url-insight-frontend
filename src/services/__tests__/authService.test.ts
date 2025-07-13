import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService';

// Mock the apiService module
vi.mock('../apiService', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Import apiService AFTER mocking it
import apiService from '../apiService';

// Mock btoa which is used for Basic Auth
global.btoa = vi.fn(str => `encoded_${str}`);

describe('Auth Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: vi.fn(),
      },
      configurable: true,
    });
  });

  describe('login', () => {
    it('sends correct request with Basic auth', async () => {
      // Setup mock response
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2025-07-13',
      };
      const mockResponse = { data: { user: mockUser, token: 'token123' } };

      // Use vi.fn() methods for mocking
      (apiService.post as any).mockResolvedValue(mockResponse);

      // Call the method
      const result = await authService.login('test@example.com', 'password123');

      // Verify results
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
    });

    it('handles login errors', async () => {
      // Setup error response
      const mockError = new Error('Login failed');
      (apiService.post as any).mockRejectedValue(mockError);

      // Verify that the error is propagated
      await expect(
        authService.login('test@example.com', 'password123')
      ).rejects.toThrow('Login failed');
    });
  });

  describe('register', () => {
    it('sends correct request with user data', async () => {
      // Setup mock response
      const mockUser = {
        id: '1',
        username: 'newuser',
        email: 'new@example.com',
        createdAt: '2025-07-13',
      };
      const mockResponse = { data: { user: mockUser, token: 'token123' } };
      (apiService.post as any).mockResolvedValue(mockResponse);

      // Call the method
      const result = await authService.register(
        'newuser',
        'new@example.com',
        'password123'
      );

      // Verify results
      expect(apiService.post).toHaveBeenCalledWith('/auth/register', {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getCurrentUser', () => {
    it('fetches the current user', async () => {
      // Setup mock response
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2025-07-13',
      };
      const mockResponse = { data: mockUser };
      (apiService.get as any).mockResolvedValue(mockResponse);

      // Call the method
      const result = await authService.getCurrentUser();

      // Verify results
      expect(apiService.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('logs out the user and removes token', async () => {
      // Setup mock response
      const mockResponse = { data: {} };
      (apiService.post as any).mockResolvedValue(mockResponse);

      // Call the method
      await authService.logout();

      // Verify results
      expect(apiService.post).toHaveBeenCalledWith('/auth/logout');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });
});
