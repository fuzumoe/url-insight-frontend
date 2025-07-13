import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as storage from '../storage';

describe('Storage Utils', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  // Set up mocks before each test
  beforeEach(() => {
    // Replace original implementations
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
    });

    // Reset the mocks
    vi.clearAllMocks();
  });

  // Clean up after each test
  afterEach(() => {
    localStorageMock.clear();
    sessionStorageMock.clear();
  });

  describe('Token Management', () => {
    it('sets and retrieves token correctly', () => {
      storage.setToken('test-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        'test-token'
      );

      localStorageMock.getItem.mockReturnValueOnce('test-token');
      const token = storage.getToken();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
      expect(token).toBe('test-token');
    });

    it('removes token correctly', () => {
      storage.removeToken();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });

    it('handles errors when getting token', () => {
      console.error = vi.fn();
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const token = storage.getToken();
      expect(console.error).toHaveBeenCalled();
      expect(token).toBeNull();
    });

    it('handles errors when setting token', () => {
      console.error = vi.fn();
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      storage.setToken('test-token');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('User Management', () => {
    const testUser = { id: 1, name: 'Test User' };

    it('sets and retrieves user correctly', () => {
      storage.setUser(testUser);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(testUser)
      );

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testUser));
      const user = storage.getUser();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
      expect(user).toEqual(testUser);
    });

    it('removes user correctly', () => {
      storage.removeUser();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });

    it('handles JSON parse errors when getting user', () => {
      console.error = vi.fn();
      localStorageMock.getItem.mockReturnValueOnce('invalid-json');

      const user = storage.getUser();
      expect(console.error).toHaveBeenCalled();
      expect(user).toBeNull();
    });
  });

  describe('Preferences Management', () => {
    const testPreferences = { theme: 'dark', language: 'en' };

    it('sets and retrieves preferences correctly', () => {
      storage.setPreferences(testPreferences);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'preferences',
        JSON.stringify(testPreferences)
      );

      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify(testPreferences)
      );
      const preferences = storage.getPreferences();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('preferences');
      expect(preferences).toEqual(testPreferences);
    });
  });

  describe('Generic Storage Helpers', () => {
    it('sets and retrieves items correctly', () => {
      const testData = { test: 'data' };
      storage.setItem('testKey', testData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(testData)
      );

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testData));
      const data = storage.getItem('testKey');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
      expect(data).toEqual(testData);
    });

    it('removes items correctly', () => {
      storage.removeItem('testKey');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('clears storage correctly', () => {
      storage.clear();
      expect(localStorageMock.clear).toHaveBeenCalled();
    });
  });

  describe('Session Storage Helpers', () => {
    it('sets and retrieves session items correctly', () => {
      const testData = { test: 'data' };
      storage.setSessionItem('testKey', testData);
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(testData)
      );

      sessionStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testData));
      const data = storage.getSessionItem('testKey');
      expect(sessionStorageMock.getItem).toHaveBeenCalledWith('testKey');
      expect(data).toEqual(testData);
    });

    it('removes session items correctly', () => {
      storage.removeSessionItem('testKey');
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('clears session storage correctly', () => {
      storage.clearSession();
      expect(sessionStorageMock.clear).toHaveBeenCalled();
    });
  });
});
