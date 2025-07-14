import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { URLProvider, URLContext } from '../URLContext';
import { urlService } from '../../services/urlService';

// Mock the URL service
vi.mock('../../services/urlService', () => ({
  urlService: {
    getURLs: vi.fn(),
    analyzeURL: vi.fn(),
    deleteURL: vi.fn(),
  },
}));

describe('URLContext', () => {
  const mockURLs = [
    {
      id: '1',
      original: 'https://example.com',
      shortenedURL: 'abc123',
      clicks: 0,
      createdAt: '2023-01-01',
    },
    {
      id: '2',
      original: 'https://test.com',
      shortenedURL: 'def456',
      clicks: 5,
      createdAt: '2023-01-02',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for getURLs
    vi.mocked(urlService.getURLs).mockResolvedValue(mockURLs);
  });

  it('initializes with empty URLs and loading state', async () => {
    // Don't resolve getURLs immediately to test loading state
    vi.mocked(urlService.getURLs).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockURLs), 100))
    );

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
      await vi.runAllTimersAsync();
    });

    expect(screen.getByTestId('loading-state')).toHaveTextContent(
      'Loading: false'
    );
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');
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
      await vi.runAllTimersAsync();
    });

    expect(urlService.getURLs).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');
  });

  it('analyzes a URL successfully', async () => {
    const newURL = {
      id: '3',
      original: 'https://new-example.com',
      shortenedURL: 'ghi789',
      clicks: 0,
      createdAt: '2023-01-03',
    };

    vi.mocked(urlService.analyzeURL).mockResolvedValue(newURL);

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
      await vi.runAllTimersAsync();
    });

    // URL count before analysis
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');

    // Trigger URL analysis
    await act(async () => {
      fireEvent.click(screen.getByTestId('analyze-btn'));
      await vi.runAllTimersAsync();
    });

    // Verify service was called correctly
    expect(urlService.analyzeURL).toHaveBeenCalledWith({
      url: 'https://new-example.com',
    });

    // URL count after analysis (should include the new URL)
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 3');
  });

  it('handles URL analysis error', async () => {
    // Mock the analyzeURL to throw an error
    vi.mocked(urlService.analyzeURL).mockRejectedValue(
      new Error('Failed to analyze URL')
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
              } catch (e) {
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

    // Initially no error
    expect(screen.getByTestId('error-state')).toHaveTextContent('Error: None');

    // Trigger error
    await act(async () => {
      fireEvent.click(screen.getByTestId('analyze-error-btn'));
      await vi.runAllTimersAsync();
    });

    // Error state should be updated
    expect(screen.getByTestId('error-state')).toHaveTextContent(
      'Error: Failed to analyze URL'
    );
  });

  it('deletes a URL successfully', async () => {
    vi.mocked(urlService.deleteURL).mockResolvedValue(undefined);

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
      await vi.runAllTimersAsync();
    });

    // URL count before deletion
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');

    // Trigger URL deletion
    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-btn'));
      await vi.runAllTimersAsync();
    });

    // Verify service was called correctly
    expect(urlService.deleteURL).toHaveBeenCalledWith('1');

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
      await vi.runAllTimersAsync();
    });

    // Clear previous calls to getURLs (from initial mount)
    vi.mocked(urlService.getURLs).mockClear();

    // Trigger refresh
    await act(async () => {
      fireEvent.click(screen.getByTestId('refresh-btn'));
      await vi.runAllTimersAsync();
    });

    // Verify getURLs was called again
    expect(urlService.getURLs).toHaveBeenCalledTimes(1);
  });
});
