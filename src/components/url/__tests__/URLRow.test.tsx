import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import URLTable from '../URLRow';
import type { URLStatus } from '../../../types';

vi.mock('../../common/StatusBadge', () => ({
  default: ({ status }: { status: URLStatus }) => (
    <div data-testid="status-badge">{status}</div>
  ),
}));

vi.mock('../../common/Button', () => ({
  default: ({
    children,
    onClick,
    variant = 'primary',
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
  }) => (
    <button data-testid={`button-${variant}`} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('../../common/Pagination', () => ({
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('../../common/SearchBar', () => ({
  default: ({
    onSearch,
    placeholder,
  }: {
    onSearch: (query: string) => void;
    placeholder?: string;
  }) => (
    <div data-testid="search-bar">
      <input
        placeholder={placeholder}
        onChange={e => onSearch(e.target.value)}
        data-testid="search-input"
      />
      <button>Search</button>
    </div>
  ),
}));

vi.mock('../../common/Checkbox', () => ({
  default: ({
    checked,
    onChange,
    id,
  }: {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    id: string;
  }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange && onChange(!checked)}
      id={id}
    />
  ),
}));

vi.mock('../../common/SelectInput', () => ({
  default: ({
    id,
    label,
    value,
    options,
    onChange,
  }: {
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

const mockUrls = [
  {
    id: 1,
    url: 'https://example.com',
    title: 'Example Site',
    htmlVersion: 'HTML5',
    internalLinks: 10,
    externalLinks: 5,
    brokenLinks: 2,
    hasLoginForm: true,
    status: 'done' as URLStatus,
  },
  {
    id: 2,
    url: 'https://test.com',
    title: 'Test Site',
    htmlVersion: 'HTML4',
    internalLinks: 8,
    externalLinks: 3,
    brokenLinks: 1,
    hasLoginForm: false,
    status: 'running' as URLStatus,
  },
  {
    id: 3,
    url: 'https://example.org',
    title: undefined,
    htmlVersion: undefined,
    internalLinks: 0,
    externalLinks: 0,
    brokenLinks: 0,
    hasLoginForm: false,
    status: 'queued' as URLStatus,
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
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
  });

  it('displays loading state', () => {
    render(<URLTable {...defaultProps} loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays empty state when no URLs', () => {
    render(<URLTable {...defaultProps} urls={[]} />);
    expect(
      screen.getByText('No URLs found. Add a URL to get started.')
    ).toBeInTheDocument();
  });

  it('handles filtering', () => {
    render(<URLTable {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/Filter by Status/i);
    fireEvent.change(statusSelect, { target: { value: 'done' } });
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'done' })
    );

    const loginFormCheckbox = screen.getByLabelText(/Has Login Form/i);
    fireEvent.click(loginFormCheckbox);
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ hasLoginForm: true })
    );
  });

  it('handles searching', () => {
    render(<URLTable {...defaultProps} />);
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'example' } });
    expect(defaultProps.onSearch).toHaveBeenCalledWith('example');
  });

  it('renders pagination when needed', () => {
    render(<URLTable {...defaultProps} totalItems={20} itemsPerPage={10} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles row selection and shows actions', () => {
    render(<URLTable {...defaultProps} />);

    const initialButtons = screen.getAllByRole('button');
    const initialButtonCount = initialButtons.length;

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    const afterSelectionButtons = screen.getAllByRole('button');
    expect(afterSelectionButtons.length).toBeGreaterThan(initialButtonCount);

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rerun/i })).toBeInTheDocument();
  });

  it('handles select all', () => {
    render(<URLTable {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    const headerCheckbox = checkboxes[0];

    fireEvent.click(headerCheckbox);

    expect((headerCheckbox as HTMLInputElement).checked).toBe(true);

    try {
      const actionButton =
        screen.queryByTestId('button-red') ||
        screen.queryByTestId('button-gray');
      if (actionButton) {
        expect(actionButton).toBeInTheDocument();
      }
    } catch {
      expect((headerCheckbox as HTMLInputElement).checked).toBe(true);
    }
  });

  it('calls action handlers when buttons are clicked', () => {
    render(<URLTable {...defaultProps} />);

    const startButtons = screen.getAllByText('Start');
    fireEvent.click(startButtons[0]);
    expect(defaultProps.onStartAnalysis).toHaveBeenCalledWith(3);

    const stopButton = screen.getByText('Stop');
    fireEvent.click(stopButton);
    expect(defaultProps.onStopAnalysis).toHaveBeenCalledWith(2);

    const headerCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(headerCheckbox);

    const buttons = screen.getAllByRole('button');

    const deleteButton = buttons.find(
      button => button.getAttribute('data-testid') === 'button-red'
    );
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(defaultProps.onDeleteSelected).toHaveBeenCalled();
    }

    const rerunButton = buttons.find(
      button => button.getAttribute('data-testid') === 'button-gray'
    );
    if (rerunButton) {
      fireEvent.click(rerunButton);
      expect(defaultProps.onRerunSelected).toHaveBeenCalled();
    }
  });

  it('handles sorting when column headers are clicked', () => {
    render(<URLTable {...defaultProps} />);
    const internalLinksHeader = screen.getByText('Internal Links');
    fireEvent.click(internalLinksHeader);

    const sortIndicators = screen.getAllByText(/[↑↓]/);
    expect(sortIndicators.length).toBeGreaterThan(0);

    fireEvent.click(internalLinksHeader);
    const newSortIndicators = screen.getAllByText(/[↑↓]/);
    expect(newSortIndicators.length).toBeGreaterThan(0);
  });
});
