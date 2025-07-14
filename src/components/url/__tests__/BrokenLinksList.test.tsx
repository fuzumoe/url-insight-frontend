import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import BrokenLinksList from '../BrokenLinksList';
import type { BrokenLink } from '../../../types';

const mockLinks: BrokenLink[] = [
  {
    id: '1',
    url: 'https://example.com/broken1',
    statusCode: 404,
  },
  {
    id: '2',
    url: 'https://example.com/broken2',
    statusCode: 500,
  },
  {
    id: '3',
    url: 'https://anothersite.com/error',
    statusCode: 403,
  },
];

describe('BrokenLinksList', () => {
  it('renders the list of broken links', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // Check if all links are rendered
    expect(screen.getByText('https://example.com/broken1')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/broken2')).toBeInTheDocument();
    expect(
      screen.getByText('https://anothersite.com/error')
    ).toBeInTheDocument();

    // Check if status codes are rendered
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('403')).toBeInTheDocument();

    // Check if descriptions are rendered
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

    const cells = screen.getAllByRole('cell');
    // First row should be status code 500 (since default sort is statusCode desc)
    expect(cells[1]).toHaveTextContent('500');
    // Second row should be status code 404
    expect(cells[4]).toHaveTextContent('404');
    // Third row should be status code 403
    expect(cells[7]).toHaveTextContent('403');
  });

  it('sorts links by URL when URL header is clicked', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // Click URL header to sort by URL
    fireEvent.click(screen.getByText('URL'));

    const cells = screen.getAllByRole('cell');

    // After sorting by URL (asc), anothersite.com should be first
    expect(cells[0]).toHaveTextContent('https://anothersite.com/error');

    // Click again to reverse sort order
    fireEvent.click(screen.getByText('URL'));

    const cellsAfterSecondClick = screen.getAllByRole('cell');

    // After sorting by URL (desc), example.com should be first
    expect(cellsAfterSecondClick[0]).toHaveTextContent('https://example.com');
  });

  it('sorts links by status code when Status Code header is clicked', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // Click Status Code header to change sort to ascending
    fireEvent.click(screen.getByText('Status Code'));

    const cells = screen.getAllByRole('cell');

    // After sorting by status code (asc), 403 should be first
    expect(cells[1]).toHaveTextContent('403');
    // Then 404
    expect(cells[4]).toHaveTextContent('404');
    // Then 500
    expect(cells[7]).toHaveTextContent('500');
  });

  it('applies correct color class for different status codes', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // 500 status code should have red styling
    const statusCode500 = screen.getByText('500');
    expect(statusCode500).toHaveClass('bg-red-100');
    expect(statusCode500).toHaveClass('text-red-800');

    // 404 status code should have orange styling
    const statusCode404 = screen.getByText('404');
    expect(statusCode404).toHaveClass('bg-orange-100');
    expect(statusCode404).toHaveClass('text-orange-800');

    // 403 status code should have orange styling
    const statusCode403 = screen.getByText('403');
    expect(statusCode403).toHaveClass('bg-orange-100');
    expect(statusCode403).toHaveClass('text-orange-800');
  });

  it('renders URLs as clickable links with proper attributes', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // Get all link elements
    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute('href', 'https://example.com/broken2');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');

    // Check styling classes
    expect(links[0]).toHaveClass('text-blue-600');
    expect(links[0]).toHaveClass('hover:text-blue-800');
    expect(links[0]).toHaveClass('hover:underline');
  });

  it('displays correct description for common HTTP error codes', () => {
    const customLinks: BrokenLink[] = [
      { id: '1', url: 'https://example.com/400', statusCode: 400 },
      { id: '2', url: 'https://example.com/401', statusCode: 401 },
      { id: '3', url: 'https://example.com/502', statusCode: 502 },
      { id: '4', url: 'https://example.com/503', statusCode: 503 },
      { id: '5', url: 'https://example.com/504', statusCode: 504 },
      { id: '6', url: 'https://example.com/999', statusCode: 999 },
    ];

    render(<BrokenLinksList links={customLinks} />);

    // Check descriptions for each status code
    expect(screen.getByText('Bad Request')).toBeInTheDocument();
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(screen.getByText('Bad Gateway')).toBeInTheDocument();
    expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Gateway Timeout')).toBeInTheDocument();
    expect(screen.getByText('Error 999')).toBeInTheDocument();
  });

  it('shows sort indicators when sorting', () => {
    render(<BrokenLinksList links={mockLinks} />);

    // Initially sorting by status code desc, should show down arrow
    expect(screen.getByText('↓')).toBeInTheDocument();

    // Click URL header
    fireEvent.click(screen.getByText('URL'));

    // Should now show up arrow for URL and no arrow for status code
    const arrows = screen.getAllByText(/[↑↓]/);
    expect(arrows).toHaveLength(1);
    expect(arrows[0]).toHaveTextContent('↑');
    expect(arrows[0].previousSibling?.textContent).toBe('URL');

    // Click URL header again to reverse direction
    fireEvent.click(screen.getByText('URL'));

    // Should now show down arrow for URL
    const arrowsAfterSecondClick = screen.getAllByText(/[↑↓]/);
    expect(arrowsAfterSecondClick).toHaveLength(1);
    expect(arrowsAfterSecondClick[0]).toHaveTextContent('↓');
    expect(arrowsAfterSecondClick[0].previousSibling?.textContent).toBe('URL');
  });
});
