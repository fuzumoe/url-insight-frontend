import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuth from '../useAuth';
import { AuthContext } from '../../context';
import { authService } from '../../services';
import { getToken, setToken, removeToken } from '../../utils';
import type { AuthResponse, User } from '../../types';

// Mock dependencies
vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    register: vi.fn(),
  },
}));

vi.mock('../../utils/storage', () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

// Create a wrapper component for the hook
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  return React.createElement(
    AuthContext.Provider,
    { value: { user, setUser, loading: false } },
    children
  );
};

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log in a user successfully', async () => {
    // Setup
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'testUser@email.com',
    };
    const mockResponse: AuthResponse = { user: mockUser, token: 'fake-token' };
    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    // Execute
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    // Assert
    expect(authService.login).toHaveBeenCalledWith(
      'test@example.com',
      'password'
    );
    expect(setToken).toHaveBeenCalledWith('fake-token');
  });

  it('should log out a user', async () => {
    // Execute
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.logout();
    });

    // Assert
    expect(authService.logout).toHaveBeenCalled();
    expect(removeToken).toHaveBeenCalled();
  });

  it('should check authentication status', async () => {
    // Setup - No token
    vi.mocked(getToken).mockReturnValue(null);

    // Execute
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    let isAuth = true;
    await act(async () => {
      isAuth = await result.current.checkAuth();
    });

    // Assert
    expect(isAuth).toBe(false);
  });

  it('should verify token and set user when valid', async () => {
    // Setup - Valid token

    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'testuser@email.com',
    };
    vi.mocked(getToken).mockReturnValue('valid-token');
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

    // Execute
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    let isAuth = false;
    await act(async () => {
      isAuth = await result.current.checkAuth();
    });

    // Assert
    expect(isAuth).toBe(true);
    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it('should handle invalid token during checkAuth', async () => {
    // Setup - Invalid token
    vi.mocked(getToken).mockReturnValue('invalid-token');
    vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error());

    // Execute
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    let isAuth = true;
    await act(async () => {
      isAuth = await result.current.checkAuth();
    });

    // Assert
    expect(isAuth).toBe(false);
    expect(removeToken).toHaveBeenCalled();
  });
});
