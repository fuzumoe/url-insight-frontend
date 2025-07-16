import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import type { BrokenLink, URLData, URLStatus } from '../../../types';
import URLDetails from '../URLDetails';

vi.mock('../ChartPanel', () => ({
  default: ({
    title,
    children,
    className,
  }: {
    title: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="chart-panel" className={className}>
      <h2 data-testid="chart-panel-title">{title}</h2>
      <div data-testid="chart-panel-content">{children}</div>
    </div>
  ),
}));
vi.mock('../LinkChart', () => ({
  default: ({
    internalLinks,
    externalLinks,
    brokenLinks,
  }: {
    internalLinks: number;
    externalLinks: number;
    brokenLinks: number;
  }) => (
    <div data-testid="link-chart">
      <span data-testid="internal-links">{internalLinks}</span>
      <span data-testid="external-links">{externalLinks}</span>
      <span data-testid="broken-links">{brokenLinks}</span>
    </div>
  ),
}));

vi.mock('../BrokenLinksList', () => ({
  default: ({ links }: { links: BrokenLink[] }) => (
    <div data-testid="broken-links-list">
      {links.map((link: BrokenLink) => (
        <div key={link.id} data-testid="broken-link-item">
          {link.url}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../../common/StatusBadge', () => ({
  default: ({ status }: { status: URLStatus }) => (
    <div data-testid="status-badge">{status}</div>
  ),
}));

vi.mock('../../common/Button', () => ({
  default: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
  }) => (
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
    id: 123,
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
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
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

    const stopButton = screen.getByRole('button', { name: /stop analysis/i });
    expect(stopButton).toBeInTheDocument();

    fireEvent.click(stopButton);
    expect(mockStopAnalysis).toHaveBeenCalledWith(123);
    expect(mockStartAnalysis).not.toHaveBeenCalled();
  });

  it('displays correct button text based on URL status', () => {
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
    expect(
      screen.getByRole('button', { name: /start analysis/i })
    ).toBeInTheDocument();

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
    expect(
      screen.getByRole('button', { name: /retry analysis/i })
    ).toBeInTheDocument();

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
    expect(
      screen.getByRole('button', { name: /stop analysis/i })
    ).toBeInTheDocument();

    const stopButton = screen.getByRole('button', { name: /stop analysis/i });
    expect(stopButton.className).toContain('bg-');
    rerender(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );
    expect(
      screen.getByRole('button', { name: /run analysis again/i })
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

    fireEvent.click(
      screen.getByRole('button', { name: /run analysis again/i })
    );

    expect(mockStartAnalysis).toHaveBeenCalledWith(123);
    expect(mockStopAnalysis).not.toHaveBeenCalled();
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

    expect(
      screen.getByRole('button', { name: /run analysis again/i })
    ).toBeInTheDocument();
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

    const dateElement = screen.getByText(/1\/1\/2023/);
    expect(dateElement).toBeInTheDocument();
  });
  it('renders the title as an h1 using Typography', () => {
    render(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );
    const titleEl = screen.getByText('Example Website');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl.tagName).toBe('H1');
    expect(titleEl).toHaveClass('text-xl');
    expect(titleEl).toHaveClass('font-semibold');
    expect(titleEl).toHaveClass('text-gray-800');
  });

  it('renders the URL as an anchor using Typography', () => {
    render(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );
    const urlEl = screen.getByText('https://example.com');
    expect(urlEl).toBeInTheDocument();
    expect(urlEl.tagName).toBe('A');
    expect(urlEl).toHaveAttribute('href', 'https://example.com');
    expect(urlEl).toHaveClass('text-blue-600');
    expect(urlEl).toHaveClass('hover:underline');
    expect(urlEl).toHaveClass('text-sm');
  });
  it('disables the action button when loading', () => {
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
    const button = screen.queryByRole('button');
    if (button) {
      expect(button).toBeDisabled();
    }
  });

  it('verifies button behavior for each URL status', () => {
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

    let button = screen.getByRole('button', { name: /start analysis/i });
    fireEvent.click(button);
    expect(mockStartAnalysis).toHaveBeenCalledWith(123);
    expect(mockStopAnalysis).not.toHaveBeenCalled();

    mockStartAnalysis.mockReset();
    mockStopAnalysis.mockReset();

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

    button = screen.getByRole('button', { name: /retry analysis/i });
    fireEvent.click(button);
    expect(mockStartAnalysis).toHaveBeenCalledWith(123);
    expect(mockStopAnalysis).not.toHaveBeenCalled();

    mockStartAnalysis.mockReset();
    mockStopAnalysis.mockReset();

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

    button = screen.getByRole('button', { name: /stop analysis/i });
    fireEvent.click(button);
    expect(mockStartAnalysis).not.toHaveBeenCalled();
    expect(mockStopAnalysis).toHaveBeenCalledWith(123);
  });

  it('displays broken links count in the section title', () => {
    render(
      <URLDetails
        url={mockUrl}
        brokenLinks={mockBrokenLinks}
        loading={false}
        onStartAnalysis={mockStartAnalysis}
        onStopAnalysis={mockStopAnalysis}
      />
    );

    const brokenLinksTitle = screen.getByText(/broken links \(2\)/i);
    expect(brokenLinksTitle).toBeInTheDocument();

    const brokenLinkItems = screen.getAllByTestId('broken-link-item');
    expect(brokenLinkItems).toHaveLength(2);
    expect(brokenLinkItems[0]).toHaveTextContent('https://example.com/broken1');
    expect(brokenLinkItems[1]).toHaveTextContent('https://example.com/broken2');
  });
});
