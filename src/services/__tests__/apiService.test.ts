/* eslint-disable */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios first - with default export and interceptors
vi.mock('axios', () => {
  const interceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  };
  return {
    default: {
      create: vi.fn(() => ({ interceptors })),
    },
  };
});

// Mock storage utilities
vi.mock('../../utils/storage', () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

// --- Imports after mocks ---
import axios from 'axios';
import { getToken, removeToken } from '../../utils/storage';
import apiService from '../apiService';

// Get the axios instance created during apiService initialization.
// We capture it once so that the interceptor registrations made in apiService.ts remain.
const axiosInstance = (axios.create as any).mock.results[0].value;
let requestHandler: (config: any) => any;
let errorHandler: (error: any) => any;

describe('API Service', () => {
  beforeEach(() => {
    // Instead of clearing all mocks (which removes our stored registration),
    // we just reassign our interceptor handlers from the original registration.
    const reqCalls = (axiosInstance.interceptors.request.use as any).mock.calls;
    const resCalls = (axiosInstance.interceptors.response.use as any).mock
      .calls;
    requestHandler = reqCalls.length ? reqCalls[0][0] : undefined;
    errorHandler = resCalls.length ? resCalls[0][1] : undefined;

    // Set up window.location for tests
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true,
    });
  });

  it('creates axios instance with correct config', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:8080/api',
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
  });

  it('adds Authorization header when token exists', () => {
    // When no token, getToken returns null
    (getToken as any).mockReturnValueOnce(null);
    let cfg = { headers: {} as Record<string, string> };
    let configAfter = requestHandler(cfg);
    expect(configAfter.headers.Authorization).toBeUndefined();

    // When a token exists, getToken returns 'test-token'
    (getToken as any).mockReturnValueOnce('test-token');
    cfg = { headers: {} as Record<string, string> };
    configAfter = requestHandler(cfg);
    expect(configAfter.headers.Authorization).toBe('Bearer test-token');
  });

  it('handles 401 errors by clearing token and redirecting', async () => {
    // Simulate an error with status 401
    try {
      await errorHandler({ response: { status: 401 } } as any);
    } catch {
      // ignore rejection from Promise.reject(error)
    }
    expect(removeToken).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });

  it('passes through non-401 errors', async () => {
    const err = { response: { status: 500 } } as any;
    await expect(errorHandler(err)).rejects.toBe(err);

    expect(removeToken).toHaveBeenCalled();
    expect(window.location.href).toBe('');
  });
});
