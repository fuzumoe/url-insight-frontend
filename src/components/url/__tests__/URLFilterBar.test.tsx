import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import URLFilterBar from '../URLFilterBar';
import type { URLTableFilters } from '../../../types';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder: string;
  className?: string;
}

vi.mock('../common/SearchBar', () => ({
  default: ({ onSearch, placeholder, className }: SearchBarProps) => (
    <form
      onSubmit={e => {
        e.preventDefault();
        const value = (
          (e.target as HTMLFormElement).elements.namedItem(
            'search'
          ) as HTMLInputElement
        ).value;
        onSearch(value);
      }}
    >
      <input
        data-testid="search-bar"
        name="search"
        placeholder={placeholder}
        className={className}
      />
      <button type="submit">Search</button>
    </form>
  ),
}));

vi.mock('../common/Checkbox', () => ({
  default: ({
    id,
    checked,
    onChange,
  }: {
    id: string;
    checked?: boolean;
    onChange: (value: boolean | undefined) => void;
  }) => (
    <input
      data-testid={id}
      id={id}
      type="checkbox"
      checked={checked}
      aria-label={id === 'latest-filter' ? 'Latest analysis only' : undefined}
      onChange={() => {
        if (checked) {
          onChange(undefined);
        } else {
          onChange(true);
        }
      }}
    />
  ),
}));

describe('URLFilterBar', () => {
  const mockOnSearch = vi.fn();
  const mockOnFilterChange = vi.fn();
  const defaultFilters: URLTableFilters = {
    status: undefined,
    hasLoginForm: undefined,
    hasBrokenLinks: undefined,
    latestOnly: undefined,
  };

  beforeEach(() => {
    mockOnSearch.mockReset();
    mockOnFilterChange.mockReset();
  });

  it('renders search bar, dropdowns and checkbox', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByPlaceholderText('Search URLs...')).toBeInTheDocument();

    expect(screen.getByLabelText(/Filter by Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by Login Form/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Filter by Broken Links/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Latest analysis only/i })
    ).toBeInTheDocument();
  });

  it('calls onSearch when search form is submitted', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const searchInput = screen.getByPlaceholderText('Search URLs...');
    fireEvent.change(searchInput, { target: { value: 'example.com' } });
    fireEvent.submit(searchInput.closest('form')!);
    expect(mockOnSearch).toHaveBeenCalledWith('example.com');
  });

  it('calls onFilterChange when status is changed', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const statusSelect = screen.getByLabelText(
      /Filter by Status/i
    ) as HTMLSelectElement;
    fireEvent.change(statusSelect, { target: { value: 'error' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'error' });

    fireEvent.change(statusSelect, { target: { value: 'all' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: undefined });
  });

  it('calls onFilterChange when login form filter is changed', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const loginSelect = screen.getByLabelText(
      /Filter by Login Form/i
    ) as HTMLSelectElement;
    fireEvent.change(loginSelect, { target: { value: 'true' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ hasLoginForm: true });

    fireEvent.change(loginSelect, { target: { value: 'false' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ hasLoginForm: false });

    fireEvent.change(loginSelect, { target: { value: 'all' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      hasLoginForm: undefined,
    });
  });

  it('calls onFilterChange when broken links filter is changed', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const brokenLinksSelect = screen.getByLabelText(
      /Filter by Broken Links/i
    ) as HTMLSelectElement;
    fireEvent.change(brokenLinksSelect, { target: { value: 'true' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ hasBrokenLinks: true });

    fireEvent.change(brokenLinksSelect, { target: { value: 'false' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ hasBrokenLinks: false });

    fireEvent.change(brokenLinksSelect, { target: { value: 'all' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      hasBrokenLinks: undefined,
    });
  });

  it('calls onFilterChange when latest analysis checkbox is toggled', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const checkbox = screen.getByRole('checkbox', {
      name: /Latest analysis only/i,
    }) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ latestOnly: true });
    mockOnFilterChange.mockClear();
    fireEvent.click(checkbox);
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('shows the correct initial state based on provided filters', () => {
    const activeFilters: URLTableFilters = {
      status: 'error',
      hasLoginForm: true,
      hasBrokenLinks: false,
      latestOnly: true,
    };

    render(
      <URLFilterBar
        filters={activeFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    const statusSelect = screen.getByLabelText(
      /Filter by Status/i
    ) as HTMLSelectElement;
    expect(statusSelect.value).toBe('error');

    const loginSelect = screen.getByLabelText(
      /Filter by Login Form/i
    ) as HTMLSelectElement;
    expect(loginSelect.value).toBe('true');

    const brokenLinksSelect = screen.getByLabelText(
      /Filter by Broken Links/i
    ) as HTMLSelectElement;
    expect(brokenLinksSelect.value).toBe('false');

    const checkbox = screen.getByRole('checkbox', {
      name: /Latest analysis only/i,
    }) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
