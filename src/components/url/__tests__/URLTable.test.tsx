import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import URLTable from '../URLTable';
import type { URLData } from '../../../types';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: string;
  size?: string;
}

vi.mock('../../common/Button', () => ({
  default: ({
    children,
    onClick,
    variant,
    size,
  }: ButtonProps): React.ReactElement => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
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

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder: string;
  className?: string;
}

vi.mock('../../common/SearchBar', () => ({
  default: ({ onSearch, placeholder, className }: SearchBarProps) => (
    <div data-testid="search-bar" className={className}>
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

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

vi.mock('../../common/SelectInput', () => ({
  default: ({ id, label, value, options, onChange }: SelectInputProps) => (
    <label htmlFor={id}>
      {label}
      <select id={id} value={value} onChange={onChange}>
        {options.map((option: { value: string; label: string }) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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

interface TableHeaderCellProps {
  children: React.ReactNode;
  onClick?: () => void;
}

vi.mock('../../common/TableHeaderCell', () => ({
  default: ({ children, onClick }: TableHeaderCellProps) => (
    <th onClick={onClick}>{children}</th>
  ),
}));

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

vi.mock('../../common/TableCell', () => ({
  default: ({ children, ...rest }: TableCellProps) => (
    <td {...rest}>{children}</td>
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    render(<URLTable {...defaultProps} loading={true} />);
    // Expect the Spinner to render "Loading..." text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<URLTable {...defaultProps} urls={[]} />);
    expect(screen.getByText('No URLs found')).toBeInTheDocument();
  });

  it('renders URLs correctly', () => {
    render(<URLTable {...defaultProps} />);
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });

  it('allows selecting individual URLs', () => {
    render(<URLTable {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(3); // 1 header + 2 URL rows

    // None are checked initially
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });

    // Select first URL
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('allows selecting all URLs', () => {
    render(<URLTable {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');

    // Click "select all"
    fireEvent.click(checkboxes[0]);
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });

    // Unselect all
    fireEvent.click(checkboxes[0]);
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('shows bulk actions when URLs are selected', () => {
    render(<URLTable {...defaultProps} />);
    expect(screen.queryByText('Rerun Analysis')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    expect(screen.getByText('Rerun Analysis')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('calls onDeleteSelected when Delete button is clicked', () => {
    render(<URLTable {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByText('Delete'));
    expect(defaultProps.onDeleteSelected).toHaveBeenCalledWith(['1']);
  });

  it('calls onRerunSelected when Rerun Analysis button is clicked', () => {
    render(<URLTable {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByText('Rerun Analysis'));
    expect(defaultProps.onRerunSelected).toHaveBeenCalledWith(['1']);
  });

  it('renders action buttons based on URL status', () => {
    render(<URLTable {...defaultProps} />);
    // First URL (status: done) should show an "Analyze" button,
    // Second URL (status: running) should show a "Stop" button.
    const rows = screen.getAllByRole('row').slice(1); // skip header row
    const analyzeButton = within(rows[0]).getByText('Analyze');
    expect(analyzeButton).toBeInTheDocument();
    const stopButton = within(rows[1]).getByText('Stop');
    expect(stopButton).toBeInTheDocument();
  });

  it('calls onStartAnalysis when Analyze button is clicked', () => {
    render(<URLTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Analyze'));
    expect(defaultProps.onStartAnalysis).toHaveBeenCalledWith('1');
  });

  it('calls onStopAnalysis when Stop button is clicked', () => {
    render(<URLTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Stop'));
    expect(defaultProps.onStopAnalysis).toHaveBeenCalledWith('2');
  });

  it('calls onSearch when search form is submitted', () => {
    render(<URLTable {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search URLs...');
    fireEvent.change(searchInput, { target: { value: 'example' } });
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    expect(defaultProps.onSearch).toHaveBeenCalledWith('example');
  });

  it('calls onFilterChange when filters are changed', () => {
    render(<URLTable {...defaultProps} />);
    const statusSelect = screen.getByRole('combobox', {
      name: /filter by status/i,
    });
    fireEvent.change(statusSelect, { target: { value: 'done' } });
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      status: 'done',
    });
  });

  it('renders pagination when there are URLs', () => {
    render(<URLTable {...defaultProps} totalItems={20} itemsPerPage={10} />);
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('does not render pagination when there are no URLs', () => {
    render(<URLTable {...defaultProps} urls={[]} />);
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });
});
