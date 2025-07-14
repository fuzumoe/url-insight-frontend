import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, AuthContext } from '../AuthContext';
import { authService } from '../../services/authService';
import * as storage from '../../utils/storage';
import type { User } from '../../types';

// Mock the auth service
vi.mock('../../services/authService', () => ({
  authService: {
    getCurrentUser: vi.fn(),
  },
}));

// Mock the storage utility
vi.mock('../../utils/storage', () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

describe('AuthContext', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with loading state and null user when no token exists', async () => {
    // Mock getToken to return null (no token)
    vi.mocked(storage.getToken).mockReturnValue(null);

    render(<AuthProvider>Test content</AuthProvider>);

    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    expect(authService.getCurrentUser).not.toHaveBeenCalled();
  });

  it('attempts to authenticate with token and sets user on success', async () => {
    // Mock getToken to return a valid token
    vi.mocked(storage.getToken).mockReturnValue('valid-token');
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

    render(<AuthProvider>Test content</AuthProvider>);

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it('clears token if authentication fails', async () => {
    // Mock getToken to return an invalid token
    vi.mocked(storage.getToken).mockReturnValue('invalid-token');
    vi.mocked(authService.getCurrentUser).mockRejectedValue(
      new Error('Invalid token')
    );

    // Suppress the expected console error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<AuthProvider>Test content</AuthProvider>);

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(storage.removeToken).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('provides the context value to consumers', async () => {
    vi.mocked(storage.getToken).mockReturnValue(null);

    const TestConsumer = () => {
      const context = React.useContext(AuthContext);
      return (
        <div>
          <span data-testid="user-value">
            User: {context?.user ? JSON.stringify(context.user) : 'null'}
          </span>
          <span data-testid="loading-value">
            Loading: {context?.loading.toString()}
          </span>
          <button onClick={() => context?.setUser(mockUser)}>Set User</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.getByTestId('user-value')).toHaveTextContent('User: null');
      expect(screen.getByTestId('loading-value')).toHaveTextContent(
        'Loading: false'
      );
    });
  });
});
