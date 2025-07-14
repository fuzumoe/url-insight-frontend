import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import type { BrokenLink, URLData, URLStatus } from '../../../types';
import URLDetails from '../URLDetails';
// Mock child components
vi.mock('../LinkChart', () => ({
  default: ({ internalLinks, externalLinks, brokenLinks }: any) => (
    <div data-testid="link-chart">
      <span data-testid="internal-links">{internalLinks}</span>
      <span data-testid="external-links">{externalLinks}</span>
      <span data-testid="broken-links">{brokenLinks}</span>
    </div>
  ),
}));

vi.mock('../BrokenLinksList', () => ({
  default: ({ links }: any) => (
    <div data-testid="broken-links-list">
      {links.map((link: any) => (
        <div key={link.id} data-testid="broken-link-item">
          {link.url}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../../common/StatusBadge', () => ({
  default: ({ status }: any) => <div data-testid="status-badge">{status}</div>,
}));

vi.mock('../../common/Button', () => ({
  default: ({ children, onClick, variant }: any) => (
    <button
      data-testid="action-button"
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe('URLDetails', () => {
  const mockUrl: URLData = {
    id: '123',
    url: 'https://example.com',
    title: 'Example Website',
    status: 'done',
    htmlVersion: 'HTML5',
    hasLoginForm: true,
    internalLinks: 10,
    externalLinks: 5,
    brokenLinks: 2,
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-01T13:00:00Z',
  };
  beforeEach(() => {
    mockStartAnalysis.mockReset();
    mockStopAnalysis.mockReset();
  });
  const mockBrokenLinks: BrokenLink[] = [
    { id: '1', url: 'https://example.com/broken1', statusCode: 404 },
    { id: '2', url: 'https://example.com/broken2', statusCode: 500 },
  ];

  const mockStartAnalysis = vi.fn();
  const mockStopAnalysis = vi.fn();

  it('displays loading state when loading prop is true', () => {
    render(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={true}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );

    expect(screen.getByText('Loading URL details...')).toBeInTheDocument();
    // Use querySelector instead of getByRole since the element doesn't have a role
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders URL details when not loading', () => {
    render(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );

    // Check if the title and URL are displayed
    expect(screen.getByText('Example Website')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();

    // Check if the status badge is rendered with correct status
    expect(screen.getByTestId('status-badge')).toHaveTextContent('done');

    // Check if the details are displayed
    expect(screen.getByText('HTML Version')).toBeInTheDocument();
    expect(screen.getByText('HTML5')).toBeInTheDocument();
    expect(screen.getByText('Login Form')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Internal Links')).toBeInTheDocument();
    expect(screen.getByText('External Links')).toBeInTheDocument();
    expect(screen.getByText('Broken Links')).toBeInTheDocument();

    // Check if the LinkChart is rendered with correct props
    expect(screen.getByTestId('link-chart')).toBeInTheDocument();
    expect(screen.getByTestId('internal-links')).toHaveTextContent('10');
    expect(screen.getByTestId('external-links')).toHaveTextContent('5');
    expect(screen.getByTestId('broken-links')).toHaveTextContent('2');

    // Check if the BrokenLinksList is rendered with correct props
    expect(screen.getByTestId('broken-links-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('broken-link-item')).toHaveLength(2);
    expect(screen.getAllByTestId('broken-link-item')[0]).toHaveTextContent(
      'https://example.com/broken1'
    );
    expect(screen.getAllByTestId('broken-link-item')[1]).toHaveTextContent(
      'https://example.com/broken2'
    );

    // Check if the action button is rendered
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
    expect(screen.getByTestId('action-button')).toHaveTextContent(
      'Run Analysis Again'
    );
  });

  it('shows error message when URL status is error', () => {
    const errorUrl = { ...mockUrl, status: 'error' as URLStatus };
    render(
      <URLDetails
        url={errorUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );

    expect(screen.getByText('Analysis failed')).toBeInTheDocument();
    expect(
      screen.getByText(
        'There was an error analyzing this URL. Please check that the URL is accessible and try again.'
      )
    ).toBeInTheDocument();
  });

  it('calls onStartAnalysis when button is clicked and status is not running', () => {
    render(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );

    fireEvent.click(screen.getByTestId('action-button'));
    expect(mockStartAnalysis).toHaveBeenCalledWith('123');
    expect(mockStopAnalysis).not.toHaveBeenCalled();
  });

  it('calls onStopAnalysis when button is clicked and status is running', () => {
    const runningUrl = { ...mockUrl, status: 'running' as URLStatus };
    render(
      <URLDetails
        url={runningUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );

    expect(screen.getByTestId('action-button')).toHaveTextContent(
      'Stop Analysis'
    );
    fireEvent.click(screen.getByTestId('action-button'));
    expect(mockStopAnalysis).toHaveBeenCalledWith('123');
    expect(mockStartAnalysis).not.toHaveBeenCalled();
  });

  it('displays correct button text based on URL status', () => {
    // Test 'queued' status
    const queuedUrl = { ...mockUrl, status: 'queued' as URLStatus };
    const { rerender } = render(
      <URLDetails
        url={queuedUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );
    expect(screen.getByTestId('action-button')).toHaveTextContent(
      'Start Analysis'
    );

    // Test 'error' status
    const errorUrl = { ...mockUrl, status: 'error' as URLStatus };
    rerender(
      <URLDetails
        url={errorUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );
    expect(screen.getByTestId('action-button')).toHaveTextContent(
      'Retry Analysis'
    );

    // Test 'running' status
    const runningUrl = { ...mockUrl, status: 'running' as URLStatus };
    rerender(
      <URLDetails
        url={runningUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );
    expect(screen.getByTestId('action-button')).toHaveTextContent(
      'Stop Analysis'
    );
    expect(screen.getByTestId('action-button')).toHaveAttribute(
      'data-variant',
      'secondary'
    );

    // Test default (done) status
    rerender(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );
    expect(screen.getByTestId('action-button')).toHaveTextContent(
      'Run Analysis Again'
    );
    expect(screen.getByTestId('action-button')).toHaveAttribute(
      'data-variant',
      'primary'
    );
  });

  it('formats dates correctly', () => {
    render(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );

    // Note: exact formatted string may vary based on locale, so we check for date components
    const dateElement = screen.getByText(/1\/1\/2023/);
    expect(dateElement).toBeInTheDocument();
  });
});
