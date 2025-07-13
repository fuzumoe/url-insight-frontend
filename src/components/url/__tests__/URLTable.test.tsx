import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import URLTable from '../URLTable';
import type { URLData } from '../../../types';
// Mock components used in URLTable
vi.mock('../../common/Button', () => ({
  default: ({ children, onClick, variant, size }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

vi.mock('../../common/Pagination', () => ({
  default: ({ currentPage, totalPages, onPageChange }: any) => (
    <div
      data-testid="pagination"
      data-current-page={currentPage}
      data-total-pages={totalPages}
    >
      <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

// Sample data for testing
const mockUrls: URLData[] = [
  {
    id: '1',
    url: 'https://example.com',
    title: 'Example Site',
    htmlVersion: 'HTML5',
    internalLinks: 10,
    externalLinks: 5,
    brokenLinks: 2,
    hasLoginForm: true,
    status: 'done',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    url: 'https://test.com',
    title: 'Test Site',
    htmlVersion: 'HTML5',
    internalLinks: 8,
    externalLinks: 3,
    brokenLinks: 0,
    hasLoginForm: false,
    status: 'running',
    createdAt: '2023-01-02T00:00:00Z',
  },
];

describe('URLTable', () => {
  const defaultProps = {
    urls: mockUrls,
    loading: false,
    totalItems: 2,
    itemsPerPage: 10,
    currentPage: 1,
    onPageChange: vi.fn(),
    onStartAnalysis: vi.fn(),
    onStopAnalysis: vi.fn(),
    onDeleteSelected: vi.fn(),
    onRerunSelected: vi.fn(),
    onFilterChange: vi.fn(),
    onSearch: vi.fn(),
  };

  it('renders loading state correctly', () => {
    render(<URLTable {...defaultProps} loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<URLTable {...defaultProps} urls={[]} />);
    expect(screen.getByText('No URLs found')).toBeInTheDocument();
  });

  it('renders URLs correctly', () => {
    render(<URLTable {...defaultProps} />);

    // Check if URLs are displayed
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });

  it('allows selecting individual URLs', () => {
    render(<URLTable {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(3); // 1 for "select all" + 2 for individual URLs

    // Initially, no checkboxes should be checked
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });

    // Check the first URL
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[0]).not.toBeChecked(); // "Select all" should not be checked
    expect(checkboxes[2]).not.toBeChecked(); // Other URL should not be checked
  });

  it('allows selecting all URLs', () => {
    render(<URLTable {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');

    // Check "select all" checkbox
    fireEvent.click(checkboxes[0]);

    // All checkboxes should be checked
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });

    // Uncheck "select all" checkbox
    fireEvent.click(checkboxes[0]);

    // All checkboxes should be unchecked
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('shows bulk actions when URLs are selected', () => {
    render(<URLTable {...defaultProps} />);

    // Initially, bulk actions should not be visible
    expect(screen.queryByText('Rerun Analysis')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();

    // Select a URL
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    // Bulk actions should be visible
    expect(screen.getByText('Rerun Analysis')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('calls onDeleteSelected when Delete button is clicked', () => {
    render(<URLTable {...defaultProps} />);

    // Select a URL
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    // Click Delete button
    fireEvent.click(screen.getByText('Delete'));

    // onDeleteSelected should be called with the selected URL ID
    expect(defaultProps.onDeleteSelected).toHaveBeenCalledWith(['1']);
  });

  it('calls onRerunSelected when Rerun Analysis button is clicked', () => {
    render(<URLTable {...defaultProps} />);

    // Select a URL
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    // Click Rerun Analysis button
    fireEvent.click(screen.getByText('Rerun Analysis'));

    // onRerunSelected should be called with the selected URL ID
    expect(defaultProps.onRerunSelected).toHaveBeenCalledWith(['1']);
  });

  it('renders action buttons based on URL status', () => {
    render(<URLTable {...defaultProps} />);

    // Find action buttons for each URL
    const rows = screen.getAllByRole('row').slice(1); // Skip header row

    // First URL is "done", should have "Analyze" button
    const analyzeButton = within(rows[0]).getByText('Analyze');
    expect(analyzeButton).toBeInTheDocument();

    // Second URL is "running", should have "Stop" button
    const stopButton = within(rows[1]).getByText('Stop');
    expect(stopButton).toBeInTheDocument();
  });

  it('calls onStartAnalysis when Analyze button is clicked', () => {
    render(<URLTable {...defaultProps} />);

    // Click Analyze button for the first URL
    fireEvent.click(screen.getByText('Analyze'));

    // onStartAnalysis should be called with the URL ID
    expect(defaultProps.onStartAnalysis).toHaveBeenCalledWith('1');
  });

  it('calls onStopAnalysis when Stop button is clicked', () => {
    render(<URLTable {...defaultProps} />);

    // Click Stop button for the second URL
    fireEvent.click(screen.getByText('Stop'));

    // onStopAnalysis should be called with the URL ID
    expect(defaultProps.onStopAnalysis).toHaveBeenCalledWith('2');
  });

  it('calls onSearch when search form is submitted', () => {
    render(<URLTable {...defaultProps} />);

    // Type in search input
    const searchInput = screen.getByPlaceholderText('Search URLs...');
    fireEvent.change(searchInput, { target: { value: 'example' } });

    // Submit search form
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    // onSearch should be called with the search query
    expect(defaultProps.onSearch).toHaveBeenCalledWith('example');
  });

  it('calls onFilterChange when filters are changed', () => {
    render(<URLTable {...defaultProps} />);

    // Change status filter
    const statusFilter = screen.getByText('All Statuses').closest('select')!;
    fireEvent.change(statusFilter, { target: { value: 'done' } });

    // onFilterChange should be called with the updated filters
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      status: 'done',
    });
  });

  it('renders pagination when there are URLs', () => {
    render(<URLTable {...defaultProps} />);

    // Pagination should be rendered
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toBeInTheDocument();

    // Click Next button
    fireEvent.click(screen.getByText('Next'));

    // onPageChange should be called with the next page number
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('does not render pagination when there are no URLs', () => {
    render(<URLTable {...defaultProps} urls={[]} />);

    // Pagination should not be rendered
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });
});
