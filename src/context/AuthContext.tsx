import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../types/authTypes';
import { authService } from '../services';
import { getToken, removeToken } from '../utils';
import { Spinner } from '../components';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authService.login(email, password);
    setUser(response.user);
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    removeToken();
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    const response = await authService.register(username, email, password);
    setUser(response.user);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response);
        } catch (error) {
          console.error('Failed to authenticate with stored token:', error);
          removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <Spinner
          size="lg"
          color="primary"
          showText={true}
          text="Loading your account..."
          className="mb-2 sm:mb-4"
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
