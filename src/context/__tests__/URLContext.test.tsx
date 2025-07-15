import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { URLProvider, URLContext } from '../URLContext';
import { urlService } from '../../services';
import type { URLData } from '../../types';

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
  const mockURLs: URLData[] = [
    {
      id: 1,
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
      id: 2,
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
    id: 3,
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

    vi.mocked(urlService.list).mockResolvedValue(mockURLResponse);
    vi.mocked(urlService.create).mockResolvedValue(3);
    vi.mocked(urlService.get).mockResolvedValue(mockNewURL);
    vi.mocked(urlService.startAnalysis).mockResolvedValue(undefined);
    vi.mocked(urlService.deleteUrl).mockResolvedValue(undefined);
  });

  it('initializes with empty URLs and loading state', async () => {
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

    expect(screen.getByTestId('loading-state')).toHaveTextContent(
      'Loading: true'
    );
    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 0');

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

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');

    await act(async () => {
      fireEvent.click(screen.getByTestId('analyze-btn'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(urlService.create).toHaveBeenCalledWith('https://new-example.com');
    expect(urlService.get).toHaveBeenCalledWith(3);
    expect(urlService.startAnalysis).toHaveBeenCalledWith(3);

    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 3');
  });

  it('handles URL analysis error', async () => {
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
                expect('Error should have been thrown').toBe(false);
              } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe('Failed to create URL');
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

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId('error-state')).toHaveTextContent('Error: None');

    await act(async () => {
      fireEvent.click(screen.getByTestId('analyze-error-btn'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

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
            onClick={() => context?.deleteURL(1)}
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

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId('urls-count')).toHaveTextContent('URLs: 2');

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-btn'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(urlService.deleteUrl).toHaveBeenCalledWith(1);

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

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    vi.mocked(urlService.list).mockClear();

    await act(async () => {
      fireEvent.click(screen.getByTestId('refresh-btn'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(urlService.list).toHaveBeenCalledTimes(1);
    expect(urlService.list).toHaveBeenCalledWith(1, 20, undefined);
  });
});
