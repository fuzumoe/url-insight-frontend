import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import axios, {
  AxiosError,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getToken, removeToken } from '../../utils/storage';

import _apiService from '../apiService';

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

vi.mock('../../utils/storage', () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

const axiosInstance = vi.mocked(axios.create)().interceptors;
let requestHandler: (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig;
let errorHandler: (error: AxiosError) => Promise<never>;

describe('API Service', () => {
  beforeEach(() => {
    const reqCalls = (axiosInstance.request.use as unknown as Mock).mock.calls;
    const resCalls = (axiosInstance.response.use as unknown as Mock).mock.calls;

    requestHandler = reqCalls.length > 0 ? reqCalls[0][0] : config => config;

    errorHandler =
      resCalls.length > 0 ? resCalls[0][1] : error => Promise.reject(error);

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true,
    });
  });

  it('creates axios instance with correct config', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
  });

  it('adds Authorization header when token exists', () => {
    const mockedGetToken = getToken as unknown as Mock;
    let config: InternalAxiosRequestConfig = {
      headers: {} as AxiosRequestHeaders,
    };

    mockedGetToken.mockReturnValueOnce(null);
    let configAfter = requestHandler(config);
    expect(configAfter.headers?.Authorization).toBeUndefined();

    mockedGetToken.mockReturnValueOnce('test-token');
    config = { headers: {} as AxiosRequestHeaders };
    configAfter = requestHandler(config);
    expect(configAfter.headers?.Authorization).toBe('Bearer test-token');
  });

  it('handles 401 errors by clearing token and redirecting', async () => {
    const error401: AxiosError = {
      config: {} as InternalAxiosRequestConfig,
      code: '401',
      isAxiosError: true,
      message: 'Unauthorized',
      name: 'AxiosError',
      request: {},
      response: {
        status: 401,
        data: null,
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        statusText: '',
      },
      toJSON: () => ({}),
    };

    await expect(errorHandler(error401)).rejects.toBeDefined();

    expect(removeToken).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });

  it('passes through non-401 errors', async () => {
    const error500: AxiosError = {
      config: {} as InternalAxiosRequestConfig,
      code: '500',
      isAxiosError: true,
      message: 'Server Error',
      name: 'AxiosError',
      request: {},
      response: {
        status: 500,
        data: null,
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        statusText: '',
      },
      toJSON: () => ({}),
    };

    await expect(errorHandler(error500)).rejects.toEqual(error500);
    expect(removeToken).toHaveBeenCalled();
    expect(window.location.href).toBe('');
  });
});
