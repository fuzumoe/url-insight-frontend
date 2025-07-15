import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useURLAnalysis } from '../useURLAnalysis';
import { urlService } from '../../services';
import type { URLData } from '../../types';

// Mock the urlService methods to control their responses
vi.mock('../../services', () => ({
  urlService: {
    list: vi.fn(),
    create: vi.fn(),
    get: vi.fn(),
  },
}));

describe('useURLAnalysis hook', () => {
  const sampleURLData: URLData = {
    id: 1,
    url: 'https://example.com',
    status: 'queued',
    internalLinks: 0,
    externalLinks: 0,
    brokenLinks: 0,
    hasLoginForm: false,
    createdAt: '',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetchURLs: sets urls and toggles loading appropriately', async () => {
    const mockListResponse = {
      data: [sampleURLData],
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
      },
    };

    (urlService.list as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockListResponse
    );

    const { result } = renderHook(() => useURLAnalysis());

    // Initial state
    expect(result.current.urls).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    // Execute fetchURLs and wait for state updates.
    await act(async () => {
      await result.current.fetchURLs();
    });

    await waitFor(() => {
      expect(urlService.list).toHaveBeenCalledWith(1, 10);
      expect(result.current.urls).toEqual(mockListResponse.data);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('analyzeURL: creates URL then fetches data and updates state', async () => {
    const newURL = 'https://example.org';
    const newId = 2;
    const newURLData: URLData = {
      id: newId,
      url: newURL,
      status: 'queued',
      internalLinks: 0,
      externalLinks: 0,
      brokenLinks: 0,
      hasLoginForm: false,
      createdAt: '',
    };

    (urlService.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      newId
    );
    (urlService.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      newURLData
    );

    const { result } = renderHook(() => useURLAnalysis());

    let returnedResult: URLData;
    await act(async () => {
      returnedResult = await result.current.analyzeURL(newURL);
    });

    expect(urlService.create).toHaveBeenCalledWith(newURL);
    expect(urlService.get).toHaveBeenCalledWith(newId);
    expect(returnedResult).toEqual(newURLData);
    expect(result.current.urls).toContainEqual(newURLData);
  });

  it('fetchURLs: handles errors by setting error message', async () => {
    const errorMessage = 'Failed to fetch URLs';
    (urlService.list as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useURLAnalysis());

    await act(async () => {
      await result.current.fetchURLs();
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  it('analyzeURL: handles errors by setting error message', async () => {
    const errorMessage = 'Failed to analyze URL';
    (urlService.create as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useURLAnalysis());

    await act(async () => {
      await expect(
        result.current.analyzeURL('https://fail.com')
      ).rejects.toThrow(errorMessage);
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });
});
