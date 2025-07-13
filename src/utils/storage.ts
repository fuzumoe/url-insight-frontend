// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  PREFERENCES: 'preferences',
};

// Token management
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error retrieving token from storage:', error);
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error saving token to storage:', error);
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error removing token from storage:', error);
  }
};

// User data management
export const getUser = <T>(): T | null => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user from storage:', error);
    return null;
  }
};

export const setUser = <T>(user: T): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

export const removeUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user from storage:', error);
  }
};

// User preferences
export const getPreferences = <T>(): T | null => {
  try {
    const preferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return preferences ? JSON.parse(preferences) : null;
  } catch (error) {
    console.error('Error retrieving preferences from storage:', error);
    return null;
  }
};

export const setPreferences = <T>(preferences: T): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences to storage:', error);
  }
};

// Generic storage helpers
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error retrieving item ${key} from storage:`, error);
    return null;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to storage:`, error);
  }
};

export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from storage:`, error);
  }
};

export const clear = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Session storage helpers
export const getSessionItem = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error retrieving item ${key} from session storage:`, error);
    return null;
  }
};

export const setSessionItem = <T>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to session storage:`, error);
  }
};

export const removeSessionItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from session storage:`, error);
  }
};

export const clearSession = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
};
