/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { urlService } from '../urlService';

// Mock the apiService module
vi.mock('../apiService', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
  },
}));
// Import apiService AFTER mocking it
import apiService from '../apiService';
import type { URLTableFilters } from '../../types';

describe('URL Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  describe('create', () => {
    it('sends correct request with URL data', async () => {
      const mockResponse = { data: { id: 123 } };
      (apiService.post as any).mockResolvedValue(mockResponse);

      const result = await urlService.create('https://example.com');

      expect(apiService.post).toHaveBeenCalledWith('/urls', {
        original_url: 'https://example.com',
      });
      expect(result).toBe(123);
    });

    it('handles creation errors', async () => {
      const mockError = new Error('Failed to create URL');
      (apiService.post as any).mockRejectedValue(mockError);

      await expect(urlService.create('https://example.com')).rejects.toThrow(
        'Failed to create URL'
      );
    });
  });

  describe('list', () => {
    it('fetches URLs with pagination and filters', async () => {
      const mockURLs = [
        { id: '1', url: 'https://example.com', status: 'pending' },
        { id: '2', url: 'https://test.com', status: 'completed' },
      ];

      // Updated mock response to match backend structure
      const mockResponse = {
        data: {
          data: mockURLs,
          pagination: {
            page: 2,
            pageSize: 10,
            totalItems: 42,
            totalPages: 5,
          },
        },
      };

      (apiService.get as any).mockResolvedValue(mockResponse);

      const filters: URLTableFilters = {
        status: 'queued',
        hasLoginForm: true,
        hasBrokenLinks: false,
      };
      const result = await urlService.list(2, 10, filters);

      expect(apiService.get).toHaveBeenCalledWith('/urls', {
        params: {
          page: 2,
          page_size: 10,
          status: 'queued',
          hasLoginForm: true,
          hasBrokenLinks: false,
        },
      });

      // Updated expectation to match service implementation
      expect(result).toEqual({
        data: mockURLs,
        pagination: {
          page: 2,
          pageSize: 10,
          totalItems: 42,
          totalPages: 5,
        },
      });
    });
  });

  describe('get', () => {
    it('fetches a single URL by ID', async () => {
      const mockURL = {
        id: 1,
        url: 'https://example.com',
        status: 'pending',
      };
      const mockResponse = { data: mockURL };
      (apiService.get as any).mockResolvedValue(mockResponse);

      const result = await urlService.get('1');

      expect(apiService.get).toHaveBeenCalledWith('/urls/1');
      expect(result).toEqual(mockURL);
    });
  });

  describe('getResults', () => {
    it('fetches and transforms URL analysis results', async () => {
      const mockResponse = {
        data: {
          url: {
            id: 1,
            original_url: 'https://example.com',
            status: 'COMPLETED',
            created_at: '2025-07-13',
          },
          analysis_results: [
            {
              title: 'Example Domain',
              html_version: 'HTML5',
              internal_link_count: 5,
              external_link_count: 3,
              has_login_form: true,
            },
          ],
          links: [
            { id: 1, href: 'https://broken1.com', status_code: 404 },
            { id: 2, href: 'https://broken2.com', status_code: 500 },
            { id: 3, href: 'https://working.com', status_code: 200 },
          ],
        },
      };
      (apiService.get as any).mockResolvedValue(mockResponse);

      // Pass id as number now.
      const result = await urlService.getResults(1);

      expect(apiService.get).toHaveBeenCalledWith('/urls/1/results');

      expect(result.url).toEqual({
        id: 1, // now as a number
        url: 'https://example.com',
        title: 'Example Domain',
        htmlVersion: 'HTML5',
        internalLinks: 5,
        externalLinks: 3,
        brokenLinks: 2,
        hasLoginForm: true,
        status: 'completed',
        createdAt: '2025-07-13',
      });

      expect(result.brokenLinks).toHaveLength(2);
      expect(result.brokenLinks[0]).toEqual({
        id: 1, // number now
        url: 'https://broken1.com',
        statusCode: 404,
      });
    });
  });

  describe('startAnalysis', () => {
    it('sends request to start URL analysis', async () => {
      const mockResponse = { data: { message: 'Analysis started' } };
      (apiService.patch as any).mockResolvedValue(mockResponse);

      // Pass numeric id.
      await urlService.startAnalysis(1);

      expect(apiService.patch).toHaveBeenCalledWith('/urls/1/start');
    });
  });

  describe('stopAnalysis', () => {
    it('sends request to stop URL analysis', async () => {
      const mockResponse = { data: { message: 'Analysis stopped' } };
      (apiService.patch as any).mockResolvedValue(mockResponse);

      // Pass numeric id.
      await urlService.stopAnalysis(1);

      expect(apiService.patch).toHaveBeenCalledWith('/urls/1/stop');
    });
  });

  describe('deleteUrl', () => {
    it('sends request to delete a URL', async () => {
      const mockResponse = { data: { message: 'URL deleted' } };
      (apiService.delete as any).mockResolvedValue(mockResponse);

      // Pass numeric id.
      await urlService.deleteUrl(1);

      expect(apiService.delete).toHaveBeenCalledWith('/urls/1');
    });
  });

  describe('deleteUrls', () => {
    it('sends requests to delete multiple URLs', async () => {
      const mockResponse = { data: { message: 'URL deleted' } };
      (apiService.delete as any).mockResolvedValue(mockResponse);

      // Pass an array of numbers now.
      await urlService.deleteUrls([1, 2, 3]);

      expect(apiService.delete).toHaveBeenCalledTimes(3);
      expect(apiService.delete).toHaveBeenCalledWith('/urls/1');
      expect(apiService.delete).toHaveBeenCalledWith('/urls/2');
      expect(apiService.delete).toHaveBeenCalledWith('/urls/3');
    });
  });
});
