import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../context';
import { authService } from '../services';
import { getToken, setToken, removeToken } from '../utils';
import type { AuthResponse } from '../types';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser } = context;

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.login(email, password);
        setUser(response.user);
        setToken(response.token);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to authenticate. Please check your credentials and try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ): Promise<AuthResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.register(username, email, password);
        setUser(response.user);
        setToken(response.token);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Registration failed. Please try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUser(null);
      removeToken();
    } catch (err) {
      console.error('Logout failed on server:', err);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return true;
    } catch {
      removeToken();
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };
};

export default useAuth;
