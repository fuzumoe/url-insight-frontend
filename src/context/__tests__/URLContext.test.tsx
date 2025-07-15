/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { URLProvider, URLContext } from '../URLContext';
import { urlService } from '../../services';
import type { URLData } from '../../types';

// Mock the URL service
vi.mock('../../services/urlService', () => ({
  urlService: {
    list: vi.fn(),
    create: vi.fn(),
    get: vi.fn(),
    startAnalysis: vi.fn(),
    deleteUrl: vi.fn(),
  },
}));

describe('URLContext', () => {
  // Test data - fixed to match URLData type
  const mockURLs: URLData[] = [
    {
      id: '1',
      url: 'https://example.com',
      title: 'Example Site',
      htmlVersion: 'HTML5',
      internalLinks: 5,
      externalLinks: 3,
      brokenLinks: 0,
      hasLoginForm: false,
      status: 'done',
      createdAt: '2023-01-01',
    },
    {
      id: '2',
      url: 'https://test.com',
      title: 'Test Site',
      htmlVersion: 'HTML5',
      internalLinks: 2,
      externalLinks: 1,
      brokenLinks: 1,
      hasLoginForm: true,
      status: 'queued',
      createdAt: '2023-01-02',
    },
  ];

  const mockURLResponse = {
    data: mockURLs,
    pagination: {
      page: 1,
      pageSize: 20,
      totalItems: 2,
      totalPages: 1,
    },
  };

  const mockNewURL: URLData = {
    id: '3',
    url: 'https://new-example.com',
    title: 'New Example Site',
    htmlVersion: 'HTML5',
    internalLinks: 0,
    externalLinks: 0,
    brokenLinks: 0,
    hasLoginForm: false,
    status: 'done',
    createdAt: '2023-01-03',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(urlService.list).mockResolvedValue(mockURLResponse);
    vi.mocked(urlService.create).mockResolvedValue(3);
    vi.mocked(urlService.get).mockResolvedValue(mockNewURL);
    vi.mocked(urlService.startAnalysis).mockResolvedValue(undefined);
    vi.mocked(urlService.deleteUrl).mockResolvedValue(undefined);
  });

  it('initializes with empty URLs and loading state', async () => {
    // Make list take some time to complete
    vi.mocked(urlService.list).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockURLResponse), 100);
      });
    });

    const TestConsumer = () => {
      const context = React.useContext(URLContext);
      return (
        <div>
          <div data-testid="loading-state">
            Loading: {String(context?.loading)}
          </div>
          <div data-testid="urls-count">URLs: {context?.urls.length || 0}</div>
        </div>
      );
    };

    vi.useFakeTimers();

    render(
      <URLProvider>
        <TestConsumer />
      </URLProvider>
    );

    // Initially loading, with empty URLs
    expect(screen.getByTestId('loading-state')).toHaveTextContent(
      'Loading: true'
    );
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 0');

    // After loading completes
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByTestId('loading-state')).toHaveTextContent(
      'Loading: false'
    );
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');

    vi.useRealTimers();
  });

  it('fetches URLs on mount', async () => {
    const TestConsumer = () => {
      const context = React.useContext(URLContext);
      return (
        <div data-testid="urls-count">URLs: {context?.urls.length || 0}</div>
      );
    };

    render(
      <URLProvider>
        <TestConsumer />
      </URLProvider>
    );

    // Wait for the component to finish rendering
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(urlService.list).toHaveBeenCalledTimes(1);
    expect(urlService.list).toHaveBeenCalledWith(1, 20, undefined);
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');
  });

  it('analyzes a URL successfully', async () => {
    const TestConsumer = () => {
      const context = React.useContext(URLContext);

      return (
        <div>
          <div data-testid="urls-count">URLs: {context?.urls.length || 0}</div>
          <button
            data-testid="analyze-btn"
            onClick={() =>
              context?.analyzeURL({ url: 'https://new-example.com' })
            }
          >
            Analyze URL
          </button>
        </div>
      );
    };

    render(
      <URLProvider>
        <TestConsumer />
      </URLProvider>
    );

    // Wait for initial data load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // URL count before analysis
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');

    // Trigger URL analysis
    await act(async () => {
      fireEvent.click(screen.getByTestId('analyze-btn'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify service was called correctly
    expect(urlService.create).toHaveBeenCalledWith('https://new-example.com');
    expect(urlService.get).toHaveBeenCalledWith('3');
    expect(urlService.startAnalysis).toHaveBeenCalledWith('3');

    // URL count after analysis (should include the new URL)
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 3');
  });

  it('handles URL analysis error', async () => {
    // Mock the create method to throw an error
    vi.mocked(urlService.create).mockRejectedValue(
      new Error('Failed to create URL')
    );

    const TestConsumer = () => {
      const context = React.useContext(URLContext);

      return (
        <div>
          <div data-testid="error-state">Error: {context?.error || 'None'}</div>
          <button
            data-testid="analyze-error-btn"
            onClick={async () => {
              try {
                await context?.analyzeURL({ url: 'https://error-url.com' });
              } catch (_) {
                // Error will be caught by the context and set in state
              }
            }}
          >
            Analyze Error URL
          </button>
        </div>
      );
    };

    render(
      <URLProvider>
        <TestConsumer />
      </URLProvider>
    );

    // Wait for initial data load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Initially no error
    expect(screen.getByTestId('error-state')).toHaveTextContent('Error: None');

    // Trigger error
    await act(async () => {
      fireEvent.click(screen.getByTestId('analyze-error-btn'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Error state should be updated
    expect(screen.getByTestId('error-state')).toHaveTextContent(
      'Error: Failed to create URL'
    );
  });

  it('deletes a URL successfully', async () => {
    const TestConsumer = () => {
      const context = React.useContext(URLContext);

      return (
        <div>
          <div data-testid="urls-count">URLs: {context?.urls.length || 0}</div>
          <button
            data-testid="delete-btn"
            onClick={() => context?.deleteURL('1')}
          >
            Delete URL
          </button>
        </div>
      );
    };

    render(
      <URLProvider>
        <TestConsumer />
      </URLProvider>
    );

    // Wait for initial data load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // URL count before deletion
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');

    // Trigger URL deletion
    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-btn'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify service was called correctly
    expect(urlService.deleteUrl).toHaveBeenCalledWith('1');

    // URL count after deletion (should be reduced by 1)
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 1');
  });

  it('refreshes data', async () => {
    const TestConsumer = () => {
      const context = React.useContext(URLContext);

      return (
        <div>
          <button
            data-testid="refresh-btn"
            onClick={() => context?.refreshData()}
          >
            Refresh Data
          </button>
        </div>
      );
    };

    render(
      <URLProvider>
        <TestConsumer />
      </URLProvider>
    );

    // Wait for initial data load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Clear previous calls to list (from initial mount)
    vi.mocked(urlService.list).mockClear();

    // Trigger refresh
    await act(async () => {
      fireEvent.click(screen.getByTestId('refresh-btn'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify list was called again
    expect(urlService.list).toHaveBeenCalledTimes(1);
    expect(urlService.list).toHaveBeenCalledWith(1, 20, undefined);
  });
});
