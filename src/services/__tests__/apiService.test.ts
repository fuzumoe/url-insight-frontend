import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import axios from 'axios';
import '../apiService';

const axiosInstance = (axios.create as any).mock.results[0].value;
const requestHandler = axiosInstance.interceptors.request.use.mock.calls[0][0];
const errorHandler = axiosInstance.interceptors.response.use.mock.calls[0][1];

describe('API Service', () => {
  beforeEach(() => {
    // reset globals (don’t clear axios spies!)
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      configurable: true,
    });

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
    (window.localStorage.getItem as any)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce('test-token');

    let cfg = { headers: {} as Record<string, string> };
    expect(requestHandler(cfg).headers.Authorization).toBeUndefined();

    cfg = { headers: {} as Record<string, string> };
    expect(requestHandler(cfg).headers.Authorization).toBe('Bearer test-token');
  });

  it('handles 401 errors by clearing token and redirecting', async () => {
    try {
      await errorHandler({ response: { status: 401 } } as any);
    } catch {
      /* interceptor rejects; ignore */
    }

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(window.location.href).toBe('/login');
  });

  it('passes through non-401 errors', async () => {
    const err = { response: { status: 500 } } as any;

    await expect(errorHandler(err)).rejects.toBe(err);

    expect(window.localStorage.removeItem).not.toHaveBeenCalled();
    expect(window.location.href).toBe('');
  });
});
