import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import BrokenLinksList from '../BrokenLinksList';
import type { BrokenLink } from '../../../types';

const mockLinks: BrokenLink[] = [
  { id: '1', url: 'https://example.com/broken1', statusCode: 404 },
  { id: '2', url: 'https://example.com/broken2', statusCode: 500 },
  { id: '3', url: 'https://anothersite.com/error', statusCode: 403 },
];

describe('BrokenLinksList', () => {
  it('renders the list of broken links with URL, status code and description', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // Check links are rendered correctly as clickable anchors.
    expect(
      screen.getByRole('link', { name: 'https://example.com/broken1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://example.com/broken2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://anothersite.com/error' })
    ).toBeInTheDocument();

    // Check the status codes are rendered.
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('403')).toBeInTheDocument();

    // Check the status descriptions.
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
    expect(screen.getByText('Forbidden')).toBeInTheDocument();
  });

  it('displays empty state when no links are provided', () => {
    render(<BrokenLinksList links={[]} />);
    expect(screen.getByText('No broken links found')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('sorts links by status code by default (descending)', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // By default the list is sorted by status code in descending order:
    // Expected order: 500, 404, 403.
    const cells = screen.getAllByRole('cell');
    expect(cells[1]).toHaveTextContent('500');
    expect(cells[4]).toHaveTextContent('404');
    expect(cells[7]).toHaveTextContent('403');
  });

  it('sorts links by URL when URL header is clicked', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // Click the URL header to sort by URL.
    fireEvent.click(screen.getByText('URL'));
    const urlHeader = screen.getByText('URL').closest('th');
    expect(urlHeader).toBeInTheDocument();
    if (urlHeader) {
      const svgIcon = urlHeader.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    }

    // Check that the first row has the URL that comes first alphabetically.
    const firstRowCells = screen.getAllByRole('cell').slice(0, 3);
    expect(firstRowCells[0]).toHaveTextContent('https://anothersite.com/error');

    // Click the URL header again to reverse order.
    fireEvent.click(screen.getByText('URL'));
    const updatedRowCells = screen.getAllByRole('cell').slice(0, 3);
    // Now the first cell should contain one of the example.com URLs.
    expect(updatedRowCells[0]).toHaveTextContent('https://example.com');
  });

  it('sorts links by status code when Status Code header is clicked', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // Click the Status Code header to toggle sort direction.
    fireEvent.click(screen.getByText('Status Code'));
    const statusHeader = screen.getByText('Status Code').closest('th');
    expect(statusHeader).toBeInTheDocument();
    if (statusHeader) {
      const svgIcon = statusHeader.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    }

    // After sort toggling, expect ascending order: 403, 404, 500.
    const cells = screen.getAllByRole('cell');
    expect(cells[1]).toHaveTextContent('403');
    expect(cells[4]).toHaveTextContent('404');
    expect(cells[7]).toHaveTextContent('500');
  });

  it('applies correct color class for different status codes', () => {
    render(<BrokenLinksList links={mockLinks} />);

    const status500 = screen.getByText('500');
    expect(status500).toHaveClass('bg-red-100');
    expect(status500).toHaveClass('text-red-800');

    const status404 = screen.getByText('404');
    expect(status404).toHaveClass('bg-orange-100');
    expect(status404).toHaveClass('text-orange-800');

    const status403 = screen.getByText('403');
    expect(status403).toHaveClass('bg-orange-100');
    expect(status403).toHaveClass('text-orange-800');
  });

  it('renders URLs as clickable links with proper attributes', () => {
    render(<BrokenLinksList links={mockLinks} />);

    const linkElements = screen.getAllByRole('link');
    expect(linkElements.length).toBeGreaterThan(0);
    expect(linkElements[0]).toHaveAttribute('href');
    expect(linkElements[0]).toHaveAttribute('target', '_blank');
    expect(linkElements[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays correct descriptions for common HTTP error codes', () => {
    const customLinks: BrokenLink[] = [
      { id: '1', url: 'https://example.com/400', statusCode: 400 },
      { id: '2', url: 'https://example.com/401', statusCode: 401 },
      { id: '3', url: 'https://example.com/502', statusCode: 502 },
      { id: '4', url: 'https://example.com/503', statusCode: 503 },
      { id: '5', url: 'https://example.com/504', statusCode: 504 },
      { id: '6', url: 'https://example.com/999', statusCode: 999 },
    ];

    render(<BrokenLinksList links={customLinks} />);

    expect(screen.getByText('Bad Request')).toBeInTheDocument();
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(screen.getByText('Bad Gateway')).toBeInTheDocument();
    expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Gateway Timeout')).toBeInTheDocument();
    expect(screen.getByText('Error 999')).toBeInTheDocument();
  });
  it('displays empty state when no links are provided', () => {
    render(<BrokenLinksList links={[]} />);
    const emptyState = screen.getByText('No broken links found');
    expect(emptyState).toBeInTheDocument();
    expect(emptyState.tagName).toBe('P'); // Typography defaults to span
    expect(emptyState).toHaveClass('text-gray-500');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
