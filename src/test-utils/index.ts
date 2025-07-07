// Test utilities and helpers
export { render } from './render';

// Common test data
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

export const mockUrlData = {
  id: 1,
  url: 'https://example.com',
  title: 'Example Site',
  description: 'A test website',
  createdAt: '2023-01-01T00:00:00Z',
};

// Helper functions
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 100));
};

export const createMockEvent = (
  type: string,
  data: Record<string, unknown> = {}
) => ({
  type,
  timestamp: Date.now(),
  data,
});

// Mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
