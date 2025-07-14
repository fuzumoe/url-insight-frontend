import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import URLTable from '../URLRow';
import type { URLData } from '../../../types';

vi.mock('../../common/StatusBadge', () => ({
  default: ({ status }: { status: string }) => (
    <div data-testid="status-badge">{status}</div>
  ),
}));

vi.mock('../../common/Button', () => ({
  default: ({
    children,
    onClick,
    variant = 'primary',
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    className?: string;
  }) => (
    <button
      data-testid={`button-${variant}`}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
}));

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

vi.mock('../../common/Pagination', () => ({
  default: ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

vi.mock('../../common/SearchBar', () => ({
  default: ({ onSearch, placeholder }: SearchBarProps) => (
    <div data-testid="search-bar">
      <input
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearch(e.target.value)
        }
      />
      <button>Search</button>
    </div>
  ),
}));

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
}

vi.mock('../../common/Checkbox', () => ({
  default: ({ checked, onChange, id }: CheckboxProps) => (
    <input
      type="checkbox"
      data-testid={id ? `checkbox-${id}` : 'checkbox'}
      checked={checked}
      onChange={() => onChange && onChange(!checked)}
    />
  ),
}));

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
    htmlVersion: 'HTML4',
    internalLinks: 8,
    externalLinks: 3,
    brokenLinks: 1,
    hasLoginForm: false,
    status: 'running',
    createdAt: '2023-01-02T00:00:00Z',
  },
  {
    id: '3',
    url: 'https://example.org',
    title: undefined,
    htmlVersion: undefined,
    internalLinks: 0,
    externalLinks: 0,
    brokenLinks: 0,
    hasLoginForm: false,
    status: 'queued',
    createdAt: '2023-01-03T00:00:00Z',
  },
];

const defaultProps = {
  urls: mockUrls,
  loading: false,
  totalItems: 3,
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

describe('URLTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the table with correct number of rows', () => {
    render(<URLTable {...defaultProps} />);
    // 1 header row + 3 data rows = 4 rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
  });

  it('displays loading state using Spinner', () => {
    render(<URLTable {...defaultProps} loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays empty state when no URLs', () => {
    render(<URLTable {...defaultProps} urls={[]} />);
    expect(
      screen.getByText('No URLs found. Add a URL to get started.')
    ).toBeInTheDocument();
  });

  it('handles row selection', () => {
    render(<URLTable {...defaultProps} />);
    const checkboxes = screen.getAllByTestId('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
    expect(screen.getByText('Rerun Analysis')).toBeInTheDocument();
    expect(screen.getByText('Delete Selected')).toBeInTheDocument();
  });

  it('handles select all', () => {
    render(<URLTable {...defaultProps} />);
    const headerCheckbox = screen.getAllByTestId('checkbox')[0];
    fireEvent.click(headerCheckbox);
    expect(screen.getByText('3 items selected')).toBeInTheDocument();
  });

  it('calls onStartAnalysis when Start button is clicked for queued URL', () => {
    render(<URLTable {...defaultProps} />);

    const startButtons = screen.getAllByText('Start');
    fireEvent.click(startButtons[0]);
    expect(defaultProps.onStartAnalysis).toHaveBeenCalledWith('3');
  });

  it('calls onStopAnalysis when Stop button is clicked for running URL', () => {
    render(<URLTable {...defaultProps} />);
    const stopButton = screen.getByText('Stop');
    fireEvent.click(stopButton);
    expect(defaultProps.onStopAnalysis).toHaveBeenCalledWith('2');
  });

  it('calls onDeleteSelected when Delete Selected button is clicked', () => {
    render(<URLTable {...defaultProps} />);
    const headerCheckbox = screen.getAllByTestId('checkbox')[0];
    fireEvent.click(headerCheckbox);
    const deleteButton = screen.getByText('Delete Selected');
    fireEvent.click(deleteButton);
    expect(defaultProps.onDeleteSelected).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('calls onRerunSelected when Rerun Analysis button is clicked', () => {
    render(<URLTable {...defaultProps} />);
    const headerCheckbox = screen.getAllByTestId('checkbox')[0];
    fireEvent.click(headerCheckbox);
    const rerunButton = screen.getByText('Rerun Analysis');
    fireEvent.click(rerunButton);
    expect(defaultProps.onRerunSelected).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('handles filtering by status using SelectInput', () => {
    render(<URLTable {...defaultProps} />);
    const statusSelect = screen.getByRole('combobox', {
      name: /filter by status/i,
    });
    fireEvent.change(statusSelect, { target: { value: 'done' } });
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'done',
      })
    );
  });

  it('handles filtering by login form via checkbox', () => {
    render(<URLTable {...defaultProps} />);
    const loginFormCheckbox = screen.getByTestId('checkbox-login-form-filter');
    fireEvent.click(loginFormCheckbox);
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        hasLoginForm: true,
      })
    );
  });

  it('calls onSearch when search is performed', () => {
    render(<URLTable {...defaultProps} />);
    const searchBar = screen.getByTestId('search-bar');
    const searchInput = searchBar.querySelector('input');
    fireEvent.change(searchInput!, { target: { value: 'example' } });
    expect(defaultProps.onSearch).toHaveBeenCalledWith('example');
  });

  it('handles sorting when column headers are clicked', () => {
    render(<URLTable {...defaultProps} />);
    const internalLinksHeader = screen.getByText('Internal Links');
    fireEvent.click(internalLinksHeader);
    expect(screen.getByText('↑')).toBeInTheDocument();
    fireEvent.click(internalLinksHeader);
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('renders pagination when total pages > 1', () => {
    render(<URLTable {...defaultProps} totalItems={20} itemsPerPage={10} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('does not render pagination when total pages <= 1', () => {
    render(<URLTable {...defaultProps} totalItems={10} itemsPerPage={10} />);
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('calls onPageChange when pagination buttons are clicked', () => {
    render(
      <URLTable
        {...defaultProps}
        totalItems={30}
        itemsPerPage={10}
        currentPage={2}
      />
    );
    const prevButton = screen.getByText('Prev');
    fireEvent.click(prevButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('displays correct content for null values', () => {
    render(<URLTable {...defaultProps} />);
    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('renders Yes/No for hasLoginForm boolean', () => {
    render(<URLTable {...defaultProps} />);
    const cells = screen.getAllByRole('cell');
    const yesNoCells = Array.from(cells).filter(
      cell => cell.textContent === 'Yes' || cell.textContent === 'No'
    );
    expect(yesNoCells.length).toBe(3);
  });
});
